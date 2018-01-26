'use strict';

module.exports = function getEnvOrDefault(varName, transform) {
  transform = transform || (val => val);

  if (typeof process !== 'undefined' && process.env && process.env[varName]) {
    return transform(process.env[varName]);
  } else if (typeof window !== 'undefined' && window[varName] != null) {
    return transform(window[varName]);
  } else if (typeof global !== 'undefined' && global[varName] != null) {
    return transform(global[varName]);
  } else {
    return transform();
  }
};