import React,{useMemo,useState} from 'react';
import { gradientFor } from '../data/catalog.js';
import {artworkSourceFor} from '../data/coverArt.js';
import {generatedArtworkUri} from '../lib/generatedMedia.js';

function hash(text=''){
  let value=0;
  for(let i=0;i<text.length;i+=1)value=(value*31+text.charCodeAt(i))>>>0;
  return value;
}

export default function Artwork({item,variant='card',className='',children,previewing=false}){
  const[failed,setFailed]=useState(false);
  const source=useMemo(()=>artworkSourceFor(item,variant),[item,variant]);
  if(!item)return null;
  const generated=generatedArtworkUri(item,variant);
  const artUrl=!failed&&source.url?source.url:generated;
  const isCurated=!failed&&Boolean(source.url);
  const seed=hash(item.id||item.title);
  const h1=seed%360;
  const h2=(h1+48+(seed%73))%360;
  const style={'--art-bg':gradientFor(item.tone),'--art-h1':h1,'--art-h2':h2,'--art-focus':source.focus||'50% 50%'};
  return <span className={`artwork artwork--${variant} ${previewing?'artwork--previewing':''} ${isCurated?'artwork--curated':'artwork--generated'} ${className}`} style={style} aria-hidden="true" data-art-source={isCurated?'curated':'generated'} data-art-layout={isCurated?source.layout:'generated'}>
    {isCurated&&source.layout==='portrait-fallback'&&<img className="artwork__image artwork__image--ambient" src={artUrl} alt="" aria-hidden="true"/>}
    <img className="artwork__image artwork__image--primary" src={artUrl} alt="" loading={variant==='card'?'lazy':'eager'} decoding="async" onError={()=>setFailed(true)}/>
    <span className="artwork__wash"/>
    {!isCurated&&<><span className="artwork__shape artwork__shape--a"/><span className="artwork__shape artwork__shape--b"/><span className="artwork__shape artwork__shape--c"/></>}
    <span className="artwork__beam"/>
    <span className="artwork__grain"/>
    {children}
  </span>;
}
