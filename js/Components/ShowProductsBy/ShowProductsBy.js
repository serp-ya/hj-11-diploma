'use strict';
class ShowProductsBy {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.optionsList = options.rootElement;
    this.showProductByChangeHandler = options.showProductByChangeHandler;

    this.optionsList.addEventListener('change', this.showProductByChangeHandler.bind(this));
  }
}