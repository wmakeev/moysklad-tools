moysklad-type-matchers
======================

> Набор функций для проверки значений на соответствие типам данных

Используется для внутренних целей. К примеру, для проверки аргументов функции.

## Установка

```
$ npm install moysklad-type-matchers
```

## Использование

```js
const uuidMatcher = require('moysklad-type-matchers/types/uuid')

assert.equal(uuidMatcher('eb7bcc22-ae8d-11e3-9e32-002590a28eca'), true)
assert.equal(uuidMatcher(123), false)
```
