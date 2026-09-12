import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {catalog as baseCatalog,getTitle} from '../data/catalog.js';
import {defaultProfiles} from '../data/profiles.js';
import {loadJSON,saveJSON} from '../lib/storage.js';
import {controlBus} from '../lib/controlBus.js';
import {PRANKS} from '../lib/prankEngine.js';
import {makeCustomTitle} from '../lib/titleFactory.js';

const NotflixContext=createContext(null);
const defaultSettings={autoplayPreviews:true,autoplayNext:true,subtitles:true,subtitleSize:'medium',reduceMotion:false,soundEffects:true,maturity:'all',defaultPlaybackRate:1};

export function NotflixProvider({children}){
  const[profiles,setProfiles]=useState(()=>loadJSON('profiles',defaultProfiles));
  const[profileId,setProfileId]=useState(()=>loadJSON('activeProfile',null));
  const[settings,setSettings]=useState(()=>loadJSON('settings',defaultSettings));
  const[myList,setMyList]=useState(()=>loadJSON('myList',['pop','gums','bigger-things']));
  const[progress,setProgress]=useState(()=>loadJSON('progress',{'pop':.38,'no-weigh-home':.71,'mission-mildly-inconvenient':.22,'titan-ish':.53}));
  const[history,setHistory]=useState(()=>loadJSON('history',[]));
  const[notifications,setNotifications]=useState(()=>loadJSON('notifications',[{id:'n1',title:'New episode',body:'BIGGER THINGS has an episode nobody remembers ordering.',read:false,at:Date.now()-3600000},{id:'n2',title:'Because apparently',body:'GUMS 2: DENTAL PLAN is now streaming.',read:false,at:Date.now()-7200000}]));
  const[prank,setPrank]=useState(null);
  const[toast,setToast]=useState(null);
  const[remoteState,setRemoteState]=useState({connected:false,lastCommand:null});
  const[viewerTelemetry,setViewerTelemetry]=useState(null);
  const[injected,setInjected]=useState(()=>loadJSON('injected',[]));
  const[customTitles,setCustomTitles]=useState(()=>loadJSON('customTitles',[]));
  const[ruleOverrides,setRuleOverrides]=useState(()=>loadJSON('ruleOverrides',{}));
  const[ratings,setRatings]=useState(()=>loadJSON('ratings',{}));
  const[sessionEvents,setSessionEvents]=useState(()=>loadJSON('sessionEvents',[]));
  const profile=profiles.find((p)=>p.id===profileId)??null;

  useEffect(()=>saveJSON('profiles',profiles),[profiles]);
  useEffect(()=>saveJSON('activeProfile',profileId),[profileId]);
  useEffect(()=>saveJSON('settings',settings),[settings]);
  useEffect(()=>saveJSON('myList',myList),[myList]);
  useEffect(()=>saveJSON('progress',progress),[progress]);
  useEffect(()=>saveJSON('history',history.slice(0,100)),[history]);
  useEffect(()=>saveJSON('notifications',notifications),[notifications]);
  useEffect(()=>saveJSON('injected',injected),[injected]);
  useEffect(()=>saveJSON('customTitles',customTitles),[customTitles]);
  useEffect(()=>saveJSON('ruleOverrides',ruleOverrides),[ruleOverrides]);
  useEffect(()=>saveJSON('ratings',ratings),[ratings]);
  useEffect(()=>saveJSON('sessionEvents',sessionEvents.slice(0,80)),[sessionEvents]);

  const recordEvent=useCallback((label,detail={})=>setSessionEvents((prev)=>[{id:`evt-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,at:Date.now(),label,...detail},...prev].slice(0,80)),[]);
  const notify=useCallback((message)=>{setToast({id:Date.now(),message});setTimeout(()=>setToast(null),2600);},[]);
  const findTitle=useCallback((id)=>customTitles.find((x)=>x.id===id)??getTitle(id),[customTitles]);
  const toggleMyList=useCallback((id)=>setMyList((prev)=>{const exists=prev.includes(id);notify(exists?'Removed from My List':'Added to My List');recordEvent(exists?'Removed from My List':'Added to My List',{titleId:id});return exists?prev.filter((x)=>x!==id):[...prev,id];}),[notify,recordEvent]);
  const saveProgress=useCallback((id,value,meta={})=>{const clamped=Math.max(0,Math.min(1,Number(value)||0));setProgress((prev)=>({...prev,[id]:clamped,...(meta.playbackKey?{[meta.playbackKey]:clamped}:{})}));setHistory((prev)=>[{id,progress:clamped,at:Date.now(),...meta},...prev.filter((x)=>!(x.id===id&&x.episodeId===meta.episodeId))].slice(0,100));},[]);
  const triggerPrank=useCallback((id,overrides={})=>{const base=PRANKS[id]??{title:'NOTFLIX Notice',body:'Something suspicious happened.',primary:'Continue',secondary:'Continue',kind:'notice'};setPrank({id,...base,...overrides});recordEvent(`Prank: ${base.title}`,{prankId:id});},[recordEvent]);
  const injectTitle=useCallback((id)=>{const title=findTitle(id);if(!title)return;setInjected((prev)=>prev.includes(id)?prev:[id,...prev]);notify(`${title.title} was injected into the TV catalog`);recordEvent(`Injected ${title.title}`,{titleId:id});},[findTitle,notify,recordEvent]);
  const createCustomTitle=useCallback((input)=>{const item=makeCustomTitle(input);setCustomTitles((prev)=>[item,...prev.filter((x)=>x.id!==item.id)]);return item;},[]);
  const removeCustomTitle=useCallback((id)=>{setCustomTitles((prev)=>prev.filter((x)=>x.id!==id));setInjected((prev)=>prev.filter((x)=>x!==id));setMyList((prev)=>prev.filter((x)=>x!==id));},[]);
  const saveRuleOverride=useCallback((id,rules)=>setRuleOverrides((prev)=>({...prev,[id]:rules})),[]);
  const clearRuleOverride=useCallback((id)=>setRuleOverrides((prev)=>{const next={...prev};delete next[id];return next;}),[]);
  const rateTitle=useCallback((id,value)=>setRatings((prev)=>({...prev,[id]:value})),[]);
  const resetViewingData=useCallback(()=>{setProgress({});setHistory([]);setMyList([]);setRatings({});notify('Viewing data reset');recordEvent('Viewing data reset');},[notify,recordEvent]);

  useEffect(()=>controlBus.subscribe((message)=>{if(!message?.type)return;setRemoteState({connected:true,lastCommand:message});if(message.type==='telemetry')setViewerTelemetry({...message.payload,receivedAt:Date.now()});if(message.type==='prank')triggerPrank(message.payload?.id??'fakeError',message.payload?.overrides);if(message.type==='inject-title')injectTitle(message.payload?.id);if(message.type==='toast')notify(message.payload?.message??'Remote command received');if(message.type==='navigate')window.dispatchEvent(new CustomEvent('notflix:remote-navigate',{detail:message.payload}));if(message.type==='player')window.dispatchEvent(new CustomEvent('notflix:remote-player',{detail:message.payload}));}),[injectTitle,notify,triggerPrank]);

  const effectiveCatalog=useMemo(()=>[...customTitles,...baseCatalog].map((item)=>ruleOverrides[item.id]?{...item,pranks:{...(item.pranks||{}),...ruleOverrides[item.id]}}:item),[customTitles,ruleOverrides]);
  const visibleCatalog=useMemo(()=>{const map=new Map(effectiveCatalog.map((x)=>[x.id,x]));const injectedItems=injected.map((id)=>map.get(id)).filter(Boolean);return[...injectedItems,...effectiveCatalog.filter((item)=>!injected.includes(item.id))];},[effectiveCatalog,injected]);
  const value={catalog:visibleCatalog,baseCatalog,customTitles,createCustomTitle,removeCustomTitle,profiles,setProfiles,profile,profileId,selectProfile:setProfileId,signOutProfile:()=>setProfileId(null),settings,setSettings,myList,toggleMyList,progress,saveProgress,history,notifications,markNotificationRead:(id)=>setNotifications((prev)=>prev.map((n)=>n.id===id?{...n,read:true}:n)),clearNotifications:()=>setNotifications([]),prank,triggerPrank,closePrank:()=>setPrank(null),toast,notify,remoteState,viewerTelemetry,injected,injectTitle,ruleOverrides,saveRuleOverride,clearRuleOverride,ratings,rateTitle,sessionEvents,recordEvent,resetViewingData};
  return <NotflixContext.Provider value={value}>{children}</NotflixContext.Provider>;
}

export function useNotflix(){const value=useContext(NotflixContext);if(!value)throw new Error('useNotflix must be used inside NotflixProvider');return value;}
