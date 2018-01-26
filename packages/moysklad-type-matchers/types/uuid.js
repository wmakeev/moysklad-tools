'use strict'

const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

module.exports = function (uuid) {
  return !!(typeof uuid === 'string' && UUID_REGEX.test(uuid))
}
