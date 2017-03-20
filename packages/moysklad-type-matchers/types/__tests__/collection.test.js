'use strict'

const test = require('blue-tape')
const collection = require('../collection')

const COLLECTION = {
  meta: {
    href: 'href',
    size: 1
  }
}

const NOT_COLLECTION = [
  null,
  void 0,
  0,
  1,
  '',
  'str',
  {},
  [],
  { meta: 'meta' },
  { meta: {} },
  { meta: { href: 'href' } }
]

test('collection matcher', t => {
  t.ok(collection, 'is ok')

  t.true(collection(COLLECTION), 'should return true for collection like object')

  NOT_COLLECTION.forEach(notCollection => {
    t.false(collection(notCollection),
      `should return false for not collection like - ${JSON.stringify(notCollection)}`)
  })

  t.end()
})
