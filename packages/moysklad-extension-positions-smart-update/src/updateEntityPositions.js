'use strict'

const loadRows = require('moysklad-tools/loadRows')

const updatePositions = require('./updatePositions')
const deletePositions = require('./deletePositions')
const getEntityId = require('./getEntityId')

module.exports = async function updateEntityPositions (base, entityType, entityId, positions) {
  // список идентификаторов позиций которые остаются в документе
  let entityPositionsIds = positions.reduce((res, pos) => {
    let posId = getEntityId(base, pos)
    if (posId) res.push(posId)
    return res
  }, [])

  // получаем список всех текущих позиций в документе
  let entityPositions = await base
    .GET(['entity', entityType, entityId, 'positions']).then(res => loadRows(base, res))

  // удаляем позиции из документа (те, что не вошли в список обновления)
  let positionsToDelete = entityPositions
    .filter(pos => entityPositionsIds.indexOf(getEntityId(base, pos)) === -1)
  await deletePositions(base, entityType, entityId, positionsToDelete)

  // обновляем переданные с документом позиции
  return await updatePositions(base, entityType, entityId, positions)
}
