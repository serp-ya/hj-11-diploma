'use strict';
class CartItem {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.cartItem = options.rootElement;
    this.quantityFeild = this.cartItem.querySelector('.product-quantity');
    this.priceField = this.cartItem.querySelector('.current-price');
    this.amountResultField = this.cartItem.querySelector('.amount-result');

    this.initController(cartController);
  }

  initController(controller) {
    controller.cartItemInit(this);
  }

  clearView() {
    this.cartItem.remove();
  }

  setValueToOne() {
    this.quantityFeild.value = 1;
  }

  renderNewAmount(newQuantity) {
    const newAmountResult = Number(this.priceField.textContent) * newQuantity;
    this.amountResultField.textContent = newAmountResult.toFixed(2);
  }
}