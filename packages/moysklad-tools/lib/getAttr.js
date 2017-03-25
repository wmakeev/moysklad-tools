'use strict';

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid')
});

module.exports = function getAttr() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var _have$strict = have.strict(args, [{ entity: 'Obj', attrId: 'uuid' }, { entity: 'Obj', meta: 'Obj' }, // TODO meta
  have.argumentsObject]);

  let entity = _have$strict.entity,
      attrId = _have$strict.attrId;


  if (!entity.attributes) {
    // TODO Нужна ли ошибка?
    // throw new Error('Entity has no attributes')
    return null;
  }

  return entity.attributes.find(a => a.id === attrId);
};