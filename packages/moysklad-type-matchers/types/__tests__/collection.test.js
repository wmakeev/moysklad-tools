'use strict'

const test = require('blue-tape')
const collection = require('../collection')

const COLLECTION = [
  {
    meta: {
      href: 'href',
      type: 'collection',
      size: 0
    }
  },
  {
    meta: {
      href: 'href',
      type: 'collection',
      size: 1
    }
  },
  {
    meta: {
      href: 'href',
      type: 'collection',
      size: 1
    },
    rows: [{}]
  },
  {
    meta: {
      href: 'href',
      type: 'collection'
    },
    rows: [{}]
  },
  {
    meta: {
      href: 'href',
      type: 'collection'
    },
    rows: []
  }
]

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
  { meta: { href: 'href' } },
  { meta: { href: 'href', type: 'collection' } },
  { meta: { href: 'href' }, rows: 'not array' },
  { meta: { href: 'href', size: 1 }, rows: 'not array' }
]

test('collection matcher', t => {
  t.ok(collection, 'is ok')

  COLLECTION.forEach(coll => {
    t.true(collection(coll), 'should return true for collection like object')
  })

  NOT_COLLECTION.forEach(notCollection => {
    t.false(collection(notCollection),
      `should return false for not collection like - ${JSON.stringify(notCollection)}`)
  })

  t.end()
})
