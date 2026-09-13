import React from 'react';
import {AlertTriangle,Crown,LoaderCircle,PartyPopper,RadioTower} from 'lucide-react';
import {useNotflix} from '../context/NotflixContext.jsx';
import FocusButton from './FocusButton.jsx';
const icons={paywall:Crown,loading:LoaderCircle,notice:AlertTriangle,reveal:PartyPopper,error:AlertTriangle,'still-watching':RadioTower};
export default function PrankModal(){
  const{prank,closePrank,notify,clearPrankEffect}=useNotflix();
  if(!prank)return null;
  const Icon=icons[prank.kind]??AlertTriangle;
  const finish=(primary=false)=>{
    if(prank.id==='stillWatching'){clearPrankEffect('stillWatching');if(primary)window.dispatchEvent(new CustomEvent('notflix:remote-player',{detail:{action:'play'}}));}
    if(primary){if(prank.kind==='paywall')notify('Trial activated in the extremely fictional NOTFLIX billing system');else if(prank.id==='reveal')notify('NOTFLIX reveal acknowledged');else notify(`${prank.title} acknowledged`);}
    closePrank();
  };
  return <div className="prank-overlay"><div className={`prank-modal prank-modal--${prank.kind??'notice'}`} role="dialog" aria-modal="true" aria-label={prank.title}><div className="prank-modal__eyebrow">NOTFLIX SYSTEM</div><div className="prank-modal__icon"><Icon size={36} className={prank.kind==='loading'?'spin':''}/></div><h2>{prank.title}</h2><p>{prank.body}</p><div className="prank-modal__actions"><FocusButton className="hero-button hero-button--play" onClick={()=>finish(true)}>{prank.primary}</FocusButton><FocusButton className="text-button" onClick={()=>finish(false)}>{prank.secondary}</FocusButton></div>{prank.kind==='paywall'&&<small>No payment method is collected. The billing screen is part of the joke.</small>}{prank.effect&&<span className="prank-modal__effect">SYSTEM EFFECT · {prank.effect.replaceAll('-',' ').toUpperCase()}</span>}</div></div>;
}
