function addProductHandler(wrapper, controller) {
  const productId = wrapper.productId;

  return function (event) {
    wrapper.changeState('tryingToAdd');

    controller.addProduct(productId)
      .then(() => {
        controller.updateProductCounters();
        wrapper.changeState('itAdd');
      })
      .catch((error) => {
        console.error(error);
        wrapper.changeState('addIsFailed');
        return false;
      });
  }
}