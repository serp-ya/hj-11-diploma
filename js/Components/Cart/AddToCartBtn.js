'use strict';
class AddToCartBtn {
  constructor(options) {
    if (!options.rootElement) {
      throw new Error('Не передан корневой элемент');
    }

    this.addBtn = options.rootElement;
    this.controller = options.controller;

    this.initController(this.controller);
  }

  initController(controller) {
    controller.addProduct(this);
  }

  changeState(newState) {
    this.cleanStateClasses();

    switch(newState) {
      case 'tryingToAdd':
        this.addBtn.classList.add('in-process');
        break;
      case 'itAdd':
        this.addBtn.classList.add('it-add');
        break;
      case 'addIsFailed':
        this.addBtn.classList.add('it-failed');
        break;
    }

    setTimeout(() => {
      this.cleanStateClasses();
    }, 3000);
  }

  cleanStateClasses() {
    this.addBtn.classList.remove('in-process', 'it-add', 'it-failed');
  }
}