import test from 'node:test';
import assert from 'node:assert/strict';
import {prankForEvent,PRANKS} from '../src/lib/prankEngine.js';

test('direct event prank resolves',()=>{const item={id:'x',pranks:{pause:'premiumPause'}};assert.equal(prankForEvent(item,'pause').id,'premiumPause');});
test('percentage prank only fires once',()=>{const item={id:'x',pranks:{atPercent:{50:'fakeBuffering'}}};const first=prankForEvent(item,'progress',{progress:.51,triggered:[]});assert.equal(first.id,'fakeBuffering');assert.equal(prankForEvent(item,'progress',{progress:.8,triggered:[first.triggerKey]}),null);});
test('all configured pranks have required copy',()=>{for(const prank of Object.values(PRANKS)){assert.ok(prank.title);assert.ok(prank.body);assert.ok(prank.primary);}});
