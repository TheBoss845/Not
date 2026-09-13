export const coverArt = {
  'the-mediocres': {
    poster: '/media/posters/the-mediocres.jpg',
    posterFocus: '50% 40%',
    heroFocus: '50% 32%',
    version: 'v1',
  },
};

export const coverFor = (id) => coverArt[id] ?? null;

export function artworkSourceFor(item,variant='card'){
  if(!item)return {url:null,kind:'generated',layout:'generated',focus:'50% 50%'};
  const curated=coverFor(item.id);
  const poster=item.media?.poster||curated?.poster||null;
  const backdrop=item.media?.backdrop||curated?.backdrop||null;
  const wantsWide=variant==='hero'||variant==='backdrop';
  if(wantsWide&&backdrop)return {url:backdrop,kind:'curated',layout:'wide',focus:curated?.heroFocus||'50% 50%'};
  if(wantsWide&&poster)return {url:poster,kind:'curated',layout:'portrait-fallback',focus:curated?.heroFocus||curated?.posterFocus||'50% 38%'};
  if(poster)return {url:poster,kind:'curated',layout:'portrait-crop',focus:curated?.posterFocus||'50% 42%'};
  return {url:null,kind:'generated',layout:'generated',focus:'50% 50%'};
}
