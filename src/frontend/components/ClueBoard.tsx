import type React from 'react';
import { Comparison, type Character, type GuessShape, type TableEntry } from '../../backend/types';
import { GuessCharacter } from '../GuessCharacter';
import { useState } from 'react';
import { formatEntryForDisplay } from './formatEntryForDisplay';

const ClueButton = ({
  show,
  placeholder,
  clue,
  click,
}: {
  show: boolean;
  placeholder: string;
  clue: string;
  click: () => void;
}) => {
  const [clued, setClued] = useState<boolean>(false);
  return !clued ? (
    <button
      className='flex-1 bg-gray-300 dark:bg-amber-600 hover:bg-blue-600 dark:hover:bg-yellow-600 text-gray-900 dark:text-white rounded-lg h-24 flex justify-center items-center p-4'
      onClick={() => {
        if (show) {
          setClued(true);
          click();
        }
        return null;
      }}>
      {placeholder}
    </button>
  ) : (
    <button className='flex-1 bg-gray-300 dark:bg-amber-600 text-gray-900 dark:text-white rounded-lg flex justify-center items-center p-4 h-fit'>
      {clue}
    </button>
  );
};
export const ClueBoard = ({ entries, target }: { entries: Character[]; target: Character }) => {
  // find what entries already have matches for the target...
  const guessesTilClueOne = 4;
  const guessesTilClueTwo = 8;
  const guessesTilClueThree = 14;
  const [clueOne, setClueOne] = useState<string>('');
  const [clueTwo, setClueTwo] = useState<string>('');
  const [clueThree, setClueThree] = useState<string>('');
  const countdown = (guessesLeft: string | number) => {
    return Math.max(Number(guessesLeft) - entries.length, 0);
  };
  const unlockOnce = (countdown: number) => {
    return countdown === 0;
  };
  const clueDisplay = (clueKey: string) => {
    const displayChar = formatEntryForDisplay(target);
    if(clueKey === "no help left") return "You're on your own!"
    return `${clueKey}: ${displayChar[clueKey as keyof TableEntry]}`;
  };
  const setClue = (
    setClue: { (value: React.SetStateAction<string>): void },
    previousClu: string
  ) => {
    setClue(findClueToGive(previousClu));
  };
  function findClueToGive(previousClue: string) {
    if (entries.length < 2) {
      console.log('oops not enough entries');
      return 'Something Broke.';
    }
    const guessTarget = new GuessCharacter(target);
    const guessKeys = [
      'devilFruit',
      'origin',
      'bounty',
      'affiliations',
      'debut',
      'age',
      'status',
      'height',
    ];
    const correctGuesses = ['name', previousClue];
    entries.forEach((entry) => {
      const compared = guessTarget.compareAll(entry);
      Object.keys(compared).forEach((key) => {
        if (key == 'name') return;
        const field = compared[key as keyof GuessShape];
        if (field === Comparison.right) correctGuesses.push(key);
      });
    });
    const remainingKeys = guessKeys.filter((key) => {
      if (correctGuesses.includes(key)) return false;
      return true;
    });
    console.log('remaining keys', remainingKeys);
    if(remainingKeys.length < 1) return "no help left"
    return remainingKeys[0];
  }
  return (
    <div className='clue_box flex justify-center items-center'>
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 w-fit max-w-sm'>
        <p>Clues!</p>
        <div className='flex justify-between items-center space-x-4'>
          <ClueButton
            show={unlockOnce(countdown(guessesTilClueOne))}
            placeholder={`Reveal in ${countdown(guessesTilClueOne)} Guesses!`}
            clue={clueDisplay(clueOne)}
            click={() => setClue(setClueOne, '')}
          />
          <ClueButton
            show={unlockOnce(countdown(guessesTilClueTwo))}
            placeholder={`Reveal in ${countdown(guessesTilClueTwo)} Guesses!`}
            clue={clueDisplay(clueTwo)}
            click={() => setClue(setClueTwo, clueOne)}
          />
          <ClueButton
            show={unlockOnce(countdown(guessesTilClueThree))}
            placeholder={`Answer in ${countdown(guessesTilClueThree)} Guesses!`}
            clue={clueThree}
            click={() => setClueThree(`it's ${target.name}!`)}
          />
        </div>
      </div>
    </div>
  );
};
