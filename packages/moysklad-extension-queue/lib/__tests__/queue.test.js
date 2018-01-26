'use strict';

// const debug = require('debug')

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const test = require('blue-tape');
const Queue = require('../queue');
const sleep = require('moysklad/tools/sleep');

test('Queue is ok', t => {
  t.ok(Queue);
  t.equals(typeof Queue, 'function');
  t.end();
});

test('Queue instance', t => {
  let queue = new Queue();
  t.ok(queue, 'should be truthy');
  t.equals(queue.period, 5200, 'should have `period` property default to 5200');
  t.equals(queue.tasksPerPeriod, 100, 'should have `tasksPerPeriod` property default to 100');
  t.equals(queue.parallelTasks, 5, 'should have `parallelTasks` property default to 5');
  t.equals(typeof queue.processTask, 'function', 'should have `processTask` method');
  t.end();
});

test('Queue#processTask (simple)', (() => {
  var _ref = _asyncToGenerator(function* (t) {
    let queue = new Queue();
    let task = (() => {
      var _ref2 = _asyncToGenerator(function* () {
        yield sleep(10);
        return 'foo';
      });

      return function task() {
        return _ref2.apply(this, arguments);
      };
    })();
    let result = yield queue.processTask(task);
    t.equals(result, 'foo', 'should process async task');
  });

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})());

test('Queue#processTask (complex)', (() => {
  var _ref3 = _asyncToGenerator(function* (t) {
    const CONSTRAINT_PERIOD = 100;
    const TASKS_PER_PERIOD = 3;
    const PARALLEL_TASK_COUNT = 2;

    let queue = new Queue({
      period: CONSTRAINT_PERIOD,
      tasksPerPeriod: TASKS_PER_PERIOD,
      parallelTasks: PARALLEL_TASK_COUNT
    });

    let startTime = Date.now();
    let getCurTime = function getCurTime() {
      return Date.now() - startTime;
    };
    let timeLog = [];

    function getAsyncTask(number, executionTime) {
      timeLog.push({ number: number, added: getCurTime() });
      return _asyncToGenerator(function* () {
        timeLog.push({ number: number, started: getCurTime() });
        yield sleep(executionTime);
        timeLog.push({ number: number, processed: getCurTime() });
        return number;
      });
    }

    let tasks = [queue.processTask(getAsyncTask(0, 20)), queue.processTask(getAsyncTask(1, 60)), queue.processTask(getAsyncTask(2, 130)), queue.processTask(getAsyncTask(3, 20)), queue.processTask(getAsyncTask(4, 30)), queue.processTask(getAsyncTask(5, 30)), queue.processTask(getAsyncTask(6, 70)), queue.processTask(getAsyncTask(7, 170))];

    yield sleep(100);
    tasks.push(queue.processTask(getAsyncTask(8, 20)));

    yield sleep(10);
    tasks.push(queue.processTask(getAsyncTask(9, 20)));

    yield sleep(10);
    tasks.push(queue.processTask(getAsyncTask(10, 70)));

    yield sleep(10);
    tasks.push(queue.processTask(getAsyncTask(11, 20)));

    let tasksResults = yield Promise.all(tasks);

    t.deepEqual(tasksResults, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'should return tasks results');

    let timeline = timeLog.reduce(function (res, log) {
      res[log.number] = Object.assign(res[log.number] || {}, log);
      return res;
    }, []);

    // Задачи выполняются последовательно
    timeline.reduce(function (prev, next) {
      if (prev.started > next.started) {
        t.fail(`task#${prev.number} start before task#${next.number}`);
      }
      return next;
    });

    // Не более заданного кол-ва одновременно исполняемых задач
    for (let task1 of timeline) {
      let parallelTasks = 0;
      for (let task2 of timeline) {
        if (task1 !== task2) {
          var _ref5 = [task1.started, task2.started, task2.processed];
          let a1 = _ref5[0],
              a2 = _ref5[1],
              b2 = _ref5[2];

          if (a2 <= a1 && a1 < b2) {
            parallelTasks++;
          }
        }
      }
      if (parallelTasks > PARALLEL_TASK_COUNT - 1) {
        t.fail(`more than ${PARALLEL_TASK_COUNT - 1} tasks at the same time for task#${task1.number}`);
      }
    }

    // Не более заданного кол-ва задач за указанных период
    for (let task1 of timeline) {
      let periodStart = task1.started - CONSTRAINT_PERIOD;
      let periodTasks = timeline.filter(function (task2) {
        if (task2 !== task1) {
          return task2.started >= periodStart && task2.started < task1.started;
        }
      });
      if (periodTasks.length > TASKS_PER_PERIOD) {
        t.fail(`more than ${TASKS_PER_PERIOD} tasks for task#${task1.number}`);
      }
    }

    // console.log(timeline)
  });

  return function (_x2) {
    return _ref3.apply(this, arguments);
  };
})());