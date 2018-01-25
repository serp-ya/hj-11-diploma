'use strict';
class SearchPanel {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.rootElement = options.rootElement;
    this.validateSearchPanelHandler = options.validateSearchPanelHandler;
    this.makeSearchRequestHandler = options.makeSearchRequestHandler;

    this.inputField = this.rootElement.querySelector('input');
    this.searchBtn = this.rootElement.querySelector('.fa.fa-search');

    this.inputField.addEventListener('input', this.validateSearchPanelHandler.bind(this));
    this.inputField.addEventListener('keypress', this.makeSearchRequestHandler.bind(this));
    this.searchBtn.addEventListener('click', this.makeSearchRequestHandler.bind(this));
  }

  get enteredData() {
    return this.inputField.value;
  }

  get isValid() {
    return (!!this.enteredData.trim()) && (this.enteredData.length > 3);
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
}

window.addEventListener('DOMContentLoaded', () => {
  new SearchPanel({
    rootElement: document.querySelector('.search-panel'),
    validateSearchPanelHandler: validateSearchPanel,
    makeSearchRequestHandler: makeSearchRequest
  });
});