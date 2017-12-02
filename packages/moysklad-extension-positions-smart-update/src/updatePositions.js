'use strict'

const chunk = require('lodash.chunk')

module.exports = async function updatePositions (moysklad, entityType, entityId, positions) {
  positions = positions.filter(pos => {
    let keys = Object.keys(pos)
    return keys.length !== 1 || keys[0] !== 'id'
  })

  if (positions.length === 0) return positions

  const positionsUpdatePath = moysklad.buildUrl(['entity', entityType, entityId, 'positions'])

  return await chunk(positions, 100).reduce(
    async (resultPositions, positionsChunk) =>
      (await resultPositions)
        .concat(await moysklad.POST(positionsUpdatePath, positionsChunk)),
    Promise.resolve([]))
}
