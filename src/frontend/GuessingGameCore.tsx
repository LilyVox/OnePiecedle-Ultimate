import React from 'react';
import SearchBox from './components/SearchBox';
import { characterData } from '../backend/characterData';
import type { Character } from '../backend/types';
import ErrorBoundary from './components/ErrorBoundary';
import './guessingGame.css';
import {
  findCharDataByIndex
} from '../backend/DataHandler';
import { Table } from './components/Table';
import { ClueBoard } from './components/ClueBoard';

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
export default function GuessingGameCore({ target, children, entries, setEntries }: { target: Character, entries: Character[], children: React.ReactNode, setEntries:React.Dispatch<React.SetStateAction<Character[]>> }) {
  const updateEntries = (newEntry: Character) => setEntries([...entries, newEntry]);
  const selection = (item: Character) => {
    updateEntries(item);
    return item;
  };
  const handleSearch = (query: string, char: Character) => {
    console.log('Searching for:', query);
    const foundChar = findCharDataByIndex(char.index);
    if (foundChar !== undefined) {
      if (!entries.includes(foundChar)) selection(foundChar);
    }
  };
  return (
    <ErrorBoundary>
      <div
        className='flex-col justify-center'
        style={{ fontFamily: 'Arial, sans-serif', padding: '0px' }}>
        {children}
        <ClueBoard entries={entries} target={target} />
        <StatsRow
          difficulty={target.difficulty}
          totalGuesses={50}
          averageGuesses={target.difficulty * 3 + 7}
        />
        <SearchBox<Character>
          data={characterData}
          keys={['name', 'moniker', 'affiliations']}
          displayKey='name'
          debounceMs={400}
          maxVisible={10}
          onSearch={handleSearch}
          renderItem={(char) => (
            <div className='flex flex-row justify-center'>
              <img
                className='table_image flex-col table-cell justify-center align-middle p-1 max-h-24 object-scale-down'
                src={char.imageUrl}
              />
              <div>
                <strong>{char.name}</strong>
                <div className='text-m text-gray-500'>{char.moniker}</div>
                <div className='text-m text-gray-500'>{char.affiliations.split(',')[0]}</div>
              </div>
            </div>
          )}
        />
        <Table entries={entries} matchCharacter={target} />
      </div>
    </ErrorBoundary>
  );
}