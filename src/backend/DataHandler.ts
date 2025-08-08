import { characterData } from './characterData';
import { characterList } from './characterList';
import { saveDataToFile } from './utils';
import { grabSampleCharacterInfo, initCharacterData } from './scraper';
import type { Character, CharacterListEntry, SearchCharacter } from './types';

export function buildCharacterSearchList() {
  console.time('Building Search Character Data');
  const searchCharacters: SearchCharacter[] = characterData.map((char) => {
    return {
      index: char.index,
      name: char.name,
      moniker: char.moniker,
      mainAffiliation: char.affiliations.split(',')[0],
      imageUrl: char.imageUrl,
    };
  });
  saveDataToFile('searchCharacterList', 'SearchCharacter', searchCharacters);
  console.timeEnd('Building Search Character Data');
}

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

export function selectCharForGuessing(charList: CharacterListEntry[]) {
  const charIndex = Math.floor(Math.random() * charList.length)
  return charList[charIndex];
  // selection algorithm
  // probably based on the day, include "conditional builder"
  // for example, whether we're doing anime or manga.
}

// buildCharacterSearchList();
// findUniqueAffiliations()
// initCharacterData();
// sampleCharacterInfo();
