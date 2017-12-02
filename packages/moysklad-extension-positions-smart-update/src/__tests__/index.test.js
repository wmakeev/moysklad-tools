'use strict'

const _ = require('lodash')
const test = require('blue-tape')
const Moysklad = require('moysklad').compose(require('..'))

const orderTemplate = {
  'applicable': false,
  'store': {
    'meta': {
      'href': 'https://online.moysklad.ru/api/remap/1.1/entity/store/' +
        'eed5fae7-c949-4258-8e27-69f306d7166c',
      'type': 'store'
    }
  },
  'project': {
    'meta': {
      'href': 'https://online.moysklad.ru/api/remap/1.1/entity/project/' +
        '5813cdc1-1f5f-44b1-bbb2-c2a011c31180',
      'type': 'project'
    }
  },
  'agent': {
    'meta': {
      'href': 'https://online.moysklad.ru/api/remap/1.1/entity/counterparty/' +
        'd79d4cda-4060-4c2f-965b-530ee87794f9',
      'type': 'counterparty'
    }
  },
  'organization': {
    'meta': {
      'href': 'https://online.moysklad.ru/api/remap/1.1/entity/organization/' +
        'bf6bc7ce-444e-4fd2-9826-3134ce89c54b',
      'type': 'organization'
    }
  },
  'state': {
    'meta': {
      'href': 'https://online.moysklad.ru/api/remap/1.1/entity/customerorder/metadata/states/' +
        '7be2675a-dc76-4435-8cce-1c64bb6bfd34',
      'type': 'state'
    }
  },
  'attributes': [
    {
      'id': '48a9dbca-75f3-4f1c-933b-57df18b5169f',
      'value': {
        'meta': {
          'href': 'https://online.moysklad.ru/api/remap/1.1/entity/customentity/' +
            '3e2a8f95-e4d2-4ae7-90a4-e61ff2dde955/9e57d383-37e6-11e7-7a69-8f55001fa588',
          'type': 'customentity'
        }
      }
    },
    {
      'id': 'c24b7296-1f0a-11e3-0677-7054d21a8d1e',
      'value': {
        'meta': {
          'href': 'https://online.moysklad.ru/api/remap/1.1/entity/customentity/' +
            '972e18bf-1f0a-11e3-06a7-7054d21a8d1e/3c7ff0c0-239d-11e3-0b96-7054d21a8d1e',
          'type': 'customentity'
        }
      }
    },
    {
      'id': '0067d0e1-bfb7-4f26-aa6a-b54ad64cc633',
      'value': {
        'meta': {
          'href': 'https://online.moysklad.ru/api/remap/1.1/entity/customentity/' +
            'ab5d0643-6f5b-4665-9a39-c631b68d8df6/1ef65acc-5b6b-49ae-a299-2db10b270ecc',
          'type': 'customentity'
        }
      }
    },
    {
      'id': '159443fe-d1b4-45f8-af24-b28c5c8549a7',
      'value': '2017-05-21 17:33:00'
    },
    {
      'id': '50574eb4-5a4d-11e6-7a69-93a7000a515b',
      'value': false
    }
  ]
}

function getPositions (ms, count) {
  return Promise.all(_.fill(Array(Math.floor(count / 100)), 100).concat([count % 100])
    .map((limit, index) =>
      ms.GET('entity/product', { offset: 1000 + 100 * index, limit })))
    .then(res => _.flatMap(res, r => r.rows))
    .then(products => products.map(product => ({
      assortment: {
        meta: product.meta
      },
      quantity: 10
    })))
}

test('moysklad-extension-positions-smart-update', async t => {
  let order12, order123, order223
  let moysklad = Moysklad({ queue: true })

  let positions = await getPositions(moysklad, 223)
  let positions12 = positions.slice(0, 12)
  let positions123 = positions.slice(0, 123)
  let positions223 = positions.slice(0, 223)

  try {
    // order12 = await moysklad.POST('entity/customerorder', {
    //   ...orderTemplate,
    //   positions: positions12
    // })

    // t.equal(order12.positions.meta.size, positions12.length)

    order123 = await moysklad.POST('entity/customerorder', {
      ...orderTemplate,
      positions: positions123
    })

    t.equal(order123.positions.meta.size, positions123.length)

    // TODO создать вместе с обновлением 12 и 123
    // order223 = await moysklad.POST('entity/customerorder', {
    //   ...orderTemplate,
    //   positions: positions123
    // })

    // t.equal(order223.positions.meta.size, positions223.length)
  } finally {
    if (order12) await moysklad.DELETE(['entity/customerorder', order12.id])
    if (order123) await moysklad.DELETE(['entity/customerorder', order123.id])
    if (order223) await moysklad.DELETE(['entity/customerorder', order223.id])
  }
})
