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

    for(let i=0; i<this.routes.length; i++) {
      const match = fragment.match(this.routes[i].re);

      if(match) {
        match.shift();
        this.routes[i].handler.apply({}, match);
        return this;
      }
    }

    return this;
  }

  listen() {
    const self = this;
    let current = self.getFragment();
    const fn = function() {
      if(current !== self.getFragment()) {
        current = self.getFragment();
        self.check(current);
      }
    };

    clearInterval(this.interval);
    this.interval = setInterval(fn, 50);
    return this;
  }

  navigate(path) {
    path = path ? path : '';
    window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;

    return this;
  }

  pickUpLinks() {
    const links = document.querySelectorAll('a');

    Array.from(links).forEach(function (link) {
      link.addEventListener('click', sendLinkToRouter);
    });
  }
}

function sendLinkToRouter(event) {
  const linkHref = event.currentTarget.pathname;
  router.navigate(linkHref);
  event.preventDefault();
}