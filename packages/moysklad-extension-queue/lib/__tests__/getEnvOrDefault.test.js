'use strict';

// const debug = require('debug')

const test = require('blue-tape');
const getEnvOrDefault = require('../getEnvOrDefault');

const GLOBAL_FOO = 'GLOBAL_FOO';

test('getEnvOrDefault (from process.env)', t => {
  process.env.Foo = GLOBAL_FOO;
  t.equal(getEnvOrDefault('Foo'), GLOBAL_FOO);
  delete process.env.Foo;
  t.end();
});

test('getEnvOrDefault (from window)', t => {
  global.window = {
    Foo: GLOBAL_FOO
  };
  t.equal(getEnvOrDefault('Foo'), GLOBAL_FOO);
  delete global.window;
  t.end();
});

test('getEnvOrDefault (from global)', t => {
  global.Foo = GLOBAL_FOO;
  t.equal(getEnvOrDefault('Foo'), GLOBAL_FOO);
  delete global.Foo;
  t.end();
});

test('getEnvOrDefault (default)', t => {
  t.equal(getEnvOrDefault('Bar', val => 'default bar'), 'default bar');
  t.end();
});