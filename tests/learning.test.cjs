const { test } = require('node:test');
const assert = require('node:assert/strict');
const learning = require('../learning.js');
const date = day => new Date(2026, 9, day, 12);

test('existing mastery and missed words migrate without inventing XP', () => {
  const progress = learning.normalize({ mastered: ['known'], missed: ['weak'], streak: 4 }, date(13));
  assert.equal(progress.xp, 0);
  assert.equal(progress.records.known.level, 3);
  assert.equal(progress.records.known.due, '2026-10-13');
  assert.equal(progress.records.weak.level, 0);
  assert.equal(progress.streak, 4);
});

test('mastery takes three separate days; repeat answers do not farm XP or advance reviews', () => {
  const progress = learning.normalize();
  assert.equal(learning.recordAnswer(progress, 'word', true, date(13)), 10);
  assert.equal(learning.recordAnswer(progress, 'word', true, date(13)), 0);
  assert.equal(progress.records.word.level, 1);
  assert.equal(progress.records.word.due, '2026-10-14');
  learning.recordAnswer(progress, 'word', true, date(14));
  assert.deepEqual(progress.mastered, []);
  assert.equal(progress.records.word.due, '2026-10-17');
  learning.recordAnswer(progress, 'word', true, date(17));
  assert.deepEqual(progress.mastered, ['word']);
  assert.equal(progress.records.word.due, '2026-10-24');
  assert.equal(progress.xp, 30);
});

test('missing a mastered word restarts mastery and schedules tomorrow', () => {
  const progress = learning.normalize({mastered:['word']}, date(13));
  learning.recordAnswer(progress, 'word', false, date(13));
  assert.deepEqual(progress.mastered, []);
  assert.deepEqual(progress.missed, ['word']);
  assert.equal(progress.records.word.due, '2026-10-14');
  assert.equal(progress.records.word.level, 0);
});

test('same-day failure and retry cannot regain mastery or duplicate XP', () => {
  const progress = learning.normalize();
  learning.recordAnswer(progress, 'word', true, date(13));
  learning.recordAnswer(progress, 'word', false, date(13));
  learning.recordAnswer(progress, 'word', true, date(13));
  assert.equal(progress.records.word.level, 0);
  assert.equal(progress.xp, 10);
  assert.deepEqual(progress.mastered, []);
});

test('daily selection mixes due reviews and new words, prioritizing missed words', () => {
  const words = Array.from({length:20}, (_,i)=>({id:String(i)}));
  const progress = learning.normalize({missed:['7']}, date(13));
  for(let i=0;i<8;i++) progress.records[i]={level:1,due:'2026-10-13'};
  progress.records['8']={level:3,due:'2026-10-20'};
  const selected=learning.selectSession(words,progress,w=>w.id,date(13));
  assert.equal(selected.length,10);
  assert.equal(new Set(selected.map(w=>w.id)).size,10);
  assert.equal(selected[0].id,'7');
  assert.equal(selected.filter(w=>!progress.records[w.id]).length,4);
  assert.equal(selected.some(w=>w.id==='8'),false);
});

test('session fills from either available pool and returns empty when reviews are not due', () => {
  const words = Array.from({length:12}, (_,i)=>({id:String(i)}));
  assert.equal(learning.selectSession(words,learning.normalize(),w=>w.id,date(13)).length,10);
  const progress=learning.normalize();
  words.forEach(w=>{progress.records[w.id]={level:1,due:'2026-10-14'}});
  assert.equal(learning.selectSession(words,progress,w=>w.id,date(13)).length,0);
  assert.equal(learning.selectSession(words,progress,w=>w.id,date(14)).length,10);
});

test('review records and capped XP survive save and reload; invalid progress falls back safely', () => {
  const progress=learning.normalize(null);
  learning.recordAnswer(progress,'word',true,date(13));
  const reloaded=learning.normalize(JSON.parse(JSON.stringify(progress)),date(13));
  assert.equal(learning.recordAnswer(reloaded,'word',true,date(13)),0);
  assert.equal(reloaded.records.word.due,'2026-10-14');
  assert.deepEqual(learning.normalize({mastered:'invalid',missed:8}).mastered,[]);
});
