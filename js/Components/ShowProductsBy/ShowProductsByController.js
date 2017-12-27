class ShowProductsByController {
  showProductsBylInit(view) {
    const showByList = view.optionsList;

    showByList.addEventListener('change', () => {
      const newValue = showByList.value;
      window.howMuchProductsShow = Number(newValue);
      view.updatePage();
    });
  }
}

const showProductsByController = new ShowProductsByController();