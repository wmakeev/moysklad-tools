'use strict';

const have = require('./have');

module.exports = function getPropertyInfo() {
  var _have$strict = have.strict(arguments, {
    model: 'model', typeName: 'str', propName: 'str'
  });

  let model = _have$strict.model,
      typeName = _have$strict.typeName,
      propName = _have$strict.propName;


  let types = model.types;

  return function findProperty(_typeName) {
    if (_typeName === 'Object' || _typeName === 'Enum') {
      return null;
    }
    let type = types[_typeName];
    if (!type) {
      throw new Error(`Type "${_typeName}" not found`);
    }
    if (type.properties && type.properties[propName]) {
      return type.properties[propName];
    } else if (type.baseType) {
      return findProperty(type.baseType.indexOf('.') !== -1 ? type.baseType.split('.')[1] : type.baseType);
    } else {
      return null;
    }
  }(typeName);
};