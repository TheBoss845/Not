import React,{useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {Captions,Maximize,Pause,Play,RotateCcw,RotateCw,Volume2,VolumeX,X} from 'lucide-react';
import {useNotflix} from '../context/NotflixContext.jsx';
import {prankForEvent,subtitleJokes} from '../lib/prankEngine.js';
import {controlBus} from '../lib/controlBus.js';
import {generatedDurationSeconds} from '../lib/generatedMedia.js';
import FocusButton from './FocusButton.jsx';
import MotionReel from './MotionReel.jsx';

const formatTime=(seconds)=>{const s=Math.max(0,Math.floor(seconds||0));const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`:`${m}:${String(sec).padStart(2,'0')}`;};
export default function Player({item,episode,trailer=false,onClose,onNextEpisode}){
  const{profile,progress,saveProgress,settings,triggerPrank}=useNotflix();
  const media=trailer?{...(item.media||{}),source:item.media?.trailer}:episode?.media??item.media??{};
  const source=media?.source||'';
  const demoDuration=generatedDurationSeconds(item,episode,trailer);
  const playbackKey=episode?`${item.id}:${episode.id}`:item.id;
  const initialRatio=trailer?0:(progress[playbackKey]??progress[item.id]??0);
  const[time,setTime]=useState(source?0:Math.min(initialRatio*demoDuration,Math.max(0,demoDuration-1)));
  const[total,setTotal]=useState(source?1:demoDuration);
  const[playing,setPlaying]=useState(true);const[muted,setMuted]=useState(false);const[captions,setCaptions]=useState(settings.subtitles);const[controls,setControls]=useState(true);const[triggered,setTriggered]=useState([]);const[autoplay,setAutoplay]=useState(null);const[speed,setSpeed]=useState(settings.defaultPlaybackRate||1);
  const videoRef=useRef(null);const hideTimer=useRef(null);const lastSavedRatio=useRef(initialRatio);const ratio=Math.min(1,time/Math.max(1,total));const wholeSecond=Math.floor(time);const playbackTitle=trailer?`${item.title} — Trailer`:episode?`${item.title}: ${episode.title}`:item.title;
  const subtitleTracks=media?.subtitles||[];const introEnd=Number(media?.introEnd||0);

  const wakeControls=useCallback(()=>{setControls(true);clearTimeout(hideTimer.current);if(playing)hideTimer.current=setTimeout(()=>setControls(false),2800);},[playing]);
  const saveCurrent=useCallback(()=>{if(trailer)return;saveProgress(item.id,ratio,episode?{episodeId:episode.id,seasonNumber:episode.seasonNumber,playbackKey}:{playbackKey});lastSavedRatio.current=ratio;},[trailer,saveProgress,item.id,ratio,episode,playbackKey]);
  const close=useCallback(()=>{saveCurrent();controlBus.send('telemetry',{profile:profile?.name,title:item.title,episode:episode?.title??null,playing:false,closed:true,trailer,progress:ratio,time,total});onClose();},[saveCurrent,profile,item.title,episode,ratio,time,total,trailer,onClose]);
  const pausePlayback=useCallback(()=>{setPlaying(false);videoRef.current?.pause();if(!trailer){const prank=prankForEvent(item,'pause');if(prank)triggerPrank(prank.id);}wakeControls();},[item,triggerPrank,wakeControls,trailer]);
  const playPlayback=useCallback(()=>{setPlaying(true);if(videoRef.current){videoRef.current.playbackRate=speed;videoRef.current.play?.().catch(()=>{});}wakeControls();},[wakeControls,speed]);
  const seek=useCallback((delta)=>{if(delta<0&&!trailer){const prank=prankForEvent(item,'rewind');if(prank)triggerPrank(prank.id);}const next=Math.max(0,Math.min(total,time+delta));if(videoRef.current)videoRef.current.currentTime=next;setTime(next);wakeControls();},[item,triggerPrank,total,time,wakeControls,trailer]);

  useEffect(()=>{if(source)return undefined;const id=setInterval(()=>{if(playing)setTime((value)=>Math.min(demoDuration,value+.5*speed));},500);return()=>clearInterval(id);},[playing,demoDuration,source,speed]);
  useEffect(()=>{if(!source&&time>=total&&playing)setPlaying(false);},[source,time,total,playing]);
  useEffect(()=>{if(trailer)return;const prank=prankForEvent(item,'progress',{progress:ratio,triggered});if(prank?.triggerKey){setTriggered((prev)=>[...prev,prank.triggerKey]);triggerPrank(prank.id);}if(Math.abs(ratio-lastSavedRatio.current)>=.01||ratio>=.98)saveCurrent();if(ratio>=.98&&item.type==='show'&&settings.autoplayNext&&episode)setAutoplay((value)=>value??8);},[ratio,item,episode,saveCurrent,settings.autoplayNext,triggerPrank,triggered,trailer]);
  useEffect(()=>{controlBus.send('telemetry',{profile:profile?.name??'Viewer',title:item.title,titleId:item.id,episode:episode?.title??null,episodeId:episode?.id??null,playing,muted,captions,trailer,progress:ratio,time,total,speed,media:source?'custom':'generated'});},[profile?.name,item.title,item.id,episode?.title,episode?.id,playing,muted,captions,trailer,wholeSecond,total,speed,source]);
  useEffect(()=>{if(autoplay===null)return undefined;if(autoplay<=0){setAutoplay(null);onNextEpisode?.();return undefined;}const id=setTimeout(()=>setAutoplay((value)=>value-1),1000);return()=>clearTimeout(id);},[autoplay,onNextEpisode]);
  useEffect(()=>{if(videoRef.current)videoRef.current.playbackRate=speed;},[speed]);
  useEffect(()=>()=>clearTimeout(hideTimer.current),[]);
  useEffect(()=>{const remote=(event)=>{const action=event.detail?.action;if(action==='play')playPlayback();if(action==='pause')pausePlayback();if(action==='seek-forward')seek(10);if(action==='seek-back')seek(-10);if(action==='mute')setMuted(true);if(action==='unmute')setMuted(false);if(action==='captions')setCaptions((v)=>!v);if(action==='close')close();};const keys=(event)=>{const tag=event.target?.tagName?.toLowerCase();if(tag==='input'||tag==='textarea')return;if(event.key==='Escape'||event.key==='Backspace'){event.preventDefault();close();return;}if(event.code==='Space'||event.key==='Enter'){event.preventDefault();playing?pausePlayback():playPlayback();}if(event.key==='ArrowLeft'){event.preventDefault();seek(-10);}if(event.key==='ArrowRight'){event.preventDefault();seek(10);}if(event.key.toLowerCase()==='m')setMuted((v)=>!v);if(event.key.toLowerCase()==='c')setCaptions((v)=>!v);if(event.key.toLowerCase()==='f')document.documentElement.requestFullscreen?.();};window.addEventListener('notflix:remote-player',remote);window.addEventListener('keydown',keys);return()=>{window.removeEventListener('notflix:remote-player',remote);window.removeEventListener('keydown',keys);};},[close,playPlayback,pausePlayback,seek,playing]);
  const subtitle=useMemo(()=>{const index=Math.floor(time/6)%subtitleJokes.length;if(!captions)return'';return time>total*.38&&time<total*.7?subtitleJokes[index]:`(${playbackTitle}) original NOTFLIX dialogue continues.`;},[time,captions,total,playbackTitle]);
  const cycleSpeed=()=>setSpeed((value)=>value===1?1.25:value===1.25?1.5:value===1.5?0.75:1);
  const quality=source?'MEDIA':trailer?'GENERATED TRAILER':'NOTFLIX MOTION';

  return <div className={`player ${controls?'player--controls':''}`} onMouseMove={wakeControls} onClick={wakeControls}>
    {source?<video ref={videoRef} className="player__video" src={source} autoPlay muted={muted} playsInline onLoadedMetadata={(e)=>{const duration=e.currentTarget.duration||1;setTotal(duration);const start=trailer?0:Math.min((progress[playbackKey]??progress[item.id]??0)*duration,Math.max(0,duration-2));e.currentTarget.currentTime=start;e.currentTarget.playbackRate=speed;setTime(start);}} onTimeUpdate={(e)=>setTime(e.currentTarget.currentTime)} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>{setPlaying(false);setTime(total);}}>{subtitleTracks.map((track,index)=><track key={`${track.lang}-${track.src}`} kind="captions" src={track.src} srcLang={track.lang||'en'} label={track.label||track.lang||'English'} default={index===0}/>)}</video>:<MotionReel item={item} episode={episode} trailer={trailer} progress={ratio}/>} 
    <div className="player__top"><strong>{playbackTitle}</strong><span className="player__quality">{quality} · {speed}×</span><FocusButton className="player__close" onClick={close}><X/></FocusButton></div>
    {captions&&playing&&(!source||subtitleTracks.length===0)&&<div className={`player__subtitles subtitles--${settings.subtitleSize}`}>{subtitle}</div>}
    {!trailer&&introEnd>0&&time<introEnd&&<FocusButton className="skip-intro" onClick={()=>seek(introEnd-time)}>Skip Intro</FocusButton>}
    <div className="player__controls"><div className="player__timeline"><input aria-label="Seek" type="range" min="0" max={total||1} step="0.1" value={Math.min(time,total||1)} onChange={(e)=>{const value=Number(e.target.value);setTime(value);if(videoRef.current)videoRef.current.currentTime=value;}}/><span>{formatTime(Math.max(0,(total||0)-time))} remaining</span></div><div className="player__buttons"><FocusButton className="player-control" onClick={playing?pausePlayback:playPlayback}>{playing?<Pause fill="white"/>:<Play fill="white"/>}</FocusButton><FocusButton className="player-control" onClick={()=>seek(-10)}><RotateCcw/></FocusButton><FocusButton className="player-control" onClick={()=>seek(10)}><RotateCw/></FocusButton><FocusButton className="player-control" onClick={()=>setMuted((v)=>!v)}>{muted?<VolumeX/>:<Volume2/>}</FocusButton><span className="player__episode-title">{playbackTitle}</span><FocusButton className="player-speed" onClick={cycleSpeed}>{speed}×</FocusButton><FocusButton className={`player-control ${captions?'player-control--active':''}`} onClick={()=>setCaptions((v)=>!v)}><Captions/></FocusButton><FocusButton className="player-control" onClick={()=>document.documentElement.requestFullscreen?.()}><Maximize/></FocusButton></div></div>
    {autoplay!==null&&<div className="autoplay-card"><small>Next episode in {autoplay}</small><strong>Because apparently sleep is optional</strong><FocusButton className="hero-button hero-button--play" onClick={onNextEpisode}>Play Now</FocusButton><FocusButton className="text-button" onClick={()=>setAutoplay(null)}>Cancel</FocusButton></div>}
  </div>;
}
