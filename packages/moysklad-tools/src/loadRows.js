'use strict'

// @ts-ignore
const have = require('have2').with({
  collection: require('moysklad-type-matchers/types/collection')
})

module.exports = async function loadRows () {
  let { client, collection, query = {} } = have.strict(arguments, [
    { client: 'Object', collection: 'collection', query: 'opt Object' },
    have.argumentsObject
  ])

  // TODO коллекция может быть без полей size, limit, offset
  // (для коллекций созданных вручную)
  let { size, limit, offset } = collection.meta
  let href = client.parseUrl(collection.meta.href)
  let rowsPages = []

  if (collection.rows && collection.rows.length) {
    if (size <= limit) {
      return query.offset ? collection.rows.slice(query.offset) : collection.rows
    }

    if (query.offset >= limit) {
      offset = query.offset
    } else {
      rowsPages = [query.offset != null
        ? collection.rows.slice(query.offset)
        : collection.rows]
      offset = limit
    }
  }

  if (query.limit != null) {
    if (query.limit <= 0) throw new Error('query.limit should be greater then 0')
    limit = query.limit
  }

  while (size > offset) {
    rowsPages.push(
      client.GET(href.path, Object.assign({}, href.query, query, { offset, limit }))
        .then(col => col.rows))
    offset += limit
  }

  let cobinedRows = (await Promise.all(rowsPages))
    // TODO Remove Debug
    // .map(pos => {
    //   return pos
    // })
    .reduce((res, rows) => res.concat(rows), [])

  return cobinedRows
}
