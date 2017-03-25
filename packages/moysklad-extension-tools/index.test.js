'use strict'

const test = require('blue-tape')
const Moysklad = require('moysklad')
const ExtensionTools = require('./index')

test('moysklad-extension-tools', t => {
  t.ok(ExtensionTools)

  let moysklad = Moysklad.compose(ExtensionTools).create({ fetch () {} })

  let methods = ['createAttr', 'createMeta', 'loadRows']

  methods.forEach(m => {
    t.equal(typeof moysklad[m], 'function', `should bind \`${m}\` method`)
  })

  t.end()
})
