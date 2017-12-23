'use strict';
class ShowProductsBy {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.optionsList = options.rootElement;
    this.initController(showProductsByController);
  }

  initController(controller) {
    controller.showProductsBylInit(this);
  }

  updatePage() {
    router.check();
  }
}