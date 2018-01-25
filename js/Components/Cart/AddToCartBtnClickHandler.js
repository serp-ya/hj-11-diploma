function addProductHandler(event) {
  this.changeState('tryingToAdd');

  cartController.addProduct(this.productId)
    .then(() => {
      cartController.updateProductCounters();
      this.changeState('itAdd');
    })
    .catch((error) => {
      console.error(error);
      this.changeState('addIsFailed');
      return false;
    });
}