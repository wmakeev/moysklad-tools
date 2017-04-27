'use strict'

const fs = require('fs')
const path = require('path')
const test = require('blue-tape')
const aggregateMetadata = require('../aggregateMetadata')
const model = require('../../res/json-api-model')

const QueueExtension = require('moysklad-extension-queue')
const Moysklad = require('moysklad').compose(QueueExtension)

test('aggregateMetadata is ok', t => {
  t.equals(typeof aggregateMetadata, 'function')
  t.end()
})

test('aggregateMetadata', async t => {
  let moysklad = Moysklad({ queue: true })
  let metadata = await aggregateMetadata(moysklad, model, {
    customEntityFilter: entName => !['Города'].includes(entName)
  })

  t.ok(metadata, 'should return metadata')
  fs.writeFileSync(path.resolve('_temp/aggregatedMetadata.json'),
    JSON.stringify(metadata, null, 2))
})
