import React,{useEffect,useState} from 'react';
import Brand from './Brand.jsx';
export default function LoadingSplash({onDone}){ const[phase,setPhase]=useState(0); useEffect(()=>{const a=setTimeout(()=>setPhase(1),350),b=setTimeout(()=>setPhase(2),950),c=setTimeout(()=>onDone?.(),1450);return()=>[a,b,c].forEach(clearTimeout);},[onDone]); return <div className={`splash splash--${phase}`}><div className="splash__beam"/><Brand/><div className="splash__line"/><div className="splash__caption">A suspiciously legitimate streaming service</div></div>; }
