'use strict';
document.querySelector('.search-panel').addEventListener('click', search);
document.querySelector('.search-panel').addEventListener('input', search);
document.querySelector('.search-panel').addEventListener('keypress', search);

function search(event) {
  const searchQueryInputField = event.currentTarget.querySelector('input');
  const searchQuery = searchQueryInputField.value;
  const searchQueryFieldIsValid = (!!searchQuery.trim()) && (searchQuery.length > 3);

  const justSearchBtn = event.currentTarget.querySelector('.fa-search');

  if (!searchQuery.trim()) {
    searchQueryInputField.classList.remove('valid');
    searchQueryInputField.classList.remove('invalid');

  } else if (!searchQueryFieldIsValid) {
    searchQueryInputField.classList.add('invalid');
    searchQueryInputField.classList.remove('valid');

  } else {
    searchQueryInputField.classList.add('valid');
    searchQueryInputField.classList.remove('invalid');
  }

  if (event.target === justSearchBtn && searchQueryFieldIsValid) {
    goToSearchPage();

  } else if (event.code === 'Enter' && searchQueryFieldIsValid) {
    goToSearchPage();

  }

  function goToSearchPage() {
    router.navigate(`search?${searchQuery}`);
    searchQueryInputField.value = null;
    searchQueryInputField.classList.remove('valid');
    searchQueryInputField.classList.remove('invalid');
  }
}

function addGoodInCart(event) {
  const addBtn = event.currentTarget;
  const productId = addBtn.dataset.productId;

  try {
    if (!productId) {
      throw new Error('Invalid product\'s Id');
    }

    const requestConfig = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'_id': productId})
    };

    const sendingProduct = fetch(userCartRequestApiUrl, requestConfig);
    sendingProduct
      .then(res => {
        if (200 < res.status > 299) {
          throw new Error('Invalid request status code');
        }
      })
      .catch(console.error);

  } catch (e) {
    console.error(e);
    return false;
  }
}

function updateProductsCount(event) {
  const productId = Number(event.currentTarget.dataset.productId);

  if (event.target.classList.contains('product-quantity')) {
    const priceField = event.currentTarget.querySelector('.current-price');
    const amountResultField = event.currentTarget.querySelector('.amount-result');
    const newQuantity = Number(event.target.value);

    if (newQuantity < 1) {
      return event.target.value = 1;
    }

    const updateConfig = Object.assign({}, requestDefaultConfig);
    updateConfig.method = 'PUT';
    updateConfig.headers = {'Content-Type': 'application/json'};
    updateConfig.body = JSON.stringify({'_id': productId, count: newQuantity});

    fetch(userCartRequestApiUrl, updateConfig)
      .then(res => {
        if (200 < res.status > 299) {
          throw new Error(`Invalid status: ${res.status}`);
        }

        const newAmountResult = Number(priceField.textContent) * newQuantity;
        amountResultField.textContent = newAmountResult.toFixed(2);
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }
}

function deleteProduct(event) {
  const productId = Number(event.currentTarget.dataset.productId);
  const currentProductCard = event.currentTarget;

  if (event.target.classList.contains('icon-close')) {
    const deleteConfig = Object.assign({}, requestDefaultConfig);
    deleteConfig.method = 'DELETE';
    deleteConfig.headers = {'Content-Type': 'application/json'};
    deleteConfig.body = JSON.stringify({'_id': productId});

    fetch(userCartRequestApiUrl, deleteConfig)
      .then(res => {
        if (200 < res.status > 299) {
          throw new Error(`Invalid status: ${res.status}`);
        }

        currentProductCard.remove();
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }

}

function changeShowBy(event) {
  const newShowLimit = event.currentTarget.value;
  window.howMuchProductsShow = Number(newShowLimit);
  router.check();
}
