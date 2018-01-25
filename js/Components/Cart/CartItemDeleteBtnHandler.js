function deleteCartItem(event) {
  cartController.deleteCartItem(this.productId)
    .then(() => {
      this.deleteItem();
      cartController.updateProductCounters();
    })
    .catch((error) => {
      console.error(error);
      return false;
    });
}