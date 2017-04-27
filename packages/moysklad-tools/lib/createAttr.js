'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

const uuidMatcher = require('moysklad-type-matchers/types/uuid');
const have = require('have2').with({
  'uuid': uuidMatcher,
  'uuid/uuid': id => {
    if (typeof id !== 'string') {
      return false;
    }

    var _id$split = id.split('/'),
        _id$split2 = _slicedToArray(_id$split, 2);

    let dicId = _id$split2[0],
        entId = _id$split2[1];

    return uuidMatcher(dicId) && uuidMatcher(entId);
  }
});
const createMeta = require('./createMeta');

module.exports = function createAttr() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  let parsedArgs = have.strict(args, [{ client: 'Object', id: 'uuid', entityId: 'uuid/uuid' }, { client: 'opt Object', id: 'uuid', name: 'str' }]);

  let attr = {
    id: parsedArgs.id
  };

  if (parsedArgs.entityId) {
    attr.value = {
      meta: createMeta(parsedArgs.client, 'customentity', ['entity/customentity', parsedArgs.entityId])
    };
  } else {
    attr.value = {
      name: parsedArgs.name
    };
  }

  return attr;
};