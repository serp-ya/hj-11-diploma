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
    const deleteConfig = Object.assign({}, requestDefaultConfig);
    deleteConfig.method = 'DELETE';
    deleteConfig.headers = {'Content-Type': 'application/json'};
    deleteConfig.body = JSON.stringify({'_id': this.productId});

    fetch(userCartRequestApiUrl, deleteConfig)
      .then(res => {
        if (200 < res.status || res.status > 299) {
          throw new Error(`Invalid status: ${res.status}`);
        }

        this.cartItem.remove();
        window.dispatchEvent(window.updateCartCountEvent);
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }

  updateQuantity(event) {
    const quantity = this.quantity;

    if (quantity < 1) {
      return this.quantityFeild.value = 1;
    }

    const updateConfig = Object.assign({}, requestDefaultConfig);
    updateConfig.method = 'PUT';
    updateConfig.headers = {'Content-Type': 'application/json'};
    updateConfig.body = JSON.stringify({'_id': this.productId, count: quantity});

    fetch(userCartRequestApiUrl, updateConfig)
      .then(res => {
        if (200 < res.status || res.status > 299) {
          throw new Error(`Invalid status: ${res.status}`);
        }

        const newAmountResult = Number(this.priceField.textContent) * quantity;
        this.amountResultField.textContent = newAmountResult.toFixed(2);
        window.dispatchEvent(window.updateCartCountEvent);
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }
}