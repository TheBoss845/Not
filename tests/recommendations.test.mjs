import test from 'node:test';
import assert from 'node:assert/strict';
import {becauseYouWatched,topPicksForYou,watchAgain} from '../src/lib/recommendations.js';

const catalog=[
  {id:'a',title:'A',genres:['Comedy','Adventure'],match:90,featured:true},
  {id:'b',title:'B',genres:['Comedy'],match:96,newRelease:true},
  {id:'c',title:'C',genres:['Drama'],match:99},
  {id:'d',title:'D',genres:['Comedy','Adventure'],match:80},
];

test('becauseYouWatched uses the latest history title as the seed',()=>{
  const result=becauseYouWatched(catalog,{history:[{id:'a',at:20,progress:.5}],progress:{a:.5}});
  assert.equal(result.seed.id,'a');
  assert.deepEqual(result.items.map((item)=>item.id),['d','b']);
});

test('topPicksForYou favors the strongest genre overlap',()=>{
  const result=topPicksForYou(catalog,{ratings:{a:'up'},progress:{a:.4}},3);
  assert.deepEqual(result.map((item)=>item.id),['d','b','c']);
});

test('watchAgain returns completed titles most-recent first',()=>{
  const result=watchAgain(catalog,{progress:{a:.95,b:.99},history:[{id:'a',progress:.95,at:10},{id:'b',progress:.99,at:40}]});
  assert.deepEqual(result.map((item)=>item.id),['b','a']);
});
