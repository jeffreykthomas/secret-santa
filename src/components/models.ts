export type FamilyMember = {
  name: string;
  label: string;
  value: number;
  partner?: string;
  assigned: boolean;
  hasSanta: boolean;
  santaFor: string | string[]; // Support both single and multiple giftees
  giftIdeas: GiftIdea[];
};

export type GiftIdea = {
  idea: string;
  purchasedBy?: string; // Name of the Santa who purchased this gift
};
