import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {catalog as baseCatalog,getTitle} from '../data/catalog.js';
import {defaultProfiles} from '../data/profiles.js';
import {loadJSON,saveJSON} from '../lib/storage.js';
import {controlBus} from '../lib/controlBus.js';
import {PRANKS} from '../lib/prankEngine.js';
import {makeCustomTitle} from '../lib/titleFactory.js';

const NotflixContext=createContext(null);
const defaultSettings={autoplayPreviews:true,autoplayNext:true,subtitles:true,subtitleSize:'medium',reduceMotion:false,soundEffects:true,maturity:'all',defaultPlaybackRate:1};
const starterProgress={'pop':.38,'no-weigh-home':.71,'mission-mildly-inconvenient':.22,'titan-ish':.53};
const starterLists={levi:['pop','gums','bigger-things'],friend:['pop'],guest:['gums'],kids:['pop','outside-in']};
const defaultPrankState={recommendationRow:null,ghostProgress:{},matchMode:null,fakePlan:null,customSubtitle:null,qualityMode:null,serviceNotice:null,stillWatching:false,lastEffect:null};
const newProfileData=(id)=>({myList:starterLists[id]??[],progress:id==='levi'?starterProgress:{},history:[],ratings:{}});
const ratingRank={'G':0,'TV-Y':0,'TV-Y7':0,'TV-G':0,'PG':1,'TV-PG':1,'PG-13':2,'TV-14':2,'R':3,'TV-MA':3,'NC-17':4};
const maturityLimit={pg:1,pg13:2,all:99};
const allowedForProfile=(item,profile)=>!profile||profile.maturity==='all'||(ratingRank[item.rating]??2)<=(maturityLimit[profile.maturity]??99);

function loadProfileData(){const saved=loadJSON('profileData',null);if(saved&&typeof saved==='object')return saved;const active=loadJSON('activeProfile',null);if(!active)return{};return{[active]:{myList:loadJSON('myList',starterLists[active]??[]),progress:loadJSON('progress',active==='levi'?starterProgress:{}),history:loadJSON('history',[]),ratings:loadJSON('ratings',{})}};}
function mergeContent(item,override){if(!override)return item;return{...item,...override,media:{...(item.media||{}),...(override.media||{})},pranks:{...(item.pranks||{}),...(override.pranks||{})}};}
function fakeMatchFor(item,mode){if(mode!=='impossible')return item.match;const seed=[...(item.id||item.title||'')].reduce((n,ch)=>(n*33+ch.charCodeAt(0))>>>0,7);return 101+(seed%38);}

