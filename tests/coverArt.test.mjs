import test from 'node:test';
import assert from 'node:assert/strict';
import {artworkSourceFor,coverFor} from '../src/data/coverArt.js';

test('The Mediocres uses its finished poster artwork',()=>{
  assert.equal(coverFor('the-mediocres')?.poster,'/media/posters/the-mediocres.jpg');
});

test('wide surfaces reuse the poster cleanly until a real backdrop exists',()=>{
  const item={id:'the-mediocres',media:{}};
  const source=artworkSourceFor(item,'backdrop');
  assert.equal(source.url,'/media/posters/the-mediocres.jpg');
  assert.equal(source.layout,'portrait-fallback');
});

test('browse cards use curated poster crops instead of generated placeholders',()=>{
  const item={id:'the-mediocres',media:{}};
  const source=artworkSourceFor(item,'card');
  assert.equal(source.url,'/media/posters/the-mediocres.jpg');
  assert.equal(source.layout,'portrait-crop');
});

test('titles without finished artwork keep generated fallbacks',()=>{
  assert.equal(coverFor('pop'),null);
  assert.equal(artworkSourceFor({id:'pop',media:{}},'card').url,null);
});
