import React, { useState } from 'react';
import SelectionBox from './components/SearchBox';
import { searchCharacterList } from '../backend/searchCharacterList';
import { characterData } from '../backend/characterData';
import type {
  SearchCharacter,
  Character,
  DevilFruitField,
  GuessShape,
  TableEntry,
} from '../backend/types';
import { GuessCharacter } from './GuessCharacter';
import ErrorBoundary from './components/ErrorBoundary';
import './guessingGame.css';

const Header = () => (
  <header
    style={{
      marginBlockStart: '0px',
      fontSize: '1rem',
      textAlign: 'center',
      margin: '10px 0',
      fontFamily: 'Georgia, serif',
    }}>
    <h1>One Piecedle - Not Enough Characters</h1>
  </header>
);

const IconsRow = () => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '0' }}>
    <img
      src='character-icon.png'
      alt='Character Guesser'
      style={{ width: '50px', height: '50px' }}
    />
    <img
      src='devilfruit-icon.png'
      alt='Devilfruit Guesser'
      style={{ width: '50px', height: '50px' }}
    />
    <img src='laugh-icon.png' alt='Laugh Guesser' style={{ width: '50px', height: '50px' }} />
  </div>
);

const StatsRow = () => (
  <div
    style={{
      textAlign: 'center',
      margin: '0 0',
      display: 'flex',
      justifyContent: 'center',
      gap: '.25rem',
    }}>
    <p>
      Difficulty: <strong>Placeholder</strong>
    </p>
    <p>/</p>
    <p>
      Number of Guesses: <strong>Placeholder</strong>
    </p>
    <p>/</p>
    <p>
      Average Guesses: <strong>Placeholder</strong>
    </p>
  </div>
);
const formatEntryForTable = (char: Character): TableEntry => {
  const dFruit: DevilFruitField = char.devilFruit;
  let showFruit = '';
  if (dFruit === 'Unknown') showFruit = dFruit.toString();
  else if (Array.isArray(dFruit)) showFruit = dFruit[0].type;
  else showFruit = dFruit.type;
  const showAffiliations = char.affiliations.split(',').splice(0, 4).join(',');
  return {
    name: char.name,
    debut: char.debut,
    origin: char.origin,
    devilFruit: showFruit,
    bounty: char.bounty,
    affiliations: showAffiliations,
    age: char.age,
    height: char.height,
    status: char.status,
    imageUrl: char.imageUrl,
    index: char.index,
  };
};
function compareCharacterEntry(match: Character, entryChar: Character) {
  const guessChar = new GuessCharacter(match);
  return guessChar.compareAll(entryChar);
}
const headers = [
  '',
  'Name',
  'Debut',
  'Origin',
  'Devil Fruit',
  'Bounty',
  'Affiliations',
  'Age',
  'Height',
  'Status',
];
const headerKeys = [
  'name',
  'debut',
  'origin',
  'devilFruit',
  'bounty',
  'affiliations',
  'age',
  'height',
  'status',
];
const TableEntryWithComparison = ({
  entry,
  comparison,
}: {
  entry: TableEntry;
  comparison: GuessShape;
}) => {
  return (
    <tr key={entry.index}>
      <td className='table_image'>
        <img
          src='https://dok1t7q1m768g.cloudfront.net/Atagoyama_Anime.jpg?Expires=1754686278&Signature=IUmDw8QP3MRZXmUKsomyvtTPU6VHZXUsVZkf3-stPiLMl~~qnNEd98KYL8wn-4W5iter~W765UkibxWu3q7kOLQ~1s0lxh1oBL9ALJlXAW19nfj-V3TI2lDcc08slFLQNjAogUBalGP6mtHfD7ec1zNvtUIuEgPlzVHlWIkZDAod9i7ZLi2jTQ3oiWUllNu6hLFIOM3IFAcGZECWyeNS6XlWBSOX-nR4jlocL-J0kQebet-tImrDsPmUIj-Mli7OtYDDF9pEuyNv5EgkDwNY70clRZSW6ig9XKDZ-e8iS0Bsbu5aM2CqskFK7eI-ZKWQ3wZVkZzhRPtYeVaOSUdFPQ__&Key-Pair-Id=K2RCJ8R40JMUEM'
          alt='char icon'
        />
      </td>
      {headerKeys.map((header, i) => (
        <td className={comparison[header as keyof GuessShape]} key={i}>
          {entry[header as keyof TableEntry]}
        </td>
      ))}
    </tr>
  );
};
function Table({ matchCharacter, entries }: { matchCharacter: Character; entries: Character[] }) {
  // compare entries against match character
  // do I need to store the matchChar as a state..?
  const showEntries = entries.map((entry) => formatEntryForTable(entry));
  const comparedEntries = entries.map((entry) => compareCharacterEntry(matchCharacter, entry));

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0' }}>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th
              key={header + i}
              style={{ borderBottom: '2px solid #ccc', padding: '00px', textAlign: 'center' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {showEntries.map((entry, i) => (
          <TableEntryWithComparison entry={entry} comparison={comparedEntries[i]} key={i} />
        ))}
      </tbody>
    </table>
  );
}
const findCharData = (index: number) => {
  const tempChar = characterData.find((char) => {
    if (char.index === index) return char;
  });
  if (tempChar === undefined) return characterData[0];
  return tempChar;
};
const emptyTableDisplay = () => {
  return (<div>Guess a character to get started...</div>)
}
const emptyCharArray: Character[] = [];
const blackBeardMatch = findCharData(803);
function BasicGuessingGame() {
  const [entries, setEntries] = useState(emptyCharArray);
  const updateEntries = (newEntry: Character) => setEntries([...entries, newEntry]);
  const selection = (item: SearchCharacter) => {
    console.log(`${item.name} picked!`);
    const foundChar = characterData.find((char) => char.index === item.index);
    if (foundChar) updateEntries(foundChar);
    return characterData[0];
  };

  return (
    <ErrorBoundary>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '0px' }}>
        <Header />
        <IconsRow />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SelectionBox list={searchCharacterList} label={'Who is it?'} selectionMade={selection} />
        </div>
        <StatsRow />
        <Table entries={entries} matchCharacter={blackBeardMatch} />
        {entries.length === 0 && emptyTableDisplay()}

      </div>
    </ErrorBoundary>
  );
}

export default BasicGuessingGame;
