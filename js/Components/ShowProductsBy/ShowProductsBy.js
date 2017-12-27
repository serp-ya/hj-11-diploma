'use strict';
class ShowProductsBy {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.optionsList = options.rootElement;
    this.controller = options.controller;

    this.initController(this.controller);
  }

  initController(controller) {
    controller.showProductsBylInit(this);
  }

  updatePage() {
    router.check();
  }
}