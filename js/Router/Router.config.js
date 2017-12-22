'use strict';
const router = new Router();
const appBlock = document.getElementById('app');


appBlock.makeEmpty = function () {
  while (this.childElementCount) {
    this.firstElementChild.remove();
  }
};

appBlock.renderPage = function (domElements) {
  this.makeEmpty();
  this.appendChild(domElements);
};

const preloader = document.getElementById('preloader');

preloader.show = function() {
  this.style.display = 'inherit';
};

preloader.hide = function() {
  this.style.display = 'none';
};

// Настройки для пагинации и кол-ва вывода товаров по умолчанию
window.howMuchProductsShow = 6;

window.addEventListener('DOMContentLoaded', () => {
  new CartProductsCounter({
    rootElement: document.getElementById('countInCart')
  });

  router
    .add(/goods\/(.*)/, function (goodId) {
      preloader.show();

      const productPageSchemaUrl = templateEngine.schemas.productPage;
      const productPageSchemaRequest = fetch(productPageSchemaUrl);
      const productRequest = fetch(goodsRequestApiUrl + `/${goodId}`, requestDefaultConfig);

      Promise.all([productPageSchemaRequest, productRequest])
        .then(([schemaResponse, dataResponse]) => {
          return Promise.all([schemaResponse.json(), dataResponse.json()]);
        })
        .then(([schema, data]) => {
          const domElements = templateEngine.renderPage(schema, data);
          appBlock.renderPage(domElements);

          const addProductBtn = app.querySelector('.pro-add-to-cart');
          new AddToCartBtn({ rootElement: addProductBtn});

          preloader.hide();
        })
        .catch(error => console.error(error));
    })
    .add(/cart/, function () {
      preloader.show();

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
          appBlock.renderPage(domElements);

          const productItems = document.querySelectorAll('.product-item');

          Array.from(productItems).forEach(productCard => {
            new CartItem({ rootElement: productCard });
          });

          preloader.hide();
        })
        .catch(error => {
          if (error.message === 'Cart is empty') {
            const warningEmptyCart = document.createElement('h1');
            warningEmptyCart.innerText = 'Корзина пуста!';
            appBlock.appendChild(warningEmptyCart);
            preloader.hide();
          } else {
            console.error(error);
            return false;
          }
        })

    })
    .add(/page\/(.*)/, function (currentPageNumber) {
      preloader.show();

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
          appBlock.renderPage(domElements);

          const addProductBtns = app.querySelectorAll('.add-to-cart-mt');

          Array.from(addProductBtns).forEach(addBtn => {
            new AddToCartBtn({ rootElement: addBtn });
          });

          const showProductsBySelect = app.querySelector('.show-products-by');
          new ShowProductsByList({ rootElement: showProductsBySelect });

          return fetch(goodsCountRequestApiUrl, requestDefaultConfig);
        })
        .then(res => res.json())
        .then(countNumber => {
          const pagination = templateEngine.renderPagination(countNumber, currentPageNumber);
          appBlock.appendChild(pagination);

          preloader.hide();
        })
        .catch(error => console.error(error));

    })
    .add(/search(.*)/, function (searchQueryString) {
      preloader.show();

      const searchQuery = searchQueryString.replace('?', '?search=');
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
          appBlock.renderPage(domElements);

          const addProductBtns = app.querySelectorAll('.cart-button');

          Array.from(addProductBtns).forEach(addBtn => {
            new AddToCartBtn({ rootElement: addBtn });
          });

          preloader.hide();
        })
        .catch(error => console.error(error));
    })
    .add(function() {
      // По умолчанию, редирект на 1 страницу выдачи товаров
      router.navigate('/page/1').check();
    })
    .check().listen().pickUpLinks();
});