'use strict'

const stampit = require('stampit')
const methodHandler = require('./methodHandler')

module.exports = stampit().init(function () {
  let base = Object.create(Object.getPrototypeOf(this))
  Object.assign(base, this)

  this.PUT = function (...args) {
    return methodHandler.call(this, base, 'PUT', ...args)
  }

  this.POST = function (...args) {
    return methodHandler.call(this, base, 'POST', ...args)
  }
})
