class CartController {
  constructor() {
    this.productsCounters = [];
  }

  addProduct(addBtnView) {
    const addBtn = addBtnView.addBtn;
    const productId = addBtn.dataset.productId;

    if (!productId) {
      throw new Error('Invalid product\'s Id');
    }

    addBtn.addEventListener('click', () => {
      addBtnView.changeState('tryingToAdd');
      const updateCounters = this.updateProductCounters.bind(this);

      cartApi.addProduct(productId)
        .then(() => {
          updateCounters();
          addBtnView.changeState('itAdd');
        })
        .catch((error) => {
          console.error(error);
          addBtnView.changeState('addIsFailed');
          return false;
        });
    })
  }

  addProductsCounter(counter) {
    this.productsCounters.push(counter);
  }

  updateProductCounters() {
    cartApi.updateCartCount()
      .then((result) => {
        const count = result.count;
        this.productsCounters.forEach(counter => counter.updateCounter(count));
      })
      .catch((error) => {
        console.error(error);
        this.productsCounters.forEach(counter => counter.updateCounter(null));
      });
  }

  cartItemInit(view) {
    const self = view.cartItem;
    const productId = self.dataset.productId;
    const deleteBtn = self.querySelector('.icon-close');
    const quantityField = self.querySelector('.product-quantity');

    deleteBtn.addEventListener('click', () => {
      cartApi.deleteProduct(productId)
        .then(() => {
          view.clearView();
          this.updateProductCounters();
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
    });

    quantityField.addEventListener('input', (event) => {
      const quantityField = event.currentTarget;
      const quantity = Number(quantityField.value);

      if (quantity < 1) {
        return view.setValueToOne();
      }

      cartApi.updateProductItemQuantity(productId, quantity)
        .then(() => {
          view.renderNewAmount(quantity);
          this.updateProductCounters();
        })
        .catch((error) => {
          console.error(error);
          return false;
        });
    });
  }
}

const cartController = new CartController();