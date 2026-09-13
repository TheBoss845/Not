import test from 'node:test';
import assert from 'node:assert/strict';
import {titleBibleFor} from '../src/data/titleBibles.js';

test('The Mediocres bible is locked and production-ready',()=>{
  const bible=titleBibleFor('the-mediocres');
  assert.equal(bible.status,'locked-v2');
  assert.equal(bible.rating,'PG');
  assert.equal(bible.displayRuntime,'1h 42m');
  assert.equal(bible.characters.length,7);
  assert.equal(bible.cast.length,7);
  assert.ok(bible.storyBeats.length>=12);
  assert.ok(bible.continuityRules.length>=8);
});

test('The Mediocres cast and characters are fully fictional production metadata',()=>{
  const bible=titleBibleFor('the-mediocres');
  assert.deepEqual(bible.cast[0],{actor:'Adrian Vale',character:'Dean Palmer / Captain Composed'});
  assert.equal(bible.characters.find((character)=>character.name==='Dean Palmer')?.heroName,'Captain Composed');
  assert.equal(bible.characters.find((character)=>character.name==='Elise Palmer')?.heroName,'Readout');
  assert.equal(bible.characters.find((character)=>character.name==='Victor Pinnacle')?.villainName,'Dr. Exceptional');
});
