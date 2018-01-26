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
    meta: {
      type: 'attributemetadata',
      href: 'https://online.moysklad.ru/api/remap/1.1/entity/product/metadata/attributes/' + 'f4c073c5-1bcc-4d91-8b41-ed825495b672'
    },
    id: 'f4c073c5-1bcc-4d91-8b41-ed825495b672',
    value: 'bar'
  }]
};

test('getAttr', t => {
  t.equals(typeof getAttr, 'function');
  t.end();
});

test('getAttr (errors)', t => {
  t.throws(() => getAttr(entity, 123), /is not uuid/);
  t.throws(() => getAttr(entity, '123'), /is not uuid/);
  t.throws(() => getAttr(entity), /is not uuid/);
  t.end();
});

test('getAttr (empty)', t => {
  t.equal(getAttr({}, 'f4c073c5-1bcc-4d91-8b41-ed825495b677'), null, 'should return attribute object');
  t.end();
});

test('getAttr by id', t => {
  t.equal(getAttr(entity, entity.attributes[0].id), entity.attributes[0], 'should return attribute object');
  t.end();
});

test('getAttr by href', t => {
  t.equal(getAttr(entity, entity.attributes[1].meta.href), entity.attributes[1], 'should return attribute object');
  t.end();
});

test('getAttrVal', t => {
  t.equals(typeof getAttrVal, 'function');
  t.equal(getAttrVal(entity, entity.attributes[1].id), entity.attributes[1].value, 'should return attribute value');
  t.end();
});