const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const learning = require('../learning.js');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const context = vm.createContext({window:{}, shuffle: values => [...values]});
for (const file of ['vocabulary', 'exam-vocabulary', 'hspt-pdf-vocabulary']) {
  vm.runInContext(read(`data/${file}.js`), context);
}
const app = read('app.js');
// Execute the actual app catalog and option builder, without starting its DOM UI.
vm.runInContext(app.slice(0, app.indexOf('const state =')), context);
vm.runInContext(app.slice(app.indexOf('function wordId('), app.indexOf('function scopedWords(')), context);
vm.runInContext(app.slice(app.indexOf('function makeWordOptions('), app.indexOf('function makeSpeedOptions(')), context);
vm.runInContext('globalThis.catalog = allWords; globalThis.vault = vaultWords;', context);
const idFor = word => `${word.source}-${word.set}-${word.number}-${word.word.toLowerCase()}`;

test('the study catalog includes every workbook, exam, and extended HSPT entry exactly once', () => {
  const expected = [
    ...context.window.VOCABULARY_WORDS.map(w=>({...w, source:'HSPT'})),
    ...context.window.EXAM_VOCABULARY_WORDS,
    ...context.window.HSPT_PDF_VOCABULARY_WORDS.map(w=>({...w, source:'HSPT'})),
  ];
  assert.equal(context.catalog.length,857);
  assert.deepEqual(new Set(context.catalog.map(idFor)),new Set(expected.map(idFor)));
  assert.equal(new Set(context.catalog.map(idFor)).size,expected.length);
  assert.equal(context.vault,context.catalog);
  for(const word of context.catalog) {
    assert.ok(word.word.trim());
    assert.ok(word.synonyms.length && word.synonyms.every(clue=>clue.trim()));
  }
});

for(const [category, count, distinct] of [['HSPT',677,630],['ISEE',80,80],['SSAT',100,100]]) {
  test(`${category}: every one of ${count} entries is reachable through daily sessions`, () => {
    const words=context.catalog.filter(w=>w.source===category);
    assert.equal(words.length,count);
    assert.equal(new Set(words.map(w=>w.word.toLowerCase())).size,distinct);
    const progress=learning.normalize();
    const seen=new Set();
    const now=new Date(2026,9,13,12);
    for(let rounds=0;rounds<count;rounds++) {
      const session=learning.selectSession(words,progress,idFor,now);
      if(!session.length)break;
      assert.ok(session.length<=10);
      assert.equal(new Set(session.map(w=>w.word.toLowerCase())).size,session.length);
      for(const word of session) {
        assert.equal(seen.has(idFor(word)),false);
        seen.add(idFor(word));
        learning.recordAnswer(progress,idFor(word),true,now);
      }
    }
    assert.equal(seen.size,count,'Some study entries could never be selected');
  });
}

test('all word-choice questions have unique labels and exactly one copy of the target entry', () => {
  for(const answer of context.catalog) {
    const options=context.makeWordOptions(answer);
    assert.equal(options.length,4);
    assert.equal(new Set(options.map(w=>w.word.toLowerCase())).size,4);
    assert.equal(options.filter(w=>idFor(w)===idFor(answer)).length,1);
  }
});
