import React, { useEffect, useState } from 'react';
import SearchBox from './components/TestSearchBox';
import { characterData } from '../backend/characterData';
import type { Character } from '../backend/types';
import ErrorBoundary from './components/ErrorBoundary';
import './guessingGame.css';
import { selectCharForGuessing, findCharDataByName } from '../backend/DataHandler';
import { Table } from './components/Table';

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
    if(foundChar !== undefined){
      if (!entries.includes(foundChar)) selection(foundChar);
    }
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
          averageGuesses={target.difficulty * 3 + 5}
        />
        <div>{entries.length > 10 && target.name}</div>
        <Table entries={entries} matchCharacter={target} />
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
