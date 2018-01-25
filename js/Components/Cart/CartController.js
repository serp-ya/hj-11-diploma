class CartController {
  constructor() {
    this.productsCounters = [];
  }

  addProduct(productId) {
    return cartApi.addProduct(productId)
  }

  addProductsCounter(counter) {
    this.productsCounters.push(counter);
  }

  updateProductCounters() {
    cartApi.updateCartCount()
      .then((result) => {
        const count = result.count;
        this.productsCounters.forEach(counter => counter.updateCounter(count));
      })
      .catch((error) => {
        console.error(error);
        this.productsCounters.forEach(counter => counter.updateCounter(null));
      });
  }

  deleteCartItem(productId) {
    return cartApi.deleteProduct(productId);
  }

  updateCartItemAmount(productId, newQuantity) {
    return cartApi.updateProductItemQuantity(productId, newQuantity);
  }
}

const cartController = new CartController();