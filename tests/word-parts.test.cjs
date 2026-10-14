const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const context = vm.createContext({ window: { VOCABULARY_WORDS: [] }, shuffle: values => values });
vm.runInContext(read('data/word-parts.js'), context);
const app = read('app.js');
vm.runInContext(app.slice(0, app.indexOf('const state =')), context);
vm.runInContext('const state = {partFilter: "prefix"};', context);
vm.runInContext(app.slice(app.indexOf('function currentWordParts()'), app.indexOf('function partFilterLabel')), context);
const entries = type => vm.runInContext(`state.partFilter = ${JSON.stringify(type)}; currentWordParts()`, context);

test('Word Parts filters distinct categories instead of relabeling the same mixed list', () => {
  const expected = {prefix: 'un-', suffix: '-ful', root: 'port', stem: 'play'};
  for (const [type, part] of Object.entries(expected)) {
    const cards = entries(type);
    assert(cards.some(card => card.part === part));
    assert(cards.every(card => card.type === type));
    assert.equal(new Set(cards.map(card => card.part)).size, cards.length);
  }
  assert(!entries('prefix').some(card => card.part === 'port'));
  assert(!entries('stem').some(card => card.part === 'un-'));
});

test('every lesson includes two explained examples and a sentence', () => {
  for (const card of context.window.WORD_PART_LESSONS) {
    assert(card.meaning.trim(), card.part);
    assert(card.sentence.trim(), card.part);
    assert(card.examples.length >= 2, card.part);
    for (const example of card.examples) {
      assert(example.build.includes('→'), card.part);
      assert(example.meaning.trim(), card.part);
    }
  }
  const un = entries('prefix').find(card => card.part === 'un-');
  assert(un.examples.some(example => example.build.endsWith('unhappy') && example.meaning === 'not happy'));
  assert(un.examples.some(example => example.build.endsWith('unlucky') && example.meaning === 'not lucky'));
});
