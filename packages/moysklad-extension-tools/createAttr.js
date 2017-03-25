'use strict'

const stampit = require('stampit')
const createAttr = require('moysklad-tools/createAttr')

module.exports = stampit().init(function () {
  this.createAttr = createAttr.bind(this, this)
})
