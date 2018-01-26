'use strict'

const test = require('blue-tape')
const collection = require('../collection')

const VALID_COLLECTIONS = [
  {
    meta: {
      href: 'https://href',
      type: 'collection',
      size: 0
    }
  },
  {
    meta: {
      href: 'https://href',
      type: 'collection',
      size: 1
    }
  },
  {
    meta: {
      href: 'https://href',
      type: 'collection',
      size: 1
    },
    rows: [{}]
  },
  {
    meta: {
      href: 'https://href',
      type: 'collection'
    },
    rows: [{}]
  },
  {
    meta: {
      href: 'https://href',
      type: 'collection'
    },
    rows: []
  },
  {
    rows: []
  }
]

const INVALID_COLLECTIONS = [
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

  VALID_COLLECTIONS.forEach(valid => {
    t.equal(collection(valid), true, `should return true for collection like object - ` +
      JSON.stringify(valid))
  })

  INVALID_COLLECTIONS.forEach(invalid => {
    t.equal(collection(invalid), false,
      `should return false for not collection - ${JSON.stringify(invalid)}`)
  })

  t.end()
})
