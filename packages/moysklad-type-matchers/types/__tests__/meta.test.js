'use strict'

const test = require('blue-tape')
const meta = require('../meta')

const VALID_METAS = [
  { type: 'state', href: 'https://state' }
]

const INVALID_METAS = [
  null,
  void 0,
  0,
  1,
  'str',
  '',
  'eb7bcc22-ae8d-11e3-9e32*002590a28eca',
  {},
  [],
  { type: 'state' },
  { href: 'https://state' },
  { type: 1, href: 'https://state' },
  { type: 'state', href: 'state' }
]

test('meta matcher', t => {
  t.ok(meta, 'is ok')

  VALID_METAS.forEach(valid => {
    t.equal(meta(valid), true,
      `should return true for meta like object - ${JSON.stringify(valid)}`)
  })

  INVALID_METAS.forEach(invalid => {
    t.equal(meta(invalid), false,
      `should return false for not meta object - ${JSON.stringify(invalid)}`)
  })

  t.end()
})
