'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const have = require('have2').with({
  collection: require('moysklad-type-matchers/types/collection')
});

module.exports = (() => {
  var _ref = _asyncToGenerator(function* () {
    var _have$strict = have.strict(arguments, [{ client: 'Object', collection: 'collection', query: 'opt Object' }, have.argumentsObject]);

    let client = _have$strict.client,
        collection = _have$strict.collection;
    var _have$strict$query = _have$strict.query;
    let query = _have$strict$query === undefined ? {} : _have$strict$query;
    var _collection$meta = collection.meta;
    let size = _collection$meta.size,
        limit = _collection$meta.limit,
        offset = _collection$meta.offset;

    let href = client.parseUri(collection.meta.href);
    let rowsPages = [];

    if (collection.rows && collection.rows.length) {
      if (size <= limit) {
        return query.offset ? collection.rows.slice(query.offset) : collection.rows;
      }

      if (query.offset >= limit) {
        offset = query.offset;
      } else {
        rowsPages = [query.offset != null ? collection.rows.slice(query.offset) : collection.rows];
        offset = limit;
      }
    }

    if (query.limit != null) {
      if (query.limit <= 0) throw new Error('query.limit should be greater then 0');
      limit = query.limit;
    }

    while (size > offset) {
      rowsPages.push(client.GET(href.path, Object.assign({}, href.query, query, { offset: offset, limit: limit })).then(function (col) {
        return col.rows;
      }));
      offset += limit;
    }

    let cobinedRows = (yield Promise.all(rowsPages)).
    // TODO Remove Debug
    // .map(pos => {
    //   return pos
    // })
    reduce(function (res, rows) {
      return res.concat(rows);
    }, []);

    return cobinedRows;
  });

  function loadRows() {
    return _ref.apply(this, arguments);
  }

  return loadRows;
})();