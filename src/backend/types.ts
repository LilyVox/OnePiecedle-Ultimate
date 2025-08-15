export type DevilFruitField = 'Unknown' | DevilFruit | DevilFruit[];
export interface DevilFruit {
  japaneseName: string;
  englishName: string;
  meaning: string;
  type: string;
}
export const Comparison = {
  right: 'right',
  more: 'more',
  less: 'less',
  some: 'some',
  wrong: 'wrong',
};
export interface Character {
  name: string;
  moniker: string;
  imageUrl: string;
  height: string;
  debut: string;
  affiliations: string;
  origin: string;
  age: string;
  status: string;
  bounty: string;
  devilFruit: DevilFruitField;
  difficulty: number;
  index: number;
}
export interface CharacterListEntry {
  key: number;
  name: string;
  href: string;
  chapter: number;
  episode: number;
}
export interface SearchCharacter {
  index: number;
  name: string;
  moniker: string;
  mainAffiliation: string;
  imageUrl: string | undefined;
}
export interface TableEntry {
  name: string;
  debut: string;
  origin: string;
  height: string;
  affiliations: string;
  age: string;
  status: string;
  bounty: string;
  devilFruit: string;
  imageUrl: string;
  index: number;
}
export interface GuessShape {
  name: string;
  // mDebut: string;
  devilFruit: string;
  origin: string;
  bounty: string;
  affiliations: string;
  age: string;
  debut: string;
  status: string;
  height: string;
}
