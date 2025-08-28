import { useState, useEffect } from 'react';
import { selectRandomCharForGuessing } from '../backend/DataHandler';
import type { Character } from '../backend/types';
import GuessingGameCore from './GuessingGameCore';
import JSConfetti from 'js-confetti';
import { Link } from 'react-router';

export const Header = () => (
  <header
    style={{
      marginBlockStart: '0px',
      fontSize: '1rem',
      textAlign: 'center',
      margin: '10px 0',
      fontFamily: 'Georgia, serif',
    }}>
    <Link to={'/'}>
      <h1>One Piecedle - Not Enough Characters</h1>
    </Link>
  </header>
);
export const IconsRow = () => (
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

export default function GuessingGameController() {
  const [tChar, setTChar] = useState<Character>();
  const [entries, setEntries] = useState<Character[]>([]);
  useEffect(() => {
    if (!tChar) {
      setTChar(selectRandomCharForGuessing());
    }
    const jsConfetti = new JSConfetti();
    if (tChar && entries.includes(tChar)) {
      jsConfetti.addConfetti({
        emojis: ['☠️', '🏴‍☠️ ', '💥', '✨', '🍖', '⚓'],
        emojiSize: 100,
        confettiNumber: 60,
      });
    }
  }, [tChar, entries]);

  return (
    tChar && (
      <GuessingGameCore entries={entries} setEntries={setEntries} target={tChar}>
        <Header />
        <IconsRow />
      </GuessingGameCore>
    )
  );
}
