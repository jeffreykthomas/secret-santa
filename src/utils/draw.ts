import type { FamilyMember } from 'src/components/models';

// Santa name -> everyone they have gifted to in past years (repeats included)
export type PastAssignments = Record<string, string[]>;

// Santa name -> the giftees drawn for them
export type DrawResult = Record<string, string[]>;

const PARTNER_PENALTY = 1000;

export const santaForToArray = (
  santaFor: string | string[] | undefined
): string[] => {
  if (Array.isArray(santaFor)) return santaFor;
  return santaFor ? [santaFor] : [];
};

const shuffle = <T>(items: T[]): T[] => {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// How undesirable it is for `santa` to draw `giftee`: partners are far worse
// than repeating a past pairing.
export const pairingPenalty = (
  santa: FamilyMember,
  giftee: FamilyMember,
  pastAssignments: PastAssignments
): number => {
  const repeats =
    pastAssignments[santa.name]?.filter((name) => name === giftee.name)
      .length || 0;
  const isPartner =
    giftee.name === santa.partner || santa.name === giftee.partner;
  return (isPartner ? PARTNER_PENALTY : 0) + repeats;
};

const attemptDraw = (
  members: FamilyMember[],
  gifteesPerSanta: number,
  pastAssignments: PastAssignments
): { result: DrawResult; penalty: number } | null => {
  // Start from any assignments that already exist (people who already drew)
  const timesDrawn: Record<string, number> = {};
  members.forEach((member) => (timesDrawn[member.name] = 0));
  members.forEach((member) => {
    if (!member.assigned) return;
    santaForToArray(member.santaFor).forEach((name) => {
      timesDrawn[name] = (timesDrawn[name] || 0) + 1;
    });
  });

  const result: DrawResult = {};
  let penalty = 0;

  for (const santa of shuffle(members.filter((m) => !m.assigned))) {
    const candidates = shuffle(
      members.filter(
        (m) => m.name !== santa.name && timesDrawn[m.name] < gifteesPerSanta
      )
    )
      .map((giftee) => ({
        giftee,
        cost: pairingPenalty(santa, giftee, pastAssignments),
      }))
      .sort((a, b) => a.cost - b.cost);

    if (candidates.length < gifteesPerSanta) return null;

    const picked = candidates.slice(0, gifteesPerSanta);
    picked.forEach(({ giftee, cost }) => {
      timesDrawn[giftee.name]++;
      penalty += cost;
    });
    result[santa.name] = picked.map(({ giftee }) => giftee.name);
  }

  return { result, penalty };
};

// Draws giftees for every member who has not drawn yet. Tries many random
// draws and keeps the best one: no partner pairings if at all possible, then
// as few repeats of past years as possible. Returns null if no valid draw
// exists (e.g. too few people).
export const drawAll = (
  members: FamilyMember[],
  gifteesPerSanta: number,
  pastAssignments: PastAssignments,
  maxAttempts = 2000
): { result: DrawResult; partnerPairings: number; repeats: number } | null => {
  let best: { result: DrawResult; penalty: number } | null = null;

  for (let i = 0; i < maxAttempts; i++) {
    const attempt = attemptDraw(members, gifteesPerSanta, pastAssignments);
    if (attempt && (!best || attempt.penalty < best.penalty)) {
      best = attempt;
      if (best.penalty === 0) break;
    }
  }

  if (!best) return null;
  return {
    result: best.result,
    partnerPairings: Math.floor(best.penalty / PARTNER_PENALTY),
    repeats: best.penalty % PARTNER_PENALTY,
  };
};
