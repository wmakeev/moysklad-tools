'use strict'

const immediate = typeof setImmediate !== 'undefined'
  ? setImmediate
  : fn => setTimeout(fn, 1)

class DeferredBatchUpdate {
  constructor (moysklad, path, query, options) {
    this.moysklad = moysklad
    this.path = path
    this.query = query
    this.options = options
    this.queue = []
    this.updating = false
  }

  start () {
    if (!this.updating) {
      this.updating = true
      immediate(this.update.bind(this))
    }
  }

  async update () {
    let queue = this.queue

    if (queue.length > 0) this.queue = []
    else return

    try {
      let entities = await this.moysklad
        .POST(this.path, queue.map(q => q.entity), this.query, this.options)

      entities.forEach((entity, index) => {
        queue[index].resolve(entity)
      })
    } catch (e) {
      queue.forEach(q => q.reject(e))
    }
  }

  POST (entity) {
    return new Promise((resolve, reject) => {
      this.queue.push({ entity, resolve, reject })
      this.start()
    })
  }
}

module.exports = DeferredBatchUpdate