export function NotflixProvider({children}){
  const[profiles,setProfiles]=useState(()=>loadJSON('profiles',defaultProfiles));const[profileId,setProfileId]=useState(()=>loadJSON('activeProfile',null));const[settings,setSettings]=useState(()=>loadJSON('settings',defaultSettings));const[profileData,setProfileData]=useState(loadProfileData);
  const[notifications,setNotifications]=useState(()=>loadJSON('notifications',[{id:'n1',title:'New episode',body:'BIGGER THINGS has an episode nobody remembers ordering.',read:false,at:Date.now()-3600000},{id:'n2',title:'Because apparently',body:'GUMS 2: DENTAL PLAN is now streaming.',read:false,at:Date.now()-7200000}]));
  const[prank,setPrank]=useState(null);const[prankState,setPrankState]=useState(()=>loadJSON('prankState',defaultPrankState));const[toast,setToast]=useState(null);const[remoteState,setRemoteState]=useState({connected:false,lastCommand:null});const[viewerTelemetry,setViewerTelemetry]=useState(null);const[injected,setInjected]=useState(()=>loadJSON('injected',[]));const[customTitles,setCustomTitles]=useState(()=>loadJSON('customTitles',[]));const[contentOverrides,setContentOverrides]=useState(()=>loadJSON('contentOverrides',{}));const[ruleOverrides,setRuleOverrides]=useState(()=>loadJSON('ruleOverrides',{}));const[sessionEvents,setSessionEvents]=useState(()=>loadJSON('sessionEvents',[]));
  const isHQController=useMemo(()=>new URLSearchParams(window.location.search).get('mode')==='hq',[]);
  const profile=profiles.find((p)=>p.id===profileId)??null;const activeData=profileId?(profileData[profileId]??newProfileData(profileId)):newProfileData('anonymous');const myList=activeData.myList??[];const progress=activeData.progress??{};const history=activeData.history??[];const ratings=activeData.ratings??{};

  useEffect(()=>saveJSON('profiles',profiles),[profiles]);useEffect(()=>saveJSON('activeProfile',profileId),[profileId]);useEffect(()=>saveJSON('settings',settings),[settings]);useEffect(()=>saveJSON('profileData',profileData),[profileData]);useEffect(()=>saveJSON('notifications',notifications),[notifications]);useEffect(()=>saveJSON('injected',injected),[injected]);useEffect(()=>saveJSON('customTitles',customTitles),[customTitles]);useEffect(()=>saveJSON('contentOverrides',contentOverrides),[contentOverrides]);useEffect(()=>saveJSON('ruleOverrides',ruleOverrides),[ruleOverrides]);useEffect(()=>saveJSON('sessionEvents',sessionEvents.slice(0,80)),[sessionEvents]);useEffect(()=>saveJSON('prankState',prankState),[prankState]);

  const patchProfile=useCallback((updater)=>{if(!profileId)return;setProfileData((prev)=>{const current=prev[profileId]??newProfileData(profileId);const next=typeof updater==='function'?updater(current):{...current,...updater};return{...prev,[profileId]:next};});},[profileId]);
  const recordEvent=useCallback((label,detail={})=>setSessionEvents((prev)=>[{id:`evt-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,at:Date.now(),profileId,label,...detail},...prev].slice(0,80)),[profileId]);
  const notify=useCallback((message)=>{setToast({id:Date.now(),message});setTimeout(()=>setToast(null),2600);},[]);
  const findTitle=useCallback((id)=>{const raw=customTitles.find((x)=>x.id===id)??getTitle(id);return raw?mergeContent(raw,contentOverrides[id]):null;},[customTitles,contentOverrides]);
  const toggleMyList=useCallback((id)=>{const exists=myList.includes(id);patchProfile((data)=>({...data,myList:exists?data.myList.filter((x)=>x!==id):[...data.myList,id]}));notify(exists?'Removed from My List':'Added to My List');recordEvent(exists?'Removed from My List':'Added to My List',{titleId:id});},[myList,patchProfile,notify,recordEvent]);
  const saveProgress=useCallback((id,value,meta={})=>{const clamped=Math.max(0,Math.min(1,Number(value)||0));patchProfile((data)=>{const nextProgress={...(data.progress??{}),[id]:clamped,...(meta.playbackKey?{[meta.playbackKey]:clamped}:{})};const nextHistory=[{id,progress:clamped,at:Date.now(),...meta},...(data.history??[]).filter((x)=>!(x.id===id&&x.episodeId===meta.episodeId))].slice(0,100);return{...data,progress:nextProgress,history:nextHistory};});},[patchProfile]);
  const injectTitle=useCallback((id)=>{const title=findTitle(id);if(!title)return;setInjected((prev)=>prev.includes(id)?prev:[id,...prev]);notify(`${title.title} was injected into the TV catalog`);recordEvent(`Injected ${title.title}`,{titleId:id});},[findTitle,notify,recordEvent]);
  const createCustomTitle=useCallback((input)=>{const item=makeCustomTitle(input);setCustomTitles((prev)=>[item,...prev.filter((x)=>x.id!==item.id)]);controlBus.send('catalog-upsert',{item});return item;},[]);
  const removeCustomTitle=useCallback((id)=>{setCustomTitles((prev)=>prev.filter((x)=>x.id!==id));setInjected((prev)=>prev.filter((x)=>x!==id));setContentOverrides((prev)=>{const next={...prev};delete next[id];return next;});setProfileData((prev)=>Object.fromEntries(Object.entries(prev).map(([key,data])=>[key,{...data,myList:(data.myList??[]).filter((x)=>x!==id)}])));controlBus.send('catalog-remove',{id});},[]);
  const updateTitleContent=useCallback((id,patch)=>{setContentOverrides((prev)=>{const current=prev[id]??{};const mediaPatch=patch.media?{media:{...(current.media||{}),...patch.media}}:{};return{...prev,[id]:{...current,...patch,...mediaPatch}};});controlBus.send('content-override',{id,patch});recordEvent('Updated title media',{titleId:id});},[recordEvent]);
  const clearTitleContent=useCallback((id)=>{setContentOverrides((prev)=>{const next={...prev};delete next[id];return next;});controlBus.send('content-clear',{id});},[]);
  const saveRuleOverride=useCallback((id,rules)=>{setRuleOverrides((prev)=>({...prev,[id]:rules}));controlBus.send('rule-override',{id,rules});},[]);
  const clearRuleOverride=useCallback((id)=>{setRuleOverrides((prev)=>{const next={...prev};delete next[id];return next;});controlBus.send('rule-clear',{id});},[]);
  const rateTitle=useCallback((id,value)=>patchProfile((data)=>({...data,ratings:{...(data.ratings??{}),[id]:value}})),[patchProfile]);const resetViewingData=useCallback(()=>{patchProfile((data)=>({...data,progress:{},history:[],myList:[],ratings:{}}));notify('Viewing data reset for this profile');recordEvent('Viewing data reset');},[patchProfile,notify,recordEvent]);

  const clearPrankEffect=useCallback((key)=>setPrankState((prev)=>({...prev,[key]:defaultPrankState[key]??null})),[]);
  const resetPrankEffects=useCallback(()=>{setPrankState(defaultPrankState);setPrank(null);window.dispatchEvent(new CustomEvent('notflix:prank-player',{detail:{action:'reset-pranks'}}));notify('All prank effects reset');recordEvent('Prank effects reset');},[notify,recordEvent]);

  const triggerPrank=useCallback((id,overrides={})=>{
    const base=PRANKS[id]??{title:'NOTFLIX Notice',body:'Something suspicious happened.',primary:'Continue',secondary:'Continue',kind:'notice'};
    const resolved={id,...base,...overrides,payload:{...(base.payload||{}),...(overrides.payload||{})}};
    const payload=resolved.payload||{};
    if(resolved.effect==='recommendation-injection')setPrankState((prev)=>({...prev,recommendationRow:{title:payload.title||'Recommended With Suspicious Confidence',ids:payload.ids||[]},lastEffect:id}));
    if(resolved.effect==='history-ghost')setPrankState((prev)=>({...prev,ghostProgress:{...prev.ghostProgress,...(payload.items||{})},lastEffect:id}));
    if(resolved.effect==='match-override')setPrankState((prev)=>({...prev,matchMode:payload.mode||'impossible',lastEffect:id}));
    if(resolved.effect==='subscription-tier')setPrankState((prev)=>({...prev,fakePlan:payload.plan||'ULTRA PREMIUM BASIC',lastEffect:id}));
    if(resolved.effect==='subtitle-message')setPrankState((prev)=>({...prev,customSubtitle:payload.message||resolved.body,lastEffect:id}));
    if(resolved.effect==='quality-drop')setPrankState((prev)=>({...prev,qualityMode:payload.mode||'potato',lastEffect:id}));
    if(resolved.effect==='service-notice')setPrankState((prev)=>({...prev,serviceNotice:payload.message||resolved.body,lastEffect:id}));
    if(resolved.effect==='still-watching'){setPrankState((prev)=>({...prev,stillWatching:true,lastEffect:id}));window.dispatchEvent(new CustomEvent('notflix:prank-player',{detail:{action:'pause'}}));}
    if(resolved.effect==='buffer-loop')window.dispatchEvent(new CustomEvent('notflix:prank-player',{detail:{action:'buffer-loop',seconds:Number(payload.seconds)||8}}));
    if(resolved.effect==='player-swap')window.dispatchEvent(new CustomEvent('notflix:prank-player',{detail:{action:'swap-title',targetId:payload.targetId||'gums'}}));
    if(resolved.effect==='episode-inject'){
      const showId=payload.showId||'bigger-things';const show=findTitle(showId);
      if(show?.type==='show'){
        const seasons=(show.seasons||[]).map((season)=>({...season,episodes:[...(season.episodes||[])]}));
        if(!seasons.length)seasons.push({number:1,episodes:[]});
        const target=seasons[0];
        if(!target.episodes.some((ep)=>ep.id==='prank-episode'))target.episodes.push({number:target.episodes.length+1,id:'prank-episode',title:'The Episode Nobody Ordered',duration:'46m',description:'A new episode appears with no release announcement, no explanation, and far too much confidence.',tone:'red-storm',emoji:'📼',media:{},pranks:{atPercent:{34:'subtitleTakeover',71:'fakeBuffering'}}});
        const patch={seasons};setContentOverrides((prev)=>({...prev,[showId]:{...(prev[showId]||{}),seasons}}));controlBus.send('content-override',{id:showId,patch});setInjected((prev)=>prev.includes(showId)?prev:[showId,...prev]);
      }
    }
    if(resolved.effect==='chain')for(const step of resolved.chain||[])setTimeout(()=>triggerPrank(step.id,step.overrides||{}),Number(step.delay)||0);
    if(resolved.modal!==false)setPrank(resolved);else notify(resolved.title);
    recordEvent(`Prank: ${resolved.title}`,{prankId:id,effect:resolved.effect||'modal'});
  },[findTitle,notify,recordEvent]);

  useEffect(()=>controlBus.subscribe((message)=>{if(!message?.type)return;if(message.type==='transport-status'){setRemoteState((prev)=>({...prev,connected:Boolean(message.payload?.socket),lastCommand:message}));return;}setRemoteState({connected:true,lastCommand:message});if(message.type==='telemetry')setViewerTelemetry({...message.payload,receivedAt:Date.now()});if(message.type==='prank')triggerPrank(message.payload?.id??'fakeError',message.payload?.overrides);if(message.type==='inject-title')injectTitle(message.payload?.id);if(message.type==='toast')notify(message.payload?.message??'Remote command received');if(message.type==='navigate')window.dispatchEvent(new CustomEvent('notflix:remote-navigate',{detail:message.payload}));if(message.type==='player')window.dispatchEvent(new CustomEvent('notflix:remote-player',{detail:message.payload}));if(message.type==='catalog-upsert'&&message.payload?.item)setCustomTitles((prev)=>[message.payload.item,...prev.filter((x)=>x.id!==message.payload.item.id)]);if(message.type==='catalog-remove'&&message.payload?.id)setCustomTitles((prev)=>prev.filter((x)=>x.id!==message.payload.id));if(message.type==='content-override'&&message.payload?.id){const{id,patch}=message.payload;setContentOverrides((prev)=>{const current=prev[id]??{};const mediaPatch=patch?.media?{media:{...(current.media||{}),...patch.media}}:{};return{...prev,[id]:{...current,...patch,...mediaPatch}};});}if(message.type==='content-clear'&&message.payload?.id)setContentOverrides((prev)=>{const next={...prev};delete next[message.payload.id];return next;});if(message.type==='rule-override'&&message.payload?.id)setRuleOverrides((prev)=>({...prev,[message.payload.id]:message.payload.rules??{}}));if(message.type==='rule-clear'&&message.payload?.id)setRuleOverrides((prev)=>{const next={...prev};delete next[message.payload.id];return next;});if(message.type==='sync-request'&&isHQController)controlBus.send('sync-state',{customTitles,contentOverrides,ruleOverrides,injected});if(message.type==='sync-state'&&!isHQController){setCustomTitles(message.payload?.customTitles??[]);setContentOverrides(message.payload?.contentOverrides??{});setRuleOverrides(message.payload?.ruleOverrides??{});setInjected(message.payload?.injected??[]);notify('TV catalog synchronized with NOTFLIX HQ');}}),[injectTitle,notify,triggerPrank,isHQController,customTitles,contentOverrides,ruleOverrides,injected]);
  useEffect(()=>{if(isHQController)return undefined;const id=setTimeout(()=>controlBus.send('sync-request',{role:'viewer'}),600);return()=>clearTimeout(id);},[isHQController]);

  const effectiveCatalog=useMemo(()=>[...customTitles,...baseCatalog].map((item)=>{const withContent=mergeContent(item,contentOverrides[item.id]);return ruleOverrides[item.id]?{...withContent,pranks:{...(withContent.pranks||{}),...ruleOverrides[item.id]}}:withContent;}),[customTitles,contentOverrides,ruleOverrides]);
  const visibleCatalog=useMemo(()=>{const permitted=effectiveCatalog.filter((item)=>allowedForProfile(item,profile));const map=new Map(permitted.map((x)=>[x.id,x]));const injectedItems=injected.map((id)=>map.get(id)).filter(Boolean);return[...injectedItems,...permitted.filter((item)=>!injected.includes(item.id))];},[effectiveCatalog,injected,profile]);
  const selectProfile=useCallback((id)=>{setProfileData((prev)=>prev[id]?prev:{...prev,[id]:newProfileData(id)});setProfileId(id);},[]);
  const displayMatchFor=useCallback((item)=>fakeMatchFor(item,prankState.matchMode),[prankState.matchMode]);
  const value={catalog:visibleCatalog,baseCatalog,customTitles,createCustomTitle,removeCustomTitle,contentOverrides,updateTitleContent,clearTitleContent,profiles,setProfiles,profile,profileId,selectProfile,signOutProfile:()=>setProfileId(null),settings,setSettings,myList,toggleMyList,progress,saveProgress,history,notifications,markNotificationRead:(id)=>setNotifications((prev)=>prev.map((n)=>n.id===id?{...n,read:true}:n)),clearNotifications:()=>setNotifications([]),prank,triggerPrank,closePrank:()=>setPrank(null),prankState,clearPrankEffect,resetPrankEffects,displayMatchFor,toast,notify,remoteState,viewerTelemetry,injected,injectTitle,ruleOverrides,saveRuleOverride,clearRuleOverride,ratings,rateTitle,sessionEvents,recordEvent,resetViewingData,findTitle};
  return <NotflixContext.Provider value={value}>{children}</NotflixContext.Provider>;
}
export function useNotflix(){const value=useContext(NotflixContext);if(!value)throw new Error('useNotflix must be used inside NotflixProvider');return value;}
