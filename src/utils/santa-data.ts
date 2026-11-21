import { db, collection, doc, getDoc } from 'src/boot/firebase';
import type { FamilyMember } from 'src/components/models';
import { santaForToArray } from 'src/utils/draw';
import type { PastAssignments } from 'src/utils/draw';

// The Firestore document this year's exchange lives in. Bump this each year.
export const CURRENT_YEAR = '2026';

const FIRST_YEAR = 2020;

// Every earlier year's document, oldest first. Note the 2025 exchange was
// saved under the '2024' document, so document names before 2026 don't all
// match the year they were used.
const pastYears = (): string[] => {
  const years: string[] = [];
  for (let year = FIRST_YEAR; year < Number(CURRENT_YEAR); year++) {
    years.push(String(year));
  }
  return years;
};

interface LegacySantaListEntry {
  text: string;
  santaFor: string;
}

const fetchYear = async (collectionName: string, year: string) => {
  const docSnap = await getDoc(doc(collection(db, collectionName), year));
  return docSnap.exists() ? docSnap.data() : undefined;
};

// Who each person gifted to in earlier years, so the draw can avoid repeats.
export const fetchPastAssignments = async (
  collectionName: string
): Promise<PastAssignments> => {
  const pastAssignments: PastAssignments = {};
  const add = (santa: string, giftee: string) => {
    if (!santa || !giftee) return;
    (pastAssignments[santa] ||= []).push(giftee);
  };

  const yearDocs = await Promise.all(
    pastYears().map((year) => fetchYear(collectionName, year))
  );

  yearDocs.forEach((data) => {
    if (!data) return;
    // 2020-2023 format
    if (Array.isArray(data.santaLists)) {
      (data.santaLists as LegacySantaListEntry[]).forEach((entry) =>
        add(entry.text, entry.santaFor)
      );
    }
    // Current format
    if (data.familyMembers) {
      (Object.values(data.familyMembers) as FamilyMember[]).forEach((member) =>
        santaForToArray(member.santaFor).forEach((giftee) =>
          add(member.name, giftee)
        )
      );
    }
  });

  return pastAssignments;
};

// The most recent earlier roster (names and partners only), with assignments,
// gift ideas and purchase marks cleared. Returns null if there is none.
export const fetchPreviousRoster = async (
  collectionName: string
): Promise<{ year: string; members: FamilyMember[] } | null> => {
  for (const year of pastYears().reverse()) {
    const data = await fetchYear(collectionName, year);
    const previous = data?.familyMembers
      ? (Object.values(data.familyMembers) as FamilyMember[])
      : [];
    if (previous.length === 0) continue;

    const members = previous
      .slice()
      .sort((a, b) => a.value - b.value)
      .map((member, index) => {
        const fresh: FamilyMember = {
          name: member.name,
          label: member.name,
          value: index + 1,
          assigned: false,
          hasSanta: false,
          santaFor: '',
          giftIdeas: [],
        };
        if (member.partner) fresh.partner = member.partner;
        return fresh;
      });
    return { year, members };
  }
  return null;
};
