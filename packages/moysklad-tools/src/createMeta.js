'use strict'

const have = require('have2')

module.exports = function createMeta (...args) {
  let { client, type, path } = have.strict(args, [
    { client: 'Object', type: 'str', path: 'str or str arr' },
    have.argumentsObject
  ])

  return {
    href: client.buildUrl(path),
    type,
    mediaType: 'application/json'
  }
}
