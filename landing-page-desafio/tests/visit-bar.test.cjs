const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function visit(storage, now, blocked = false) {
  const bar = { hidden: true, getBoundingClientRect: () => ({ height: 84 }) };
  const timer = { textContent: '' };
  const properties = {};
  const callbacks = {};
  let timeout;
  let tick;
  const context = {
    Date: { now: () => now },
    document: {
      querySelector: selector => selector === '.visit-bar' ? bar : timer,
      documentElement: { style: { setProperty: (key, value) => { properties[key] = value; } } },
      addEventListener: (event, callback) => { callbacks[event] = callback; }
    },
    window: {
      localStorage: {
        getItem: key => { if (blocked) throw Error('blocked'); return storage[key] ?? null; },
        setItem: (key, value) => { if (blocked) throw Error('blocked'); storage[key] = value; }
      },
      addEventListener: (event, callback) => { callbacks[event] = callback; }
    },
    setTimeout: (callback, delay) => { timeout = { callback, delay }; },
    setInterval: callback => { tick = callback; }
  };
  vm.runInNewContext(fs.readFileSync('visit-bar.js', 'utf8'), context);
  return { bar, timer, properties, callbacks, get timeout() { return timeout; }, advance: value => { now = value; tick(); } };
}

test('first visit saves its start immediately and reveals only after ten seconds', () => {
  const storage = {};
  const page = visit(storage, 100000);
  assert.equal(Object.values(storage)[0], '100000');
  assert.equal(page.bar.hidden, true);
  assert.equal(page.timeout.delay, 10000);
  page.advance(110000);
  page.timeout.callback();
  assert.equal(page.bar.hidden, false);
  assert.equal(page.timer.textContent, '00:00:10');
  assert.equal(page.properties['--visit-bar-height'], '84px');
});

test('reopening shows immediately and counts time spent closed without resetting storage', () => {
  const storage = {};
  visit(storage, 100000);
  const reopened = visit(storage, 3761000);
  assert.equal(reopened.bar.hidden, false);
  assert.equal(reopened.timeout, undefined);
  assert.equal(reopened.timer.textContent, '01:01:01');
  assert.equal(Object.values(storage)[0], '100000');
  reopened.advance(360100000);
  assert.equal(reopened.timer.textContent, '100:00:00');
});

test('unavailable storage does not prevent the bar from working', () => {
  const page = visit({}, 100000, true);
  page.timeout.callback();
  page.advance(102000);
  assert.equal(page.bar.hidden, false);
  assert.equal(page.timer.textContent, '00:00:02');
});

test('invalid or future saved dates start a new first visit', () => {
  for (const saved of ['invalid', '200000', '0', '-1']) {
    const storage = { 'desafio-first-visit-at': saved };
    const page = visit(storage, 100000);
    assert.equal(page.bar.hidden, true);
    assert.equal(storage['desafio-first-visit-at'], '100000');
    assert.equal(page.timeout.delay, 10000);
  }
});
