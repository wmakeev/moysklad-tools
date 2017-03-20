moysklad-tools
==============

> Набор инструментов для библиотеки [moysklad](https://github.com/wmakeev/moysklad)

Набор инструментов автоматизирующих рутинные операции при работе с библиотекой.

## Установка

```
$ npm install moysklad-tools
```

## Использование

```js
const Moysklad = require('moysklad')
const loadRows = require('moysklad-tools/loadRows')

const moysklad = Moysklad()

// ...

let order = await moysklad.GET(['entity/customerorder', orderId])
let orderRows = await loadRows(moysklad, order.positions, { limit: 100 })

// ...
```

## API

### #loadRows

`tools.loadRows(client: Moysklad, collection: Object, query: Object?) : Array<Object>`

При получении документа, позиции могут быть загружены не полностью.
`loadRows` загружает/подгружает позиции в коллекции и возвращает массив rows.

```js
let order = await moysklad.GET(['entity/customerorder', orderId], {
  expand: 'positions'
})

let orderPositionsRows = await loadRows(moysklad, order.positions, { limit: 100 })
```

### #getAttr

`tools.getAttr(entity: Object, attrId: String) : Object`

### #getAttrVal

`tools.getAttrVal(entity: Object, attrId: String) : any`


