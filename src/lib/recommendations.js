const baseId=(id='')=>String(id).split(':')[0];
const unique=(items)=>[...new Set(items)];
const titleMap=(catalog)=>new Map(catalog.map((item)=>[item.id,item]));

function watchedIds(progress={},history=[]){
  return new Set(unique([
    ...Object.entries(progress).filter(([,value])=>Number(value)>.02).map(([id])=>baseId(id)),
    ...history.map((entry)=>entry?.id).filter(Boolean),
  ]));
}

export function becauseYouWatched(catalog,{progress={},history=[]}={},limit=12){
  const map=titleMap(catalog);
  const recent=[...history].filter((entry)=>entry?.id&&map.has(entry.id)).sort((a,b)=>(b.at||0)-(a.at||0));
  const progressSeeds=Object.entries(progress)
    .filter(([id,value])=>!id.includes(':')&&Number(value)>.08&&Number(value)<.98&&map.has(id))
    .sort((a,b)=>Number(b[1])-Number(a[1]));
  const seed=map.get(recent[0]?.id)||map.get(progressSeeds[0]?.[0])||null;
  if(!seed)return{seed:null,items:[]};
  const watched=watchedIds(progress,history);
  const items=catalog
    .filter((item)=>item.id!==seed.id&&!watched.has(item.id))
    .map((item)=>{
      const shared=item.genres.filter((genre)=>seed.genres.includes(genre)).length;
      const score=shared*20+(item.match||0)/10+(item.newRelease?1.5:0);
      return{item,shared,score};
    })
    .filter((entry)=>entry.shared>0)
    .sort((a,b)=>b.score-a.score||String(a.item.title).localeCompare(String(b.item.title)))
    .slice(0,limit)
    .map((entry)=>entry.item);
  return{seed,items};
}

export function topPicksForYou(catalog,{progress={},history=[],ratings={},myList=[]}={},limit=12){
  const map=titleMap(catalog);const weights=new Map();const watched=watchedIds(progress,history);
  const addGenres=(id,weight)=>{const item=map.get(baseId(id));if(!item)return;for(const genre of item.genres)weights.set(genre,(weights.get(genre)||0)+weight);};
  for(const[id,value]of Object.entries(ratings))if(value==='up')addGenres(id,5);
  for(const id of myList)addGenres(id,2.2);
  [...history].sort((a,b)=>(b.at||0)-(a.at||0)).slice(0,10).forEach((entry,index)=>addGenres(entry.id,Math.max(1,3-index*.2)));
  Object.entries(progress).filter(([id,value])=>!id.includes(':')&&Number(value)>.08).forEach(([id,value])=>addGenres(id,1+Number(value)*1.5));
  if(!weights.size)return catalog.filter((item)=>item.featured||item.top10).sort((a,b)=>(b.match||0)-(a.match||0)).slice(0,limit);
  return catalog
    .filter((item)=>!watched.has(item.id))
    .map((item)=>({item,score:item.genres.reduce((sum,genre)=>sum+(weights.get(genre)||0),0)+(item.match||0)/20+(item.newRelease?.8:0)+(item.featured?.6:0)}))
    .sort((a,b)=>b.score-a.score||String(a.item.title).localeCompare(String(b.item.title)))
    .slice(0,limit)
    .map((entry)=>entry.item);
}

export function watchAgain(catalog,{progress={},history=[]}={},limit=12){
  const map=titleMap(catalog);const completed=new Map();
  for(const[id,value]of Object.entries(progress)){if(id.includes(':')||Number(value)<.92)continue;completed.set(id,{id,progress:Number(value),at:0});}
  for(const entry of history){if(!entry?.id||Number(entry.progress)<.92)continue;const existing=completed.get(entry.id);if(!existing||(entry.at||0)>(existing.at||0))completed.set(entry.id,{id:entry.id,progress:Number(entry.progress),at:entry.at||0});}
  return [...completed.values()].sort((a,b)=>b.at-a.at||b.progress-a.progress).map((entry)=>map.get(entry.id)).filter(Boolean).slice(0,limit);
}
