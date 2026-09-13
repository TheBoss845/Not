const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

export function hashString(text=''){
  let value=2166136261;
  for(let i=0;i<text.length;i+=1){value^=text.charCodeAt(i);value=Math.imul(value,16777619);}
  return value>>>0;
}

const esc=(text='')=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');

export function paletteFor(item={}){
  const seed=hashString(`${item.id||item.title||'notflix'}:${item.tone||''}`);
  const a=seed%360;
  const b=(a+38+(seed%86))%360;
  const c=(a+172+(seed%71))%360;
  return{
    a:`hsl(${a} 78% 44%)`,
    b:`hsl(${b} 82% 26%)`,
    c:`hsl(${c} 88% 54%)`,
    ink:'hsl(0 0% 4%)',
    glow:`hsl(${(a+24)%360} 96% 70%)`,
  };
}

function titleLines(title='',maxChars=18){
  const words=String(title).trim().split(/\s+/).filter(Boolean);const lines=[];let current='';
  for(const word of words){const candidate=current?`${current} ${word}`:word;if(candidate.length>maxChars&&current){lines.push(current);current=word;}else current=candidate;}
  if(current)lines.push(current);
  if(lines.length<=3)return lines;
  return[lines[0],lines[1],`${lines.slice(2).join(' ').slice(0,maxChars-1)}…`];
}

export function generatedArtworkUri(item={},variant='card'){
  const landscape=variant!=='poster';
  const width=landscape?1280:720,height=landscape?720:1080;
  const palette=paletteFor(item);const seed=hashString(item.id||item.title||'notflix');
  const lines=titleLines(item.title||'NOTFLIX',landscape?24:16);
  const titleSize=landscape?78:72;const startY=landscape?height-168:height-250;
  const circles=Array.from({length:5},(_,index)=>{const x=(seed*(index+3)*17)%width;const y=(seed*(index+7)*13)%height;const r=80+((seed>>(index*3))%180);const opacity=.08+index*.018;return`<circle cx="${x}" cy="${y}" r="${r}" fill="white" opacity="${opacity}"/>`;}).join('');
  const title=lines.map((line,index)=>`<text x="${landscape?76:54}" y="${startY+index*(titleSize*.94)}" fill="white" font-family="Arial,Helvetica,sans-serif" font-size="${titleSize}" font-weight="900" letter-spacing="-2">${esc(line)}</text>`).join('');
  const emojiX=landscape?width-210:width-170,emojiY=landscape?230:260,emojiSize=landscape?170:150;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.a}"/><stop offset="0.54" stop-color="${palette.b}"/><stop offset="1" stop-color="${palette.ink}"/></linearGradient>
    <radialGradient id="glow" cx="72%" cy="28%" r="55%"><stop offset="0" stop-color="${palette.glow}" stop-opacity=".7"/><stop offset="1" stop-color="${palette.glow}" stop-opacity="0"/></radialGradient>
    <filter id="shadow"><feDropShadow dx="0" dy="12" stdDeviation="22" flood-color="#000" flood-opacity=".55"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/><rect width="100%" height="100%" fill="url(#glow)"/>
  ${circles}
  <path d="M0 ${Math.round(height*.72)} C ${Math.round(width*.28)} ${Math.round(height*.57)}, ${Math.round(width*.58)} ${Math.round(height*.92)}, ${width} ${Math.round(height*.58)} L ${width} ${height} L0 ${height}Z" fill="#000" opacity=".38"/>
  <text x="${landscape?76:54}" y="${landscape?74:82}" fill="#ff1838" font-family="Arial,Helvetica,sans-serif" font-size="${landscape?34:30}" font-weight="900" letter-spacing="5">NOTFLIX</text>
  <text x="${emojiX}" y="${emojiY}" text-anchor="middle" dominant-baseline="middle" font-size="${emojiSize}" filter="url(#shadow)">${esc(item.emoji||'🎬')}</text>
  <text x="${landscape?76:54}" y="${startY-52}" fill="white" opacity=".75" font-family="Arial,Helvetica,sans-serif" font-size="${landscape?24:22}" font-weight="700" letter-spacing="3">${esc((item.kicker||'A NOTFLIX ORIGINAL').toUpperCase())}</text>
  ${title}
  <text x="${landscape?76:54}" y="${height-34}" fill="white" opacity=".7" font-family="Arial,Helvetica,sans-serif" font-size="${landscape?20:18}">${esc(item.tagline||'Probably a terrible idea.')}</text>
</svg>`;
  return`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function sentenceParts(text=''){
  return String(text).split(/(?<=[.!?])\s+/).map((part)=>part.trim()).filter(Boolean);
}

export function storyboardFor(item={},episode=null,trailer=false){
  const title=episode?.title||item.title||'Untitled';
  const description=episode?.description||item.description||'Something highly questionable happens.';
  const sentences=sentenceParts(description);
  const tagline=item.tagline||'Probably a terrible idea.';
  const genre=(item.genres||[]).slice(0,3).join(' · ')||'NOTFLIX';
  const beats=trailer?
    [
      ['A NOTFLIX PREVIEW',title],
      ['THE SETUP',tagline],
      ['THE PROBLEM',sentences[0]||description],
      ['THINGS ESCALATE',sentences[1]||`Nobody involved in ${title} makes the sensible choice.`],
      ['SOMEHOW, MORE',sentences[2]||`The situation becomes dramatically less reasonable.`],
      ['COMING TO NOTFLIX',`${genre} · ${item.rating||'NR'}`],
      ['WATCH NOW',title],
    ]:
    [
      ['NOW PLAYING',title],
      ['ACT I',sentences[0]||tagline],
      ['THE PLAN',sentences[1]||`A plan is created. This will later be regretted.`],
      ['THE COMPLICATION',`The ${genre.toLowerCase()} portion of events becomes unavoidable.`],
      ['ACT II',sentences[2]||`Everyone doubles down for reasons that seemed better at the time.`],
      ['THE TURN',`A surprisingly polished montage attempts to make this all seem intentional.`],
      ['ACT III',`The consequences arrive exactly when everyone hoped they would not.`],
      ['THE FINALE',tagline],
      ['END CREDITS',`${title} · A NOTFLIX ORIGINAL`],
    ];
  return beats.map(([label,copy],index)=>({id:`beat-${index+1}`,label,headline:index===0||index===beats.length-1?title:label,copy}));
}

export function generatedDurationSeconds(item={},episode=null,trailer=false){
  if(trailer)return clamp(Number(item.trailerDuration)||58,25,120);
  const raw=String(episode?.duration||item.runtime||'').toLowerCase();
  const hours=Number(raw.match(/(\d+)\s*h/)?.[1]||0);
  const minutes=Number(raw.match(/(\d+)\s*m/)?.[1]||0);
  const seconds=hours*3600+minutes*60;
  if(seconds>0)return seconds;
  return item.type==='show'?45*60:96*60;
}

export function mediaReadiness(item={}){
  return{
    poster:item.media?.poster?'custom':'generated',
    backdrop:item.media?.backdrop?'custom':'generated',
    trailer:item.media?.trailer?'custom':'generated',
    feature:item.media?.source?'custom':'generated',
  };
}
