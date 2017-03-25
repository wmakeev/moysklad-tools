'use strict';

const test = require('blue-tape');

var _require = require('..');

const getAttr = _require.getAttr,
      getAttrVal = _require.getAttrVal;


let entity = {
  attributes: [{
    id: 'f4c073c5-1bcc-4d91-8b41-ed825495b677',
    value: 'foo'
  }, {
    id: 'f4c073c5-1bcc-4d91-8b41-ed825495b672',
    value: 'bar'
  }]
};

// TODO Дополнить тесты

test('tools.getAttr', t => {
  t.equals(typeof getAttr, 'function');
  t.equal(getAttr(entity, entity.attributes[0].id), entity.attributes[0], 'should return attribute object');
  t.end();
});

test('tools.getAttrVal', t => {
  t.equals(typeof getAttrVal, 'function');
  t.equal(getAttrVal(entity, entity.attributes[1].id), entity.attributes[1].value, 'should return attribute value');
  t.end();
});