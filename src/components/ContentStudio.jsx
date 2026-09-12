import React,{useState} from 'react';
import {Clapperboard,Link,Plus,Trash2} from 'lucide-react';
import {useNotflix} from '../context/NotflixContext.jsx';
import FocusButton from './FocusButton.jsx';

const empty={title:'',type:'movie',emoji:'🎬',tagline:'',description:'',genres:'Comedy',rating:'PG-13',runtime:'1h 30m',tone:'midnight',source:'',trailer:'',poster:'',backdrop:''};
export default function ContentStudio(){
  const{customTitles,createCustomTitle,removeCustomTitle,notify}=useNotflix();
  const[form,setForm]=useState(empty);
  const patch=(key,value)=>setForm((prev)=>({...prev,[key]:value}));
  const submit=(event)=>{event.preventDefault();if(!form.title.trim())return;const created=createCustomTitle(form);setForm(empty);notify(`${created.title} added to NOTFLIX`);};
  return <div className="studio">
    <div className="studio__intro"><Clapperboard/><div><h3>Catalog Studio</h3><p>Create a title, attach generated media later, and it immediately becomes searchable and playable.</p></div></div>
    <form className="studio-form" onSubmit={submit}>
      <label><span>Title</span><input value={form.title} onChange={(e)=>patch('title',e.target.value)} placeholder="POP 2: POP HARDER"/></label>
      <label><span>Type</span><select value={form.type} onChange={(e)=>patch('type',e.target.value)}><option value="movie">Movie</option><option value="show">Show</option></select></label>
      <label><span>Emoji</span><input value={form.emoji} onChange={(e)=>patch('emoji',e.target.value)} maxLength={4}/></label>
      <label className="studio-form__wide"><span>Tagline</span><input value={form.tagline} onChange={(e)=>patch('tagline',e.target.value)} placeholder="One sentence of extremely serious nonsense."/></label>
      <label className="studio-form__wide"><span>Description</span><textarea value={form.description} onChange={(e)=>patch('description',e.target.value)} rows={3}/></label>
      <label><span>Genres</span><input value={form.genres} onChange={(e)=>patch('genres',e.target.value)} placeholder="Comedy, Adventure"/></label>
      <label><span>Rating</span><input value={form.rating} onChange={(e)=>patch('rating',e.target.value)}/></label>
      <label><span>Runtime</span><input value={form.runtime} onChange={(e)=>patch('runtime',e.target.value)}/></label>
      <label><span>Art tone</span><input value={form.tone} onChange={(e)=>patch('tone',e.target.value)}/></label>
      <label className="studio-form__wide"><span><Link size={14}/> Full video URL</span><input value={form.source} onChange={(e)=>patch('source',e.target.value)} placeholder="https://...mp4"/></label>
      <label className="studio-form__wide"><span><Link size={14}/> Trailer URL</span><input value={form.trailer} onChange={(e)=>patch('trailer',e.target.value)} placeholder="https://...mp4"/></label>
      <label><span>Poster URL</span><input value={form.poster} onChange={(e)=>patch('poster',e.target.value)}/></label>
      <label><span>Backdrop URL</span><input value={form.backdrop} onChange={(e)=>patch('backdrop',e.target.value)}/></label>
      <FocusButton className="hq-send studio-form__submit" type="submit"><Plus size={18}/> Add title</FocusButton>
    </form>
    <div className="studio-library"><h4>Custom titles</h4>{customTitles.length===0?<p className="studio-empty">Nothing custom yet. The built-in catalog is carrying civilization.</p>:customTitles.map((item)=><div className="studio-title" key={item.id}><span>{item.emoji}</span><div><strong>{item.title}</strong><small>{item.type} · {item.media?.source?'full media attached':'simulated playback'}</small></div><FocusButton onClick={()=>removeCustomTitle(item.id)} aria-label={`Remove ${item.title}`}><Trash2 size={17}/></FocusButton></div>)}</div>
  </div>;
}
