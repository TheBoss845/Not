const movie = (id, title, opts = {}) => ({
  id,
  title,
  type: 'movie',
  year: opts.year ?? '2026',
  rating: opts.rating ?? 'PG-13',
  runtime: opts.runtime ?? '1h 42m',
  match: opts.match ?? 94,
  kicker: opts.kicker ?? 'A NOTFLIX ORIGINAL',
  tagline: opts.tagline ?? 'Probably a terrible idea.',
  description: opts.description ?? 'A suspiciously polished parody adventure from the least responsible streaming service on Earth.',
  genres: opts.genres ?? ['Comedy'],
  tone: opts.tone ?? 'midnight',
  emoji: opts.emoji ?? '🎬',
  featured: Boolean(opts.featured),
  newRelease: Boolean(opts.newRelease),
  top10: opts.top10 ?? null,
  trailerDuration: opts.trailerDuration ?? 58,
  progress: opts.progress ?? 0,
  cast: opts.cast ?? ['A Very Serious Actor', 'Another Serious Actor'],
  creators: opts.creators ?? ['NOTFLIX Studios'],
  pranks: opts.pranks ?? {},
  media: opts.media ?? {},
});

const episode = (number, title, duration, description, opts = {}) => ({
  number,
  id: opts.id ?? `ep-${number}`,
  title,
  duration,
  description,
  tone: opts.tone ?? 'midnight',
  emoji: opts.emoji ?? '📺',
  progress: opts.progress ?? 0,
  media: opts.media ?? {},
  pranks: opts.pranks ?? {},
});

const show = (id, title, opts = {}) => ({
  id, title, type: 'show', year: opts.year ?? '2026', rating: opts.rating ?? 'TV-14',
  runtime: `${opts.seasons?.length ?? 1} Season${(opts.seasons?.length ?? 1) === 1 ? '' : 's'}`,
  match: opts.match ?? 95, kicker: opts.kicker ?? 'A NOTFLIX SERIES', tagline: opts.tagline ?? 'Several episodes more than necessary.',
  description: opts.description ?? 'A serialized parody with extremely questionable production decisions.',
  genres: opts.genres ?? ['Comedy'], tone: opts.tone ?? 'midnight', emoji: opts.emoji ?? '📺', featured: Boolean(opts.featured),
  newRelease: Boolean(opts.newRelease), top10: opts.top10 ?? null, progress: opts.progress ?? 0,
  cast: opts.cast ?? ['Someone With Secrets', 'Someone Else With Worse Secrets'], creators: opts.creators ?? ['NOTFLIX Television'],
  seasons: opts.seasons ?? [], pranks: opts.pranks ?? {}, media: opts.media ?? {},
});

