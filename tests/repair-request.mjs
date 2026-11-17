import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mock } from 'node:test';
import { availableNow } from '../src/lib/hours.ts';
import { requestSchema, calendarFile, localDay, availableWindows, minimumRequestDay } from '../src/lib/repair-request.ts';
const site = JSON.parse(readFileSync(new URL('../src/data/site.json', import.meta.url)));
assert.equal(availableNow(site.hours, new Date('2026-11-17T17:00:00Z')), true);
assert.equal(availableNow(site.hours, new Date('2026-11-18T01:00:00Z')), false);
assert.equal(availableNow(site.hours, new Date('2026-11-15T17:00:00Z')), false);
assert.equal(availableNow(site.hours, new Date('2026-07-14T11:00:00Z')), true);
const request = { name: 'Alex Demo', contact: 'alex@example.com', day: '2099-12-31', window: '0' };
assert(requestSchema.safeParse(request).success);
assert(requestSchema.safeParse({ ...request, contact: '(508) 555-0100' }).success);
for (const bad of [{ contact: 'hello' }, { day: '2000-01-01' }, { day: '2099-02-31' }, { window: '8' }, { name: '' }]) assert(!requestSchema.safeParse({ ...request, ...bad }).success);
const ics = calendarFile(request, 'Demo, not confirmed', 'Name: Alex\nPreferred window: morning');
assert(ics.includes('DTSTART;VALUE=DATE:20991231'));
assert(ics.includes('DTEND;VALUE=DATE:21000101'));
assert(ics.includes('SUMMARY:Demo\\, not confirmed'));
assert(ics.includes('STATUS:TENTATIVE'));
assert(ics.split('\r\n').every(line => Buffer.byteLength(line) <= 75));
for (const [now, windows, minimum] of [
  ['2026-11-17T16:59:59Z', ['0', '1'], '2026-11-17'],
  ['2026-11-17T17:00:00Z', ['1'], '2026-11-17'],
  ['2026-11-17T20:59:59Z', ['1'], '2026-11-17'],
  ['2026-11-17T21:00:00Z', [], '2026-11-18'],
  ['2026-07-14T16:00:00Z', ['1'], '2026-07-14'],
  ['2026-07-14T20:00:00Z', [], '2026-07-15'],
  ['2027-01-01T04:59:59Z', [], '2027-01-01'],
  ['2027-01-01T05:00:00Z', ['0', '1'], '2027-01-01'],
]) {
  const date = new Date(now);
  assert.deepEqual(availableWindows(localDay(date), date), windows, now);
  assert.equal(minimumRequestDay(date), minimum, now);
  assert.deepEqual(availableWindows('2099-12-31', date), ['0', '1']);
}
mock.timers.enable({ apis: ['Date'], now: new Date('2026-11-17T17:00:00Z') });
assert(!requestSchema.safeParse({ ...request, day: '2026-11-17', window: '0' }).success);
assert(requestSchema.safeParse({ ...request, day: '2026-11-17', window: '1' }).success);
const empty = requestSchema.safeParse({ ...request, day: '', window: '' });
assert(!empty.success);
assert(empty.error.issues.some(issue => issue.message === 'Choose a day.'));
assert(empty.error.issues.some(issue => issue.message === 'Choose a time window.'));
mock.timers.setTime(new Date('2026-11-17T21:00:00Z').getTime());
assert(!requestSchema.safeParse({ ...request, day: '2026-11-17', window: '1' }).success);
assert(requestSchema.safeParse({ ...request, day: '2026-11-18', window: '0' }).success);
mock.timers.reset();
console.log('Hours, DST, date/window cutoffs, friendly validation and calendar checks passed.');
