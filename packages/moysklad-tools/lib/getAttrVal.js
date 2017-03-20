'use strict';

const have = require('have2').with({
  uuid: require('moysklad-type-matchers/types/uuid')
});
const getAttr = require('./getAttr');

module.exports = function getAttrVal() {
  var _have$strict = have.strict(arguments, [{ entity: 'Obj', attrId: 'uuid' }, { entity: 'Obj', meta: 'Obj' }, // TODO meta
  have.argumentsObject]);

  let entity = _have$strict.entity,
      attrId = _have$strict.attrId;


  let attr = getAttr({ entity: entity, attrId: attrId });

  if (!attr) {
    return void 0;
  }

  return attr.value;
};