'use strict';

// const fs = require('fs')

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const EventEmitter = require('events');
const debug = require('debug')('moysklad-extension-queue');
const test = require('blue-tape');
const Moysklad = require('moysklad');
const sleep = require('moysklad/tools/sleep');

const QueueStamp = require('..');
const ExtendedMoysklad = Moysklad.compose(QueueStamp);

let products = require('./products');

test('Moysklad queue', (() => {
  var _ref = _asyncToGenerator(function* (t) {
    const period = 5500;
    const tasksPerPeriod = 100;
    // const parallelTasks = 50

    // Сделаем паузу после предыдущих тестов (чтобы убедиться что лимиты не перекрываются)
    debug(`Ожидаем ${period / 1000} сек ...`);
    yield sleep(period);

    let emitter = new EventEmitter();
    let ms = ExtendedMoysklad({
      queue: true,
      // queue: {
      //   period,
      //   tasksPerPeriod,
      //   parallelTasks
      // },
      emitter: emitter
    });

    // debug(`Получаем идентификаторы ${tasksPerPeriod * 2} товаров ...`)
    // products = [
    //   ...(await ms.GET('entity/product', { limit: tasksPerPeriod })).rows,
    //   ...(await ms.GET('entity/product', { offset: tasksPerPeriod, limit: tasksPerPeriod })).rows]

    // fs.writeFileSync(
    //   '/Users/mvv/Documents/GitHub/moysklad/src/extensions/queue/__tests__/products.json',
    //   JSON.stringify(products.map(p => ({ id: p.id, name: p.name }))))

    let startTime = Date.now();
    let report = [];
    let results = [];

    t.comment('should queue requests to avoid 429 error');

    emitter.on('request:start', function (_ref2) {
      let uri = _ref2.uri;

      let parsedUri = ms.parseUri(uri);
      let id = parsedUri.path[2];
      let reportItem = report.find(function (i) {
        return i.id === id;
      });
      reportItem.started = Date.now() - startTime;
    });

    emitter.on('response:body', function (_ref3) {
      let uri = _ref3.uri;

      let parsedUri = ms.parseUri(uri);
      let id = parsedUri.path[2];
      let reportItem = report.find(function (i) {
        return i.id === id;
      });
      reportItem.processed = Date.now() - startTime;
    });

    emitter.on('error', function () {
      debug('error:', Date.now() - startTime);
    });

    for (let i = 0, max = tasksPerPeriod * 2; i < max; i++) {
      report[i] = {
        id: products[i].id,
        number: i,
        added: Date.now() - startTime
      };
      results[i] = ms.GET(['entity/product', products[i].id]).then(function (p) {
        return p.name;
      });
    }

    try {
      results = yield Promise.all(results);
    } finally {
      // fs.writeFileSync('/Users/mvv/Documents/GitHub/moysklad/_temp/queue.js',
      //   'var data = ' + JSON.stringify(report, null, 2))
    }

    t.ok(results.every(function (r, index) {
      return r === products[index].name;
    }));
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());