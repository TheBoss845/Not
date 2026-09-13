import test from 'node:test';
import assert from 'node:assert/strict';
import {generatedArtworkUri,generatedDurationSeconds,mediaReadiness,storyboardFor} from '../src/lib/generatedMedia.js';

const item={id:'pop',title:'POP',runtime:'1h 39m',trailerDuration:58,rating:'PG',kicker:'A NOTFLIX ORIGINAL',tagline:'Dream big. Maybe not that big.',description:'A house rises into the sky. The plan becomes less sensible almost immediately.',genres:['Adventure','Comedy'],tone:'sunset',emoji:'🎈',media:{}};

test('generated artwork returns an inline SVG data URI',()=>{
  const uri=generatedArtworkUri(item,'card');
  assert.match(uri,/^data:image\/svg\+xml;charset=UTF-8,/);
  assert.ok(uri.length>500);
});

test('generated durations preserve catalog runtime and trailer length',()=>{
  assert.equal(generatedDurationSeconds(item,null,false),5940);
  assert.equal(generatedDurationSeconds(item,null,true),58);
  assert.equal(generatedDurationSeconds(item,{duration:'48m'},false),2880);
});

test('storyboards provide complete trailer and feature beats',()=>{
  const trailer=storyboardFor(item,null,true);
  const feature=storyboardFor(item,null,false);
  assert.equal(trailer.length,7);
  assert.equal(feature.length,9);
  assert.equal(trailer[0].headline,'POP');
  assert.ok(feature.every((beat)=>beat.label&&beat.headline&&beat.copy));
});

test('media readiness treats missing custom assets as generated coverage',()=>{
  assert.deepEqual(mediaReadiness(item),{poster:'generated',backdrop:'generated',trailer:'generated',feature:'generated'});
  assert.deepEqual(mediaReadiness({...item,media:{poster:'/poster.svg',source:'/movie.mp4'}}),{poster:'custom',backdrop:'generated',trailer:'generated',feature:'custom'});
});
