'use strict';
class AddToCartBtn {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.addBtn = options.rootElement;
    this.productId = this.addBtn.dataset.productId;

    this.addBtn.addEventListener('click', this.addProduct.bind(this));

    if (!this.productId) {
      throw new Error('Invalid product\'s Id');
    }
  }

  addProduct(event) {
    const requestConfig = Object.assign({}, requestDefaultConfig);
    requestConfig.method = 'POST';
    requestConfig.headers = {'Content-Type': 'application/json'};
    requestConfig.body = JSON.stringify({'_id': this.productId});

    fetch(userCartRequestApiUrl, requestConfig)
      .then(res => {
        if (200 < res.status || res.status > 299) {
          throw new Error('Invalid request status code');
        }

        window.dispatchEvent(window.updateCartCountEvent);
      })
      .catch(error => {
        console.error(error);
      });
  }
}