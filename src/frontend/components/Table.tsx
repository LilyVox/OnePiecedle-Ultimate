import { type Character, type TableEntry, type GuessShape, Comparison } from '../../backend/types';
import { GuessCharacter } from '../GuessCharacter';
import { formatEntryForDisplay } from './formatEntryForDisplay';
import DownArrow from '../../assets/down-arrow.svg';
import UpArrow from '../../assets/up-arrow.svg';
import Circle from '../../assets/circle.svg';
import Cross from '../../assets/cross.svg';

function compareCharacterEntry(match: Character, entryChar: Character) {
  const guessChar = new GuessCharacter(match);
  return guessChar.compareAll(entryChar);
}
const headers = [
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
  'debut',
  'origin',
  'devilFruit',
  'bounty',
  'affiliations',
  'age',
  'height',
  'status',
];
const arrowDisplay = (header: string, compared: string, entry: TableEntry) => {
  const universalStyle = 'rounded-lg h-25 w-25 overflow-y-auto overflow-x-clip grid justify-center';
  if (compared === Comparison.wrong) {
    return (
      <div className={`${header} ${compared} a_container ${universalStyle}`}>
        <img src={Cross} className='sticky arrow' />
        <p className='overflow-y-auto overflow-x-clip'>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  }
  if (compared === Comparison.more) {
    return (
      <div className={`${header} ${compared} a_container ${universalStyle}`}>
        <img src={UpArrow} className='arrow' />
        <p>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  }
  if (compared === Comparison.less) {
    return (
      <div className={`${header} ${compared} a_container ${universalStyle}`}>
        <img src={DownArrow} className='arrow' />
        <p>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  }
  if (compared === Comparison.right) {
    return (
      <div className={`${header} ${compared} a_container ${universalStyle}`}>
        <img src={Circle} className='arrow' />
        <p>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  }
};
const TableEntryWithComparison = ({
  entry,
  comparison,
}: {
  entry: TableEntry;
  comparison: GuessShape;
}) => {
  return (
    <div key={entry.index} className='flex flex-row h-28'>
      <div className='px-1 p-2'>
        <div className='table_image flex-col table-cell rounded-lg h-25 w-25 overflow-x-clip justify-center '>
          <img className='h-21 bg-cover' src={entry.imageUrl} alt='char icon' />
          <p className='hover:opacity-0 opacity-100' >{entry.name}</p>
        </div>
      </div>
      {headerKeys.map((header, i) => (
        <div
          className={` px-1 p-2 opacity-0 [transform:rotateY(90deg)] [transform-origin:left_center] animate-[flipIn_2s_forwards] rounded-l`}
          key={i}
          style={{ animationDelay: `${0.25 * i}s` }}>
          {arrowDisplay(header, comparison[header as keyof GuessShape], entry)}
        </div>
      ))}
    </div>
  );
};
const emptyTableDisplay = () => {
  return <p className='p-4'>Guess a character to get started...</p>;
};
export function Table({
  matchCharacter,
  entries,
}: {
  matchCharacter: Character;
  entries: Character[];
}) {
  // compare entries against match character
  // do I need to store the matchChar as a state..?
  const showEntries = entries.map((entry) => formatEntryForDisplay(entry));
  const comparedEntries = entries.map((entry) => compareCharacterEntry(matchCharacter, entry));

  return (
    <>
      <div
        className='m-auto [perspective:1000px] '
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0' }}>
        <div className='flex flex-row pb-0 pt-4'>
          {headers.map((header, i) => (
            <div
              key={header + i}
              className='px-2 w-27'
              style={{ borderBottom: '2px solid #ccc', textAlign: 'center' }}>
              <p className='w-25'>{header}</p>
            </div>
          ))}
        </div>
        <div className='flex flex-col-reverse'>
          {showEntries.map((entry, i) => (
            <TableEntryWithComparison entry={entry} comparison={comparedEntries[i]} key={i} />
          ))}
        </div>
      </div>
      {entries.length === 0 && emptyTableDisplay()}
    </>
  );
}