export const catalog = [
  movie('pop', 'POP', { featured: true, newRelease: true, top10: 1, rating: 'PG', runtime: '1h 39m', match: 99, tagline: 'Dream big. Maybe not that big.', description: 'A determined widower attaches thousands of balloons to his house. The launch is magical for approximately eleven seconds, after which structural engineering files a formal complaint.', genres: ['Adventure','Family','Comedy','Catastrophe'], tone: 'sunset', emoji: '🎈', progress: .38, cast: ['Carl Uplift','Russell-ish','One Extremely Concerned Crane Operator'], pranks: { pause: 'premiumPause', rewind: 'rewindPremium', atPercent: { 62: 'fakeBuffering' } } }),
  movie('no-weigh-home','NO WEIGH HOME',{top10:2,runtime:'2h 11m',match:98,kicker:'NOTFLIX MULTIVERSE EVENT',tagline:'With great power comes extremely strange gravity.',description:'A masked hero opens the wrong portal and lands in a universe where gravity, physics, costumes, and heroic landings all behave very differently.',genres:['Superhero','Comedy','Multiverse'],tone:'city',emoji:'🕷️',progress:.71,pranks:{pause:'premiumPause',subtitleAtPercent:44}}),
  movie('gums','GUMS',{top10:4,tagline:'The ocean’s least efficient predator.',description:'A seaside town panics when an enormous shark appears, then becomes slightly less concerned after discovering one major dental limitation.',genres:['Creature Feature','Comedy'],tone:'ocean',emoji:'🦈'}),
  movie('the-mediocres','THE MEDIOCRES',{top10:3,rating:'PG',tagline:'Saving the world. Adequately.',description:'A family with aggressively average superpowers attempts to stop a villain using teamwork, confidence, and surprisingly reliable public transportation.',genres:['Family','Heroes','Comedy'],tone:'hero',emoji:'🦸'}),
  movie('outside-in','OUTSIDE IN',{rating:'PG',tagline:'The voices are now an outdoor problem.',description:'A teenager’s emotions escape headquarters and start shouting advice from the front lawn, creating a neighborhood problem of historic proportions.',genres:['Animation','Family','Comedy'],tone:'dream',emoji:'🧠'}),
  movie('mission-mildly-inconvenient','MISSION: MILDLY INCONVENIENT',{top10:6,runtime:'1h 57m',tagline:'This summer, inconvenience has a name.',description:'An elite agent tackles printer jams, wet paint, a slow elevator, and a restaurant reservation that is somehow still not ready.',genres:['Action','Spy','Comedy'],tone:'spy',emoji:'🕶️',progress:.22}),
  movie('slow-and-irritated','SLOW & IRRITATED',{top10:7,runtime:'2h 03m',tagline:'One quarter mile. Eventually.',description:'The world’s most impatient drivers meet their greatest rival: downtown traffic at 5:17 PM.',genres:['Cars','Action','Comedy'],tone:'neon',emoji:'🚗'}),
  movie('toy-lawsuit','TOY LAWSUIT',{rating:'PG',tagline:'To infinity… and arbitration.',description:'The toys come alive, discover labor law, retain counsel, and permanently change the meaning of playtime.',genres:['Family','Courtroom','Comedy'],tone:'toy',emoji:'🧸'}),
  movie('home-with-47-people','HOME WITH 47 PEOPLE',{rating:'PG',tagline:'Personal space has left the building.',description:'A kid thinks the family forgot him, only to discover nearly every relative he has is staying in a different room.',genres:['Holiday','Family','Comedy'],tone:'holiday',emoji:'🏠'}),
  movie('titan-ish','TITAN-ISH',{top10:9,runtime:'2h 26m',tagline:'Almost unsinkable. Probably.',description:'Passengers aboard a wildly confident luxury ship discover that optimism is not, technically, a navigation system.',genres:['Epic','Romance-ish','Comedy'],tone:'ice',emoji:'🚢',progress:.53}),
  movie('finding-memo','FINDING MEMO',{rating:'PG',tagline:'Just keep filing.',description:'A forgetful office fish crosses the ocean to recover the one document everyone insists was definitely sent last Tuesday.',genres:['Adventure','Office Comedy'],tone:'reef',emoji:'🐠'}),
  movie('thawed','THAWED',{rating:'PG',tagline:'Some things should stay frozen.',description:'An icy kingdom gets an unexpected heat wave and discovers nobody budgeted for air conditioning.',genres:['Fantasy','Family','Comedy'],tone:'snow',emoji:'☀️'}),
  movie('jurassic-pork','JURASSIC PORK',{runtime:'1h 51m',tagline:'Life finds a buffet.',description:'Scientists reopen an island attraction featuring enormous prehistoric farm animals. Every safety meeting is immediately ignored.',genres:['Adventure','Creatures','Comedy'],tone:'jungle',emoji:'🐖'}),
  movie('lord-onion-rings','LORD OF THE ONION RINGS',{runtime:'2h 43m',tagline:'One ring to fry them all.',description:'A tiny hero must carry the final onion ring across a dangerous realm before someone eats it on the journey.',genres:['Fantasy','Adventure','Comedy'],tone:'fantasy',emoji:'🧅'}),
  movie('hungry-games','THE HUNGRY GAMES',{runtime:'2h 04m',tagline:'May the snacks be ever in your flavor.',description:'Competitors enter a dramatic arena where the final challenge is surviving until dinner.',genres:['Action','Dystopian-ish','Comedy'],tone:'arena',emoji:'🥨'}),
  movie('whoppenheimer','WHOPPENHEIMER',{rating:'PG-13',runtime:'2h 59m',tagline:'Now I am become lunch.',description:'A brilliant scientist attempts to build the most over-engineered sandwich in history and learns that condiments have consequences.',genres:['Drama-ish','Science','Comedy'],tone:'desert',emoji:'🍔'}),
  movie('john-thick','JOHN THICK',{rating:'PG-13',runtime:'1h 49m',tagline:'Three winter coats. One mission.',description:'A legendary action hero attempts an impossible mission while wearing an unreasonable number of layers.',genres:['Action','Comedy'],tone:'night',emoji:'🧥'}),
  movie('top-bun-maverick','TOP BUN: MAVERICK',{rating:'PG-13',runtime:'2h 07m',tagline:'Feel the knead for speed.',description:'An elite pilot returns to train a new generation while operating a suspiciously successful bakery on the side.',genres:['Action','Aviation','Comedy'],tone:'sky',emoji:'🥯'}),
  movie('iron-mass','IRON MASS',{rating:'PG-13',tagline:'Heavy metal, literally.',description:'A genius inventor creates armor so overbuilt that the first challenge is simply standing up.',genres:['Superhero','Tech','Comedy'],tone:'forge',emoji:'🤖'}),
  movie('pie-rates','PIE-RATES OF THE CARIBBEAN',{runtime:'2h 01m',tagline:'Dead men bake no pies.',description:'A chaotic captain hunts for a legendary pastry while several navies become increasingly confused about the mission.',genres:['Pirates','Adventure','Comedy'],tone:'caribbean',emoji:'🥧'}),
  movie('fatrix','THE FATRIX',{rating:'PG-13',tagline:'There is no spoon. There is, however, dessert.',description:'A hacker discovers reality is a simulation and immediately starts asking deeply inconvenient questions about the cafeteria.',genres:['Sci-Fi','Action','Comedy'],tone:'matrix',emoji:'💊'}),
  movie('gums-2','GUMS 2: DENTAL PLAN',{newRelease:true,tagline:'This time, it has coverage.',description:'The ocean’s least efficient predator returns after a suspiciously successful appointment with a marine dentist.',genres:['Creature Feature','Comedy'],tone:'ocean2',emoji:'🪥'}),
  movie('cars-jars','JARS',{rating:'PG',tagline:'Life is a highway. This is a pantry.',description:'A shelf of competitive jars dreams of racing glory despite several obvious mobility problems.',genres:['Family','Animation','Comedy'],tone:'desert-road',emoji:'🫙'}),
  movie('lion-intern','THE LION INTERN',{rating:'PG',tagline:'The circle of unpaid experience.',description:'A young lion returns home expecting a kingdom and receives an internship badge instead.',genres:['Family','Workplace','Comedy'],tone:'savanna',emoji:'🦁'}),
  movie('gums-vs-jars','GUMS VS. JARS',{rating:'PG-13',tagline:'Nobody asked for this crossover.',description:'A toothless shark and a shelf of racing jars collide in the cinematic event absolutely no focus group predicted.',genres:['Crossover','Action','Comedy'],tone:'crossover',emoji:'💥'}),
  movie('printer-2','MISSION: PRINTER IMPOSSIBLE',{newRelease:true,tagline:'PC LOAD LETTER has gone too far.',description:'The world’s greatest agent has ninety minutes to make the office printer produce one double-sided PDF.',genres:['Spy','Office','Comedy'],tone:'office',emoji:'🖨️'}),
  movie('grocery-potter','HARRY GROCER',{rating:'PG',tagline:'The cart chooses the shopper.',description:'A young wizard discovers a secret supermarket where every aisle is enchanted and the self-checkout knows his name.',genres:['Fantasy','Family','Comedy'],tone:'magic-store',emoji:'🛒'}),
  movie('batman-day-shift','BATMAN: DAY SHIFT',{rating:'PG-13',tagline:'Vengeance, but before dinner.',description:'A famously nocturnal hero gets reassigned to daylight hours and discovers the sun is his greatest enemy.',genres:['Superhero','Comedy'],tone:'day-city',emoji:'🦇'}),
  movie('quiet-place-loud','A VERY LOUD PLACE',{rating:'PG-13',tagline:'Silence was never an option.',description:'A family tries to survive in a world where every appliance has been set to maximum volume.',genres:['Thriller-ish','Comedy'],tone:'farm',emoji:'📢'}),
  movie('napoleon-small-talk','NAPOLEON: SMALL TALK',{rating:'PG-13',tagline:'History’s most awkward conversation.',description:'A military genius faces the one battlefield he cannot master: a crowded networking event.',genres:['History-ish','Comedy'],tone:'ballroom',emoji:'🎖️'}),
  movie('minions-union','MINIONS: THE UNION',{rating:'PG',tagline:'Banana benefits included.',description:'A yellow workforce discovers collective bargaining and immediately schedules a very loud meeting.',genres:['Animation','Family','Comedy'],tone:'yellow-lab',emoji:'🍌'}),
  movie('rocky-road','ROCKY ROAD',{rating:'PG-13',tagline:'Every scoop is a comeback.',description:'An underdog ice-cream maker trains for the championship of an oddly intense frozen-dessert league.',genres:['Sports-ish','Comedy'],tone:'gym',emoji:'🍨'}),
  show('bigger-things','BIGGER THINGS',{newRelease:true,top10:5,match:99,tagline:'The town got stranger. The problems got bigger.',description:'A group of friends discovers a suspicious government project, an impossible doorway, and one episode that absolutely should not exist.',genres:['Sci-Fi','Mystery','Comedy'],tone:'red-storm',emoji:'🚲',seasons:[{number:1,episodes:[episode(1,'The Extremely Normal Basement','48m','A missing bike leads to a basement door that was definitely not there yesterday.',{id:'s1e1',tone:'basement'}),episode(2,'Walkie-Talkie Problems','51m','The group learns that shouting into radios is not the same thing as having a plan.',{id:'s1e2',tone:'radio'}),episode(3,'The Mall Is Probably Fine','54m','Nobody believes the mall is dangerous because the food court is still open.',{id:'s1e3',tone:'mall'}),episode(4,'Conformity Gate','57m','A secret episode appears with no explanation. Everyone involved insists this is completely normal.',{id:'s1e4',tone:'gate',pranks:{pause:'premiumPause',atPercent:{31:'subtitleGlitch',77:'reveal'}}})]},{number:2,episodes:[episode(1,'Previously, Somehow','52m','The story resumes with a recap containing several events nobody remembers happening.',{id:'s2e1'}),episode(2,'The Red Hallway','50m','A hallway becomes suspiciously red and everyone still decides to enter it.',{id:'s2e2'}),episode(3,'The Bike Chase, Again','55m','There are vehicles available. They choose bicycles anyway.',{id:'s2e3'})]}]}),
  show('space-office','SPACE OFFICE',{top10:8,match:96,tagline:'The final frontier has mandatory meetings.',description:'An underfunded crew explores the galaxy while completing expense reports, safety modules, and quarterly performance reviews.',genres:['Sci-Fi','Workplace','Comedy'],tone:'space',emoji:'🚀',seasons:[{number:1,episodes:[episode(1,'Launch Meeting','27m','The crew cannot launch until everyone completes the agenda.',{id:'space1'}),episode(2,'Alien Reply-All','29m','First contact becomes a 4,000-message email chain.',{id:'space2'}),episode(3,'Quarterly Meteor Shower','31m','Finance insists the meteors are outside this quarter’s budget.',{id:'space3'}),episode(4,'Casual Friday on Mars','28m','Nobody agrees on what casual means inside a pressure suit.',{id:'space4'})]}]}),
  show('extremely-mild-files','THE EXTREMELY MILD FILES',{match:93,tagline:'The truth is somewhere nearby.',description:'Two investigators pursue mysteries including missing socks, unexplained refrigerator noises, and a printer that works only when nobody is watching.',genres:['Mystery','Comedy'],tone:'flashlight',emoji:'🔦',seasons:[{number:1,episodes:[episode(1,'The Missing Left Sock','42m','A laundry mystery reaches the highest levels of government.',{id:'mild1'}),episode(2,'The Refrigerator Hum','44m','An appliance makes a noise. The investigation becomes unreasonable.',{id:'mild2'}),episode(3,'Printer at Midnight','45m','The printer behaves normally only after everyone leaves the office.',{id:'mild3'})]}]}),
  show('cooking-with-consequences','COOKING WITH CONSEQUENCES',{rating:'TV-PG',match:91,tagline:'Every recipe has a final boss.',description:'A cooking show where each recipe starts normally and ends with the kitchen requiring an insurance adjuster.',genres:['Reality-ish','Food','Comedy'],tone:'kitchen',emoji:'🍳',seasons:[{number:1,episodes:[episode(1,'Pancake Ceiling','24m','A flip goes higher than expected.',{id:'cook1'}),episode(2,'Soup Volcano','25m','The blender lid was, in fact, important.',{id:'cook2'}),episode(3,'The Croissant Incident','23m','Butter becomes a structural material.',{id:'cook3'}),episode(4,'Finale: Fire Extinguisher','29m','The extinguisher finally receives top billing.',{id:'cook4'})]}]})
];

