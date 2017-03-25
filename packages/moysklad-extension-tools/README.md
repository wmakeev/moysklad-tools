moysklad-extension-tools
========================

> Набор инструментов для библиотеки [moysklad](https://github.com/wmakeev/moysklad)

Расширение для [moysklad](https://github.com/wmakeev/moysklad). Подключает набор инструментов из модуля [moysklad-tools](https://github.com/wmakeev/moysklad-tools/tree/master/packages/moysklad-tools) к экземпляру библиотеки.

## Установка

```
$ npm install moysklad-extension-tools
```

## Использование

**Без подключения расширения**

```js
const MoyskladCore = require('moysklad')
const { createAttr } = require('moysklad-tools')

const moysklad = MoyskladCore()

// незавизимый метод createAttr (в параметрах нужно указывать экземпляр moysklad)
let attr = createAttr(moysklad, someMetadataId, someCustomEntId)
```

**С подключенным расширением**

```js
const MoyskladCore = require('moysklad')
const ToolsExtension = require('moysklad-extension-tools')

const moysklad = MoyskladCore.compose(ToolsExtension).create()

// метод createAttr привязан к экземпляру moysklad
let attr = moysklad.createAttr(someMetadataId, someCustomEntId)
```

Привязываются только те методы, которые требуют передачи экземпляра `moysklad` в своих аргументах.
К примеру, метод [`getAttr`](https://github.com/wmakeev/moysklad-tools/tree/master/packages/moysklad-tools#getattr) из модуля [moysklad-tools](https://github.com/wmakeev/moysklad-tools/tree/master/packages/moysklad-tools) привязан не будет.
