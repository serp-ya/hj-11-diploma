'use strict';
const router = new Router();
const requestDefaultConfig = {credentials: 'include'};
const appBlock = document.getElementById('app');

appBlock.makeEmpty = function () {
  while (this.childElementCount) {
    this.firstElementChild.remove();
  }
};

// Настройки для пагинации и кол-ва вывода товаров по умолчанию
window.howMuchProductsShow = 6;

window.addEventListener('DOMContentLoaded', () => {

  router
    .add(/goods\/(.*)/, function () {
      appBlock.makeEmpty();
      const goodId = arguments[0];
      const productPageSchemaUrl = templateEngine.schemas.productPage;
      const productPageSchemaRequest = fetch(productPageSchemaUrl);
      const productRequest = fetch(goodsRequestApiUrl + `/${goodId}`, requestDefaultConfig);

      Promise.all([productPageSchemaRequest, productRequest])
        .then(([schemaResponse, dataResponse]) => {
          return Promise.all([schemaResponse.json(), dataResponse.json()]);
        })
        .then(([schema, data]) => {
          const domElements = templateEngine.renderPage(schema, data);
          app.appendChild(domElements);
          router.pickUpLinks();

          const addProductBtn = app.querySelector('.pro-add-to-cart');
          addProductBtn.addEventListener('click', addGoodInCart);
        })
        .catch(console.error);
    })
    .add(/cart/, function () {
      appBlock.makeEmpty();
      const cartSchemaUrl = templateEngine.schemas.cartPage;
      const cartSchemaRequest = fetch(cartSchemaUrl);
      const userCartRequest = fetch(userCartRequestApiUrl, requestDefaultConfig);

      Promise.all([cartSchemaRequest, userCartRequest])
        .then(([schemaResponse, dataResponse]) => {
          if (dataResponse.status === 404) {
            throw new Error('Cart is empty');
          }

          return Promise.all([schemaResponse.json(), dataResponse.json()]);
        })
        .then(([schema, data]) => {
          const domElements = templateEngine.renderPage(schema, data.cart.goods);
          app.appendChild(domElements);
          router.pickUpLinks();

          const productItems = document.querySelectorAll('.product-item');

          Array.from(productItems).forEach(productCard => {
            productCard.addEventListener('input', updateProductsCount);
            productCard.addEventListener('click', deleteProduct);
          })

        })
        .catch(error => {
          if (error.message === 'Cart is empty') {
            const warningEmptyCart = document.createElement('h1');
            warningEmptyCart.innerText = 'Корзина пуста!';
            appBlock.appendChild(warningEmptyCart);
          } else {
            console.error(error);
            return false;
          }
        })

    })
    .add(/page\/(.*)/, function () {
      appBlock.makeEmpty();
      const currentPageNumber = arguments[0];
      const productsListSchemaUrl = templateEngine.schemas.productsList;
      const productsListSchemaRequest = fetch(productsListSchemaUrl);
      const productsRequestUrl = goodsRequestApiUrl + `?limit=${window.howMuchProductsShow}&offset=${(currentPageNumber -1 ) * window.howMuchProductsShow}`;
      const productsRequest = fetch(productsRequestUrl, requestDefaultConfig);

      Promise.all([productsListSchemaRequest, productsRequest])
        .then(([schemaResponse, dataResponse]) => {
          return Promise.all([schemaResponse.json(), dataResponse.json()]);
        })
        .then(([schema, data]) => {
          const domElements = templateEngine.renderPage(schema, data);
          app.appendChild(domElements);

          const addProductBtns = app.querySelectorAll('.add-to-cart-mt');

          Array.from(addProductBtns).forEach(addBtn => {
            addBtn.addEventListener('click', addGoodInCart)
          });

          const showProductsBySelect = app.querySelector('.show-products-by');
          showProductsBySelect.addEventListener('change', changeShowBy);

          return fetch(goodsCountRequestApiUrl, requestDefaultConfig);
        })
        .then(res => res.json())
        .then(countNumber => {
          const pagination = templateEngine.renderPagination(countNumber, currentPageNumber);
          app.appendChild(pagination);
          router.pickUpLinks();
        })
        .catch(console.error);

    })
    .add(/search(.*)/, function () {
      appBlock.makeEmpty();
      const searchQuery = arguments[0].replace('?', '?search=');
      const searchResultPageSchemaUrl = templateEngine.schemas.searchPage;
      const searchResultPageSchemaRequest = fetch(searchResultPageSchemaUrl);
      const searchResultUrl = goodsRequestApiUrl + searchQuery;
      const searchResult = fetch(searchResultUrl, requestDefaultConfig);

      Promise.all([searchResultPageSchemaRequest, searchResult])
        .then(([schemaResponse, dataResponse]) => {
          return Promise.all([schemaResponse.json(), dataResponse.json()]);
        })
        .then(([schema, data]) => {
          const domElements = templateEngine.renderPage(schema, data);
          app.appendChild(domElements);

          const addProductBtns = app.querySelectorAll('.cart-button');

          Array.from(addProductBtns).forEach(addBtn => {
            addBtn.addEventListener('click', addGoodInCart)
          });

          router.pickUpLinks();
        })
        .catch(console.error);
    })
    .add(function () {
      // По умолчанию, редирект на страницу первую страницу товаров
      router.navigate('/page/1');
    })
    .check().listen();

  router.navigate('/page/1');
});