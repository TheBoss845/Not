import React from 'react';
import { gradientFor } from '../data/catalog.js';

function hash(text=''){
  let value=0;
  for(let i=0;i<text.length;i+=1)value=(value*31+text.charCodeAt(i))>>>0;
  return value;
}

export default function Artwork({item,variant='card',className='',children,previewing=false}){
  if(!item)return null;
  const artUrl=variant==='hero'||variant==='backdrop'?item.media?.backdrop:item.media?.poster;
  const seed=hash(item.id||item.title);
  const h1=seed%360;
  const h2=(h1+48+(seed%73))%360;
  return <span className={`artwork artwork--${variant} ${previewing?'artwork--previewing':''} ${className}`} style={{'--art-bg':gradientFor(item.tone),'--art-h1':h1,'--art-h2':h2}} aria-hidden="true">
    {artUrl&&<img className="artwork__image" src={artUrl} alt="" loading={variant==='card'?'lazy':'eager'}/>} 
    <span className="artwork__wash"/>
    <span className="artwork__shape artwork__shape--a"/>
    <span className="artwork__shape artwork__shape--b"/>
    <span className="artwork__shape artwork__shape--c"/>
    <span className="artwork__emoji">{item.emoji}</span>
    <span className="artwork__beam"/>
    <span className="artwork__grain"/>
    {children}
  </span>;
}
