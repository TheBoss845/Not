import test from 'node:test';
import assert from 'node:assert/strict';
import {makeCustomTitle,slugify} from '../src/lib/titleFactory.js';

test('slugify creates safe ids',()=>assert.equal(slugify('POP 2: The Re-Popping!'),'pop-2-the-re-popping'));
test('custom title has complete playable defaults',()=>{const item=makeCustomTitle({title:'Test Movie',genres:'Comedy, Adventure'});assert.equal(item.type,'movie');assert.deepEqual(item.genres,['Comedy','Adventure']);assert.ok(item.media);assert.ok(item.id.startsWith('custom-test-movie-'));});
