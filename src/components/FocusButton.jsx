import React from 'react';
export default function FocusButton({ className='', children, ...props }){ return <button type="button" data-tv-focusable="true" className={className} {...props}>{children}</button>; }
