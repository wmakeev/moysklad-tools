'use strict';

/* eslint brace-style:0 */

const have = require('have2');
const sleep = require('moysklad/tools/sleep');

class Action {
  /**
   * Создание Action
   * @param {number} id Идентификатор
   * @param {function(): Promise<any>} task Задача
   * @param {function} cb callback
   */
  constructor(id, task, cb) {
    this.id = id;
    this.action = cb => task().then(result => cb(null, result)).catch(err => cb(err));
    this.cb = cb;
  }
}

class Queue {
  /**
   * Создание Queue
   * @param {object} options Параметры очереди
   */
  constructor() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    have.strict(options, {
      period: 'opt num',
      tasksPerPeriod: 'opt num',
      parallelTasks: 'opt num'
    });

    // https://youtu.be/k2o-IFe0L9s?t=8m55s
    // Опытным путем проверено что period лучше для надежности немного увеличить
    var _options$period = options.period;
    let period = _options$period === undefined ? 5500 : _options$period;
    var _options$tasksPerPeri = options.tasksPerPeriod;
    let tasksPerPeriod = _options$tasksPerPeri === undefined ? 100 : _options$tasksPerPeri;
    var _options$parallelTask = options.parallelTasks;
    let parallelTasks = _options$parallelTask === undefined ? 50 : _options$parallelTask;

    /** @type {number} Период на который накладывается ограничение по кол-ву задач (мс) */

    this.period = period;

    /** @type {number} Кол-во задач допустимых за период */
    this.tasksPerPeriod = tasksPerPeriod;

    /** @type {number} Макс. допустимое кол-во параллельно выполняемых задач */
    this.parallelTasks = parallelTasks;

    /** @type {number} Последний id задачи */
    this._lastTaskId = 0;

    /** @type {Array<number>} Моменты времени завершения прошлых задач */
    this._timeline = [];

    /** @type {number} Кол-во задач ожидающих выполнения */
    this._tasksInProgress = 0;

    /** @type {Array<Action>} Очередь задач */
    this._actionsQueue = [];
  }

  /**
   * Выполняет задачу в рамках очереди
   * @param {function(): Promise<any>} task task to be wrapped
   * @returns {Promise<any>} Результат задачи
   */
  processTask(task) {
    // debug(`processTask#${task
    //   ? '(task)' : '()'}: tasksInProgress - ${this._tasksInProgress} | ` +
    //     `actionsQueue - ${this._actionsQueue.length}`)

    if (task) {
      if (typeof task !== 'function') {
        throw new Error('processTask: `task` argument must to be function');
      }
      let taskResult = new Promise((resolve, reject) => {
        this._actionsQueue.push(new Action(++this._lastTaskId, task, (err, result) => err ? reject(err) : resolve(result)));
      });
      this.processTask();
      return taskResult;
    }

    if (this._tasksInProgress < this.parallelTasks && this._actionsQueue.length > 0) {
      let curTime = Date.now();

      while (this._timeline.length) {
        // -r1-r2-[-r3--r4-r5----------*]
        if (curTime - this._timeline[0] > this.period) {
          this._timeline.shift();
        }
        // -------[-r3--r4-r5----------*]
        else {
            break;
          }
      }

      // debug(`timeline - ${JSON.stringify(this._timeline)}`)

      // ----[r1-r2---r3--r4-r5--*--]
      if (this._timeline.length >= this.tasksPerPeriod) {
        let waitTime = this.period - (curTime - this._timeline[0]);
        // debug(`tasksInProgress - ${this._tasksInProgress} | waitTime ${waitTime}`)
        sleep(waitTime).then(() => {
          // debug(`call processTask after waitTime - ${waitTime}`)
          this.processTask();
        });
        return;
      }
      // else
      // ----[r1-r2---r3---------*--]

      let curAction = this._actionsQueue.shift();
      this._tasksInProgress++;
      this._timeline.push(Date.now());

      // debug(`Start action#${curAction.id} | tasksInProgress - ${this._tasksInProgress} | ` +
      //   `timeline - ${JSON.stringify(this._timeline)} | ` +
      //   `actionsQueue - ${this._actionsQueue.length}`)

      curAction.action((err, data) => {
        this._tasksInProgress--;

        // debug(`Fnish action#${data} | tasksInProgress - ${this._tasksInProgress} | ` +
        //   `timeline - ${JSON.stringify(this._timeline)} | ` +
        //   `actionsQueue - ${this._actionsQueue.length}`)

        // this._timeline.push(Date.now())
        this.processTask();
        curAction.cb(err, data);
      });
    }
    // else {
    //   this._tasksInProgress < this.parallelTasks
    //   debug(`Skip processTask: tasksInProgress - ${this._tasksInProgress} | ` +
    //     `timeline - ${JSON.stringify(this._timeline)} | ` +
    //     `actionsQueue - ${this._actionsQueue.length}`)
    // }
  }
}

module.exports = Queue;