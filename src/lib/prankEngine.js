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
};

export function prankForEvent(item, event, state = {}) {
  if (!item) return null;
  const prankId = item.pranks?.[event];
  if (prankId && PRANKS[prankId]) return { id: prankId, ...PRANKS[prankId] };
  if (event === 'progress') {
    const pct = Math.floor((state.progress ?? 0) * 100);
    const entries = Object.entries(item.pranks?.atPercent ?? {});
    const found = entries.find(([threshold]) => pct >= Number(threshold) && !state.triggered?.includes(`${item.id}:${threshold}`));
    if (found) {
      const [threshold, id] = found;
      return PRANKS[id] ? { id, triggerKey: `${item.id}:${threshold}`, ...PRANKS[id] } : null;
    }
  }
  return null;
}

export const subtitleJokes = [
  'I definitely remember this line being in the movie.',
  'The subtitle department would like to apologize in advance.',
  'This is getting oddly specific.',
  'Please ignore the person controlling NOTFLIX from another room.',
  'Nothing suspicious is happening. Continue watching normally.',
];
