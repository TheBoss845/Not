import React,{useEffect,useRef,useState} from 'react';
import {Info,Play,Volume2,VolumeX} from 'lucide-react';
import {useNotflix} from '../context/NotflixContext.jsx';
import FocusButton from './FocusButton.jsx';
import Artwork from './Artwork.jsx';
import MotionReel from './MotionReel.jsx';

export default function Hero({item,onPlay,onInfo}){
  const{settings,profile,displayMatchFor}=useNotflix();const[muted,setMuted]=useState(true);const[previewing,setPreviewing]=useState(false);const videoRef=useRef(null);
  const autoplay=settings.autoplayPreviews&&profile?.autoplay!==false;
  useEffect(()=>{setPreviewing(false);if(!autoplay)return undefined;const id=setTimeout(()=>setPreviewing(true),1600);return()=>clearTimeout(id);},[item?.id,autoplay]);
  useEffect(()=>{if(videoRef.current)videoRef.current.muted=muted;},[muted]);
  if(!item)return null;
  const customTrailer=Boolean(item.media?.trailer);const match=displayMatchFor(item);
  return <section className={`hero ${previewing?'hero--previewing':''}`}><div className="hero__visual"><Artwork item={item} variant="hero" previewing={previewing}/>{previewing&&customTrailer&&<video ref={videoRef} className="hero__video" src={item.media.trailer} autoPlay muted={muted} loop playsInline/>}{previewing&&!customTrailer&&<div className="hero__generated-preview"><MotionReel item={item} trailer preview/></div>}</div><div className="hero__vignette"/>
    <div className="hero__content"><div className="eyebrow">{item.kicker}</div><h1>{item.title}</h1><p className="hero__tagline">{item.tagline}</p><p className="hero__description">{item.description}</p><div className="hero__meta"><strong>{match}% Match</strong><span>{item.year}</span><span className="rating-pill">{item.rating}</span><span>{item.runtime}</span><span className="hd-pill">{item.media?.source?'FULL FILM':'MOTION CUT'}</span></div><div className="hero__actions"><FocusButton className="hero-button hero-button--play" onClick={()=>onPlay(item)}><Play fill="currentColor" size={24}/> Play</FocusButton><FocusButton className="hero-button hero-button--info" onClick={()=>onInfo(item)}><Info size={24}/> More Info</FocusButton></div></div>
    <div className="hero__controls">{customTrailer&&<FocusButton className="hero-volume" onClick={()=>setMuted((v)=>!v)}>{muted?<VolumeX size={20}/>:<Volume2 size={20}/>}</FocusButton>}<span className="hero__rating">{item.rating}</span></div>{previewing&&<div className="hero__preview-label">{customTrailer?'TRAILER':'MOTION PREVIEW'}</div>}
  </section>;
}
