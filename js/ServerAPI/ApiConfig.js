const requestDefaultConfig = {credentials: 'include'};
const requestJsonHeaders = {headers: {'Content-Type': 'application/json'}};
const requestJsonConfig = Object.assign({}, requestDefaultConfig, requestJsonHeaders);

const requestJsonConfigs = {
  post: Object.assign({}, requestJsonConfig, {method: 'POST'}),
  put: Object.assign({}, requestJsonConfig, {method: 'PUT'}),
  delete: Object.assign({}, requestJsonConfig, {method: 'DELETE'}),
};