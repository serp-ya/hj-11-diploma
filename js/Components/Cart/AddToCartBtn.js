'use strict';
class AddToCartBtn {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.addBtn = options.rootElement;
    this.initController(cartController);
  }

  initController(controller) {
    controller.addProduct(this.addBtn);
  }
}