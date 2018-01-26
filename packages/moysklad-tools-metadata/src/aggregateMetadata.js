'use strict'

const have = require('./have')
const getPropertyInfo = require('./getPropertyInfo')
const loadRows = require('moysklad-tools/loadRows')

const getFieldName = fieldName => fieldName
  .toUpperCase()
  .replace(/[^0-9a-zA-Zа-яА-Я_$]/g, '_')
  .replace(/_{2,}/g, '_')
  .replace(/_{1,}$/, '') // TODO Объединить последние два replace
  .replace(/^_{1,}/, '')

module.exports = async function aggregateMetadata () {
  let { client, model, options = {} } = have(arguments, {
    client: 'Obj', model: 'model', options: 'opt Obj'
  })

  let { customEntityFilter = () => true } = options

  let Metadata = {
    CustomEntity: {},
    updated: new Date(),
    formatVersion: '4.0.0'
  }

  // асинхронная загрузка метаданных внешних (доступных из API) сущностей
  let typeMetadataPromises = Object.keys(model.types)
    .filter(typeName => {
      let type = model.types[typeName]
      return type && type.external && getPropertyInfo(model, typeName, 'attributes')
    })
    .map(typeName => {
      Metadata[typeName] = {}
      return typeName
    })
    .map(typeName => client.GET(['entity', typeName, 'metadata']).then(metadata => ({
      typeName, metadata
    })))

  // асинхронная загрузка пользовательских атрибутов и справочников
  let thread1 = typeMetadataPromises.map(p => p.then(async typeMetadata => {
    let { typeName, metadata } = typeMetadata
    // type = Metadata.CustomerOrder
    let type = Metadata[typeName]

    if (metadata.states) {
      // Metadata.CustomerOrder.States = {}
      type.States = {}
      // обработка метаданных сущности
      for (let attrState of metadata.states) {
        // Metadata.CustomerOrder.States.ОФОРМЛЕН = state.meta.href
        type.States[getFieldName(attrState.name)] = attrState.meta.href
      }
    }

    if (metadata.attributes) {
      // Metadata.CustomerOrder.Attributes = {}
      type.Attributes = {}
      // обработка метаданных сущности
      for (let attrMeta of metadata.attributes) {
        // Metadata.CustomerOrder.Attributes.ИСТОЧНИК_ЗАКАЗА = attribute.meta.href
        type.Attributes[getFieldName(attrMeta.name)] = attrMeta.meta.href
        if (attrMeta.customEntityMeta) {
          let customEntities = await client.fetchUrl(attrMeta.customEntityMeta.href)
          let entName = getFieldName(customEntities.name)
          // заполнение пользовательского справочника (если не заполнен) и если не пропущен явно
          if (!Metadata.CustomEntity[entName] && customEntityFilter(customEntities.name)) {
            // Metadata.CustomEntity.ИСТОЧНИКИ_ЗАКАЗА = {}
            Metadata.CustomEntity[entName] = {}
            let collection = await client.fetchUrl(customEntities.entityMeta.href)
            let rows = await loadRows(client, collection, { limit: 100 })
            rows.reduce((res, row) => {
              // Metadata.CustomEntity.ИСТОЧНИКИ_ЗАКАЗА.САЙТ = entity.meta.href
              res[getFieldName(row.name)] = row.meta.href
              return res
            }, Metadata.CustomEntity[entName])
          }
        }
      }
    }
  }))

  await Promise.all(thread1)

  return Metadata
}
