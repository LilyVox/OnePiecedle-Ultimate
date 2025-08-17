import type React from 'react';
import { useEffect, useRef } from 'react';
import { type Character, type TableEntry, type GuessShape, Comparison } from '../../backend/types';
import { GuessCharacter } from '../GuessCharacter';
import { formatEntryForDisplay } from './formatEntryForDisplay';
import DownArrow from '../../assets/down-arrow.svg';
import UpArrow from '../../assets/up-arrow.svg';

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
  if (!['debut', 'bounty', 'age', 'height'].includes(header))
    return (
      <div className={`${header} ${compared}  p-4`}>
        <p>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  if (compared === Comparison.more) {
    return (
      <div className={`${header} ${compared} a_container p-2`}>
        <img src={UpArrow} className='arrow' />
        <p>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  }
  if (compared === Comparison.less) {
    return (
      <div className={`${header} ${compared} a_container p-2`}>
        <img src={DownArrow} className='arrow' />
        <p>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  }
  if (compared === Comparison.right) {
    return (
      <div className={`${header} ${compared} p-4 h-full`}>
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
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (rowRef.current) {
      rowRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    return () => {};
  }, []);

  return (
    <tr key={entry.index} className='' ref={rowRef}>
      <td className='table_image flex-col table-cell justify-center align-middle p-1'>
        <img src={entry.imageUrl} alt='char icon' />
        <p>{entry.name}</p>
      </td>
      {headerKeys.map((header, i) => (
        <td
          className={`px-1 p-4 opacity-0 [transform:rotateY(90deg)] [transform-origin:left_center] animate-[flipIn_0.6s_forwards]`}
          key={i}
          style={{ animationDelay: `${i * 0.15}s` }}>
          {arrowDisplay(header, comparison[header as keyof GuessShape], entry)}
        </td>
      ))}
    </tr>
  );
};
const emptyTableDisplay = () => {
  return <div className='p-4'>Guess a character to get started...</div>;
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
    <table
      className='m-auto table-auto [perspective:1000px]'
      style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0' }}>
      <thead>
        <tr>
          {headers.map((header, i) => (
            <th
              key={header + i}
              className='p-6 pb-0'
              style={{ borderBottom: '2px solid #ccc', textAlign: 'center' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {showEntries.map((entry, i) => (
          <TableEntryWithComparison entry={entry} comparison={comparedEntries[i]} key={i} />
        ))}
        {entries.length === 0 && emptyTableDisplay()}
      </tbody>
    </table>
  );
}
