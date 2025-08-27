import { type Character, type TableEntry, type GuessShape, Comparison } from '../../backend/types';
import { GuessCharacter } from '../GuessCharacter';
import { formatEntryForDisplay } from './formatEntryForDisplay';
import DownArrow from '../../assets/down-arrow.svg';
import UpArrow from '../../assets/up-arrow.svg';
import Circle from '../../assets/circle.svg';

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
      <div
        className={`${header} ${compared} h-25 w-25 overflow-y-auto overflow-x-clip grid justify-center`}
        style={{ scrollbarWidth: 'thin', textShadow: '0 1px 4px rgba(0,0,0,.6)' }}>
        <p className='self-center'>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  if (compared === Comparison.more) {
    return (
      <div
        className={`${header} ${compared} a_container h-25 w-25 overflow-y-auto overflow-x-clip grid justify-center`}>
        <img src={UpArrow} className='arrow' />
        <p>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  }
  if (compared === Comparison.less) {
    return (
      <div
        className={`${header} ${compared} a_container h-25 w-25 overflow-y-auto overflow-x-clip grid justify-center`}>
        <img src={DownArrow} className='arrow' />
        <p>{entry[header as keyof TableEntry]}</p>
      </div>
    );
  }
  if (compared === Comparison.right) {
    return (
      <div
        className={`${header} ${compared} h-25 w-25 overflow-y-auto overflow-x-clip grid justify-center`}
        style={{ textShadow: '0 1px 4px rgba(0,0,0,.6)' }}>
        <p className='self-center'>{entry[header as keyof TableEntry]}</p>
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
    <tr key={entry.index} className=''>
      <td className='table_image flex-col table-cell justify-center align-middle p-1'>
        <img src={entry.imageUrl} alt='char icon' />
        <p>{entry.name}</p>
      </td>
      {headerKeys.map((header, i) => (
        <td
          className={`px-1 p-4 opacity-0 [transform:rotateY(90deg)] [transform-origin:left_center] animate-[flipIn_2s_forwards]`}
          key={i}
          style={{ animationDelay: `${0.25 * i}s` }}>
          {arrowDisplay(header, comparison[header as keyof GuessShape], entry)}
        </td>
      ))}
    </tr>
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
      <table
        className='m-auto table-auto [perspective:1000px]'
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0' }}>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={header + i}
                className='w-25 pb-0 pt-4'
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
        </tbody>
      </table>
      {entries.length === 0 && emptyTableDisplay()}
    </>
  );
}
