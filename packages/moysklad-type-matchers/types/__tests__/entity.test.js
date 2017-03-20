'use strict'

const test = require('blue-tape')
const entity = require('../entity')

const ENTITY = {
  meta: {
    type: 'entity'
  },
  id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca'
}

const NOT_ENTITY = [
  null,
  void 0,
  0,
  1,
  '',
  'str',
  {},
  [],
  { id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca' },
  { meta: {}, id: 'eb7bcc22-ae8d-11e3-9e32-002590a28eca' }
]

test('entity matcher', t => {
  t.ok(entity, 'is ok')

  t.true(entity(ENTITY), 'should return true for entity like object')

  NOT_ENTITY.forEach(notEntity => {
    t.false(entity(notEntity),
      `should return false for not entity like - ${JSON.stringify(notEntity)}`)
  })

  t.end()
})
