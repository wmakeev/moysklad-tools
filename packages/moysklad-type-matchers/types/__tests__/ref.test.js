'use strict'

const test = require('blue-tape')
const ref = require('../ref')

const VALID_REFS = [
  'entity/foo/18fba15b-9288-11e9-9109-f8fc00117bb7',
  'entity/foo/18fba15b-9288-11e9-9109-f8fc00117bb7/',
  'entity/foo//18fba15b-9288-11e9-9109-f8fc00117bb7/',
  'entity/foo/bar/18fba15b-9288-11e9-9109-f8fc00117bb7/18fba15b-9288-11e9-9109-f8fc00117bb7'
]

const INVALID_REFS = [
  null,
  void 0,
  0,
  1,
  'str',
  '',
  'eb7bcc22-ae8d-11e3-9e32*002590a28eca',
  {},
  [],
  'https://',
  'entity/eb7bcc22-ae8d-11e3-9e323002590a28eca',
  'entity/foo/eb7bcc22-ae8d-11e3-9e323002590a28eca/bar'
]

test('ref matcher', t => {
  t.ok(ref, 'is ok')

  VALID_REFS.forEach(valid => {
    t.equal(ref(valid), true,
      `should return true for ref like string - ${JSON.stringify(valid)}`)
  })

  INVALID_REFS.forEach(invalid => {
    t.equal(ref(invalid), false,
      `should return false for not ref - ${JSON.stringify(invalid)}`)
  })

  t.end()
})
