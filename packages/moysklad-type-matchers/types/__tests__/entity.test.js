'use strict'

const test = require('blue-tape')
const entity = require('../entity')

const VALID_ENTITY = {
  meta: {
    type: 'entity',
    href: 'https://entity'
  },
  id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca'
}

const INVALID_ENTITY = [
  null,
  void 0,
  0,
  1,
  '',
  'str',
  {},
  [],
  { id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca' },
  { meta: {}, id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca' },
  { meta: { type: 'entity' }, id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca' }
]

test('entity matcher', t => {
  t.ok(entity, 'is ok')

  t.equal(entity(VALID_ENTITY), true, 'should return true for entity like object')

  INVALID_ENTITY.forEach(invalid => {
    t.equal(entity(invalid), false,
      `should return false for not entity - ${JSON.stringify(invalid)}`)
  })

  t.end()
})
