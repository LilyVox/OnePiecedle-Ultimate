# Design Choices

## scraper.ts

The general logic is this:

### scrapeCharacterList

First, this function scrapes the website: `https://onepiece.fandom.com/wiki/List_of_Canon_Characters`
it's the list of all canon canon characters, if the URL wasn't clear.
I grab the name, link, chapter, episode, and create an index number for the character.

### grabAllCharacterInfo

Using the index and link, I iterate through each link and use scrapeCharacterDataFromURL.

### scrapeCharacterDataFromURL

We grab the character data, whose type is defined in `./types.ts`.

```js
 interface Character {
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
```

It's pretty straightforward. Each entry is scraped from the respective webpage and the values are cleaned to be identical and easy to manipulate.

## utils

### saveDataToFile

Saves data to a file. Requires a file name, the filetype, and an array of the data to store.

## DataHandler

Where we utilize the scraper.

### sampleCharacterInfo

Grabs a couple of characters to test the scraper. Intend to move this to a test file.

### selectCharForGuessing

Grabs a character to guess for.
