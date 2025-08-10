import React, { useEffect, useState } from 'react';
import SearchBox from './components/TestSearchBox';
import { characterData } from '../backend/characterData';
import type { Character, DevilFruitField, GuessShape, TableEntry } from '../backend/types';
import { GuessCharacter } from './GuessCharacter';
import ErrorBoundary from './components/ErrorBoundary';
import './guessingGame.css';
import { selectCharForGuessing, findCharDataByName } from '../backend/DataHandler';

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

const StatsRow = ({
  difficulty,
  totalGuesses,
  averageGuesses,
}: {
  difficulty: number;
  totalGuesses: number;
  averageGuesses: number;
}) => (
  <div
    style={{
      textAlign: 'center',
      margin: '0 0',
      display: 'flex',
      justifyContent: 'center',
      gap: '.25rem',
    }}>
    <p>
      Difficulty: <strong>{difficulty}</strong>
    </p>
    <p>/</p>
    <p>
      Total Guesses: <strong>{totalGuesses}</strong>
    </p>
    <p>/</p>
    <p>
      Average Guesses: <strong>{averageGuesses}</strong>
    </p>
  </div>
);
const formatEntryForTable = (char: Character): TableEntry => {
  const dFruit: DevilFruitField = char.devilFruit;
  let showFruit = '';
  if (dFruit === 'Unknown') showFruit = dFruit.toString();
  else if (Array.isArray(dFruit)) showFruit = dFruit[0].type;
  else showFruit = dFruit.type;
  const showAffiliations = char.affiliations;
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
        <img src={entry.imageUrl} alt='char icon' />
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
const emptyTableDisplay = () => {
  return <div>Guess a character to get started...</div>;
};

function BasicGuessingGame({ target }: { target: Character }) {
  const [entries, setEntries] = useState<Character[]>([]);
  const updateEntries = (newEntry: Character) => setEntries([...entries, newEntry]);
  const selection = (item: Character) => {
    updateEntries(item);
    return item;
  };
  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    const foundChar = findCharDataByName(query);
    if (!entries.includes(foundChar)) selection(foundChar);
  };

  return (
    <ErrorBoundary>
      <div
        className='flex-col justify-center'
        style={{ fontFamily: 'Arial, sans-serif', padding: '0px' }}>
        <Header />
        <IconsRow />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
        </div>
        <StatsRow
          difficulty={target.difficulty}
          totalGuesses={50}
          averageGuesses={target.difficulty + 1}
        />
        <div>{entries.length > 10 && target.name}</div>
        <Table entries={entries} matchCharacter={target} />
        {entries.length === 0 && emptyTableDisplay()}
        <SearchBox<Character>
          data={characterData}
          keys={['name', 'moniker', 'affiliations']}
          displayKey='name'
          debounceMs={400}
          maxVisible={10}
          onSearch={handleSearch}
          renderItem={(char) => (
            <div>
              <strong>{char.name}</strong>
              <div className='text-m text-gray-500'>{char.moniker}</div>
              <div className='text-m text-gray-500'>{char.affiliations.split(',')[0]}</div>
            </div>
          )}
        />
      </div>
    </ErrorBoundary>
  );
}
function GuessingGameController() {
  const [tChar, setTChar] = useState<Character>();
  useEffect(() => {
    setTChar(selectCharForGuessing())
  }, [])
  
  return tChar && <BasicGuessingGame target={tChar} />;
}

export default GuessingGameController;
