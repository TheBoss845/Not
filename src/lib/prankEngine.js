export const PRANKS = {
  premiumPause: {
    title: 'Pausing is a Premium Feature',
    body: 'Add NOTFLIX Pause for $2.99/month — first month free.',
    primary: 'Start Free Trial',
    secondary: 'Continue Watching',
    kind: 'paywall',
  },
  rewindPremium: {
    title: 'Rewinding Requires NOTFLIX Plus+',
    body: 'Time travel is expensive. Upgrade for $4.99/month to revisit the previous ten seconds.',
    primary: 'Upgrade',
    secondary: 'Accept The Present',
    kind: 'paywall',
  },
  fakeBuffering: {
    title: 'Optimizing Your Viewing Experience',
    body: 'NOTFLIX is recalculating several completely unnecessary things.',
    primary: 'Wait Patiently',
    secondary: 'Also Wait Patiently',
    kind: 'loading',
  },
  subtitleGlitch: {
    title: 'Subtitle Department Notice',
    body: 'The subtitles have developed opinions. Engineering has been informed and is pretending not to know why.',
    primary: 'Interesting',
    secondary: 'Continue',
    kind: 'notice',
  },
  reveal: {
    title: 'You’ve Been Watching NOTFLIX',
    body: 'None of this was a real streaming service. The suspiciously specific movie recommendations should probably have been a clue.',
    primary: 'I Knew It',
    secondary: 'Absolutely Not',
    kind: 'reveal',
  },
  fakeError: {
    title: 'Error N-404: Too Much Confidence',
    body: 'The requested title is currently unavailable because the server sensed that you were getting too comfortable.',
    primary: 'Try Again',
    secondary: 'Question Reality',
    kind: 'error',
  },
  hdPremium: {
    title: 'Sharp Images Are Premium',
    body: 'Upgrade to NOTFLIX Vision to unlock all the pixels we already sent to your television.',
    primary: 'Unlock Pixels',
    secondary: 'Remain Slightly Blurry',
    kind: 'paywall',
  },
  recommendationHijack: {
    title: 'Recommendations Recalibrated',
    body: 'The algorithm has become extremely confident that you need these titles immediately.',
    primary: 'Trust The Algorithm',
    secondary: 'Remain Suspicious',
    kind: 'notice',
    effect: 'recommendation-injection',
    payload: {title:'Because NOTFLIX Knows You Better Than You Do',ids:['gums-vs-jars','printer-2','lion-intern','gums-2','pop']},
  },
  historyHaunt: {
    title: 'Continue Watching Updated',
    body: 'Several titles you absolutely do not remember watching have mysteriously appeared in your history.',
    primary: 'That Seems Normal',
    secondary: 'Investigate Later',
    kind: 'notice',
    effect: 'history-ghost',
    payload: {items:{'finding-memo':.63,'lion-intern':.41,'gums-2':.87}},
  },
  impossibleMatch: {
    title: 'Compatibility Engine Overachieved',
    body: 'NOTFLIX has decided normal percentages are too limiting. Some titles may now match you more than 100%.',
    primary: 'Excellent Science',
    secondary: 'Ignore Mathematics',
    kind: 'notice',
    effect: 'match-override',
    payload: {mode:'impossible'},
  },
  planShuffle: {
    title: 'Your Plan Has Been “Improved”',
    body: 'Congratulations. You are now on NOTFLIX Ultra Mega Basic Premium Lite Max. Nothing has changed except the name.',
    primary: 'Admire My Plan',
    secondary: 'Continue',
    kind: 'paywall',
    effect: 'subscription-tier',
    payload: {plan:'ULTRA MEGA BASIC PREMIUM LITE MAX'},
  },
  contentSwap: {
    title: 'Seamless Content Optimization',
    body: 'NOTFLIX has decided you would rather be watching something else. This decision was made with alarming confidence.',
    primary: 'Apparently So',
    secondary: 'Wait, What?',
    kind: 'notice',
    effect: 'player-swap',
    payload: {targetId:'gums'},
  },
  surpriseEpisode: {
    title: 'New Episode Detected',
    body: 'An episode has appeared that nobody remembers filming, approving, or asking for.',
    primary: 'Add It Anyway',
    secondary: 'This Is Fine',
    kind: 'notice',
    effect: 'episode-inject',
    payload: {showId:'bigger-things'},
  },
  subtitleTakeover: {
    title: 'Subtitle Override Enabled',
    body: 'The subtitle department has been replaced by somebody with access to the control panel.',
    primary: 'Read Carefully',
    secondary: 'Continue',
    kind: 'notice',
    effect: 'subtitle-message',
    payload: {message:'NOTFLIX HQ would like you to know this subtitle was absolutely not in the original movie.'},
  },
  potatoQuality: {
    title: 'Adaptive Quality Engaged',
    body: 'Video quality has been reduced to conserve approximately three heroic bytes of bandwidth.',
    primary: 'Accept The Pixels',
    secondary: 'Squint',
    kind: 'notice',
    effect: 'quality-drop',
    payload: {mode:'potato'},
  },
  bufferingLoop: {
    title: 'Advanced Buffering Mode',
    body: 'Playback will briefly buffer, recover, and buffer again because stability would ruin the experience.',
    primary: 'Begin Optimization',
    secondary: 'Why',
    kind: 'loading',
    effect: 'buffer-loop',
    payload: {seconds:8},
  },
  stillWatchingTrap: {
    title: 'Are You Still Watching?',
    body: 'Please confirm that you remain physically present, emotionally committed, and willing to continue making questionable viewing choices.',
    primary: 'I’m Still Watching',
    secondary: 'Define “Watching”',
    kind: 'still-watching',
    effect: 'still-watching',
  },
  serviceNotice: {
    title: 'Important Service Announcement',
    body: 'NOTFLIX is operating normally, which is honestly the most suspicious thing it has done all day.',
    primary: 'Acknowledge',
    secondary: 'Remain Alert',
    kind: 'notice',
    effect: 'service-notice',
    payload: {message:'Service notice: NOTFLIX is operating suspiciously normally.'},
  },
  chainReaction: {
    title: 'Enhanced Viewing Sequence Activated',
    body: 'Several completely unrelated improvements will now occur in a carefully engineered order.',
    primary: 'Proceed',
    secondary: 'This Seems Bad',
    kind: 'notice',
    effect: 'chain',
    chain:[
      {id:'potatoQuality',delay:900},
      {id:'subtitleTakeover',delay:2600},
      {id:'bufferingLoop',delay:4700},
      {id:'impossibleMatch',delay:7600},
    ],
  },
};

