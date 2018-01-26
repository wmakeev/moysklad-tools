'use strict';

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid'),
  href: require('moysklad-type-matchers/types/href')
});

module.exports = function getAttr() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _have$strict = have.strict(args, [{ entity: 'obj', attrId: 'uuid' }, { entity: 'obj', href: 'href' }, have.argumentsObject]);

  let entity = _have$strict.entity,
      attrId = _have$strict.attrId,
      href = _have$strict.href;


  if (!entity.attributes) {
    // TODO Нужна ли ошибка?
    // throw new Error('Entity has no attributes')
    return null;
  }

  if (attrId == null && href == null) {
    throw new Error('getAttr: You should specify correct attribute id or href');
  }

  return attrId != null ? entity.attributes.find(a => a.id === attrId) : entity.attributes.find(a => a.meta != null && a.meta.href === href);
};