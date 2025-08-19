import type { Character, TableEntry, DevilFruitField } from '../../backend/types';

export function formatEntryForDisplay(char: Character): TableEntry {
  const dFruit: DevilFruitField = char.devilFruit;
  let showFruit = '';
  if (dFruit === 'Unknown') showFruit = dFruit.toString();
  else if (Array.isArray(dFruit)) showFruit = dFruit[0].type;
  else showFruit = dFruit.type;
  const showAffiliations = char.affiliations;
  const showBounty = (bounty: string) => {
    const scale = ['', 'K', 'M', 'B', 'T'];
    const segments = bounty.split(',');
    const zeroSets = segments.filter((segment) => segment === '000').length;
    if (zeroSets < segments.length - 1) {
      const newSegments = `${segments[0]}.${segments[1].replace(/0/g, "")}${scale[zeroSets + 1]}`;
      return newSegments;
    }
    const newSegments = `${segments[0]}${scale[zeroSets]}`;
    return newSegments;
  };
  return {
    name: char.name,
    debut: char.debut,
    origin: char.origin,
    devilFruit: showFruit,
    bounty: showBounty(char.bounty),
    affiliations: showAffiliations,
    age: char.age,
    height: char.height,
    status: char.status,
    imageUrl: char.imageUrl,
    index: char.index,
  };
};
