'use strict'

const uuidMatcher = require('moysklad-type-matchers/types/uuid')
const have = require('have2').with({
  'uuid': uuidMatcher,
  'uuid/uuid': id => {
    if (typeof id !== 'string') { return false }
    let [dicId, entId] = id.split('/')
    return uuidMatcher(dicId) && uuidMatcher(entId)
  }
})
const createMeta = require('./createMeta')

module.exports = function createAttr (...args) {
  let parsedArgs = have.strict(args, [
    { client: 'Object', id: 'uuid', entityId: 'uuid/uuid' },
    { client: 'opt Object', id: 'uuid', name: 'str' }
  ])

  let attr = {
    id: parsedArgs.id
  }

  if (parsedArgs.entityId) {
    attr.value = {
      meta: createMeta(
        parsedArgs.client, 'customentity', ['entity/customentity', parsedArgs.entityId])
    }
  } else {
    attr.value = {
      meta: {
        name: parsedArgs.name
      }
    }
  }

  return attr
}
