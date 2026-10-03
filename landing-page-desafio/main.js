'use strict';
const purchaseLink = document.querySelector('.purchase-link');
let checkoutReady = false;
try {
  const checkout = new URL(CHECKOUT_URL);
  if (checkout.protocol === 'https:' && (checkout.hostname === 'kiwify.com.br' || checkout.hostname.endsWith('.kiwify.com.br'))) {
    purchaseLink.href = checkout.href;
    purchaseLink.removeAttribute('aria-disabled');
    purchaseLink.innerHTML = 'Comprar pela Kiwify <span aria-hidden="true">↗</span>';
    checkoutReady = true;
  }
} catch {
  // Sem um checkout válido, a página não simula uma compra.
}
if (!checkoutReady) {
  purchaseLink.href = '#oferta';
  purchaseLink.setAttribute('aria-disabled', 'true');
  purchaseLink.innerHTML = 'Vendas em breve <span aria-hidden="true">↗</span>';
}
purchaseLink.addEventListener('click', event => {
  if (purchaseLink.getAttribute('aria-disabled') === 'true') event.preventDefault();
});
const toggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');
function closeMenu() {
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Abrir menu');
  menu.classList.remove('is-open');
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  menu.classList.toggle('is-open', open);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    toggle.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});
