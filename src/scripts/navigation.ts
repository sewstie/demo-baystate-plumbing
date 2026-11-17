const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const header = document.querySelector<HTMLElement>('.site-header');
if (header) new ResizeObserver(() => document.documentElement.style.setProperty('--header-h', `${header.offsetHeight + 16}px`)).observe(header);
function reveal(hash: string, behavior: ScrollBehavior) {
  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!target) return false;
  target.scrollIntoView({ behavior });
  const heading = target.querySelector<HTMLElement>('h1,h2,h3') ?? target;
  heading.tabIndex = -1;
  heading.focus({ preventScroll: true });
  return true;
}
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || event.defaultPrevented) return;
  if (link.dataset.service) {
    const estimate = document.getElementById('estimate');
    if (estimate) estimate.dataset.service = link.dataset.service;
    document.dispatchEvent(new CustomEvent('select-service', { detail: Number(link.dataset.service) }));
  }
  document.getElementById('mobile-menu')?.hidePopover();
  if (reveal(link.hash, reduced.matches ? 'instant' : 'smooth')) event.preventDefault();
});
if (location.hash) {
  reveal(location.hash, 'instant');
  history.replaceState(null, '', location.pathname + location.search);
}
