const templateEngine = new TemplateEngine('./js/TemplateEngine/schemas');
[
  {
    name: 'productsList',
    url: '/productsList.json'
  },
  {
    name: 'productPage',
    url: '/productPage.json'
  },
  {
    name: 'searchPage',
    url: '/searchPage.json'
  },
  {
    name: 'cartPage',
    url: '/cartPage.json'
  }
].forEach(schema => templateEngine.addSchema(schema));