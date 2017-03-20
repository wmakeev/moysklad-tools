'use strict';

module.exports = require('have2').with({
  model: _model => _model && _model.name && _model.types
});