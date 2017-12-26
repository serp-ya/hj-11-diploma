const cartApi = {
  addProduct,
  updateProductItemQuantity,
  deleteProduct,
  updateCartCount
};

function addProduct(productId) {
  const requestConfig = Object.assign({}, requestJsonConfigs.post);
  requestConfig.body = JSON.stringify({'_id': productId});

  return fetch(userCartRequestApiUrl, requestConfig)
    .then((result) => {
      if (200 < result.status || result.status > 299) {
        throw new Error(`Invalid status: ${result.status}`);
      }

      return result;
    });
}

function updateProductItemQuantity(productId, newQuantity) {
  const updateConfig = Object.assign({}, requestJsonConfigs.put);
  updateConfig.body = JSON.stringify({'_id': productId, count: newQuantity});

  return fetch(userCartRequestApiUrl, updateConfig)
    .then((result) => {
      if (200 < result.status || result.status > 299) {
        throw new Error(`Invalid status: ${result.status}`);
      }

      return result;
    });
}

function deleteProduct(productId) {
  const deleteConfig = Object.assign({}, requestJsonConfigs.delete);
  deleteConfig.body = JSON.stringify({'_id': productId});

  return fetch(userCartRequestApiUrl, deleteConfig)
    .then((result) => {
      if (200 < result.status || result.status > 299) {
        throw new Error(`Invalid status: ${result.status}`);
      }

      return result;
    });
}

function updateCartCount() {
  return fetch(userCartRequestApiUrl + '?count=true', requestDefaultConfig)
    .then((result) => {
      if (result.status === 404) {
        throw new Error('Cart not found');

      } else if (200 < result.status || result.status > 299) {
        throw new Error(`Invalid status: ${result.status}`);
      }

      return result.json();
    });
}