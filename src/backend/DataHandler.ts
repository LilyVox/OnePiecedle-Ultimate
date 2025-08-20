import { characterData } from './characterData';
import { characterList } from './characterList';
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
export function selectRandomCharForGuessing() {
  const charIndex = Math.floor(Math.random() * characterData.length);
  const possibleChar = characterData[charIndex];
  if (possibleChar.difficulty <= 6) return possibleChar;
  return selectRandomCharForGuessing();
  // selection algorithm
  // probably based on the day, include "conditional builder"
  // for example, whether we're doing anime or manga.
}
export function selectDailyCharForGuessing() {
  const charIndex = Math.floor(Math.random() * characterData.length);
  const possibleChar = characterData[charIndex];
  if (possibleChar.difficulty < 3) return possibleChar;
  return selectRandomCharForGuessing();
  // selection algorithm
  // probably based on the day, include "conditional builder"
  // for example, whether we're doing anime or manga.
}
export function getDailyNumber(date: Date = new Date()): number {
  // Build a string based on the local date parts
  const dayString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

  // Basic hash from the string
  let hash = 0;
  for (let i = 0; i < dayString.length; i++) {
    hash = Math.imul(31, hash) + dayString.charCodeAt(i);
  }

  // Xorshift to "mix" the bits and add randomness
  let x = hash ^ (hash >>> 16);
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;

  return (x >>> 0) % 1389;
}
export function getDailyCharacter(date: Date = new Date()){
  const charIndex = getDailyNumber(date);
  return characterData[charIndex];
}
export function howManyDifficulty(){
  let total = 0;
  characterData.forEach((char)=>{
    if(char.difficulty == 8) {
      total++;
    }
  });
  return total;
}
export function maxDifficulty(){
  let maxDifficulty = 0;
  characterData.forEach((char)=>{
    if(char.difficulty > maxDifficulty) maxDifficulty = char.difficulty;
  });
  return maxDifficulty;
}

// buildCharacterSearchList();
// findUniqueAffiliations()
initCharacterData();
// sampleCharacterInfo();
