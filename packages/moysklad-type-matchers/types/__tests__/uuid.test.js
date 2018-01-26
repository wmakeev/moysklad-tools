'use strict'

const test = require('blue-tape')
const uuid = require('../uuid')

const VALID_UUID = 'eb7bcc22-ae8d-11e3-9e32-002590a28eca'

const INVALID_UUIDS = [
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

  t.equal(uuid(VALID_UUID), true, 'should return true for correct uuid')

  INVALID_UUIDS.forEach(invalid => {
    t.equal(uuid(invalid), false,
      `should return false for not uuid - ${JSON.stringify(invalid)}`)
  })

  t.end()
})
