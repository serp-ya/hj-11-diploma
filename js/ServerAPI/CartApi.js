const cartApi = {
  addProduct,
  updateProductItemQuantity,
  deleteProduct,
  updateCartCount
};

function addProduct(productId) {
  const requestConfig = Object.assign({}, requestJsonConfigs.post);
  requestConfig.body = JSON.stringify({'_id': productId});

  return new Promise((done, fail) => {
    fetch(userCartRequestApiUrl, requestConfig)
      .then(res => {
        if (200 < res.status || res.status > 299) {
          throw new Error('Invalid request status code');
        }

        // window.dispatchEvent(window.updateCartCountEvent);
        done(res);
      })
      .catch(error => fail(error));
  });
}

function updateProductItemQuantity(productId, newQuantity) {
  const updateConfig = Object.assign({}, requestJsonConfigs.put);
  updateConfig.body = JSON.stringify({'_id': productId, count: newQuantity});

  return new Promise((done, fail) => {
    fetch(userCartRequestApiUrl, updateConfig)
      .then(res => {
        if (200 < res.status || res.status > 299) {
          throw new Error(`Invalid status: ${res.status}`);
        }

        // window.dispatchEvent(window.updateCartCountEvent);
        done(newQuantity);
      })
      .catch(error => fail(error));
  });
}

function deleteProduct(productId) {
  const deleteConfig = Object.assign({}, requestJsonConfigs.delete);
  deleteConfig.body = JSON.stringify({'_id': productId});

  return new Promise((done, fail) => {
    fetch(userCartRequestApiUrl, deleteConfig)
      .then(res => {
        if (200 < res.status || res.status > 299) {
          throw new Error(`Invalid status: ${res.status}`);
        }

        // window.dispatchEvent(window.updateCartCountEvent);
        done(res);
      })
      .catch(error => fail(error));
  });
}

function updateCartCount() {
  return new Promise((done, fail) => {
    fetch(userCartRequestApiUrl + '?count=true', requestDefaultConfig)
      .then(res => {
        if (res.status === 404) {
          throw new Error('Cart not found');

        } else if (200 < res.status || res.status > 299) {
          throw new Error('Invalid request status code');
        }

        done(res.json());
      })
      .catch(error => fail(error));
  })
}