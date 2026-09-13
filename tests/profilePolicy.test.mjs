import test from 'node:test';
import assert from 'node:assert/strict';
import {applyProfilePolicy,canonicalProfileId,maturityLabel,policyForProfile} from '../src/lib/profilePolicy.js';

test('legacy profile ids migrate to Shaun and Lisa',()=>{
  assert.equal(canonicalProfileId('friend'),'shaun');
  assert.equal(canonicalProfileId('guest'),'lisa');
});

test('household profiles enforce the requested maturity ceilings',()=>{
  assert.equal(applyProfilePolicy({id:'levi',name:'Whatever',maturity:'all'}).maturity,'pg13');
  assert.equal(applyProfilePolicy({id:'kids',name:'Whatever',maturity:'all'}).maturity,'pg');
  assert.equal(applyProfilePolicy({id:'shaun',name:'Whatever',maturity:'pg'}).maturity,'all');
  assert.equal(applyProfilePolicy({id:'lisa',name:'Whatever',maturity:'pg13'}).maturity,'all');
});

test('household profile names are canonical and limits are locked',()=>{
  assert.equal(applyProfilePolicy({id:'friend',name:'Friend',maturity:'pg'}).name,'Shaun');
  assert.equal(applyProfilePolicy({id:'guest',name:'Guest',maturity:'pg'}).name,'Lisa');
  assert.equal(policyForProfile('levi').locked,true);
  assert.equal(policyForProfile('kids').locked,true);
  assert.equal(maturityLabel('pg13'),'PG-13 / TV-14 maximum');
});
