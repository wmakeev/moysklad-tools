'use strict';

const test = require('blue-tape');

var _require = require('..');

const getId = _require.getId;


test('tools.getId', t => {
  t.equals(typeof getId, 'function', 'should be function');

  const TEST_ID = '18fba15b-9288-11e9-9109-f8fc00117bb7';

  const VALID = ['entity/foo/18fba15b-9288-11e9-9109-f8fc00117bb7', 'entity/foo/18fba15b-9288-11e9-9109-f8fc00117bb7/', 'https://path/to/some/18fba15b-9288-11e9-9109-f8fc00117bb7', 'https://path/to/some/18fba15b-9288-11e9-9109-f8fc00117bb7?some=query', {
    meta: {
      type: 'foo',
      href: 'https://path/to/some/18fba15b-9288-11e9-9109-f8fc00117bb7'
    }
  }];

  for (let it of VALID) {
    t.equal(getId(it), TEST_ID, `should return id for ${it}`);
  }

  const INVALID = ['entity/foo/18fba15b-9288-11e9-9109-f8fc001*17bb7', 'entity/foo/18fba15b-9288-11e9-9109-f8fc0017bb7/', 'http://path/to/some/18fba15b-9288-11e9-9109-f8fc00117bb7', 'path/to/some/18fba15b-9288-11e9-9109-f8fc00117bb7?some=query', {}, { meta: { href: 'foo' } }];

  for (let it of INVALID) {
    t.equal(getId(it), null, `should not return id for ${it}`);
  }

  t.end();
});