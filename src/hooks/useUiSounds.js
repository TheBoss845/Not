import {useEffect,useRef} from 'react';

function createTone(context,{frequency=440,duration=.045,gain=.025,type='sine',delay=0,slide=0}){
  const now=context.currentTime+delay;const oscillator=context.createOscillator();const volume=context.createGain();
  oscillator.type=type;oscillator.frequency.setValueAtTime(frequency,now);if(slide)oscillator.frequency.exponentialRampToValueAtTime(Math.max(40,frequency+slide),now+duration);
  volume.gain.setValueAtTime(.0001,now);volume.gain.exponentialRampToValueAtTime(gain,now+.008);volume.gain.exponentialRampToValueAtTime(.0001,now+duration);
  oscillator.connect(volume);volume.connect(context.destination);oscillator.start(now);oscillator.stop(now+duration+.02);
}

export function useUiSounds(enabled=true){
  const contextRef=useRef(null);const lastFocusRef=useRef(0);
  useEffect(()=>{
    if(!enabled)return undefined;
    const context=()=>{if(!contextRef.current){const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return null;contextRef.current=new AudioContext();}if(contextRef.current.state==='suspended')contextRef.current.resume?.().catch(()=>{});return contextRef.current;};
    const focusSound=()=>{const now=performance.now();if(now-lastFocusRef.current<45)return;lastFocusRef.current=now;const ctx=context();if(!ctx)return;createTone(ctx,{frequency:520,duration:.036,gain:.018,type:'triangle',slide:70});};
    const activateSound=()=>{const ctx=context();if(!ctx)return;createTone(ctx,{frequency:610,duration:.05,gain:.022,type:'triangle',slide:170});createTone(ctx,{frequency:910,duration:.055,gain:.014,type:'sine',delay:.018,slide:120});};
    const backSound=()=>{const ctx=context();if(!ctx)return;createTone(ctx,{frequency:330,duration:.065,gain:.021,type:'triangle',slide:-115});};
    const onFocus=(event)=>{if(event.target?.matches?.('[data-tv-focusable="true"]'))focusSound();};
    const onClick=(event)=>{if(event.target?.closest?.('[data-tv-focusable="true"]'))activateSound();};
    const onBack=()=>backSound();
    document.addEventListener('focusin',onFocus,true);document.addEventListener('click',onClick,true);window.addEventListener('notflix:back',onBack);
    return()=>{document.removeEventListener('focusin',onFocus,true);document.removeEventListener('click',onClick,true);window.removeEventListener('notflix:back',onBack);contextRef.current?.close?.().catch(()=>{});contextRef.current=null;};
  },[enabled]);
}
