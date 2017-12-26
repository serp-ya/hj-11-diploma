class CartController {
  constructor() {
    this.productsCounters = [];
  }

  addProduct(addBtn) {
    addBtn.addEventListener('click', this.addProductEvent.bind(this))
  }

  addProductEvent(event) {
    const addBtn = event.currentTarget;
    const productId = addBtn.dataset.productId;
    const updateCounters = this.updateProductCounters.bind(this);

    if (!productId) {
      throw new Error('Invalid product\'s Id');
    }

    cartApi.addProduct(productId)
      .then((res) => {
        if (200 < res.status || res.status > 299) {
          throw new Error(`Invalid status: ${res.status}`);
        }

        updateCounters();
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }

  addProductsCounter(counter) {
    this.productsCounters.push(counter);
  }

  updateProductCounters() {
    cartApi.updateCartCount()
      .then((res) => {
        if (res.status === 404) {
          throw new Error('Cart not found');

        } else if (200 < res.status || res.status > 299) {
          throw new Error(`Invalid status: ${res.status}`);
        }

        return res.json();
      })
      .then((res) => {
        const count = res.count;
        this.productsCounters.forEach(counter => counter.updateCounter(count));
      })
      .catch(error => {
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
        .then((res) => {
          if (200 < res.status || res.status > 299) {
            throw new Error(`Invalid status: ${res.status}`);
          }

          view.clearView();
          this.updateProductCounters();
        })
        .catch(error => {
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
        .then((res) => {
          if (200 < res.status || res.status > 299) {
            throw new Error(`Invalid status: ${res.status}`);
          }

          view.renderNewAmount(quantity);
          this.updateProductCounters();
        })
        .catch(error => {
          console.error(error);
          return false;
        });
    });
  }
}

const cartController = new CartController();