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

    if (newState === 'tryingToAdd') {
      this.addBtn.classList.add('in-process');

    } else if (newState === 'itAdd') {
      this.addBtn.classList.remove('in-process');
      this.addBtn.classList.add('it-add');

      setTimeout(() => {
        this.cleanStateClasses();
      }, 3000);

    } else if (newState === 'addIsFailed') {
      this.addBtn.classList.remove('in-process');
      this.addBtn.classList.add('it-failed');

      setTimeout(() => {
        this.cleanStateClasses();
      }, 3000);
    }
  }

  cleanStateClasses() {
    this.addBtn.classList.remove('in-process', 'it-add', 'it-failed');
  }
}