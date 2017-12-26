const cartApi = {
  addProduct,
  updateProductItemQuantity,
  deleteProduct,
  updateCartCount
};

function addProduct(productId) {
  const requestConfig = Object.assign({}, requestJsonConfigs.post);
  requestConfig.body = JSON.stringify({'_id': productId});

  return fetch(userCartRequestApiUrl, requestConfig);
}

function updateProductItemQuantity(productId, newQuantity) {
  const updateConfig = Object.assign({}, requestJsonConfigs.put);
  updateConfig.body = JSON.stringify({'_id': productId, count: newQuantity});

  return fetch(userCartRequestApiUrl, updateConfig);
}

function deleteProduct(productId) {
  const deleteConfig = Object.assign({}, requestJsonConfigs.delete);
  deleteConfig.body = JSON.stringify({'_id': productId});

  return fetch(userCartRequestApiUrl, deleteConfig);
}

function updateCartCount() {
  return fetch(userCartRequestApiUrl + '?count=true', requestDefaultConfig);
}