'use strict'

const test = require('blue-tape')
const Moysklad = require('moysklad')
const { loadRows } = require('..')

const ORDER_LARGE_ID = 'dd5d3aff-08d6-11e7-7a69-97110015919e'
const POSITIONS_LARGE_COUNT = 333

const ORDER_SMALL_ID = '94510b32-23b3-4167-babf-34463f8a719d'
const POSITIONS_SMALL_COUNT = 89

const uniqCount = items => [...new Set(items)].length

test('tools.loadRows', t => {
  t.equal(typeof loadRows, 'function', 'should be function')
  t.end()
})

// TODO Test throws on incorrect arguments?

test('tools.loadRows returns rows from expanded collection', async t => {
  const ms = Moysklad()

  let order = await ms.GET(['entity/customerorder', ORDER_SMALL_ID], { expand: 'positions' })
  t.ok(order.positions.rows, 'positions is expanded')

  let rows = await loadRows(ms, order.positions)

  t.true(rows instanceof Array, 'should return rows array')

  t.equals(rows.length, POSITIONS_SMALL_COUNT,
    `should return ${POSITIONS_SMALL_COUNT} positions`)
  t.equal(uniqCount(rows.map(p => p.id)), POSITIONS_SMALL_COUNT,
    `should return ${POSITIONS_SMALL_COUNT} uniq positions`)
})

test('tools.loadRows load and returns rows from not expanded collection', async t => {
  const ms = Moysklad()

  let order = await ms.GET(['entity/customerorder', ORDER_SMALL_ID])
  let rows = await loadRows(ms, order.positions)

  t.true(rows instanceof Array, 'should return rows array')

  t.equals(rows.length, POSITIONS_SMALL_COUNT,
    `should return ${POSITIONS_SMALL_COUNT} positions`)
  t.equal(uniqCount(rows.map(p => p.id)), POSITIONS_SMALL_COUNT,
    `should return ${POSITIONS_SMALL_COUNT} uniq positions`)
})

test('tools.loadRows load and returns rows from not expanded collection (limit specified)',
  async t => {
    const LIMIT = 33
    const ms = Moysklad()

    let order = await ms.GET(['entity/customerorder', ORDER_SMALL_ID])
    let rows = await loadRows(ms, order.positions, { limit: LIMIT })

    t.true(rows instanceof Array, 'should return rows array')

    t.equals(rows.length, POSITIONS_SMALL_COUNT,
      `should return ${POSITIONS_SMALL_COUNT} positions`)
    t.equal(uniqCount(rows.map(p => p.id)), POSITIONS_SMALL_COUNT,
      `should return ${POSITIONS_SMALL_COUNT} uniq positions`)
  })

test('tools.loadRows returns from expanded collection and load others pages', async t => {
  let ms = Moysklad()

  let order = await ms.GET(['entity/customerorder', ORDER_LARGE_ID], { expand: 'positions' })
  let rows = await loadRows(ms, order.positions)

  t.true(rows instanceof Array, 'should return rows array')

  t.equals(rows.length, POSITIONS_LARGE_COUNT,
    `should return ${POSITIONS_LARGE_COUNT} positions`)
  t.equal(uniqCount(rows.map(p => p.id)), POSITIONS_LARGE_COUNT,
    `should return ${POSITIONS_LARGE_COUNT} uniq positions`)
})

test('tools.loadRows returns from expanded collection and load others pages (with offset) #1',
  async t => {
    const LIMIT = 55
    const OFFSET = 60
    const ms = Moysklad()

    let order = await ms.GET(['entity/customerorder', ORDER_LARGE_ID], { expand: 'positions' })
    let rows = await loadRows(ms, order.positions, {
      offset: OFFSET, limit: LIMIT
    })

    t.true(rows instanceof Array, 'should return positions array')

    t.equals(rows.length, POSITIONS_LARGE_COUNT - OFFSET,
      `should return ${POSITIONS_LARGE_COUNT - OFFSET} positions`)

    t.equal(uniqCount(rows.map(p => p.id)), POSITIONS_LARGE_COUNT - OFFSET,
      `should return ${POSITIONS_LARGE_COUNT - OFFSET} uniq positions`)
  })

test('tools.loadRows returns from expanded collection and load others pages (with offset) #2',
  async t => {
    const LIMIT = 50
    const OFFSET = 133
    const ms = Moysklad()

    let order = await ms.GET(['entity/customerorder', ORDER_LARGE_ID], { expand: 'positions' })
    let rows = await loadRows(ms, order.positions, {
      offset: OFFSET, limit: LIMIT
    })

    t.true(rows instanceof Array, 'should return positions array')

    t.equals(rows.length, POSITIONS_LARGE_COUNT - OFFSET,
      `should return ${POSITIONS_LARGE_COUNT - OFFSET} positions`)

    t.equal(uniqCount(rows.map(p => p.id)), POSITIONS_LARGE_COUNT - OFFSET,
      `should return ${POSITIONS_LARGE_COUNT - OFFSET} uniq positions`)
  })

// TODO проверить результат по заранее полученной эталонной коллекции

test('tools.loadRows (with array filter)', async t => {
  const LIMIT = 10
  const OFFSET = 0
  const codes = [
    '15306', '15307', '15312', '15316', '15319', '15320', '15348', '15362', '15567',
    '15568', '15570', '15571', '15581', '15584', '15586', '16148', '16152', '16163',
    '16169', '16170', '16181', '16182', '16185', '16189', '16192', '16208', '16211',
    '16228', '16238', '16239', '16243', '16847', '16855', '22467'
  ]
  const ms = Moysklad()

  let productsCollection = await ms.GET('entity/product', {
    filter: {
      code: codes
    }
  })
  let rows = await loadRows(ms, productsCollection, {
    offset: OFFSET, limit: LIMIT
  })

  t.true(rows instanceof Array, 'should return positions array')

  t.equals(rows.length, codes.length, `should return ${codes.length} products`)

  t.ok(rows.every(p => codes.find(c => c === p.code)), `should return requested products`)
})
