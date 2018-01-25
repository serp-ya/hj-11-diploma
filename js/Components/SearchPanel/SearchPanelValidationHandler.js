function validateSearchPanel(event) {
  if (!this.enteredData.trim()) {
    this.clearValidation();

  } else if (this.isValid) {
    this.setValid();

  } else {
    this.setInvalid();
  }
}