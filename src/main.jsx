import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  Info,
  ListPlus,
  Play,
  Search,
  Settings,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from 'lucide-react';
import './styles.css';

const catalog = [
  {
    id: 'pop',
    title: 'POP',
    kicker: 'A NOTFLIX ORIGINAL',
    tagline: 'Dream big. Maybe not that big.',
    description:
      'A determined widower launches his house with thousands of balloons, only to discover that adventure and structural engineering do not always agree.',
    year: '2026',
    rating: 'PG',
    runtime: '1h 42m',
    match: '98% Match',
    genres: ['Adventure', 'Comedy', 'Catastrophe'],
    tone: 'sunset',
    emoji: '🎈',
    progress: 0.38,
  },
  {
    id: 'no-weigh-home',
    title: 'NO WEIGH HOME',
    kicker: 'NOTFLIX PRESENTS',
    tagline: 'Great power. Questionable meal planning.',
    description:
      'A masked hero faces his strangest multiverse yet, where every heroic landing is followed by a snack break.',
    year: '2026',
    rating: 'PG-13',
    runtime: '2h 18m',
    match: '96% Match',
    genres: ['Superhero', 'Comedy'],
    tone: 'city',
    emoji: '🕷️',
    progress: 0.71,
  },
  {
    id: 'gums',
    title: 'GUMS',
    kicker: 'ONLY ON NOTFLIX',
    tagline: 'The ocean’s least efficient predator.',
    description:
      'A seaside town panics when a giant shark appears, then becomes slightly less concerned after discovering one important dental problem.',
    year: '2026',
    rating: 'PG-13',
    runtime: '1h 31m',
    match: '93% Match',
    genres: ['Comedy', 'Creature Feature'],
    tone: 'ocean',
    emoji: '🦈',
  },
  {
    id: 'mediocres',
    title: 'THE MEDIOCRES',
    kicker: 'A NOTFLIX FAMILY EVENT',
    tagline: 'Saving the world. Adequately.',
    description:
      'A family with aggressively average powers attempts to stop a villain using teamwork, confidence, and surprisingly good public transportation.',
    year: '2026',
    rating: 'PG',
    runtime: '1h 48m',
    match: '91% Match',
    genres: ['Family', 'Comedy', 'Heroes'],
    tone: 'hero',
    emoji: '🦸',
  },
  {
    id: 'outside-in',
    title: 'OUTSIDE IN',
    kicker: 'NOTFLIX ORIGINAL',
    tagline: 'The voices are now an outdoor problem.',
    description:
      'A teenager’s emotions escape headquarters and begin shouting advice from the front lawn. The neighbors are thrilled.',
    year: '2026',
    rating: 'PG',
    runtime: '1h 36m',
    match: '95% Match',
    genres: ['Animation', 'Comedy'],
    tone: 'dream',
    emoji: '🧠',
  },
  {
    id: 'mission-mild',
    title: 'MISSION: MILDLY INCONVENIENT',
    kicker: 'NOTFLIX ACTION',
    tagline: 'This summer, inconvenience has a name.',
    description:
      'An elite agent tackles printer jams, wet paint, slow elevators, and a restaurant reservation that is somehow still not ready.',
    year: '2026',
    rating: 'PG-13',
    runtime: '1h 57m',
    match: '90% Match',
    genres: ['Action', 'Comedy'],
    tone: 'spy',
    emoji: '🕶️',
  },
  {
    id: 'slow-irritated',
    title: 'SLOW & IRRITATED',
    kicker: 'A NOTFLIX SAGA',
    tagline: 'One quarter mile. Eventually.',
    description:
      'The world’s most impatient drivers meet their greatest rival: downtown traffic at 5:17 PM.',
    year: '2026',
    rating: 'PG-13',
    runtime: '2h 03m',
    match: '94% Match',
    genres: ['Cars', 'Comedy'],
    tone: 'neon',
    emoji: '🚗',
  },
  {
    id: 'toy-lawsuit',
    title: 'TOY LAWSUIT',
    kicker: 'NOTFLIX ORIGINAL',
    tagline: 'To infinity… and arbitration.',
    description:
      'The toys come alive, discover labor law, and immediately retain counsel. Playtime will never be the same.',
    year: '2026',
    rating: 'PG',
    runtime: '1h 29m',
    match: '92% Match',
    genres: ['Family', 'Courtroom', 'Comedy'],
    tone: 'toy',
    emoji: '🧸',
  },
  {
    id: 'home-47',
    title: 'HOME WITH 47 PEOPLE',
    kicker: 'A NOTFLIX HOLIDAY MOVIE',
    tagline: 'Personal space has left the building.',
    description:
      'A kid thinks he has the house to himself, then discovers nearly every relative he has is staying in a different room.',
    year: '2026',
    rating: 'PG',
    runtime: '1h 33m',
    match: '89% Match',
    genres: ['Holiday', 'Comedy'],
    tone: 'holiday',
    emoji: '🏠',
  },
  {
    id: 'titan-ish',
    title: 'TITAN-ISH',
    kicker: 'NOTFLIX EPIC',
    tagline: 'Almost unsinkable. Probably.',
    description:
      'Passengers aboard a very confident luxury ship discover that optimism is not, technically, a navigation system.',
    year: '2026',
    rating: 'PG-13',
    runtime: '2h 26m',
    match: '97% Match',
    genres: ['Epic', 'Comedy'],
    tone: 'ice',
    emoji: '🚢',
  },
  {
    id: 'finding-memo',
    title: 'FINDING MEMO',
    kicker: 'NOTFLIX ORIGINAL',
    tagline: 'Just keep filing.',
    description:
      'A forgetful office fish crosses the ocean to recover the one document everyone insists was definitely sent last Tuesday.',
    year: '2026',
    rating: 'PG',
    runtime: '1h 28m',
    match: '88% Match',
    genres: ['Adventure', 'Office Comedy'],
    tone: 'reef',
    emoji: '🐠',
  },
  {
    id: 'thawed',
    title: 'THAWED',
    kicker: 'NOTFLIX ORIGINAL',
    tagline: 'Some things should stay frozen.',
    description:
      'An icy kingdom gets an unexpected heat wave and discovers nobody budgeted for air conditioning.',
    year: '2026',
    rating: 'PG',
    runtime: '1h 41m',
    match: '90% Match',
    genres: ['Fantasy', 'Comedy'],
    tone: 'snow',
    emoji: '☀️',
  },
];

