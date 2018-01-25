function makeSearchRequest(event) {
  if (event.type === 'keypress' && event.key !== 'Enter') {
    return false;
  } else if (this.isValid) {
    searchPanelController.goToSearchPage(this.enteredData);
    this.inputField.value = null;
    this.clearValidation();
  }
}