import React,{useMemo,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
import {getTitle} from '../data/catalog.js';
import {becauseYouWatched,topPicksForYou,watchAgain} from '../lib/recommendations.js';
import {useNotflix} from '../context/NotflixContext.jsx';
import MediaCard from './MediaCard.jsx';

export default function MediaRow({row,onInfo,onPlay}){
  const{progress,catalog,profile,history,ratings,myList}=useNotflix();
  const scroller=useRef(null);const[moved,setMoved]=useState(false);
  const personalized=useMemo(()=>({progress,history,ratings,myList}),[progress,history,ratings,myList]);
  const rowData=useMemo(()=>{
    if(row.dynamic==='continue')return{items:Object.entries(progress).filter(([id,v])=>!id.includes(':')&&v>.02&&v<.96).sort((a,b)=>b[1]-a[1]).map(([id])=>catalog.find((x)=>x.id===id)??getTitle(id)).filter(Boolean),title:`${row.title} for ${profile?.name??'You'}`};
    if(row.dynamic==='top-picks')return{items:topPicksForYou(catalog,personalized),title:`Top Picks for ${profile?.name??'You'}`};
    if(row.dynamic==='because'){const result=becauseYouWatched(catalog,personalized);return{items:result.items,title:result.seed?`Because You Watched ${result.seed.title}`:row.title};}
    if(row.dynamic==='watch-again')return{items:watchAgain(catalog,personalized),title:row.title};
    return{items:(row.ids??[]).map((id)=>catalog.find((x)=>x.id===id)??getTitle(id)).filter(Boolean),title:row.title};
  },[row,progress,catalog,profile?.name,personalized]);
  if(!rowData.items.length)return null;
  const shift=(dir)=>{const el=scroller.current;if(!el)return;el.scrollBy({left:dir*el.clientWidth*.82,behavior:'smooth'});if(dir>0)setMoved(true);};
  return <section className="media-row"><h2>{rowData.title}<span className="explore-label">Explore All <ChevronRight size={14}/></span></h2><div className="media-row__rail">{moved&&<button type="button" className="row-arrow row-arrow--left" onClick={()=>shift(-1)}><ChevronLeft size={36}/></button>}<div className="media-row__scroller" ref={scroller}>{rowData.items.map((item,index)=><MediaCard key={`${row.id}-${item.id}`} item={item} rank={row.rank?(item.top10??index+1):null} progressValue={row.progress||row.dynamic==='continue'?(progress[item.id]??item.progress??0):0} onInfo={onInfo} onPlay={onPlay}/>)}</div><button type="button" className="row-arrow row-arrow--right" onClick={()=>shift(1)}><ChevronRight size={36}/></button></div></section>;
}