const rows = [
  { title: 'Continue Watching for Levi', ids: ['no-weigh-home', 'pop', 'mission-mild', 'titan-ish'], progress: true },
  { title: 'Trending Now', ids: ['pop', 'gums', 'slow-irritated', 'outside-in', 'toy-lawsuit', 'thawed'] },
  { title: 'Top 10 in the U.S. Today', ids: ['pop', 'no-weigh-home', 'mediocres', 'gums', 'titan-ish', 'outside-in'], rank: true },
  { title: 'Because You Watched POP', ids: ['home-47', 'mission-mild', 'slow-irritated', 'finding-memo', 'gums'] },
  { title: 'Only on NOTFLIX', ids: ['toy-lawsuit', 'outside-in', 'mediocres', 'thawed', 'finding-memo'] },
];

const toneBackgrounds = {
  sunset: 'linear-gradient(135deg,#382419 0%,#d56a2c 46%,#211006 100%)',
  city: 'linear-gradient(135deg,#111827 0%,#7c1739 49%,#080b14 100%)',
  ocean: 'linear-gradient(135deg,#021b2f 0%,#075d73 50%,#001017 100%)',
  hero: 'linear-gradient(135deg,#27100b 0%,#bb2c24 50%,#120506 100%)',
  dream: 'linear-gradient(135deg,#2d1840 0%,#7456a4 50%,#120a1a 100%)',
  spy: 'linear-gradient(135deg,#0b0b0d 0%,#34343a 45%,#130c07 100%)',
  neon: 'linear-gradient(135deg,#10051b 0%,#75115f 48%,#091d2b 100%)',
  toy: 'linear-gradient(135deg,#37220f 0%,#bb7221 50%,#1d1108 100%)',
  holiday: 'linear-gradient(135deg,#0b2f21 0%,#8b1e22 50%,#14080a 100%)',
  ice: 'linear-gradient(135deg,#071520 0%,#54778f 49%,#10141a 100%)',
  reef: 'linear-gradient(135deg,#04242b 0%,#1088a1 48%,#061319 100%)',
  snow: 'linear-gradient(135deg,#163353 0%,#739fc3 50%,#1d2b39 100%)',
};

