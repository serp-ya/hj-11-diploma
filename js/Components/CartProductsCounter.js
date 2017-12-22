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
    fetch(userCartRequestApiUrl + '?count=true', requestDefaultConfig)
      .then(res => {
        if (res.status === 404) {
          this.cartCounter.innerText = null;
          throw new Error('Cart not found');

        } else if (200 < res.status || res.status > 299) {
          throw new Error('Invalid request status code');
        }

        return res.json();
      })
      .then(res => {
        const count = res.count;

        if (!count) {
          this.cartCounter.innerText = null;
        } else {
          this.cartCounter.innerText = `(${count})`
        }
      })
      .catch(error => {
        if (error.message === 'Cart not found') {
          return false;
        }
        console.error(error)
      });
  }
}

(function (window) {
  window.updateCartCountEvent = new CustomEvent('updateCartCount');
})(window);