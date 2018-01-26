'use strict'

// const fs = require('fs')
// const tmp = require('tmp')
const EventEmitter = require('events')
const debug = require('debug')('moysklad-extension-queue')
const test = require('blue-tape')
const Moysklad = require('moysklad')
const sleep = require('moysklad/tools/sleep')

const QueueStamp = require('..')
const ExtendedMoysklad = Moysklad.compose(QueueStamp)

let products // = require('./products')

test('Moysklad queue', async t => {
  const period = 5200
  const tasksPerPeriod = 100
  // const parallelTasks = 50

  // Сделаем паузу после предыдущих тестов (чтобы убедиться что лимиты не перекрываются)
  debug(`Ожидаем ${period / 1000} сек ...`)
  await sleep(period)

  let emitter = new EventEmitter()
  let ms = ExtendedMoysklad({
    queue: true,
    // queue: {
    //   period,
    //   tasksPerPeriod,
    //   parallelTasks
    // },
    emitter
  })

  debug(`Получаем идентификаторы ${tasksPerPeriod * 2} товаров ...`)
  products = [
    ...(await ms.GET('entity/product', { limit: tasksPerPeriod })).rows,
    ...(await ms.GET('entity/product', { offset: tasksPerPeriod, limit: tasksPerPeriod })).rows]

  // fs.writeFileSync(tmp.tmpNameSync(),
  //   JSON.stringify(products.map(p => ({ id: p.id, name: p.name }))))

  let startTime = Date.now()
  let report = []
  let results = []

  t.comment('should queue requests to avoid 429 error')

  emitter.on('request', ({ uri }) => {
    let parsedUrl = ms.parseUrl(uri)
    let id = parsedUrl.path[2]
    let reportItem = report.find(i => i.id === id)
    reportItem.started = Date.now() - startTime
  })

  emitter.on('response:body', ({ uri }) => {
    let parsedUrl = ms.parseUrl(uri)
    let id = parsedUrl.path[2]
    let reportItem = report.find(i => i.id === id)
    reportItem.processed = Date.now() - startTime
  })

  emitter.on('error', () => {
    debug('error:', Date.now() - startTime)
  })

  for (let i = 0, max = tasksPerPeriod * 2; i < max; i++) {
    report[i] = {
      id: products[i].id,
      number: i,
      added: Date.now() - startTime
    }
    results[i] = ms.GET(['entity/product', products[i].id]).then(p => p.name)
  }

  try {
    results = await Promise.all(results)
  } finally {
    // https://docs.google.com/spreadsheets/d/1GX4OaolG_AmZ-NbUKI9XcDhewV-jFLCn29WWn-thEf0/edit
    // let tmpFileName = tmp.tmpNameSync()
    // console.log(tmpFileName)
    // fs.writeFileSync(tmpFileName, 'var data = ' + JSON.stringify(report, null, 2))
  }

  t.ok(results.every((r, index) => r === products[index].name))
})
