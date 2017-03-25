'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');
const test = require('blue-tape');
const aggregateMetadata = require('../aggregateMetadata');
const model = require('../../res/json-api-model');

const QueueExtension = require('moysklad-extension-queue');
const Moysklad = require('moysklad').compose(QueueExtension);

test('aggregateMetadata is ok', t => {
  t.equals(typeof aggregateMetadata, 'function');
  t.end();
});

test('aggregateMetadata', (() => {
  var _ref = _asyncToGenerator(function* (t) {
    let moysklad = Moysklad({ queue: true });
    let metadata = yield aggregateMetadata(moysklad, model, {
      customEntityFilter: function customEntityFilter(entName) {
        return !['Бренды', 'Города'].includes(entName);
      }
    });

    t.ok(metadata, 'should return metadata');
    fs.writeFileSync(path.resolve('_temp/aggregatedMetadata.json'), JSON.stringify(metadata, null, 2));
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());