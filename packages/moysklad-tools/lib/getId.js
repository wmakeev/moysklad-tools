'use strict';

const ref = require('moysklad-type-matchers/types/ref');
const uuid = require('moysklad-type-matchers/types/uuid');
const entityRef = require('moysklad-type-matchers/types/entityRef');

const ID_REGEX = /https:\/\/\S+\/([0-9a-fA-F-]+)\??/;

module.exports = function getId(val) {
  if (ref(val)) {
    return val.split(/\//).filter(it => it).pop();
  } else if (entityRef(val)) {
    return getId(val.meta.href) || null;
  } else if (typeof val === 'string') {
    const m = val.match(ID_REGEX);
    if (!m) return null;
    const id = m[1];
    return uuid(id) ? id : null;
  } else {
    return null;
  }
};