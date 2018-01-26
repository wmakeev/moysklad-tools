'use strict'

const test = require('blue-tape')
const href = require('../href')

const VALID_HREFS = [
  'https://f',
  'https://foo.bar',
  'https://foo.bar/baz//foo/'
]

const INVALID_HREFS = [
  null,
  void 0,
  0,
  1,
  'str',
  '',
  'eb7bcc22-ae8d-11e3-9e32*002590a28eca',
  {},
  [],
  'https://'
]

test('href matcher', t => {
  t.ok(href, 'is ok')

  VALID_HREFS.forEach(valid => {
    t.equal(href(valid), true,
      `should return true for href like string - ${JSON.stringify(valid)}`)
  })

  INVALID_HREFS.forEach(invalid => {
    t.equal(href(invalid), false,
      `should return false for not href - ${JSON.stringify(invalid)}`)
  })

  t.end()
})
