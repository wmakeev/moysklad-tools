'use strict'

const test = require('blue-tape')
const entityRef = require('../entityRef')

const VALID_ENTITY_REFS = [
  {
    meta: {
      type: 'entity',
      href: 'https://entity'
    }
  },
  {
    meta: {
      type: 'entity',
      href: 'https://entity'
    },
    id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca',
    foo: 'bar'
  }
]

const INVALID_ENTITY_REFS = [
  null,
  void 0,
  0,
  1,
  '',
  'str',
  {},
  [],
  { id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca' },
  { meta: { type: 'entity' } },
  { meta: { href: 'https://entity' } }
]

test('entityRef matcher', t => {
  t.ok(entityRef, 'is ok')

  VALID_ENTITY_REFS.forEach(valid => {
    t.equal(entityRef(valid), true,
      `should return true for entityRef like object - ${JSON.stringify(valid)}`)
  })

  INVALID_ENTITY_REFS.forEach(invalid => {
    t.equal(entityRef(invalid), false,
      `should return false for invalid entityRef - ${JSON.stringify(invalid)}`)
  })

  t.end()
})
