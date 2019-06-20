'use strict';

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid'),
  href: require('moysklad-type-matchers/types/href'),
  ref: require('moysklad-type-matchers/types/ref')
});

module.exports = function getAttr() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _have$strict = have.strict(args, [{ entity: 'obj', attrId: 'uuid' }, { entity: 'obj', href: 'href' }, { entity: 'obj', ref: 'ref' }, have.argumentsObject]);

  let entity = _have$strict.entity,
      attrId = _have$strict.attrId,
      href = _have$strict.href,
      ref = _have$strict.ref;


  if (!entity.attributes) return null;

  if (attrId == null && href == null && ref == null) {
    throw new Error('getAttr: You should specify correct attribute id, href or ref');
  }

  if (attrId != null) {
    return entity.attributes.find(a => a.id === attrId) || null;
  } else if (href != null) {
    return entity.attributes.find(a => a.meta != null && a.meta.href === href) || null;
  } else {
    return entity.attributes.find(a => a.meta != null && a.meta.href.indexOf(ref) !== -1) || null;
  }
};