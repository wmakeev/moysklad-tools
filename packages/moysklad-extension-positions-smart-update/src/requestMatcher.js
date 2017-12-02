'use strict'

let { uuid } = require('moysklad-type-matchers')

const requestTypes = {
  'POST entity/{type}': (method, parsedPath) =>
    method === 'POST' && parsedPath.length === 2 && parsedPath[0] === 'entity',

  'PUT entity/{type}/{id}': (method, parsedPath) =>
    method === 'PUT' && parsedPath.length === 3 && parsedPath[0] === 'entity' &&
    uuid(parsedPath[2]),

  'POST entity/{type}/{id}/positions': (method, parsedPath) =>
    method === 'POST' && parsedPath.length === 4 && parsedPath[0] === 'entity' &&
    uuid(parsedPath[2]) && parsedPath[3] === 'positions',

  'POST entity/{type}/{id}/positions/delete': (method, parsedPath) =>
    method === 'POST' && parsedPath.length === 4 && parsedPath[0] === 'entity' &&
    uuid(parsedPath[2]) && parsedPath[3] === 'positions' && parsedPath[4] === 'delete'
}

module.exports = (method, parsedPath) => type => {
  return requestTypes[type](method, parsedPath)
}