export const catalogById = new Map(catalog.map((item) => [item.id, item]));
export const getTitle = (id) => catalogById.get(id) ?? null;
export const allEpisodes = catalog.flatMap((item) => item.type === 'show' ? item.seasons.flatMap((season) => season.episodes.map((ep) => ({...ep,showId:item.id,seasonNumber:season.number}))) : []);
export const tones = {
  sunset:['#2a150e','#d96b2b','#432518'],city:['#0a1020','#8b173c','#05070d'],ocean:['#001d2d','#087a91','#001016'],hero:['#210b09','#d53b2e','#0b0304'],dream:['#1d1033','#7a5bb2','#11091a'],spy:['#09090b','#3e3e44','#120b06'],neon:['#10051b','#8a126c','#041926'],toy:['#3a220b','#d48525','#1b0f05'],holiday:['#07281a','#9d2027','#120607'],ice:['#06141f','#6f91aa','#0c1118'],reef:['#03262e','#0ca2bd','#031217'],snow:['#183a60','#86b4d5','#172330'],jungle:['#0d2916','#6e7b2b','#15110a'],fantasy:['#15160b','#7b6330','#0a0c08'],arena:['#30120d','#a33b24','#120705'],desert:['#2a170b','#b66c2f','#0d0906'],night:['#090d16','#24364f','#05070b'],sky:['#14314b','#8fc3e8','#17222c'],forge:['#1b0b08','#be4b1f','#0d0806'],caribbean:['#05282f','#178da1','#241708'],matrix:['#04140a','#117a36','#010704'],ocean2:['#051f2c','#256c7d','#1c3138'],'desert-road':['#37200c','#cc8738','#1a1209'],savanna:['#39280c','#c59434','#2c1606'],crossover:['#240b2d','#ba254e','#062c3a'],office:['#111827','#596579','#090b10'],'magic-store':['#1f1429','#73508d','#160b0e'],'day-city':['#20394e','#8fc0d8','#6b3d2e'],farm:['#171a16','#69715b','#24130f'],ballroom:['#28170f','#a0784e','#120b08'],'yellow-lab':['#423a06','#d7b82a','#171405'],gym:['#211111','#83483e','#0d0909'],'red-storm':['#18070a','#781727','#070408'],basement:['#0c0d0f','#333a40','#050607'],radio:['#101b1a','#496b64','#080d0c'],mall:['#1d1027','#74518e','#0b0710'],gate:['#1a0508','#a61d2f','#050203'],space:['#040817','#212f67','#03040a'],flashlight:['#090c0f','#374857','#050607'],kitchen:['#24150d','#985c2c','#130a06'],midnight:['#07090d','#2b3140','#030407']
};
export const gradientFor = (tone='midnight') => { const [a,b,c] = tones[tone] ?? tones.midnight; return `linear-gradient(135deg, ${a} 0%, ${b} 48%, ${c} 100%)`; };
