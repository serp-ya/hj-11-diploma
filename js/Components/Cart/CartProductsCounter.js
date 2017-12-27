'use strict';
class CartProductsCounter {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.cartCounter = options.rootElement;
    this.controller = options.controller;

    this.initController(this.controller);
  }

  initController(controller) {
    controller.addProductsCounter(this);
    controller.updateProductCounters();
  }

  updateCounter(newCount) {
    this.cartCounter.innerText = newCount ? `(${newCount})` : null;
  }
}