import test from 'node:test';
import assert from 'node:assert/strict';
import {castFor} from '../src/data/fakeCast.js';

test('built-in titles receive stable fictional casts',()=>{
  const cast=castFor('the-mediocres');
  assert.equal(cast.length,3);
  assert.deepEqual(cast,castFor('the-mediocres'));
  assert.equal(new Set(cast).size,cast.length);
});

test('different titles get different casts',()=>{
  assert.notDeepEqual(castFor('the-mediocres'),castFor('gums'));
});
