'use strict'

const stampit = require('stampit')
const createMeta = require('moysklad-tools/createMeta')

module.exports = stampit().init(function () {
  this.createMeta = createMeta.bind(this, this)
})
