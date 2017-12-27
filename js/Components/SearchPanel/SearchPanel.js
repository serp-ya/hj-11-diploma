'use strict';
class SearchPanel {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.rootElement = options.rootElement;
    this.controller = options.controller;
    this.inputField = this.rootElement.querySelector('input');

    this.initController(this.controller);
  }

  initController(controller) {
    controller.searchPanelInit(this);
  }

  clearValidation() {
    this.inputField.classList.remove('valid');
    this.inputField.classList.remove('invalid');
  }

  setInvalid() {
    this.inputField.classList.add('invalid');
    this.inputField.classList.remove('valid');
  }

  setValid() {
    this.inputField.classList.add('valid');
    this.inputField.classList.remove('invalid');
  }

  goToSearchPage(queryString) {
    router.navigate(queryString);
    this.inputField.value = null;
    this.clearValidation();
  };
}

const searchPanel = new SearchPanel({
  rootElement: document.querySelector('.search-panel'),
  controller: searchPanelController
});