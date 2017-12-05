class TemplateEngine {
  constructor(schemasFolder) {
    this.schemasFolder = schemasFolder;
    this.schemas = {};
  }

  addSchema(schemaObject) {
    if (Array.isArray(schemaObject) || typeof schemaObject !== 'object') {
      throw new Error('Schema Object must be a object!');

    } else if (!schemaObject['name']) {
      throw new Error('Schema name is empty');

    } else if (!schemaObject['url']) {
      throw new Error('Schema url is empty');
    }

    schemaObject.url = this.schemasFolder + schemaObject.url;

    this.schemas[schemaObject.name] = schemaObject.url;
  }

  renderPage(schema, renderedData) {
    if (typeof schema === 'string') {
      return document.createTextNode(schema);
    } else {
      if (typeof schema !== 'object') return;
    }

    let tagName = schema.tagName;
    let className = schema.className;
    let id = schema.id;
    let attributes = schema.attributes;
    let content = schema.content;
    let isRepeaterTemplate = schema.repeater;
    let repeaterCountVariable = schema.repeaterCount;
    let element = document.createElement(tagName);

    if (id) {
      element.id = id;
    }

    if (Array.isArray(className)) {
      className.forEach(currentClass => {
        element.classList.add(currentClass);
      });

    } else if (typeof className === 'string') {
      element.classList.add(className);
    }

    if (typeof attributes === 'object') {
      Object.keys(attributes).forEach(key => {
        let hasVariable = this.checkVariable(attributes[key]);

        if (hasVariable) {
          let templateVariable = this.parseVariable(attributes[key]);
          let foundData = this.pickUpDataFromVariable(templateVariable, renderedData);

          if (foundData) {
            element.setAttribute(key, foundData);
          }

        } else {
          element.setAttribute(key, attributes[key]);
        }
      });
    }

    if (typeof content === 'string') {
      let hasVariable = this.checkVariable(content);
      let hasCondition = this.checkCondition(content);

      if (hasCondition) {
        const condition = this.parseCondition(content);
        const conditionFulfilled = this.fulfillCondition(condition, renderedData);

        if (conditionFulfilled) {
          return this.renderPage(schema.if, renderedData);
        } else {
          return this.renderPage(schema.else, renderedData);
        }
        
      } else if (hasVariable && !hasCondition) {
        let templateVariable = this.parseVariable(content);
        let foundData = this.pickUpDataFromVariable(templateVariable, renderedData);

        if (foundData) {
          element.innerText = foundData;
        }
      } else {
        element.innerText = content;
      }

    } else if (Array.isArray(content)) {
      content.forEach(item => {
        let node = this.renderPage(item, renderedData);
        element.appendChild(node);
      });

    } else if (typeof content === 'object') {
      if (isRepeaterTemplate && repeaterCountVariable) {
        const repeaterTemplate = content;
        let repeaterCount = this.parseVariable(repeaterCountVariable);
        repeaterCount = this.pickUpDataFromVariable(repeaterCount, renderedData);

        for (let i = 0; i < repeaterCount; i++) {
          element.appendChild(this.renderPage(repeaterTemplate));
        }

      } else if (isRepeaterTemplate && Array.isArray(renderedData)) {

        let repeaterTemplate = content;
        renderedData.forEach(eachData => {
          element.appendChild(this.renderPage(repeaterTemplate, eachData));
        });

      } else {
        element.appendChild(this.renderPage(content, renderedData));
      }
    }

    return element;
  }

  checkVariable(partOfContent) {
    try {
      return partOfContent.match(/^(\<\%){1}.+(\%\>){1}$/ig) ? true : false;

    } catch (error) {
      console.error(error);
      return false;
    }
  }

  checkCondition(partOfContent) {
    const templateVariable = this.parseVariable(partOfContent);
    return templateVariable.match(/^if/) ? true : false;
  };

  parseVariable(partOfContent) {
    try {
      return partOfContent.replace(/[<%>]/ig, '');

    } catch (e) {
      console.error(e);
      return false;
    }
  }

  parseCondition(partOfContent) {
    const templateVariable = this.parseVariable(partOfContent);
    let condition = templateVariable.replace(/^(if)?/, '');
    condition = condition.replace(/\(?\)?/g, '');

    return condition;
  }

  fulfillCondition(condition, dataSource) {
    if (condition.match(/^!!/)) {
      const conditionVariable = condition.replace(/^!!/, '');
      const conditionResult = this.pickUpDataFromVariable(conditionVariable, dataSource);

      return conditionResult;
      
    } else if (condition.match(/==/)) {
      const conditionComparsion = condition.split('==')[1];
      let conditionVariable;

      if (condition.match(/\./)) {
        conditionVariable = condition.split('==')[0].split('.');
      } else {
        conditionVariable = condition.split('==')[0];
      }

      if (conditionVariable[0] === 'window') {
        return window[conditionVariable[1]] == conditionComparsion;
      }
    }
  }

  pickUpDataFromVariable(templateVariable, dataSource) {
    if (templateVariable.match(/\./g)) {
      let dotVariable;
      let multiplier;

      if (templateVariable.match(/\*/g)) {
        dotVariable = templateVariable.split('*')[0];
        multiplier = templateVariable.split('*')[1];
        multiplier = dataSource[multiplier];
      }

      dotVariable = dotVariable ? dotVariable.split('.') : templateVariable.split('.');

      const searchData = dotVariable.reduce((result, innerVariableKey) => {
        return result[innerVariableKey]
      }, dataSource);

      return multiplier ? (searchData * multiplier).toFixed(2) : searchData;

    } else if (templateVariable.match(/\+/g) && templateVariable.match(/\:/g)) {
      try {
        const variableStaticContent = templateVariable.split('+')[0];
        let dataQuery = templateVariable.replace(variableStaticContent, '').replace('+', '').split(':');
        let convertedPart = dataQuery.reduce((result, stageKey) => {
          return result[stageKey];
        }, dataSource);

        return variableStaticContent + convertedPart;

      } catch (e) {
        console.error(e);
      }
    } else if (templateVariable.match(/\:/g)) {
      try {
        let dataQuery = templateVariable.split(':');
        return dataQuery.reduce((result, stageKey) => {
          return result[stageKey];
        }, dataSource);

      } catch (e) {
        console.error(e);
      }
    } else if (templateVariable.match(/\+/g)) {
      try {
        let dataQuery = templateVariable.split('+');
        const variableStaticContent = dataQuery[0];
        const queriedData = dataSource[dataQuery[1]];

        return variableStaticContent + queriedData;

      } catch (e) {
        console.error(e);
      }
    } else if (templateVariable.match(/\=/g)) {
      try {
        const dataQuery = templateVariable.split('=');
        const isIsTrue = dataSource[dataQuery[0]];

        if (isIsTrue) {
          return dataQuery[1];
        }
      } catch (e) {
        console.error(e);
      }
    }

    let requestData = dataSource[templateVariable];

    if (Array.isArray(requestData)) {
      return requestData[0];
    } else if (requestData) {
      return requestData;
    }

    return null;
  }

  renderPagination(itemsCount, currentPage) {
    const entryOnPage = window.howMuchProductsShow;
    const countOfPages = Math.ceil(itemsCount / entryOnPage);
    const maxBtnsLimit = 3;

    if (itemsCount < entryOnPage) {
      return;
    }

    const paginationWrapper = document.createElement('div');
    paginationWrapper.classList.add('pagination-area');

    const listOfPages = document.createElement('ul');
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    const icon = document.createElement('i');

    let firstBtn = Math.ceil(currentPage - (maxBtnsLimit / 2));

    if (firstBtn < 1) {
      firstBtn = 1;
    } else {
      if (countOfPages - firstBtn < maxBtnsLimit) {
        firstBtn = countOfPages - maxBtnsLimit + 1;

        if (firstBtn < 1) {
          firstBtn = 1;
        }
      }
    }

    let lastPage = firstBtn + maxBtnsLimit - 1;

    if (lastPage > countOfPages) {
      lastPage = countOfPages;
    }

    if (firstBtn !== 1) {
      const previousPageBtn = listItem.cloneNode();
      const previousPageAnchor = anchor.cloneNode();
      previousPageAnchor.href = 'page/' + (firstBtn);

      const leftAngleIcon = icon.cloneNode();
      leftAngleIcon.classList.add('fa', 'fa-angle-left');

      listOfPages
        .appendChild(previousPageBtn)
        .appendChild(previousPageAnchor)
        .appendChild(leftAngleIcon)
    }

    for (let i = firstBtn; i <= lastPage; i++) {
      const pageBtn = listItem.cloneNode();
      const pageAnchor = anchor.cloneNode();
      pageAnchor.href = 'page/' + i;
      pageAnchor.innerText = i;

      if (i === Number(currentPage)) {
        pageAnchor.classList.add('active');
      }

      listOfPages
        .appendChild(pageBtn)
        .appendChild(pageAnchor)
    }

    if (lastPage < countOfPages) {
      const nextPageBtn = listItem.cloneNode();
      const nextPageAnchor = anchor.cloneNode();
      nextPageAnchor.href = 'page/' + (lastPage);

      const leftAngleIcon = icon.cloneNode();
      leftAngleIcon.classList.add('fa', 'fa-angle-right');

      listOfPages
        .appendChild(nextPageBtn)
        .appendChild(nextPageAnchor)
        .appendChild(leftAngleIcon)

    }

    paginationWrapper.appendChild(listOfPages);

    return paginationWrapper;
  }
}