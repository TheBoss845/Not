import React,{useMemo,useState} from 'react';
import {Save,Trash2} from 'lucide-react';
import {useNotflix} from '../context/NotflixContext.jsx';
import {PRANKS} from '../lib/prankEngine.js';
import FocusButton from './FocusButton.jsx';

const EVENTS=[['play','When Play is pressed'],['pause','When Pause is pressed'],['rewind','When Rewind is pressed'],['forward','When Fast-forward is pressed'],['captions','When Captions are toggled'],['ended','When Playback ends']];
const blankRules=()=>Object.fromEntries(EVENTS.map(([event])=>[event,'']));

export default function PrankRuleEditor(){
  const{catalog,ruleOverrides,saveRuleOverride,clearRuleOverride,notify}=useNotflix();
  const[first]=catalog;
  const[titleId,setTitleId]=useState(first?.id||'');
  const current=useMemo(()=>ruleOverrides[titleId]||{},[ruleOverrides,titleId]);
  const[eventRules,setEventRules]=useState(()=>({...blankRules(),...Object.fromEntries(EVENTS.map(([event])=>[event,current[event]||'']))}));
  const[pct,setPct]=useState('');const[pctPrank,setPctPrank]=useState('fakeBuffering');
  const changeTitle=(id)=>{setTitleId(id);const rules=ruleOverrides[id]||{};setEventRules({...blankRules(),...Object.fromEntries(EVENTS.map(([event])=>[event,rules[event]||'']))});setPct('');};
  const save=()=>{const atPercent={...(current.atPercent||{})};if(pct!==''&&Number(pct)>=0&&Number(pct)<=100)atPercent[String(Math.round(Number(pct)))]=pctPrank;const direct=Object.fromEntries(EVENTS.map(([event])=>[event,eventRules[event]||undefined]));saveRuleOverride(titleId,{...current,...direct,atPercent});notify('Prank rules saved');setPct('');};
  return <div className="rule-editor"><div className="rule-editor__header"><div><h3>Prank Rule Editor</h3><p>Attach any harmless NOTFLIX prank to real player events or exact points in a title. The rules engine does the ambushing so you do not have to sit there with the reflexes of an esports player.</p></div></div>
    <label><span>Title</span><select value={titleId} onChange={(e)=>changeTitle(e.target.value)}>{catalog.map((item)=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
    <div className="rule-event-grid">{EVENTS.map(([event,label])=><label key={event}><span>{label}</span><select value={eventRules[event]} onChange={(e)=>setEventRules((prev)=>({...prev,[event]:e.target.value}))}><option value="">Normal behavior</option>{Object.entries(PRANKS).map(([id,p])=><option key={id} value={id}>{p.title}</option>)}</select></label>)}</div>
    <div className="rule-grid"><label><span>At playback %</span><input type="number" min="0" max="100" value={pct} onChange={(e)=>setPct(e.target.value)} placeholder="62"/></label><label><span>Trigger</span><select value={pctPrank} onChange={(e)=>setPctPrank(e.target.value)}>{Object.entries(PRANKS).map(([id,p])=><option key={id} value={id}>{p.title}</option>)}</select></label></div>
    <div className="rule-preview"><strong>Timed ambushes</strong>{Object.entries(current.atPercent||{}).length?Object.entries(current.atPercent).sort((a,b)=>Number(a[0])-Number(b[0])).map(([threshold,spec])=>{const id=typeof spec==='string'?spec:spec?.id;return <span key={threshold}>{threshold}% → {PRANKS[id]?.title||id}</span>;}):<span>No percentage triggers yet.</span>}</div>
    <div className="rule-actions"><FocusButton className="hq-send" onClick={save}><Save size={17}/> Save complete rule set</FocusButton><FocusButton className="settings-action" onClick={()=>{clearRuleOverride(titleId);setEventRules(blankRules());setPct('');notify('Custom prank rules cleared');}}><Trash2 size={17}/> Reset title rules</FocusButton></div>
  </div>;
}