function findTitle(id) {
  return catalog.find((item) => item.id === id);
}

function Brand() {
  return <div className="brand" aria-label="Notflix">NOTFLIX</div>;
}

function ProfilePicker({ onSelect }) {
  const profiles = [
    { name: 'Levi', face: '😎', bg: 'profile-red' },
    { name: 'Friend', face: '🤨', bg: 'profile-blue' },
    { name: 'Guest', face: '👀', bg: 'profile-gold' },
    { name: 'Kids', face: '🤖', bg: 'profile-green' },
  ];

  return (
    <main className="profile-screen">
      <Brand />
      <section className="profile-box">
        <h1>Who’s watching?</h1>
        <div className="profiles">
          {profiles.map((profile) => (
            <button className="profile-button" key={profile.name} onClick={() => onSelect(profile.name)}>
              <span className={`profile-avatar ${profile.bg}`}>{profile.face}</span>
              <span>{profile.name}</span>
            </button>
          ))}
        </div>
        <button className="manage-button">Manage Profiles</button>
      </section>
    </main>
  );
}

function Hero({ title, onPlay, onInfo }) {
  return (
    <section className="hero" style={{ '--hero-bg': toneBackgrounds[title.tone] }}>
      <div className="hero-noise" />
      <div className="hero-floating-symbol">{title.emoji}</div>
      <div className="hero-content">
        <div className="hero-kicker">{title.kicker}</div>
        <h1>{title.title}</h1>
        <p className="hero-tagline">{title.tagline}</p>
        <p className="hero-description">{title.description}</p>
        <div className="hero-actions">
          <button className="primary-button" onClick={() => onPlay(title)}><Play fill="currentColor" size={24} /> Play</button>
          <button className="secondary-button" onClick={() => onInfo(title)}><Info size={24} /> More Info</button>
        </div>
      </div>
      <div className="hero-rating">{title.rating}</div>
      <div className="hero-fade" />
    </section>
  );
}

function TitleCard({ item, rank, index, progress, onOpen, onPlay }) {
  return (
    <button className={`title-card ${rank ? 'ranked-card' : ''}`} onClick={() => onOpen(item)}>
      {rank && <span className="rank-number">{index + 1}</span>}
      <div className="card-art" style={{ background: toneBackgrounds[item.tone] }}>
        <span className="card-emoji">{item.emoji}</span>
        <div className="card-shade" />
        <div className="card-title">{item.title}</div>
      </div>
      <div className="card-expanded">
        <div className="card-buttons">
          <button aria-label={`Play ${item.title}`} onClick={(event) => { event.stopPropagation(); onPlay(item); }}><Play size={18} fill="currentColor" /></button>
          <button aria-label={`Add ${item.title} to My List`}><ListPlus size={18} /></button>
          <button className="card-more" aria-label={`More information about ${item.title}`}><ChevronDown size={18} /></button>
        </div>
        <div className="card-meta"><span>{item.match}</span><b>{item.rating}</b><span>{item.runtime}</span></div>
        <div className="card-genres">{item.genres.slice(0, 3).join(' • ')}</div>
      </div>
      {progress && <div className="watch-progress"><span style={{ width: `${(item.progress || 0.22) * 100}%` }} /></div>}
    </button>
  );
}

function ContentRow({ row, onOpen, onPlay }) {
  const railRef = useRef(null);
  const scroll = (direction) => railRef.current?.scrollBy({ left: direction * Math.min(window.innerWidth * 0.75, 900), behavior: 'smooth' });

  return (
    <section className="content-row">
      <h2>{row.title}<ChevronRight size={20} /></h2>
      <div className="rail-wrap">
        <button className="rail-arrow left" onClick={() => scroll(-1)} aria-label="Scroll left"><ChevronLeft /></button>
        <div className={`card-rail ${row.rank ? 'rank-rail' : ''}`} ref={railRef}>
          {row.ids.map((id, index) => (
            <TitleCard key={id} item={findTitle(id)} rank={row.rank} index={index} progress={row.progress} onOpen={onOpen} onPlay={onPlay} />
          ))}
        </div>
        <button className="rail-arrow right" onClick={() => scroll(1)} aria-label="Scroll right"><ChevronRight /></button>
      </div>
    </section>
  );
}

