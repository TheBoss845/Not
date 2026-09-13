import test from 'node:test';
import assert from 'node:assert/strict';
import {coverFor} from '../src/data/coverArt.js';

test('The Mediocres uses its finished poster artwork',()=>{
  assert.equal(coverFor('the-mediocres')?.poster,'/media/posters/the-mediocres.jpg');
});

test('titles without finished artwork keep generated fallbacks',()=>{
  assert.equal(coverFor('pop'),null);
});
