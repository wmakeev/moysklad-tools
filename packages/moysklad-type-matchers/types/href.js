'use strict'

const HREF_REGEX = /^https:\/\/.+/

module.exports = function (href) {
  return !!(
    href &&
    typeof href === 'string' &&
    HREF_REGEX.test(href)
  )
}
