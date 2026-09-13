import test from 'node:test';
import assert from 'node:assert/strict';
import {prankForEvent,PRANKS,resolvePrankSpec,prankCatalog} from '../src/lib/prankEngine.js';

test('direct event prank resolves',()=>{const item={id:'x',pranks:{pause:'premiumPause'}};assert.equal(prankForEvent(item,'pause').id,'premiumPause');});
test('object prank spec merges custom payload',()=>{const result=resolvePrankSpec({id:'subtitleTakeover',payload:{message:'custom'}});assert.equal(result.id,'subtitleTakeover');assert.equal(result.payload.message,'custom');});
test('percentage prank only fires once',()=>{const item={id:'x',pranks:{atPercent:{50:'fakeBuffering'}}};const first=prankForEvent(item,'progress',{progress:.51,triggered:[]});assert.equal(first.id,'fakeBuffering');assert.equal(prankForEvent(item,'progress',{progress:.8,triggered:[first.triggerKey]}),null);});
test('all configured pranks have required copy',()=>{for(const prank of Object.values(PRANKS)){assert.ok(prank.title);assert.ok(prank.body);assert.ok(prank.primary);assert.ok(prank.secondary);assert.ok(prank.kind);}});
test('v2 prank arsenal contains all persistent and player effects',()=>{for(const id of ['recommendationHijack','historyHaunt','impossibleMatch','planShuffle','contentSwap','surpriseEpisode','subtitleTakeover','potatoQuality','bufferingLoop','stillWatchingTrap','serviceNotice','chainReaction'])assert.ok(PRANKS[id],`missing ${id}`);assert.ok(Object.keys(PRANKS).length>=19);});
test('chain reaction references valid pranks',()=>{for(const step of PRANKS.chainReaction.chain)assert.ok(PRANKS[step.id],`invalid chained prank ${step.id}`);});
test('prank catalog exposes stable ids',()=>{const rows=prankCatalog();assert.equal(rows.length,Object.keys(PRANKS).length);assert.ok(rows.every((row)=>row.id&&row.title));});
