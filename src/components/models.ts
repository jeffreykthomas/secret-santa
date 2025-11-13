export type FamilyMember = {
  name: string;
  label: string;
  value: number;
  partner?: string;
  assigned: boolean;
  hasSanta: boolean;
  santaFor: string;
  giftIdeas: GiftIdea[];
};

export type GiftIdea = {
  idea: string;
};
