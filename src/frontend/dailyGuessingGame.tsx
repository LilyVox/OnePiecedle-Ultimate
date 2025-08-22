import React, {
  useState,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type ChangeEvent,
} from 'react';
import { getDailyCharacter } from '../backend/DataHandler';
import type { Character } from '../backend/types';
import GuessingGameCore from './GuessingGameCore';
import { Link } from 'react-router';
import { Modal } from './components/Modal';

const dateTransform = (d: Date) => {
  return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate() + 1}`;
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
const DailyHeader = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.valueAsDate;
    if (newDate !== null) {
      setModalOpen(true);
      setTempDate(new Date(dateTransform(newDate)));
    }
  };
  const cancelChange = () => {
    setTempDate(new Date(dateTransform(date)));
    setModalOpen(false);
  };
  const confirmChange = () => {
    setDate(new Date(dateTransform(tempDate)));
    setModalOpen(false);
  };
  return (
    <div>
      {date.toLocaleDateString()}
      <input
        name='gamedate'
        value={tempDate.toLocaleDateString()}
        onChange={changeHandler}
        max={new Date().toLocaleDateString()}
        id='gamedate'
        type='date'
      />
      <Modal
        open={modalOpen}
        titleContent={<h1 className='text-black'> Are you sure? </h1>}
        primaryFn={confirmChange}
        secondaryFn={cancelChange}
        content={
          <>
            <h2 className='text-black'>This is a modal</h2>
            <p className='text-black'>
              You can close it by pressing Escape key, pressing close, or clicking outside the
              modal.
            </p>
          </>
        }
      />
    </div>
  );
};

export default function DailyGameController() {
  const [tChar, setTChar] = useState<Character>();
  const [gameDate, setGameDate] = useState<Date>(new Date());
  useEffect(() => {
    setTChar(getDailyCharacter(gameDate));
  }, [gameDate]);
  return (
    tChar && (
      <GuessingGameCore target={tChar}>
        <Header />
        <IconsRow />
        <DailyHeader date={gameDate} setDate={setGameDate} />
      </GuessingGameCore>
    )
  );
}