function DetailModal({ item, onClose, onPlay }) {
  if (!item) return null;
  return (
    <div className="overlay" onMouseDown={onClose}>
      <section className="detail-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="round-close" onClick={onClose}><X /></button>
        <div className="detail-hero" style={{ background: toneBackgrounds[item.tone] }}>
          <span className="detail-emoji">{item.emoji}</span>
          <div className="detail-gradient" />
          <div className="detail-title-wrap">
            <div className="detail-kicker">{item.kicker}</div>
            <h2>{item.title}</h2>
            <button className="primary-button" onClick={() => onPlay(item)}><Play size={20} fill="currentColor" /> Play</button>
          </div>
        </div>
        <div className="detail-body">
          <div>
            <div className="detail-meta"><span>{item.match}</span><span>{item.year}</span><b>{item.rating}</b><span>{item.runtime}</span><span className="hd-badge">HD</span></div>
            <p>{item.description}</p>
          </div>
          <aside>
            <p><span>Genres:</span> {item.genres.join(', ')}</p>
            <p><span>This show is:</span> Absurd, polished, suspiciously expensive</p>
          </aside>
        </div>
        <section className="episodes-block">
          <div className="episodes-header"><h3>More Like This</h3><span>Season 1</span></div>
          <div className="mini-grid">
            {catalog.filter((x) => x.id !== item.id).slice(0, 3).map((x) => (
              <button key={x.id} className="mini-card" onClick={() => onPlay(x)}>
                <div style={{ background: toneBackgrounds[x.tone] }}>{x.emoji}</div>
                <strong>{x.title}</strong>
                <p>{x.description.slice(0, 94)}…</p>
              </button>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function PremiumPause({ onContinue }) {
  return (
    <div className="pause-paywall">
      <div className="pause-dialog">
        <div className="pause-mark">N</div>
        <h2>Pausing is a Premium Feature</h2>
        <p>Add <b>NOTFLIX Pause</b> for <b>$2.99/month</b> — first month free.</p>
        <button className="trial-button">Start Free Trial</button>
        <button className="continue-button" onClick={onContinue}>Continue Watching</button>
      </div>
    </div>
  );
}

function Player({ item, onClose }) {
  const [playing, setPlaying] = useState(true);
  const [elapsed, setElapsed] = useState(34);
  const [showPausePrank, setShowPausePrank] = useState(false);
  const prankTriggered = useRef(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setElapsed((x) => (x + 1) % 183), 1000);
    return () => window.clearInterval(timer);
  }, [playing]);

  const togglePlay = () => {
    if (playing && !prankTriggered.current) {
      prankTriggered.current = true;
      setPlaying(false);
      setShowPausePrank(true);
      return;
    }
    setPlaying((value) => !value);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        togglePlay();
      }
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') setElapsed((x) => Math.max(0, x - 10));
      if (event.key === 'ArrowRight') setElapsed((x) => Math.min(183, x + 10));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="player-screen" style={{ background: toneBackgrounds[item.tone] }}>
      <div className="player-scene-symbol">{item.emoji}</div>
      <div className="player-vignette" />
      <div className="player-top"><button onClick={onClose}><ChevronLeft size={32} /></button><span>{item.title}</span></div>
      <div className="player-center-copy">
        <div className="cinema-kicker">NOW PLAYING</div>
        <h1>{item.title}</h1>
        <p>{item.tagline}</p>
      </div>
      <div className="player-controls">
        <div className="scrubber"><span style={{ width: `${(elapsed / 183) * 100}%` }} /><i style={{ left: `${(elapsed / 183) * 100}%` }} /></div>
        <div className="control-row">
          <div>
            <button onClick={togglePlay}>{playing ? '❚❚' : <Play fill="currentColor" />}</button>
            <button onClick={() => setElapsed((x) => Math.max(0, x - 10))}><SkipBack /></button>
            <button onClick={() => setElapsed((x) => Math.min(183, x + 10))}><SkipForward /></button>
            <button><Volume2 /></button>
            <span className="player-time">{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')} / 3:03</span>
          </div>
          <strong>{item.title}</strong>
          <div><button>▣</button><button>⛶</button></div>
        </div>
      </div>
      {showPausePrank && <PremiumPause onContinue={() => { setShowPausePrank(false); setPlaying(true); }} />}
    </div>
  );
}

function SearchOverlay({ onClose, onOpen }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => catalog.filter((x) => `${x.title} ${x.genres.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="search-page">
      <header><Brand /><button onClick={onClose}><X /></button></header>
      <div className="search-input-wrap"><Search /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Titles, people, genres" /></div>
      <h2>{query ? `Search results for “${query}”` : 'Explore NOTFLIX'}</h2>
      <div className="search-grid">
        {results.map((item) => (
          <button key={item.id} className="search-result" onClick={() => onOpen(item)} style={{ background: toneBackgrounds[item.tone] }}>
            <span>{item.emoji}</span><strong>{item.title}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

function PrankPanel({ onClose, onTrigger }) {
  const actions = [
    ['Premium Pause', 'pause'],
    ['Fake Buffering', 'buffer'],
    ['Weird Recommendation', 'recommend'],
    ['Inject Episode', 'episode'],
    ['Change Subtitles', 'subtitle'],
    ['Trigger Reveal', 'reveal'],
  ];
  return (
    <aside className="prank-panel">
      <div className="prank-panel-head"><div><small>CONTROL ROOM</small><h2>NOTFLIX HQ</h2></div><button onClick={onClose}><X /></button></div>
      <div className="status-card"><span className="live-dot" /> Living Room TV <b>ONLINE</b></div>
      <div className="now-card"><small>NOW WATCHING</small><strong>POP</strong><span>00:34 / 03:03</span></div>
      <h3>Prank Triggers</h3>
      <div className="prank-actions">
        {actions.map(([label, key]) => <button key={key} onClick={() => onTrigger(label)}>{label}<ChevronRight size={18} /></button>)}
      </div>
      <div className="next-trigger"><small>NEXT AUTOMATION</small><b>Pause → Premium Pause</b></div>
    </aside>
  );
}

function App() {
  const [profile, setProfile] = useState(null);
  const [detail, setDetail] = useState(null);
  const [player, setPlayer] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [prankOpen, setPrankOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [navSolid, setNavSolid] = useState(false);

  useEffect(() => {
    const scroll = () => setNavSolid(window.scrollY > 40);
    window.addEventListener('scroll', scroll);
    return () => window.removeEventListener('scroll', scroll);
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 'p') setPrankOpen((v) => !v);
      if (event.key === 'Escape') {
        setDetail(null);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const triggerToast = (label) => {
    setToast(`${label} armed`);
    setTimeout(() => setToast(''), 2200);
  };

  if (!profile) return <ProfilePicker onSelect={setProfile} />;
  if (player) return <Player item={player} onClose={() => setPlayer(null)} />;

  return (
    <div className="app-shell">
      <header className={`top-nav ${navSolid ? 'solid' : ''}`}>
        <Brand />
        <nav className="nav-links"><button className="active"><Home size={16} /> Home</button><button>TV Shows</button><button>Movies</button><button>New & Popular</button><button>My List</button></nav>
        <div className="nav-right">
          <button onClick={() => setSearchOpen(true)}><Search /></button>
          <span className="kids-label">KIDS</span>
          <button><Bell /></button>
          <button className="profile-chip"><span>😎</span><ChevronDown size={15} /></button>
          <button className="settings-secret" onClick={() => setPrankOpen(true)}><Settings size={18} /></button>
        </div>
      </header>

      <Hero title={catalog[0]} onPlay={setPlayer} onInfo={setDetail} />
      <main className="rows-wrap">
        {rows.map((row) => <ContentRow key={row.title} row={row} onOpen={setDetail} onPlay={setPlayer} />)}
      </main>
      <footer className="footer"><Brand /><p>NOTFLIX is a parody streaming experience built for original comedy content.</p><span>© 2026 NOTFLIX</span></footer>

      {detail && <DetailModal item={detail} onClose={() => setDetail(null)} onPlay={(item) => { setDetail(null); setPlayer(item); }} />}
      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} onOpen={(item) => { setSearchOpen(false); setDetail(item); }} />}
      {prankOpen && <PrankPanel onClose={() => setPrankOpen(false)} onTrigger={triggerToast} />}
      {toast && <div className="toast">✓ {toast}</div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
