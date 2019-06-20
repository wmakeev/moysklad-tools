'use strict';

const test = require('blue-tape');

var _require = require('..');

const getAttrMaybe = _require.getAttrMaybe;


let entity = {
  attributes: [{
    meta: {
      type: 'attributemetadata',
      href: 'https://online.moysklad.ru/api/remap/1.1/entity/product/metadata/attributes/' + 'f4c073c5-1bcc-4d91-8b41-ed825495b672'
    },
    id: 'f4c073c5-1bcc-4d91-8b41-ed825495b672',
    value: 'bar'
  }]
};

test('getAttrMaybe', t => {
  t.equals(typeof getAttrMaybe, 'function');

  let res = getAttrMaybe(entity, entity.attributes[0].id).map(attr => attr.id).orJust();

  t.equal(res, entity.attributes[0].id);

  res = getAttrMaybe(entity, entity.attributes[0].id).get('value').orJust();

  t.equal(res, entity.attributes[0].value);

  res = getAttrMaybe(entity, entity.attributes[0].id).get('value.name').orJust('empty');

  t.equal(res, 'empty');

  t.end();
});