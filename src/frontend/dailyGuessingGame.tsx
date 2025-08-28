import { useState, useEffect, type ChangeEvent } from 'react';
import { getDailyCharacter } from '../backend/DataHandler';
import type { Character } from '../backend/types';
import GuessingGameCore from './GuessingGameCore';
import { Link } from 'react-router';
import { Modal } from './components/Modal';
import JSConfetti from 'js-confetti';

const dateTransform = (d: Date = new Date()) => {
  return d.toISOString().split('T')[0];
};
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
export default function DailyGameController() {
  const [tChar, setTChar] = useState<Character>();
  const [entries, setEntries] = useState<Character[]>([]);
  const [gameDate, setGameDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [displayDate, setDisplayDate] = useState<Date>(new Date());
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.valueAsDate;
    if (newDate !== null) {
      setModalOpen(true);
      setDisplayDate(newDate);
    }
  };
  const loadEntries = (entries: Character[] = []) => {
    setEntries(entries);
  };
  const cancelChange = () => {
    setDisplayDate(gameDate);
    setModalOpen(false);
  };
  const confirmChange = () => {
    setGameDate(new Date(dateTransform(displayDate)));
    loadEntries()
    setModalOpen(false);
  };

  useEffect(() => {
    if (!tChar) {
      setTChar(getDailyCharacter(gameDate));
    }
    const jsConfetti = new JSConfetti();
    if (tChar && entries.includes(tChar)) {
      jsConfetti.addConfetti({
        emojis: ['☠️', '🏴‍☠️ ', '💥', '✨', '🍖', '⚓'],
        emojiSize: 100,
        confettiNumber: 60,
      });
    }
  }, [gameDate, tChar, entries]);
  return (
    tChar && (
      <GuessingGameCore target={tChar} setEntries={setEntries} entries={entries}>
        <Modal
          open={modalOpen}
          titleContent={<h1 className='text-black'> Sure you want to change the date?</h1>}
          primaryFn={confirmChange}
          secondaryFn={cancelChange}
          content={
            <>
              <h2 className='text-black'>This will wipe your current guesses.</h2>
              <p className='text-black'>
                To cancel, press Escape, close, or click outside the
                modal. To confirm, press continue.
              </p>
            </>
          }
        />
        <Header />
        <IconsRow />
        <input
          name='gamedate'
          value={dateTransform(displayDate)}
          onChange={changeHandler}
          min={dateTransform(new Date('2025-08-01'))}
          max={dateTransform()}
          id='gamedate'
          type='date'
        />
      </GuessingGameCore>
    )
  );
}
