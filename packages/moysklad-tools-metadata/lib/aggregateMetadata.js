'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const have = require('./have');
const getPropertyInfo = require('./getPropertyInfo');
const loadRows = require('moysklad-tools/loadRows');

const getFieldName = fieldName => fieldName.toUpperCase().replace(/[^0-9a-zA-Zа-яА-Я_$]/g, '_').replace(/_{2,}/g, '_').replace(/_{1,}$/, '') // TODO Объединить последние два replace
.replace(/^_{1,}/, '');

module.exports = (() => {
  var _ref = _asyncToGenerator(function* () {
    var _have = have(arguments, {
      client: 'Obj', model: 'model', options: 'opt Obj'
    });

    let client = _have.client,
        model = _have.model;
    var _have$options = _have.options;
    let options = _have$options === undefined ? {} : _have$options;
    var _options$customEntity = options.customEntityFilter;
    let customEntityFilter = _options$customEntity === undefined ? function () {
      return true;
    } : _options$customEntity;


    let Metadata = {
      CustomEntity: {},
      updated: new Date(),
      formatVersion: '4.0.0'

      // асинхронная загрузка метаданных внешних (доступных из API) сущностей
    };let typeMetadataPromises = Object.keys(model.types).filter(function (typeName) {
      let type = model.types[typeName];
      return type && type.external && getPropertyInfo(model, typeName, 'attributes');
    }).map(function (typeName) {
      Metadata[typeName] = {};
      return typeName;
    }).map(function (typeName) {
      return client.GET(['entity', typeName, 'metadata']).then(function (metadata) {
        return {
          typeName: typeName, metadata: metadata
        };
      });
    });

    // асинхронная загрузка пользовательских атрибутов и справочников
    let thread1 = typeMetadataPromises.map(function (p) {
      return p.then((() => {
        var _ref2 = _asyncToGenerator(function* (typeMetadata) {
          let typeName = typeMetadata.typeName,
              metadata = typeMetadata.metadata;
          // type = Metadata.CustomerOrder

          let type = Metadata[typeName];

          if (metadata.states) {
            // Metadata.CustomerOrder.States = {}
            type.States = {};
            // обработка метаданных сущности
            for (let attrState of metadata.states) {
              // Metadata.CustomerOrder.States.ОФОРМЛЕН = state.meta.href
              type.States[getFieldName(attrState.name)] = attrState.meta.href;
            }
          }

          if (metadata.attributes) {
            // Metadata.CustomerOrder.Attributes = {}
            type.Attributes = {};
            // обработка метаданных сущности
            for (let attrMeta of metadata.attributes) {
              // Metadata.CustomerOrder.Attributes.ИСТОЧНИК_ЗАКАЗА = attribute.meta.href
              type.Attributes[getFieldName(attrMeta.name)] = attrMeta.meta.href;
              if (attrMeta.customEntityMeta) {
                let customEntities = yield client.fetchUrl(attrMeta.customEntityMeta.href);
                let entName = getFieldName(customEntities.name);
                // заполнение пользовательского справочника (если не заполнен) и если не пропущен явно
                if (!Metadata.CustomEntity[entName] && customEntityFilter(customEntities.name)) {
                  // Metadata.CustomEntity.ИСТОЧНИКИ_ЗАКАЗА = {}
                  Metadata.CustomEntity[entName] = {};
                  let collection = yield client.fetchUrl(customEntities.entityMeta.href);
                  let rows = yield loadRows(client, collection, { limit: 100 });
                  rows.reduce(function (res, row) {
                    // Metadata.CustomEntity.ИСТОЧНИКИ_ЗАКАЗА.САЙТ = entity.meta.href
                    res[getFieldName(row.name)] = row.meta.href;
                    return res;
                  }, Metadata.CustomEntity[entName]);
                }
              }
            }
          }
        });

        return function (_x) {
          return _ref2.apply(this, arguments);
        };
      })());
    });

    yield Promise.all(thread1);

    return Metadata;
  });

  function aggregateMetadata() {
    return _ref.apply(this, arguments);
  }

  return aggregateMetadata;
})();