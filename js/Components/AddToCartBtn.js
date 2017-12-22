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
    cartApi.addProduct(this.productId);
  }
}