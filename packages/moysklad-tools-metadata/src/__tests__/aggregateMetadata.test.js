'use strict'

const fs = require('fs')
const path = require('path')
const test = require('blue-tape')
const aggregateMetadata = require('../aggregateMetadata')
const model = require('../../res/json-api-model')

const QueueExtension = require('moysklad-extension-queue')
const Moysklad = require('moysklad').compose(QueueExtension)

const IS_DEV = process.env.ENV === 'development'

test('aggregateMetadata is ok', t => {
  t.equals(typeof aggregateMetadata, 'function')
  t.end()
})

test('aggregateMetadata', async t => {
  let moysklad = Moysklad({ queue: true })
  let metadata = await aggregateMetadata(moysklad, model, {
    customEntityFilter: entName => [
      'Города',
      'Пункты доставки',
      'Бренды',
      'Вид товара',
      'Приход и расход'
    ].indexOf(entName) === -1
  })

  t.ok(metadata, 'should return metadata')

  if (IS_DEV) {
    fs.writeFileSync(path.resolve('__temp/aggregatedMetadata.json'),
      JSON.stringify(metadata, null, 2))
  }
})
