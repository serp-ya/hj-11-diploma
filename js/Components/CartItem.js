'use strict';
class CartItem {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.cartItem = options.rootElement;
    this.productId = this.cartItem.dataset.productId;

    if (!this.productId) {
      throw new Error('Invalid product\'s Id');
    }

    this.deleteBtn = this.cartItem.querySelector('.icon-close');
    this.quantityFeild = this.cartItem.querySelector('.product-quantity');
    this.priceField = this.cartItem.querySelector('.current-price');
    this.amountResultField = this.cartItem.querySelector('.amount-result');

    this.deleteBtn.addEventListener('click', this.deleteProduct.bind(this));
    this.quantityFeild.addEventListener('input', this.updateQuantity.bind(this));
  }

  get quantity() {
    return Number(this.quantityFeild.value);
  }

  deleteProduct(event) {
    cartApi.deleteProduct(this.productId)
      .then(() => {
        this.cartItem.remove();
      })
      .catch(eror => {
        console.error(error);
        return false;
      });
  }

  updateQuantity(event) {
    const quantity = this.quantity;

    if (quantity < 1) {
      return this.quantityFeild.value = 1;
    }

    cartApi.updateProductItemQuantity(this.productId, quantity)
      .then(newQuantity => {
        const newAmountResult = Number(this.priceField.textContent) * newQuantity;
        this.amountResultField.textContent = newAmountResult.toFixed(2);
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }
}