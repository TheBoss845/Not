import { catalog } from './catalog.js';
const idsWhere = (predicate) => catalog.filter(predicate).map((item) => item.id);
export const baseRows = [
  { id:'continue', title:'Continue Watching', dynamic:'continue', progress:true },
  { id:'trending', title:'Trending Now', ids:['pop','no-weigh-home','gums','bigger-things','slow-and-irritated','whoppenheimer','space-office','toy-lawsuit'] },
  { id:'top10', title:'Top 10 in the U.S. Today', ids:catalog.filter((x)=>x.top10).sort((a,b)=>a.top10-b.top10).map((x)=>x.id), rank:true },
  { id:'new', title:'New Releases', ids:idsWhere((x)=>x.newRelease) },
  { id:'because-pop', title:'Because You Watched POP', ids:['home-with-47-people','mission-mildly-inconvenient','gums','cars-jars','jurassic-pork','printer-2'] },
  { id:'only', title:'Only on NOTFLIX', ids:['outside-in','the-mediocres','toy-lawsuit','space-office','extremely-mild-files','cooking-with-consequences'] },
  { id:'comedy', title:'Comedies', ids:idsWhere((x)=>x.genres.includes('Comedy')).slice(0,14) },
  { id:'family', title:'Family Movie Night', ids:idsWhere((x)=>x.rating==='PG'||x.rating==='TV-PG').slice(0,12) },
  { id:'action', title:'Action, Allegedly', ids:idsWhere((x)=>x.genres.some((g)=>['Action','Superhero','Spy'].includes(g))).slice(0,12) },
  { id:'shows', title:'Bingeable Series', ids:idsWhere((x)=>x.type==='show') },
  { id:'absurd', title:'Questionable Cinematic Decisions', ids:['gums-vs-jars','pie-rates','lord-onion-rings','john-thick','iron-mass','napoleon-small-talk','minions-union','rocky-road'] }
];
export const navFilters = { Home:()=>true, 'TV Shows':(item)=>item.type==='show', Movies:(item)=>item.type==='movie', 'New & Popular':(item)=>item.newRelease||item.top10 };
