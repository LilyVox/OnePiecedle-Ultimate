import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveDataToFile } from './utils';
import type { Character, DevilFruit, DevilFruitField, CharacterListEntry } from './types';


const baseUrl = 'https://onepiece.fandom.com';

export async function scrapeCharacterDataFromURL(
  listCharacter: CharacterListEntry
): Promise<Character> {
  try {
    // Fetch the HTML content of the webpage
    const { data: html } = await axios.get(baseUrl + listCharacter.href);
    // Load the HTML into cheerio for parsing
    const $ = cheerio.load(html);

    // Helper function to clean text by removing brackets and numbers in brackets
    const cleanText = (text: string) => text.replace(/\[.*?\]/g, ' ').trim();
    const monikerLabel = cleanText(
      $(".pi-data-label:contains('Epithet')").next('.pi-data-value').text()
    );
    const imageUrl = $('.pi-image a').first().attr('href');
    const heightLabel = cleanText(
      $(".pi-data-label:contains('Height')").next('.pi-data-value').text()
    );
    const knownAffiliations = cleanText(
      $(".pi-data-label:contains('Affiliations')").next('.pi-data-value').text()
    );
    const statusLabel = cleanText(
      $(".pi-data-label:contains('Status')").next('.pi-data-value').text()
    );
    const ageLabel = cleanText($(".pi-data-label:contains('Age')").next('.pi-data-value').text());
    const originLabel = cleanText(
      $(".pi-data-label:contains('Origin')").next('.pi-data-value').text()
    );
    const firstBountyText = cleanText(
      $(
        $(".pi-data-label:contains('Bounty')").next('.pi-data-value').contents().toArray()[1]
      ).text()
    );
    const zerothBountyText = cleanText(
      $(
        $(".pi-data-label:contains('Bounty')").next('.pi-data-value').contents().toArray()[0]
      ).text()
    );
    const bountyLabel = firstBountyText.length < 3 ? zerothBountyText : firstBountyText;
    const tempFruit: DevilFruit[] = [];
    $(".pi-item:contains('Devil Fruit')")
      .toArray()
      .forEach((element) => {
        const dFruit = cheerio.load(element);
        const devilFruitJapaneseName = cleanText(
          dFruit(".pi-data-label:contains('Japanese Name')").next('.pi-data-value').text()
        );
        if (!devilFruitJapaneseName) return;
        const devilFruitEnglishName = cleanText(
          dFruit(".pi-data-label:contains('English Name')").next('.pi-data-value').text()
        );
        const devilFruitMeaning = cleanText(
          dFruit(".pi-data-label:contains('Meaning')").next('.pi-data-value').text()
        );
        const devilFruitType = cleanText(
          dFruit(".pi-data-label:contains('Type')").next('.pi-data-value').text()
        );
        tempFruit.push({
          japaneseName: devilFruitJapaneseName,
          englishName: devilFruitEnglishName,
          meaning: devilFruitMeaning,
          type: devilFruitType,
        });
      });

    // const cleanName = (name: string) => {
    //   return name.split(';')[0].split('(')[0].replace(/,+/g, '').trim();
    // };
    // const name = officialEnglishName ? officialEnglishName : romanizedName;

    const unknownFix = (field: string) => {
      return field ? field : 'Unknown';
    };
    const cleanHeight = (height: string) => {
      const matches = height.match(/\d+\s*cm/g); // Match all occurrences of heights in the format "number cm"
      return matches ? matches[matches.length - 1] : 'Unknown'; // Return the last match or "Unknown" if none found
    };
    const heightFix = (height: string) => {
      if (height) return cleanHeight(height);
      return unknownFix(height);
    };
    // const debutFix = (debutText: string) => {
    //   if (debutText.includes(';')) {
    //     return changeSemicolonToComma(debutText);
    //   }
    //   debutText = debutText.replace(/\([^()]*\)/g, '');
    //   const chapterMatch = debutText.match(/Chapter\s*\d+/i); // Match the first occurrence of "Chapter" followed by a number
    //   const episodeMatch = debutText.match(/Episode\s*\d+/i); // Match the first occurrence of "Episode" followed by a number
    //   const cleanedDebut = [chapterMatch?.[0], episodeMatch?.[0]].filter(Boolean).join(', '); // Combine both if they exist
    //   return cleanedDebut || 'Unknown'; // Return "Unknown" if neither exists
    // };
    // const changeSemicolonToComma = (words: string) => {
    //   return words.replace(/;/g, ',').trim();
    // };
    const buildDebut = () => {
      const episode = 'Episode ' + listCharacter.episode;
      const chapter = 'Chapter ' + listCharacter.chapter;
      return `${chapter}, ${episode}`;
    };
    const cleanBounty = (bounty: string) => {
      // Match the first sequence of digits and commas
      const match = bounty.match(/\d[\d,]*/);
      return match ? match[0].replace(/,$/, '') : 'Unknown';
    };
    const bountyFix = bountyLabel ? cleanBounty(bountyLabel) : 'Unknown';
    const cleanMoniker = (moniker: string) => {
      if (!moniker) return 'None';
      return moniker
        .split(';')[0]
        .split('(')[0]
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .trim();
    };
    const cleanOrigin = (origin: string) => {
      if (!origin) return 'Unknown';
      const matchOutside = origin.split('(')[0].trim();
      // const matchInside = origin.match(/\((.*?)\)/)?.[1];
      // return matchInside ? `${matchOutside}, ${matchInside}` : matchOutside;
      return matchOutside;
    };
    const cleanAge = (age: string) => {
      const matches = age.match(/\d{1,4}/g);
      return matches ? matches[matches.length - 1] : 'Unknown';
    };
    const normalizeString = (text: string | undefined) => {
      if (text === undefined) return '';
      return text;
    };
    const cleanImageUrl = (imageUrl: string) => {
      return imageUrl.split('.png')[0] + '.png'; // Keep everything up to and including .png
    };
    const cleanAffiliations = (affiliations: string) => {
      if (!affiliations) return 'N/A';
      return affiliations
        .replace(/\(.*?\)/g, '')
        .trim()
        .replace(/;/g, ',')
        .replace(/\s*,\s*/g, ',')
        .replace(/,+/g, ',')
        .trim();
    };

    const devilFruit: DevilFruitField =
      tempFruit.length > 1 ? tempFruit : tempFruit.length === 1 ? tempFruit[0] : 'Unknown';
    const devilFruitFix = (dFruit: DevilFruitField) => {
      return dFruit;
    };

    const tempCharacterData = {
      name: listCharacter.name,
      moniker: cleanMoniker(monikerLabel),
      imageUrl: cleanImageUrl(normalizeString(imageUrl)),
      height: heightFix(heightLabel),
      debut: buildDebut(),
      affiliations: cleanAffiliations(knownAffiliations),
      origin: cleanOrigin(originLabel),
      bounty: bountyFix,
      age: cleanAge(ageLabel),
      status: statusLabel,
      devilFruit: devilFruitFix(devilFruit),
    };
    let generatedDifficulty = 0;
    Object.values(tempCharacterData).forEach((value) => {
      if (value === 'Unknown' || value === 'None' || value === 'N/A') generatedDifficulty++;
    });
    const characterData: Character = {
      ...tempCharacterData,
      difficulty: generatedDifficulty,
      index: listCharacter.key,
    };
    return characterData;
  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
}
export async function scrapeCharacterList() {
  const characterListUrl = baseUrl + '/wiki/List_of_Canon_Characters';
  try {
    // Fetch the HTML content of the webpage
    const { data: html } = await axios.get(characterListUrl);
    // Load the HTML into cheerio for parsing
    const $ = cheerio.load(html);
    let counter = 0;

    // Extract character names and their href links from the "Individuals" table
    const characterList: CharacterListEntry[] = [];
    console.time('Building Character List');
    $('.fandom-table')
      .first()
      .children('tbody')
      .find('tr')
      .each((i, row) => {
        const rowElements = $(row).find('td');
        const nameCheck = rowElements.get(1);
        if (nameCheck === undefined) {
          return;
        }
        const name = $(nameCheck).text().trim();
        const href = $(nameCheck).find('a').attr('href');
        const chapterCheck = rowElements.get(2);
        if (chapterCheck === undefined) {
          return;
        }
        const chapter = Number($(chapterCheck).text().trim().replace(/^0+/, ''));
        const episodeCheck = rowElements.get(3);
        if (episodeCheck === undefined) {
          return;
        }
        const tempEpisode = $(episodeCheck).text().trim().replace(/^0+/, '');
        let episode = Number(tempEpisode);
        if (!episode) return;
        if (tempEpisode.includes('Film: Red')) episode = 1029;
        if (tempEpisode.includes('Stampede')) episode = 896;

        if (name && href) {
          characterList.push({ key: counter, name, href, chapter, episode });
          counter++;
        }
      });
    console.timeEnd('Building Character List');
    return characterList;
  } catch (error) {
    console.error('Error scraping character list:', error);
    throw error;
  }
}
export async function grabAllCharacterInfo(characterList: CharacterListEntry[]) {
  console.time('Scraping Character Data');
  const characterDataList: Character[] = [];
  for (let i = 0; i < characterList.length - 1; i++) {
    const newCharacter = await scrapeCharacterDataFromURL(characterList[i]);
    characterDataList.push(newCharacter);
  }
  console.timeEnd('Scraping Character Data');
  return characterDataList;
}
export async function grabSampleCharacterInfo(characterList: CharacterListEntry[]) {
  console.time('Scraping Character Data');
  const characterDataList: Character[] = [];
  for (let i = 0; i < characterList.length; i++) {
    const newCharacter = await scrapeCharacterDataFromURL(characterList[i]);
    characterDataList.push(newCharacter);
  }
  console.timeEnd('Scraping Character Data');
  return characterDataList;
}

// build the character list
export async function buildCharacterDataFile(characterList: CharacterListEntry[]) {
  saveDataToFile('characterData', 'Character', await grabAllCharacterInfo(characterList));
}

// run this to compile the character list
export async function buildCharacterListFile() {
  saveDataToFile('characterList', 'CharacterListEntry', await scrapeCharacterList());
}

export async function initCharacterData() {
  const charList = await scrapeCharacterList();
  const charData = await grabAllCharacterInfo(charList);
  saveDataToFile('characterData', 'Character', charData);
  saveDataToFile('characterList', 'CharacterListEntry', charList);
}
