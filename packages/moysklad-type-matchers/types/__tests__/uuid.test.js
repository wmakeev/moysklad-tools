'use strict'

const test = require('blue-tape')
const uuid = require('../uuid')

const UUID = 'eb7bcc22-ae8d-11e3-9e32-002590a28eca'

const NOT_UUIDS = [
  null,
  void 0,
  0,
  1,
  'str',
  '',
  'eb7bcc22-ae8d-11e3-9e32*002590a28eca',
  'eb7bcc22-ae8d-11e3-9e32-0*2590a28eca',
  {},
  []
]

test('uuid matcher', t => {
  t.ok(uuid, 'is ok')

  t.true(uuid(UUID), 'should return true for correct uuid')

  NOT_UUIDS.forEach(notUuid => {
    t.false(uuid(notUuid), `should return false for not uuid - ${JSON.stringify(notUuid)}`)
  })

  t.end()
})
