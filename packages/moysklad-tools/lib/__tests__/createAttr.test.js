'use strict';

const test = require('blue-tape');
const Moysklad = require('moysklad');

var _require = require('..');

const createAttr = _require.createAttr;


const ATTR_ID = '48a9dbca-75f3-4f1c-933b-57df18b5169f';
const ENTITY_ID = '3e2a8f95-e4d2-4ae7-90a4-e61ff2dde955/55e6f545-b41f-4a72-8b85-363058b68598';

test('tools.createAttr', t => {
  const moysklad = Moysklad({ fetch: () => {} });

  t.equals(typeof createAttr, 'function', 'should be function');

  t.deepEqual(createAttr(moysklad, ATTR_ID, ENTITY_ID), {
    id: ATTR_ID,
    value: {
      meta: {
        type: 'customentity',
        href: 'https://online.moysklad.ru/api/remap/1.1/entity/customentity/' + ENTITY_ID,
        mediaType: 'application/json'
      }
    }
  }, 'should create customentity attribute by entity id');

  t.deepEqual(createAttr(moysklad, ATTR_ID, 'strName'), {
    id: ATTR_ID,
    value: {
      name: 'strName'
    }
  }, 'should create customentity attribute by entity name #1');

  t.deepEqual(createAttr(ATTR_ID, 'strName'), {
    id: ATTR_ID,
    value: {
      name: 'strName'
    }
  }, 'should create customentity attribute by entity name #2');

  // TODO Add fail test after have fix
  t.end();
});