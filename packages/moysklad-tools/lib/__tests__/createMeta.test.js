'use strict';

const test = require('blue-tape');
const Moysklad = require('moysklad');

var _require = require('..');

const createMeta = _require.createMeta;


test('tools.createMeta', t => {
  const moysklad = Moysklad({ fetch: () => {} });

  t.equals(typeof createMeta, 'function', 'should be function');

  t.deepEqual(createMeta(moysklad, 'sometype', 'path/to/type'), {
    type: 'sometype',
    href: 'https://online.moysklad.ru/api/remap/1.1/path/to/type',
    mediaType: 'application/json'
  }, 'should create meta value');

  t.end();
});