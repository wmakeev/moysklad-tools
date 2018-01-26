'use strict'

const test = require('blue-tape')
const defaultNum = require('../defaultNum')

test('defaultNum', t => {
  let func = defaultNum(123)
  t.equal(func('555'), 555)
  t.equal(func(777), 777)
  t.equal(func(), 123)
  t.equal(func(null), 123)
  t.equal(func({}), 123)
  t.equal(func('foo'), 123)
  t.end()
})