export function resolvePrankSpec(spec){
  if(!spec)return null;
  if(typeof spec==='string')return PRANKS[spec]?{id:spec,...PRANKS[spec]}:null;
  if(typeof spec==='object'&&spec.id&&PRANKS[spec.id])return{id:spec.id,...PRANKS[spec.id],...spec,payload:{...(PRANKS[spec.id].payload||{}),...(spec.payload||{})}};
  return null;
}

export function prankForEvent(item, event, state = {}) {
  if (!item) return null;
  const direct=resolvePrankSpec(item.pranks?.[event]);
  if (direct) return direct;
  if (event === 'progress') {
    const pct = Math.floor((state.progress ?? 0) * 100);
    const entries = Object.entries(item.pranks?.atPercent ?? {}).sort((a,b)=>Number(a[0])-Number(b[0]));
    const found = entries.find(([threshold]) => pct >= Number(threshold) && !state.triggered?.includes(`${item.id}:${threshold}`));
    if (found) {
      const [threshold, spec] = found;
      const resolved=resolvePrankSpec(spec);
      return resolved ? { ...resolved, triggerKey: `${item.id}:${threshold}` } : null;
    }
  }
  return null;
}

export function prankCatalog(){return Object.entries(PRANKS).map(([id,prank])=>({id,...prank}));}

export const subtitleJokes = [
  'I definitely remember this line being in the movie.',
  'The subtitle department would like to apologize in advance.',
  'This is getting oddly specific.',
  'Please ignore the person controlling NOTFLIX from another room.',
  'Nothing suspicious is happening. Continue watching normally.',
];
