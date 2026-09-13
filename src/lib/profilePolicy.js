export const PROFILE_POLICIES = {
  levi: { name: 'Levi', maturity: 'pg13', label: 'PG-13 / TV-14 maximum', locked: true },
  kids: { name: 'Kids', maturity: 'pg', label: 'PG / TV-PG maximum', locked: true },
  shaun: { name: 'Shaun', maturity: 'all', label: 'All ratings', locked: true },
  lisa: { name: 'Lisa', maturity: 'all', label: 'All ratings', locked: true },
};

export const LEGACY_PROFILE_IDS = { friend: 'shaun', guest: 'lisa' };

export function canonicalProfileId(id) {
  return LEGACY_PROFILE_IDS[id] ?? id;
}

export function policyForProfile(id) {
  return PROFILE_POLICIES[canonicalProfileId(id)] ?? null;
}

export function applyProfilePolicy(profile) {
  if (!profile) return profile;
  const id = canonicalProfileId(profile.id);
  const policy = policyForProfile(id);
  if (!policy) return { ...profile, id };
  return { ...profile, id, name: policy.name, maturity: policy.maturity };
}

export function maturityLabel(value) {
  if (value === 'pg') return 'PG / TV-PG maximum';
  if (value === 'pg13') return 'PG-13 / TV-14 maximum';
  return 'All ratings';
}
