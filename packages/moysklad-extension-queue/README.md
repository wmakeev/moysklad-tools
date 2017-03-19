moysklad-extension-queue
------------------------

> Расширение для библиотеки [moysklad](https://github.com/wmakeev/moysklad)

Добавляет возможность котролировать поток запросов.
Используется для избежания ошибки 429 при интенсивном обмене с API.

## Установка

```
$ npm install moysklad-extension-queue
```

## Использование

```js
const MoyskladQueue = require('moysklad-extension-queue')
const MoyskladCore = require('moysklad')

const Moysklad = MoyskladCore.compose(MoyskladQueue)

const moysklad = Moysklad({
  queue: true // включение очереди запросов
})
```

Очередь глобальная, т.е. для всех запросов всех экземпляров библиотеки в рамках приложения будет
использоваться одна общая очередь.

```js
const Moysklad = MoyskladCore.compose(MoyskladQueue)
const moysklad1 = Moysklad({ queue: true })
const moysklad2 = Moysklad({ queue: true })
const moysklad3 = MoyskladCore.compose(MoyskladQueue).create({ queue: true })

// для moysklad1, moysklad2 и moysklad3 будет общая очередь
```

Для каждого логина автоматически создается отдельная очередь.

```js
const moysklad1 = Moysklad({
  login: 'user1@account',
  password: '****',
  queue: true
})

const moysklad2 = Moysklad({
  login: 'user2@account',
  password: '****',
  queue: true
})

// для moysklad1 и moysklad2 очереди будут разные
```

## Настройка

Можно указать параметры очереди

```js
const moysklad = Moysklad({
  queue: {
    period: 5500,
    tasksPerPeriod: 100,
    parallelTasks: 50
  }
})
```

Параметр | Ограничение МойСклад | По умолчанию | Описание
---------|----------------------|--------------|---------
`period` | 5000 | 5500 | период (мс) на который ставится ограничение по максимальному кол-ву запросов
`tasksPerPeriod` | 100 | 100 | максимальное кол-во запросов за период `period`
`parallelTasks` | 50 | 50 | максимальное кол-во параллельных запросов

[Официальная информация по лимитам](https://youtu.be/k2o-IFe0L9s?t=8m55s)




