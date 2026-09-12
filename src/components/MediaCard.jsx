import React,{useRef,useState} from 'react';
import {ChevronDown,Check,Plus,Play} from 'lucide-react';
import {useNotflix} from '../context/NotflixContext.jsx';
import FocusButton from './FocusButton.jsx';
import Artwork from './Artwork.jsx';

export default function MediaCard({item,rank,progressValue=0,onInfo,onPlay}){
  const{myList,toggleMyList,settings}=useNotflix();
  const[expanded,setExpanded]=useState(false);const timer=useRef(null);const inList=myList.includes(item.id);
  const startExpand=()=>{clearTimeout(timer.current);timer.current=setTimeout(()=>setExpanded(true),380);};
  const stopExpand=()=>{clearTimeout(timer.current);timer.current=setTimeout(()=>setExpanded(false),110);};
  const showVideo=expanded&&settings.autoplayPreviews&&item.media?.trailer;
  return <article className={`media-card-wrap ${rank?'media-card-wrap--ranked':''}`} data-title-id={item.id}>{rank&&<div className="rank-number">{rank}</div>}<div className={`media-card ${expanded?'media-card--expanded':''}`} onMouseEnter={startExpand} onMouseLeave={stopExpand} onFocusCapture={startExpand} onBlurCapture={stopExpand}>
    <FocusButton className="media-card__art" onClick={()=>onInfo(item)} aria-label={`${item.title}, more info`}>
      <Artwork item={item} variant="card" previewing={expanded}/>
      {showVideo&&<video className="media-card__preview-video" src={item.media.trailer} autoPlay muted loop playsInline/>}
      <span className="media-card__title">{item.title}</span>{item.newRelease&&<span className="media-card__new">NEW</span>}{progressValue>0&&<span className="progress-track"><span style={{width:`${progressValue*100}%`}}/></span>}
    </FocusButton>
    <div className="media-card__details"><div className="media-card__buttons"><FocusButton className="round-button round-button--play" onClick={()=>onPlay(item)} aria-label={`Play ${item.title}`}><Play size={16} fill="currentColor"/></FocusButton><FocusButton className="round-button" onClick={()=>toggleMyList(item.id)} aria-label={inList?'Remove from My List':'Add to My List'}>{inList?<Check size={17}/>:<Plus size={17}/>}</FocusButton><FocusButton className="round-button round-button--right" onClick={()=>onInfo(item)} aria-label="More info"><ChevronDown size={18}/></FocusButton></div><div className="media-card__meta"><strong>{item.match}% Match</strong><span className="rating-mini">{item.rating}</span><span>{item.runtime}</span></div><div className="media-card__genres">{item.genres.slice(0,3).map((g,i)=><React.Fragment key={g}><span>{g}</span>{i<Math.min(item.genres.length,3)-1&&<b>•</b>}</React.Fragment>)}</div></div>
  </div></article>;
}
