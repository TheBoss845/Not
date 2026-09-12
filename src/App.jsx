import React,{useCallback,useEffect,useMemo,useState} from 'react';
import {useNotflix} from './context/NotflixContext.jsx';
import {useSpatialNavigation} from './hooks/useSpatialNavigation.js';
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
import NetworkBanner from './components/NetworkBanner.jsx';

export default function App(){
  const{profile,settings,catalog}=useNotflix();
  const params=useMemo(()=>new URLSearchParams(window.location.search),[]);
  const[booting,setBooting]=useState(params.get('skipBoot')!=='1');
  const[page,setPage]=useState(params.get('page')||'Home');
  const[selected,setSelected]=useState(()=>catalog.find((x)=>x.id===params.get('title'))||null);
  const[player,setPlayer]=useState(null);
  const[search,setSearch]=useState(false);
  const[settingsOpen,setSettingsOpen]=useState(false);
  const[hq,setHq]=useState(params.get('mode')==='hq');
  useSpatialNavigation(!booting);

  const syncUrl=useCallback((updates={})=>{const url=new URL(window.location.href);for(const[key,value]of Object.entries(updates)){if(value===null||value===undefined||value==='')url.searchParams.delete(key);else url.searchParams.set(key,String(value));}history.replaceState({},'',url);},[]);
  const navigate=useCallback((next)=>{setPage(next);syncUrl({page:next==='Home'?null:next});window.scrollTo({top:0,behavior:settings.reduceMotion?'auto':'smooth'});},[settings.reduceMotion,syncUrl]);
  const openInfo=useCallback((item)=>{setSearch(false);setSelected(item);syncUrl({title:item.id});},[syncUrl]);
  const openPlayer=useCallback((item,episode=null,options={})=>{const returnToDetails=selected?.id===item.id;setSelected(null);setSearch(false);setPlayer({item,episode,returnToDetails,...options});syncUrl({title:null});},[selected,syncUrl]);
  const closePlayer=useCallback(()=>{const current=player;setPlayer(null);if(current?.returnToDetails){setSelected(current.item);syncUrl({title:current.item.id});}},[player,syncUrl]);
  const closeTopLayer=useCallback(()=>{if(hq){setHq(false);syncUrl({mode:null});return;}if(settingsOpen)return setSettingsOpen(false);if(search)return setSearch(false);if(selected){setSelected(null);syncUrl({title:null});return;}if(player)return closePlayer();},[hq,settingsOpen,search,selected,player,closePlayer,syncUrl]);

  useEffect(()=>{const onBack=()=>closeTopLayer();const onHotkey=(event)=>{if(event.shiftKey&&event.key.toLowerCase()==='p'){event.preventDefault();setHq((value)=>{const next=!value;syncUrl({mode:next?'hq':null});return next;});}if(event.key==='/'&&!search&&!player){event.preventDefault();setSearch(true);}};const onRemoteNavigate=(event)=>{const destination=event.detail?.page;if(destination)navigate(destination);};window.addEventListener('notflix:back',onBack);window.addEventListener('keydown',onHotkey);window.addEventListener('notflix:remote-navigate',onRemoteNavigate);return()=>{window.removeEventListener('notflix:back',onBack);window.removeEventListener('keydown',onHotkey);window.removeEventListener('notflix:remote-navigate',onRemoteNavigate);};},[closeTopLayer,search,player,navigate,syncUrl]);
  useEffect(()=>{document.documentElement.dataset.reduceMotion=settings.reduceMotion?'true':'false';},[settings.reduceMotion]);
  const playNextEpisode=()=>{if(!player?.episode||player.item.type!=='show')return;const flat=player.item.seasons.flatMap((season)=>season.episodes.map((ep)=>({...ep,seasonNumber:season.number})));const index=flat.findIndex((ep)=>ep.id===player.episode.id&&ep.seasonNumber===player.episode.seasonNumber);const next=flat[index+1];if(next)setPlayer((prev)=>({...prev,episode:next,returnToDetails:false}));};

  if(booting)return <LoadingSplash onDone={()=>setBooting(false)}/>;
  if(!profile&&!hq)return <><ProfilePicker/><Toast/><NetworkBanner/></>;
  if(hq)return <><HQ onClose={()=>{setHq(false);syncUrl({mode:null});}}/><Toast/><PrankModal/><NetworkBanner/></>;
  return <div className="app-shell"><NavBar page={page} onNavigate={navigate} onSearch={()=>setSearch(true)} onSettings={()=>setSettingsOpen(true)} onHQ={()=>{setHq(true);syncUrl({mode:'hq'});}}/><BrowsePage page={page} onInfo={openInfo} onPlay={openPlayer}/>{selected&&<TitleModal item={selected} onClose={()=>{setSelected(null);syncUrl({title:null});}} onPlay={openPlayer} onOpenTitle={openInfo}/>} {search&&<SearchOverlay onClose={()=>setSearch(false)} onInfo={openInfo} onPlay={openPlayer}/>} {settingsOpen&&<SettingsPanel onClose={()=>setSettingsOpen(false)}/>} {player&&<Player item={player.item} episode={player.episode} trailer={player.trailer} onClose={closePlayer} onNextEpisode={playNextEpisode}/>}<PrankModal/><Toast/><NetworkBanner/></div>;
}
