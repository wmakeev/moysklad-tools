'use strict'

const stampit = require('stampit')
const loadRows = require('moysklad-tools/loadRows')

module.exports = stampit().init(function () {
  this.loadRows = loadRows.bind(this, this)
})
