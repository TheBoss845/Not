import React from 'react';
import {AlertTriangle,CheckCircle2,Sparkles,X} from 'lucide-react';
import {useNotflix} from '../context/NotflixContext.jsx';
import FocusButton from './FocusButton.jsx';

export default function PrankAtmosphere(){
  const{prankState,clearPrankEffect}=useNotflix();
  return <>
    {prankState.serviceNotice&&<div className="prank-service-banner" role="status"><AlertTriangle size={17}/><strong>NOTFLIX SERVICE NOTICE</strong><span>{prankState.serviceNotice}</span><FocusButton className="prank-service-banner__close" onClick={()=>clearPrankEffect('serviceNotice')} aria-label="Dismiss service notice"><X size={16}/></FocusButton></div>}
    {prankState.matchMode==='impossible'&&<div className="prank-corner-chip"><Sparkles size={14}/><span>Experimental Match Science Enabled</span></div>}
    {prankState.qualityMode==='potato'&&<div className="prank-quality-chip"><span>144p-ish</span><small>Bandwidth hero mode</small></div>}
    {prankState.stillWatching&&<div className="prank-presence-chip"><CheckCircle2 size={14}/><span>Viewer presence verification active</span></div>}
  </>;
}
