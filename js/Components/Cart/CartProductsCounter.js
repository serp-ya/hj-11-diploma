'use strict';
class CartProductsCounter {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }
    this.cartCounter = options.rootElement;

    options.initializator.bind(this)();
  }

  updateCounter(newCount) {
    this.cartCounter.innerText = newCount ? `(${newCount})` : null;
  }
}