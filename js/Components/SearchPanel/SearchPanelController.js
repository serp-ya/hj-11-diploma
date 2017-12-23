class SearchPanelController{

  searchPanelInit(view) {
    const inputField = view.rootElement.querySelector('input');
    const searchBtn = view.rootElement.querySelector('.fa.fa-search');

    inputField.addEventListener('input', () => {
      const enteredData = inputField.value;

      if (!enteredData.trim()) {
        view.clearValidation();

      } else if (!this.searchQueryFieldIsValid(enteredData)) {
        view.setInvalid();

      } else {
        view.setValid();
      }
    });

    inputField.addEventListener('keypress', (event) => {
      const enteredData = inputField.value;

      if ((this.searchQueryFieldIsValid(enteredData)) && (event.key === 'Enter')) {
        this.approveSearch(view, enteredData);
      }
    });

    searchBtn.addEventListener('click', () => {
      const enteredData = inputField.value;

      if (this.searchQueryFieldIsValid(enteredData)) {
        this.approveSearch(view, enteredData);
      }
    });
  }

  searchQueryFieldIsValid(enteredData) {
    return (!!enteredData.trim() && (enteredData.length > 3));
  }

  approveSearch(view, enteredData) {
    view.goToSearchPage(`search?${enteredData}`)
  }
}

const searchPanelController = new SearchPanelController();