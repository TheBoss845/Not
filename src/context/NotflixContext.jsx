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
const newProfileData=(id)=>({myList:starterLists[id]??[],progress:id==='levi'?starterProgress:{},history:[],ratings:{}});
const ratingRank={'G':0,'TV-Y':0,'TV-Y7':0,'TV-G':0,'PG':1,'TV-PG':1,'PG-13':2,'TV-14':2,'R':3,'TV-MA':3,'NC-17':4};
const maturityLimit={pg:1,pg13:2,all:99};
const allowedForProfile=(item,profile)=>!profile||profile.maturity==='all'||(ratingRank[item.rating]??2)<=(maturityLimit[profile.maturity]??99);

function loadProfileData(){
  const saved=loadJSON('profileData',null);
  if(saved&&typeof saved==='object')return saved;
  const active=loadJSON('activeProfile',null);
  if(!active)return{};
  return{[active]:{myList:loadJSON('myList',starterLists[active]??[]),progress:loadJSON('progress',active==='levi'?starterProgress:{}),history:loadJSON('history',[]),ratings:loadJSON('ratings',{})}};
}

export function NotflixProvider({children}){
  const[profiles,setProfiles]=useState(()=>loadJSON('profiles',defaultProfiles));
  const[profileId,setProfileId]=useState(()=>loadJSON('activeProfile',null));
  const[settings,setSettings]=useState(()=>loadJSON('settings',defaultSettings));
  const[profileData,setProfileData]=useState(loadProfileData);
  const[notifications,setNotifications]=useState(()=>loadJSON('notifications',[{id:'n1',title:'New episode',body:'BIGGER THINGS has an episode nobody remembers ordering.',read:false,at:Date.now()-3600000},{id:'n2',title:'Because apparently',body:'GUMS 2: DENTAL PLAN is now streaming.',read:false,at:Date.now()-7200000}]));
  const[prank,setPrank]=useState(null);
  const[toast,setToast]=useState(null);
  const[remoteState,setRemoteState]=useState({connected:false,lastCommand:null});
  const[viewerTelemetry,setViewerTelemetry]=useState(null);
  const[injected,setInjected]=useState(()=>loadJSON('injected',[]));
  const[customTitles,setCustomTitles]=useState(()=>loadJSON('customTitles',[]));
  const[ruleOverrides,setRuleOverrides]=useState(()=>loadJSON('ruleOverrides',{}));
  const[sessionEvents,setSessionEvents]=useState(()=>loadJSON('sessionEvents',[]));
  const profile=profiles.find((p)=>p.id===profileId)??null;
  const activeData=profileId?(profileData[profileId]??newProfileData(profileId)):newProfileData('anonymous');
  const myList=activeData.myList??[];
  const progress=activeData.progress??{};
  const history=activeData.history??[];
  const ratings=activeData.ratings??{};

  useEffect(()=>saveJSON('profiles',profiles),[profiles]);
  useEffect(()=>saveJSON('activeProfile',profileId),[profileId]);
  useEffect(()=>saveJSON('settings',settings),[settings]);
  useEffect(()=>saveJSON('profileData',profileData),[profileData]);
  useEffect(()=>saveJSON('notifications',notifications),[notifications]);
  useEffect(()=>saveJSON('injected',injected),[injected]);
  useEffect(()=>saveJSON('customTitles',customTitles),[customTitles]);
  useEffect(()=>saveJSON('ruleOverrides',ruleOverrides),[ruleOverrides]);
  useEffect(()=>saveJSON('sessionEvents',sessionEvents.slice(0,80)),[sessionEvents]);

  const patchProfile=useCallback((updater)=>{if(!profileId)return;setProfileData((prev)=>{const current=prev[profileId]??newProfileData(profileId);const next=typeof updater==='function'?updater(current):{...current,...updater};return{...prev,[profileId]:next};});},[profileId]);
  const recordEvent=useCallback((label,detail={})=>setSessionEvents((prev)=>[{id:`evt-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,at:Date.now(),profileId,label,...detail},...prev].slice(0,80)),[profileId]);
  const notify=useCallback((message)=>{setToast({id:Date.now(),message});setTimeout(()=>setToast(null),2600);},[]);
  const findTitle=useCallback((id)=>customTitles.find((x)=>x.id===id)??getTitle(id),[customTitles]);
  const toggleMyList=useCallback((id)=>{const exists=myList.includes(id);patchProfile((data)=>({...data,myList:exists?data.myList.filter((x)=>x!==id):[...data.myList,id]}));notify(exists?'Removed from My List':'Added to My List');recordEvent(exists?'Removed from My List':'Added to My List',{titleId:id});},[myList,patchProfile,notify,recordEvent]);
  const saveProgress=useCallback((id,value,meta={})=>{const clamped=Math.max(0,Math.min(1,Number(value)||0));patchProfile((data)=>{const nextProgress={...(data.progress??{}),[id]:clamped,...(meta.playbackKey?{[meta.playbackKey]:clamped}:{})};const nextHistory=[{id,progress:clamped,at:Date.now(),...meta},...(data.history??[]).filter((x)=>!(x.id===id&&x.episodeId===meta.episodeId))].slice(0,100);return{...data,progress:nextProgress,history:nextHistory};});},[patchProfile]);
  const triggerPrank=useCallback((id,overrides={})=>{const base=PRANKS[id]??{title:'NOTFLIX Notice',body:'Something suspicious happened.',primary:'Continue',secondary:'Continue',kind:'notice'};setPrank({id,...base,...overrides});recordEvent(`Prank: ${base.title}`,{prankId:id});},[recordEvent]);
  const injectTitle=useCallback((id)=>{const title=findTitle(id);if(!title)return;setInjected((prev)=>prev.includes(id)?prev:[id,...prev]);notify(`${title.title} was injected into the TV catalog`);recordEvent(`Injected ${title.title}`,{titleId:id});},[findTitle,notify,recordEvent]);
  const createCustomTitle=useCallback((input)=>{const item=makeCustomTitle(input);setCustomTitles((prev)=>[item,...prev.filter((x)=>x.id!==item.id)]);return item;},[]);
  const removeCustomTitle=useCallback((id)=>{setCustomTitles((prev)=>prev.filter((x)=>x.id!==id));setInjected((prev)=>prev.filter((x)=>x!==id));setProfileData((prev)=>Object.fromEntries(Object.entries(prev).map(([key,data])=>[key,{...data,myList:(data.myList??[]).filter((x)=>x!==id)}])));},[]);
  const saveRuleOverride=useCallback((id,rules)=>setRuleOverrides((prev)=>({...prev,[id]:rules})),[]);
  const clearRuleOverride=useCallback((id)=>setRuleOverrides((prev)=>{const next={...prev};delete next[id];return next;}),[]);
  const rateTitle=useCallback((id,value)=>patchProfile((data)=>({...data,ratings:{...(data.ratings??{}),[id]:value}})),[patchProfile]);
  const resetViewingData=useCallback(()=>{patchProfile((data)=>({...data,progress:{},history:[],myList:[],ratings:{}}));notify('Viewing data reset for this profile');recordEvent('Viewing data reset');},[patchProfile,notify,recordEvent]);

  useEffect(()=>controlBus.subscribe((message)=>{if(!message?.type)return;setRemoteState({connected:true,lastCommand:message});if(message.type==='telemetry')setViewerTelemetry({...message.payload,receivedAt:Date.now()});if(message.type==='prank')triggerPrank(message.payload?.id??'fakeError',message.payload?.overrides);if(message.type==='inject-title')injectTitle(message.payload?.id);if(message.type==='toast')notify(message.payload?.message??'Remote command received');if(message.type==='navigate')window.dispatchEvent(new CustomEvent('notflix:remote-navigate',{detail:message.payload}));if(message.type==='player')window.dispatchEvent(new CustomEvent('notflix:remote-player',{detail:message.payload}));}),[injectTitle,notify,triggerPrank]);

  const effectiveCatalog=useMemo(()=>[...customTitles,...baseCatalog].map((item)=>ruleOverrides[item.id]?{...item,pranks:{...(item.pranks||{}),...ruleOverrides[item.id]}}:item),[customTitles,ruleOverrides]);
  const visibleCatalog=useMemo(()=>{const permitted=effectiveCatalog.filter((item)=>allowedForProfile(item,profile));const map=new Map(permitted.map((x)=>[x.id,x]));const injectedItems=injected.map((id)=>map.get(id)).filter(Boolean);return[...injectedItems,...permitted.filter((item)=>!injected.includes(item.id))];},[effectiveCatalog,injected,profile]);
  const selectProfile=useCallback((id)=>{setProfileData((prev)=>prev[id]?prev:{...prev,[id]:newProfileData(id)});setProfileId(id);},[]);
  const value={catalog:visibleCatalog,baseCatalog,customTitles,createCustomTitle,removeCustomTitle,profiles,setProfiles,profile,profileId,selectProfile,signOutProfile:()=>setProfileId(null),settings,setSettings,myList,toggleMyList,progress,saveProgress,history,notifications,markNotificationRead:(id)=>setNotifications((prev)=>prev.map((n)=>n.id===id?{...n,read:true}:n)),clearNotifications:()=>setNotifications([]),prank,triggerPrank,closePrank:()=>setPrank(null),toast,notify,remoteState,viewerTelemetry,injected,injectTitle,ruleOverrides,saveRuleOverride,clearRuleOverride,ratings,rateTitle,sessionEvents,recordEvent,resetViewingData};
  return <NotflixContext.Provider value={value}>{children}</NotflixContext.Provider>;
}

export function useNotflix(){const value=useContext(NotflixContext);if(!value)throw new Error('useNotflix must be used inside NotflixProvider');return value;}
