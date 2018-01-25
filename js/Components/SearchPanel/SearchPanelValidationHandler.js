function validateSearchPanel(event) {
  if (!this.enteredData.trim()) {
    this.clearValidation();

  } else if (!this.isValid) {
    this.setInvalid();

  } else {
    this.setValid();
  }
}