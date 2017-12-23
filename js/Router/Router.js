'use strict';
class Router {
  constructor() {
    this.routes = [];
    this.root = '/';
  }

  getFragment() {
    const match = window.location.href.match(/#(.*)$/);
    let fragment = match ? match[1] : '';

    return this.clearSlashes(fragment);
  }

  clearSlashes(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }

  add(re, handler) {
    if (typeof re === 'function') {
      handler = re;
      re = '';
    }

    this.routes.push({ re: re, handler: handler});
    return this;
  }

  check(f) {
    const fragment = f || this.getFragment();

    this.routes.some((rout) => {
      const match = fragment.match(rout.re);

      if (match) {
        match.shift();
        rout.handler.apply({}, match);

        return true;
      }
    });

    return this;
  }

  listen() {
    window.addEventListener('hashchange', () => {
      setTimeout(() => {
        const current = this.getFragment();
        this.check(current);
      }, 50);
    });

    return this;
  }

  navigate(hash) {
    window.location.hash = hash ? hash : '';
    return this;
  }

  pickUpLinks() {
    document.body.addEventListener('click', (event) => {
      let target = event.target;

      if (target.closest('a')) {
        event.preventDefault();

        while(target.tagName != 'A') {
          target = target.parentNode;
        }

        this.navigate(target.pathname);
      }
    });

    return this;
  }
}