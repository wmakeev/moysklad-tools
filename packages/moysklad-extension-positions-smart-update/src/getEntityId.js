'use strict'

let { uuid } = require('moysklad-type-matchers')

module.exports = function getEntityId (moysklad, entity) {
  if (!entity) return null

  let entityId = null

  if (entity.id) {
    entityId = entity.id
  } else if (entity.meta) {
    entityId = moysklad.parseUrl(entity.meta.href).path.slice(-1)[0]
    if (entityId && !uuid(entityId)) {
      throw new Error(`href '${entity.meta.href}' не соответствует формату ссылки на сущность`)
    }
  }

  return entityId
}
