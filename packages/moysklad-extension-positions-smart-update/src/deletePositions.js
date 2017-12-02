'use strict'

const chunk = require('lodash.chunk')

module.exports = async function deletePositions (moysklad, entityType, entityId, positions) {
  const positionsDeletePath = this.buildUrl(['entity', entityType, entityId, 'positions/delete'])

  await chunk(positions, 100).reduce(
    async (res, posChunk) => {
      await res
      await moysklad.POST(positionsDeletePath, posChunk)
    },
    Promise.resolve())
}
