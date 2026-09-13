import test from 'node:test';
import assert from 'node:assert/strict';
import {titleBibleFor} from '../src/data/titleBibles.js';

test('The Mediocres bible is locked and production-ready',()=>{
  const bible=titleBibleFor('the-mediocres');
  assert.equal(bible.status,'locked');
  assert.equal(bible.rating,'PG');
  assert.equal(bible.displayRuntime,'1h 42m');
  assert.equal(bible.characters.length,7);
  assert.equal(bible.cast.length,7);
  assert.equal(bible.storyBeats.length,9);
  assert.equal(bible.continuityRules.length,6);
});

test('The Mediocres cast and characters are fully fictional production metadata',()=>{
  const bible=titleBibleFor('the-mediocres');
  assert.deepEqual(bible.cast[0],{actor:'Adrian Vale',character:'Dean Palmer / Captain Capable'});
  assert.equal(bible.characters.find((character)=>character.name==='Dean Palmer')?.heroName,'Captain Capable');
  assert.equal(bible.characters.find((character)=>character.name==='Victor Pinnacle')?.villainName,'Dr. Exceptional');
});
