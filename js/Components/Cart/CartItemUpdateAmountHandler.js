function updateCartItemAmount(event) {
  const newQuantity = Number(event.currentTarget.value);

  if (newQuantity < 1) {
    return this.setValueToOne();
  }

  cartController.updateCartItemAmount(this.productId, newQuantity)
    .then(() => {
      this.renderNewAmount(newQuantity);
      cartController.updateProductCounters();
    })
    .catch((error) => {
      console.error(error);
      return false;
    })
}