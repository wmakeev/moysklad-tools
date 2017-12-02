'use strict';

const stampit = require('stampit');
const Queue = require('./queue');

let globalQueuePull = new Map();

module.exports = stampit().init(function (options) {
  let login, fetchUrl;

  function fetchUrlWithQueue() {
    let requestTask = () => {
      return fetchUrl.apply(this, arguments);
    };

    /** @type {Queue} */
    let accountQueue = globalQueuePull.get(login);

    if (!accountQueue) {
      accountQueue = new Queue(typeof options.queue === 'object' ? options.queue : {});
      globalQueuePull.set(login, accountQueue);
    }

    return accountQueue.processTask(requestTask);
  }

  if (options.queue) {
    login = options.login ? options.login : null;
    fetchUrl = this.fetchUrl;
    this.fetchUrl = fetchUrlWithQueue;
  }
});