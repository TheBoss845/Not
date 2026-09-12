export function slugify(value=''){
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,64)||`title-${Date.now()}`;
}

export function makeCustomTitle(input={}){
  const title=(input.title||'Untitled NOTFLIX Project').trim();
  const id=input.id||`custom-${slugify(title)}-${Date.now().toString(36)}`;
  const type=input.type==='show'?'show':'movie';
  const genres=Array.isArray(input.genres)?input.genres:String(input.genres||'Comedy').split(',').map((x)=>x.trim()).filter(Boolean);
  return {
    id,title,type,year:String(input.year||new Date().getFullYear()),rating:input.rating||'PG-13',runtime:input.runtime||(type==='show'?'1 Season':'1h 30m'),match:Number(input.match)||95,
    kicker:input.kicker||'A NOTFLIX ORIGINAL',tagline:input.tagline||'This seemed like a good idea at the time.',description:input.description||'A newly created NOTFLIX title waiting for its trailer and an unreasonable amount of polish.',
    genres:genres.length?genres:['Comedy'],tone:input.tone||'midnight',emoji:input.emoji||'🎬',featured:Boolean(input.featured),newRelease:true,top10:null,progress:0,
    cast:input.cast||['NOTFLIX Cast'],creators:input.creators||['NOTFLIX Studios'],pranks:input.pranks||{},seasons:type==='show'?(input.seasons||[]):undefined,
    media:{source:input.source||'',trailer:input.trailer||'',poster:input.poster||'',backdrop:input.backdrop||'',subtitles:input.subtitles||[],introEnd:Number(input.introEnd)||0},custom:true,
  };
}
