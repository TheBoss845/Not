import test from 'node:test';
import assert from 'node:assert/strict';
import {titleBibleFor} from '../src/data/titleBibles.js';

test('The Mediocres bible uses the ordinary-human-power concept',()=>{
  const bible=titleBibleFor('the-mediocres');
  assert.equal(bible.status,'locked-v2');
  assert.match(bible.comedyEngine,/ordinary people can basically do/i);
  assert.deepEqual(bible.characters.slice(0,5).map((c)=>c.powerName),[
    'Emotional Override',
    'Mind Subtitles',
    'Instant Estimation',
    'Peripheral Awareness',
    'Biological Recharge',
  ]);
});

test('Readout keeps the caption-overload gag and deaf continuity rule',()=>{
  const bible=titleBibleFor('the-mediocres');
  const elise=bible.characters.find((c)=>c.name==='Elise Palmer');
  assert.equal(elise.heroName,'Readout');
  assert.equal(elise.signatureLine,'Slow down, man. I can’t read that fast.');
  assert.ok(bible.continuityRules.some((rule)=>rule.includes('consistently deaf')));
});

test('the family never receives secretly stronger powers',()=>{
  const bible=titleBibleFor('the-mediocres');
  assert.ok(bible.powerRules.some((rule)=>rule.includes('never secretly develop stronger powers')));
});
