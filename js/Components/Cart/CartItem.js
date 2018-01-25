'use strict';
class CartItem {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.cartItem = options.rootElement;
    this.deleteCartItemHandler = options.deleteCartItemHandler;
    this.updateCartItemAmountHandler = options.updateCartItemAmountHandler;

    this.deleteBtn = this.cartItem.querySelector('.icon-close');
    this.quantityFeild = this.cartItem.querySelector('.product-quantity');

    this.deleteBtn.addEventListener('click', this.deleteCartItemHandler.bind(this));
    this.quantityFeild.addEventListener('input', this.updateCartItemAmountHandler.bind(this));
  }

  get productId() {
    return this.cartItem.dataset.productId;
  }

  get priceField() {
    return this.cartItem.querySelector('.current-price');
  }

  get amountResultField() {
    return this.cartItem.querySelector('.amount-result');
  }

  deleteItem() {
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