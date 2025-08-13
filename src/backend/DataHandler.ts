import { characterData } from './characterData';
import { characterList } from './characterList';
import { saveDataToFile } from './utils';
import { grabSampleCharacterInfo, initCharacterData } from './scraper';
import type { CharacterListEntry } from './types';


export function findUniqueAffiliations() {
  const uniqueAffiliations: string[] = [];
  characterData.forEach((characterEntry) => {
    const affs = characterEntry.affiliations.split(',');
    affs.forEach((a) => {
      if (uniqueAffiliations.includes(a)) return null;
      uniqueAffiliations.push(a);
    });
  });
  console.log(uniqueAffiliations.sort());
}
export function sampleCharacterInfo() {
  const charsToTest = [803];
  // const charsToTest = [973];
  const charTestList: CharacterListEntry[] = [];
  charsToTest.forEach((index) => {
    charTestList.push(characterList[index]);
  });
  grabSampleCharacterInfo(charTestList).then((data) => {
    console.log(data);
  });
}
export const findCharDataByIndex = (index: number) => {
  const tempChar = characterData.find((char) => {
    if (char.index === index) return char;
  });
  if (tempChar === undefined) return characterData[0];
  return tempChar;
};
export const findCharDataByName = (search: string) => {
  const tempChar = characterData.find((char) => {
    if (char.name === search) return char;
  });
  if (tempChar === undefined) return;
  return tempChar;
};
export function selectCharForGuessing() {
  const charIndex = Math.floor(Math.random() * characterData.length)
  const possibleChar = characterData[charIndex];
  if(possibleChar.difficulty < 3) return possibleChar;
  return selectCharForGuessing()
  // selection algorithm
  // probably based on the day, include "conditional builder"
  // for example, whether we're doing anime or manga.
}

// buildCharacterSearchList();
// findUniqueAffiliations()
initCharacterData();
// sampleCharacterInfo();
