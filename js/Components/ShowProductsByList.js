'use strict';
class ShowProductsByList {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.optionsList = options.rootElement;

    this.optionsList.addEventListener('change', this.changeShowBy.bind(this));
  }

  changeShowBy(event) {
    const newShowLimit = this.optionsList.value;
    window.howMuchProductsShow = Number(newShowLimit);
    router.check();
  }
}