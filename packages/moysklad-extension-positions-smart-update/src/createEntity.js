'use strict'

const updatePositions = require('./updatePositions')

module.exports = async function (base, entity, batchUpdate) {
  let positions = entity.positions

  // первые 100 позиций создаются вместе с документом
  entity.positions = positions.slice(0, 100)

  let newEntity = batchUpdate
    ? await batchUpdate.POST(entity)
    : await defaultAction(entity)

  // остальные позиции создаются отдельно
  let tailPositions = positions.slice(100)
  await updatePositions(base, newEntity.meta.type, newEntity.id, tailPositions)

  // в случае с batchUpdate сущность будет загружена заново в итоговом batch POST запросе
  if (!batchUpdate) {
    newEntity.positions.meta.size += tailPositions.length
  }

  return newEntity
}
