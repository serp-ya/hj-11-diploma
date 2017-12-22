'use strict';
class SearchPanel {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.rootElement = options.rootElement;
    this.inputField = this.rootElement.querySelector('input');
    this.searchBtn = this.rootElement.querySelector('.fa.fa-search');

    this.inputField.addEventListener('input', this.inputFieldValidation.bind(this));
    this.inputField.addEventListener('keypress', this.searchRequest.bind(this));
    this.searchBtn.addEventListener('click', this.searchRequest.bind(this));
  }

  get searchQueryFieldIsValid() {
    const enteredData = this.inputField.value;
    return (!!enteredData.trim() && (enteredData.length > 3));
  }

  inputFieldValidation(event) {
    const enteredData = this.inputField.value;

    if (!enteredData.trim()) {
      this.inputField.classList.remove('valid');
      this.inputField.classList.remove('invalid');

    } else if (!this.searchQueryFieldIsValid) {
      this.inputField.classList.add('invalid');
      this.inputField.classList.remove('valid');

    } else {
      this.inputField.classList.add('valid');
      this.inputField.classList.remove('invalid');
    }
  };

  searchRequest(event) {
    if (this.searchQueryFieldIsValid) {
      if ((event.target === this.searchBtn) || (event.key === 'Enter')) {
        this.goToSearchPage();
      }
    }
  };

  goToSearchPage() {
    router.navigate(`search?${this.inputField.value}`);
    this.inputField.value = null;
    this.inputField.classList.remove('valid');
    this.inputField.classList.remove('invalid');
  };
}

const searchPanel = new SearchPanel({
  rootElement: document.querySelector('.search-panel')
});