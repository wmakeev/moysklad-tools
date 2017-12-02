// @ts-check

'use strict'

// @ts-ignore
const have = require('have2')
const get = require('lodash.get')

const getEntityId = require('./getEntityId')
const requestMatcher = require('./requestMatcher')
const updatePositions = require('./updatePositions')
const deletePositions = require('./deletePositions')
const createEntity = require('./createEntity')
const updateEntityPositions = require('./updateEntityPositions')
const DeferredBatchUpdate = require('./deferredBatchUpdate')

module.exports = async function methodHandler (base, method, ...args) {
  const { path, payload, query, options } = have.strict(args, [
    {
      path: 'str or str arr',
      payload: 'opt Object',
      query: 'opt Object',
      options: 'opt Object'
    },
    have.argumentsObject
  ])

  const defaultAction = _payload => base[method](path, _payload, query, options)
  const parsedPath = this.parseUrl(path).path
  const isRequestLike = requestMatcher(method, parsedPath)

  let entityType, entityId, ent

  switch (true) {
    case isRequestLike('POST entity/{type}') && payload instanceof Array:
      let batchUpdate = new DeferredBatchUpdate(base, parsedPath, query, null)

      let entitiesToUpdatePool = payload.map(async entity => {
        let positions = get(entity, 'positions', [])

        switch (true) {
          // обновлять позиции отдельно нет необходимости
          case positions.length <= 100:
            return entity

          // создание сущности
          case !(entity.id || entity.meta):
            return await createEntity(base, entity, batchUpdate)
              .then(res => ({ id: res.id }))

          // обновление сущности
          default:
            // обновление позиций в существующем документе
            entityType = parsedPath[1]
            entityId = getEntityId(entity)
            await updateEntityPositions(base, entityType, entityId, positions)

            // позиции обновлены, далее будет обновлен документ
            ent = { ...entity }
            delete ent.positions
            return ent
        }
      })

      let entitiesToUpdate = await Promise.all(entitiesToUpdatePool)
      return await defaultAction(entitiesToUpdate)

    case isRequestLike('POST entity/{type}'):
      // создаем новый документ
      return await createEntity(base, payload)

    case isRequestLike('PUT entity/{type}/{id}'):
      // обновляем позиции документа
      entityType = parsedPath[1]
      entityId = parsedPath[2]
      await updateEntityPositions(base, entityType, entityId, payload)

      // обновляем документ (без позиций)
      ent = { ...payload }
      delete ent.positions
      return await defaultAction(ent)

    case isRequestLike('POST entity/{type}/{id}/positions') && payload instanceof Array:
      // обновляем позиции
      entityType = parsedPath[1]
      entityId = parsedPath[2]
      return await updatePositions(base, entityType, entityId, payload) // TODO expand

    case isRequestLike('POST entity/{type}/{id}/positions/delete') && payload instanceof Array:
      // удаляем позиции
      entityType = parsedPath[1]
      entityId = parsedPath[2]
      return await deletePositions(base, entityType, entityId, payload)

    default:
      // операция по умолчанию
      return await defaultAction(payload)
  }
}
