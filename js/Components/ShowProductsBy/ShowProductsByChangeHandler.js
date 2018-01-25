function showProductByChange(event) {
  const newValue = event.currentTarget.value;
  window.howMuchProductsShow = Number(newValue);
  router.check();
}