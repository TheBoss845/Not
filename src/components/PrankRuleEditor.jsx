import React,{useMemo,useState} from 'react';
import {Save,Trash2} from 'lucide-react';
import {useNotflix} from '../context/NotflixContext.jsx';
import {PRANKS} from '../lib/prankEngine.js';
import FocusButton from './FocusButton.jsx';

export default function PrankRuleEditor(){
  const{catalog,ruleOverrides,saveRuleOverride,clearRuleOverride,notify}=useNotflix();
  const[first]=catalog;
  const[titleId,setTitleId]=useState(first?.id||'');
  const current=useMemo(()=>ruleOverrides[titleId]||{},[ruleOverrides,titleId]);
  const[pause,setPause]=useState(current.pause||'');
  const[rewind,setRewind]=useState(current.rewind||'');
  const[pct,setPct]=useState('');
  const[pctPrank,setPctPrank]=useState('fakeBuffering');
  const changeTitle=(id)=>{setTitleId(id);const rules=ruleOverrides[id]||{};setPause(rules.pause||'');setRewind(rules.rewind||'');setPct('');};
  const save=()=>{const atPercent={...(current.atPercent||{})};if(pct!==''&&Number(pct)>=0&&Number(pct)<=100)atPercent[String(Math.round(Number(pct)))]=pctPrank;saveRuleOverride(titleId,{...current,pause:pause||undefined,rewind:rewind||undefined,atPercent});notify('Prank rules saved');setPct('');};
  return <div className="rule-editor"><div className="rule-editor__header"><div><h3>Prank Rule Editor</h3><p>Attach harmless UI jokes to playback events. Rules stay local to this NOTFLIX installation.</p></div></div>
    <label><span>Title</span><select value={titleId} onChange={(e)=>changeTitle(e.target.value)}>{catalog.map((item)=><option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
    <div className="rule-grid"><label><span>When Pause is pressed</span><select value={pause} onChange={(e)=>setPause(e.target.value)}><option value="">Normal pause</option>{Object.entries(PRANKS).map(([id,p])=><option key={id} value={id}>{p.title}</option>)}</select></label><label><span>When Rewind is pressed</span><select value={rewind} onChange={(e)=>setRewind(e.target.value)}><option value="">Normal rewind</option>{Object.entries(PRANKS).map(([id,p])=><option key={id} value={id}>{p.title}</option>)}</select></label></div>
    <div className="rule-grid"><label><span>At playback %</span><input type="number" min="0" max="100" value={pct} onChange={(e)=>setPct(e.target.value)} placeholder="62"/></label><label><span>Trigger</span><select value={pctPrank} onChange={(e)=>setPctPrank(e.target.value)}>{Object.entries(PRANKS).map(([id,p])=><option key={id} value={id}>{p.title}</option>)}</select></label></div>
    <div className="rule-preview">{Object.entries(current.atPercent||{}).length?Object.entries(current.atPercent).sort((a,b)=>Number(a[0])-Number(b[0])).map(([threshold,id])=><span key={threshold}>{threshold}% → {PRANKS[id]?.title||id}</span>):<span>No percentage triggers yet.</span>}</div>
    <div className="rule-actions"><FocusButton className="hq-send" onClick={save}><Save size={17}/> Save rules</FocusButton><FocusButton className="settings-action" onClick={()=>{clearRuleOverride(titleId);setPause('');setRewind('');notify('Custom prank rules cleared');}}><Trash2 size={17}/> Reset</FocusButton></div>
  </div>;
}
