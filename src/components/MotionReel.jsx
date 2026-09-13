import React,{useEffect,useMemo,useState} from 'react';
import {paletteFor,storyboardFor} from '../lib/generatedMedia.js';

export default function MotionReel({item,episode=null,trailer=false,progress=0,preview=false}){
  const[loop,setLoop]=useState(0);
  useEffect(()=>{if(!preview)return undefined;const id=setInterval(()=>setLoop((value)=>(value+.018)%1),180);return()=>clearInterval(id);},[preview]);
  const scenes=useMemo(()=>storyboardFor(item,episode,trailer),[item,episode,trailer]);
  const palette=useMemo(()=>paletteFor({...item,id:episode?`${item.id}:${episode.id}`:item.id,tone:episode?.tone??item.tone}),[item,episode]);
  const effective=preview?loop:Math.max(0,Math.min(1,progress));
  const safeProgress=effective>=1?.999999:effective;
  const index=Math.min(scenes.length-1,Math.floor(safeProgress*scenes.length));
  const scene=scenes[index]??scenes[0];
  const sceneProgress=(effective*scenes.length)%1;
  return <div className={`motion-reel ${preview?'motion-reel--preview':''} ${trailer?'motion-reel--trailer':''}`} style={{'--reel-a':palette.a,'--reel-b':palette.b,'--reel-c':palette.c,'--reel-glow':palette.glow,'--scene-progress':sceneProgress}}>
    <div className="motion-reel__gradient"/>
    <div className="motion-reel__light motion-reel__light--one"/>
    <div className="motion-reel__light motion-reel__light--two"/>
    <div className="motion-reel__horizon"/>
    <div className="motion-reel__object motion-reel__object--one">{episode?.emoji??item.emoji??'🎬'}</div>
    <div className="motion-reel__object motion-reel__object--two">{item.emoji??'🎬'}</div>
    <div className="motion-reel__scan"/>
    <div className="motion-reel__copy" key={`${scene.id}-${preview?'p':'f'}`}>
      <small>{scene.label}</small>
      <strong>{scene.headline}</strong>
      <p>{scene.copy}</p>
    </div>
    <div className="motion-reel__brand">N</div>
    <div className="motion-reel__chapter">{String(index+1).padStart(2,'0')} / {String(scenes.length).padStart(2,'0')}</div>
  </div>;
}
