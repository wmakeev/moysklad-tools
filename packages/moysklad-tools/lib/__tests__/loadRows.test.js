'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

const test = require('blue-tape');
const Moysklad = require('moysklad');

var _require = require('..');

const loadRows = _require.loadRows;


const ORDER_LARGE_ID = 'dd5d3aff-08d6-11e7-7a69-97110015919e';
const POSITIONS_LARGE_COUNT = 333;

const ORDER_SMALL_ID = '94510b32-23b3-4167-babf-34463f8a719d';
const POSITIONS_SMALL_COUNT = 89;

const uniqCount = items => [].concat(_toConsumableArray(new Set(items))).length;

test('tools.loadRows', t => {
  t.equal(typeof loadRows, 'function', 'should be function');
  t.end();
});

// TODO Test throws on incorrect arguments?

test('tools.loadRows returns rows from expanded collection', (() => {
  var _ref = _asyncToGenerator(function* (t) {
    const ms = Moysklad();

    let order = yield ms.GET(['entity/customerorder', ORDER_SMALL_ID], { expand: 'positions' });
    t.ok(order.positions.rows, 'positions is expanded');

    let rows = yield loadRows(ms, order.positions);

    t.true(rows instanceof Array, 'should return rows array');

    t.equals(rows.length, POSITIONS_SMALL_COUNT, `should return ${POSITIONS_SMALL_COUNT} positions`);
    t.equal(uniqCount(rows.map(function (p) {
      return p.id;
    })), POSITIONS_SMALL_COUNT, `should return ${POSITIONS_SMALL_COUNT} uniq positions`);
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

test('tools.loadRows load and returns rows from not expanded collection', (() => {
  var _ref2 = _asyncToGenerator(function* (t) {
    const ms = Moysklad();

    let order = yield ms.GET(['entity/customerorder', ORDER_SMALL_ID]);
    let rows = yield loadRows(ms, order.positions);

    t.true(rows instanceof Array, 'should return rows array');

    t.equals(rows.length, POSITIONS_SMALL_COUNT, `should return ${POSITIONS_SMALL_COUNT} positions`);
    t.equal(uniqCount(rows.map(function (p) {
      return p.id;
    })), POSITIONS_SMALL_COUNT, `should return ${POSITIONS_SMALL_COUNT} uniq positions`);
  });

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
})());

test('tools.loadRows load and returns rows from not expanded collection (limit specified)', (() => {
  var _ref3 = _asyncToGenerator(function* (t) {
    const LIMIT = 33;
    const ms = Moysklad();

    let order = yield ms.GET(['entity/customerorder', ORDER_SMALL_ID]);
    let rows = yield loadRows(ms, order.positions, { limit: LIMIT });

    t.true(rows instanceof Array, 'should return rows array');

    t.equals(rows.length, POSITIONS_SMALL_COUNT, `should return ${POSITIONS_SMALL_COUNT} positions`);
    t.equal(uniqCount(rows.map(function (p) {
      return p.id;
    })), POSITIONS_SMALL_COUNT, `should return ${POSITIONS_SMALL_COUNT} uniq positions`);
  });

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
})());

test('tools.loadRows returns from expanded collection and load others pages', (() => {
  var _ref4 = _asyncToGenerator(function* (t) {
    let ms = Moysklad();

    let order = yield ms.GET(['entity/customerorder', ORDER_LARGE_ID], { expand: 'positions' });
    let rows = yield loadRows(ms, order.positions);

    t.true(rows instanceof Array, 'should return rows array');

    t.equals(rows.length, POSITIONS_LARGE_COUNT, `should return ${POSITIONS_LARGE_COUNT} positions`);
    t.equal(uniqCount(rows.map(function (p) {
      return p.id;
    })), POSITIONS_LARGE_COUNT, `should return ${POSITIONS_LARGE_COUNT} uniq positions`);
  });

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
})());

test('tools.loadRows returns from expanded collection and load others pages (with offset) #1', (() => {
  var _ref5 = _asyncToGenerator(function* (t) {
    const LIMIT = 55;
    const OFFSET = 60;
    const ms = Moysklad();

    let order = yield ms.GET(['entity/customerorder', ORDER_LARGE_ID], { expand: 'positions' });
    let rows = yield loadRows(ms, order.positions, {
      offset: OFFSET, limit: LIMIT
    });

    t.true(rows instanceof Array, 'should return positions array');

    t.equals(rows.length, POSITIONS_LARGE_COUNT - OFFSET, `should return ${POSITIONS_LARGE_COUNT - OFFSET} positions`);

    t.equal(uniqCount(rows.map(function (p) {
      return p.id;
    })), POSITIONS_LARGE_COUNT - OFFSET, `should return ${POSITIONS_LARGE_COUNT - OFFSET} uniq positions`);
  });

  return function (_x5) {
    return _ref5.apply(this, arguments);
  };
})());

test('tools.loadRows returns from expanded collection and load others pages (with offset) #2', (() => {
  var _ref6 = _asyncToGenerator(function* (t) {
    const LIMIT = 50;
    const OFFSET = 133;
    const ms = Moysklad();

    let order = yield ms.GET(['entity/customerorder', ORDER_LARGE_ID], { expand: 'positions' });
    let rows = yield loadRows(ms, order.positions, {
      offset: OFFSET, limit: LIMIT
    });

    t.true(rows instanceof Array, 'should return positions array');

    t.equals(rows.length, POSITIONS_LARGE_COUNT - OFFSET, `should return ${POSITIONS_LARGE_COUNT - OFFSET} positions`);

    t.equal(uniqCount(rows.map(function (p) {
      return p.id;
    })), POSITIONS_LARGE_COUNT - OFFSET, `should return ${POSITIONS_LARGE_COUNT - OFFSET} uniq positions`);
  });

  return function (_x6) {
    return _ref6.apply(this, arguments);
  };
})());

// TODO проверить результат по заранее полученной эталонной коллекции

test('tools.loadRows (with array filter)', (() => {
  var _ref7 = _asyncToGenerator(function* (t) {
    const LIMIT = 10;
    const OFFSET = 0;
    const codes = ['15306', '15307', '15312', '15316', '15319', '15320', '15348', '15362', '15567', '15568', '15570', '15571', '15581', '15584', '15586', '16148', '16152', '16163', '16169', '16170', '16181', '16182', '16185', '16189', '16192', '16208', '16211', '16228', '16238', '16239', '16243', '16847', '16855', '22467'];
    const ms = Moysklad();

    let productsCollection = yield ms.GET('entity/product', {
      filter: {
        code: codes
      }
    });
    let rows = yield loadRows(ms, productsCollection, {
      offset: OFFSET, limit: LIMIT
    });

    t.true(rows instanceof Array, 'should return positions array');

    t.equals(rows.length, codes.length, `should return ${codes.length} products`);

    t.ok(rows.every(function (p) {
      return codes.find(function (c) {
        return c === p.code;
      });
    }), `should return requested products`);
  });

  return function (_x7) {
    return _ref7.apply(this, arguments);
  };
})());