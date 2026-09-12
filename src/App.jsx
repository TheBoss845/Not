import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNotflix } from './context/NotflixContext.jsx';
import { useSpatialNavigation } from './hooks/useSpatialNavigation.js';
import LoadingSplash from './components/LoadingSplash.jsx';
import ProfilePicker from './components/ProfilePicker.jsx';
import NavBar from './components/NavBar.jsx';
import BrowsePage from './pages/BrowsePage.jsx';
import TitleModal from './components/TitleModal.jsx';
import Player from './components/Player.jsx';
import SearchOverlay from './components/SearchOverlay.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import PrankModal from './components/PrankModal.jsx';
import HQ from './components/HQ.jsx';
import Toast from './components/Toast.jsx';

export default function App() {
  const { profile, settings } = useNotflix();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [booting, setBooting] = useState(params.get('skipBoot') !== '1');
  const [page, setPage] = useState('Home');
  const [selected, setSelected] = useState(null);
  const [player, setPlayer] = useState(null);
  const [search, setSearch] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hq, setHq] = useState(params.get('mode') === 'hq');

  useSpatialNavigation(!booting);

  const openInfo = useCallback((item) => {
    setSearch(false);
    setSelected(item);
  }, []);

  const openPlayer = useCallback((item, episode = null) => {
    setSelected(null);
    setSearch(false);
    setPlayer({ item, episode });
  }, []);

  const closeTopLayer = useCallback(() => {
    if (hq) return setHq(false);
    if (settingsOpen) return setSettingsOpen(false);
    if (search) return setSearch(false);
    if (selected) return setSelected(null);
    if (player) return setPlayer(null);
  }, [hq, settingsOpen, search, selected, player]);

  useEffect(() => {
    const onBack = () => closeTopLayer();
    const onHotkey = (event) => {
      if (event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        setHq((v) => !v);
      }
      if (event.key === '/' && !search && !player) {
        event.preventDefault();
        setSearch(true);
      }
    };
    const onRemoteNavigate = (event) => {
      const destination = event.detail?.page;
      if (destination) setPage(destination);
    };
    window.addEventListener('notflix:back', onBack);
    window.addEventListener('keydown', onHotkey);
    window.addEventListener('notflix:remote-navigate', onRemoteNavigate);
    return () => {
      window.removeEventListener('notflix:back', onBack);
      window.removeEventListener('keydown', onHotkey);
      window.removeEventListener('notflix:remote-navigate', onRemoteNavigate);
    };
  }, [closeTopLayer, search, player]);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = settings.reduceMotion ? 'true' : 'false';
  }, [settings.reduceMotion]);

  const playNextEpisode = () => {
    if (!player?.episode || player.item.type !== 'show') return;
    const flat = player.item.seasons.flatMap((season) => season.episodes.map((ep) => ({ ...ep, seasonNumber: season.number })));
    const index = flat.findIndex((ep) => ep.id === player.episode.id && ep.seasonNumber === player.episode.seasonNumber);
    const next = flat[index + 1];
    if (next) setPlayer({ item: player.item, episode: next });
  };

  if (booting) return <LoadingSplash onDone={() => setBooting(false)}/>;
  if (!profile && !hq) return <><ProfilePicker/><Toast/></>;
  if (hq) return <><HQ onClose={() => setHq(false)}/><Toast/><PrankModal/></>;

  return (
    <div className="app-shell">
      <NavBar page={page} onNavigate={setPage} onSearch={() => setSearch(true)} onSettings={() => setSettingsOpen(true)} onHQ={() => setHq(true)}/>
      <BrowsePage page={page} onInfo={openInfo} onPlay={openPlayer}/>
      {selected && <TitleModal item={selected} onClose={() => setSelected(null)} onPlay={openPlayer} onOpenTitle={setSelected}/>} 
      {search && <SearchOverlay onClose={() => setSearch(false)} onInfo={openInfo} onPlay={openPlayer}/>} 
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)}/>} 
      {player && <Player item={player.item} episode={player.episode} onClose={() => setPlayer(null)} onNextEpisode={playNextEpisode}/>} 
      <PrankModal/>
      <Toast/>
    </div>
  );
}
