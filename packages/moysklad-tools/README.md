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

`tools.loadRows(moysklad: Moysklad, collection: Object, query: Object?) : Array<Object>`

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

### #createMeta

Создание структуры `meta`

`createMeta(moysklad: Object, type: String, path: String|Array<String>) : Object`

```js
let meta = createMeta(moysklad, 'sometype', 'path/to/some')

assert.deepEqual(meta, {
  type: 'sometype',
  href: 'https://online.moysklad.ru/api/remap/1.1/path/to/some',
  mediaType: 'application/json'
})
```

### #createAttr

Создание структуры пользовательского поля c типом справочник

- `tools.createAttr(moysklad: Object, id: String, entityId: String) : Object`

  ```js
  // id пользовательского атрибута с типом "Справочник"
  const СПОСОБ_ДОСТАВКИ = '48a9dbca-75f3-4f1c-933b-57df18b5169f'

  // {id справочника}/{id элемента справочника}
  const ПОЧТА = '3e2a8f95-e4d2-4ae7-90a4-e61ff2dde955/55e6f545-b41f-4a72-8b85-363058b68598'

  let attr = createAttr(moysklad, СПОСОБ_ДОСТАВКИ, ПОЧТА)

  assert.deepEqual(attr, {
    id: '48a9dbca-75f3-4f1c-933b-57df18b5169f',
    value: {
      meta: {
        type: 'customentity',
        href: 'https://online.moysklad.ru/api/remap/1.1/entity/customentity/3e2a8f95-e4d2-4ae7-90a4-e61ff2dde955/55e6f545-b41f-4a72-8b85-363058b68598',
        mediaType: 'application/json'
      }
    }
  })
  ```

- `tools.createAttr(moysklad?: Object, id: String, name: String) : Object`

  Упрощенная запись с указанием имени элемента пользовательского справочника.

  ```js
  // id пользовательского атрибута с типом "Справочник"
  const СПОСОБ_ДОСТАВКИ = '48a9dbca-75f3-4f1c-933b-57df18b5169f'

  let attr = client.createAttr(СПОСОБ_ДОСТАВКИ, 'Почта')

  assert.deepEqual(attr, {
    id: '48a9dbca-75f3-4f1c-933b-57df18b5169f',
    value: {
      name: 'Почта'
    }
  })
  ```

Пользовательские атрибуты других типов создаются ввиде простых объектов,
без специальных методов

```js
const АДРЕС_ДОСТАВКИ = '48a9dbca-75f3-4f1c-933b-57df18b5169f'
let stringAttr = {
  id: АДРЕС_ДОСТАВКИ,
  value: 'ул. Красноармейская, 10'
}

const КОЛ_ВО_МЕСТ = '48a9dbca-75f3-4f1c-933b-57df18b5169с'
let numberAttr = {
  id: КОЛ_ВО_МЕСТ,
  value: 2
}

const ВРЕМЯ_ДОСТАВКИ = '48a9dbca-75f3-4f1c-933b-57df18b5169d'
let timeAttr = {
  id: ВРЕМЯ_ДОСТАВКИ,
  value: Moysklad.getTimeString(new Date(2017, 2, 7, 11, 25))
}
```
