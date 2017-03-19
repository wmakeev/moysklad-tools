moysklad
========

> Библиотека для взаимодействия с JSON API сервиса МойСклад

> **ВНИМАНИЕ!** Библиотека не готова для использования. Идет активная разработка.

## Установка

```
$ npm install moysklad
```

## Использование

```js
const Moysklad = require('moysklad')

const ms = new Moysklad({ login, password })

ms.GET('entity/counterparty', {
  limit: 10,
  filter: {
    name
  }
}).then(({ meta, rows }) => {
  console.log('Всего контрагентов -', meta.size)
  console.log(`Первые ${meta.limit}:`)
  rows.forEach((row, index) => {
    console.log(`${index}. ${row.name}`)
  })
})
```
## API

### moysklad.GET

#### `Promise<object> moysklad.GET(string|Array<string> path, object? query, object? options)`

> GET запрос по указанному ресурсу

`path` - url ресурс (относительно текущего api)

`query` - url параметры запроса

`options` - опции запроса

### Events

#### `request:start`

``` { uri, options } ```

#### `response:head`

``` { uri, options, response } ```

#### `response:body`

``` { uri, options, response, body } ```

#### `error`
