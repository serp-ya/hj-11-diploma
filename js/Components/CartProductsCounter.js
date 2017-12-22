'use strict';
class CartProductsCounter {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.cartCounter = options.rootElement;
    this.init();
  }

  init() {
    window.addEventListener('updateCartCount', this.updateCartCount.bind(this));
    this.updateCartCount();
  }

  updateCartCount(event) {
    cartApi.updateCartCount()
      .then(res => {
        const count = res.count;
        this.cartCounter.innerText = count ? `(${count})` : null;
      })
      .catch(error => {
        this.cartCounter.innerText = null;

        if (error.message === 'Cart not found') {
          return false;

        } else {
          console.error(error);
        }
      });
  }
}

(function (window) {
  window.updateCartCountEvent = new CustomEvent('updateCartCount');
})(window);