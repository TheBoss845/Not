import React from 'react';
export default function Brand({ compact=false }){ return <div className={`brand ${compact?'brand--compact':''}`} aria-label="NOTFLIX">NOTFLIX</div>; }
