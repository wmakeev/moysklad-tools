'use strict'

module.exports = defNum => val => {
  if (typeof val === 'string') {
    let num = Number.parseInt(val)
    return Number.isNaN(num) ? defNum : num
  } else if (typeof val === 'number') {
    return val
  } else {
    return defNum
  }
}
