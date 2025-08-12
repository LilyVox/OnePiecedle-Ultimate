import type React from 'react';
import type { Character, TableEntry, DevilFruitField, GuessShape } from '../../backend/types';
import { GuessCharacter } from '../GuessCharacter';

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
const TableEntryWithComparison = ({
  entry,
  comparison,
}: {
  entry: TableEntry;
  comparison: GuessShape;
}) => {
  return (
    <tr key={entry.index}>
      <td className='table_image flex flex-col justify-center'>
        <img src={entry.imageUrl} alt='char icon' />
        <p>{entry.name}</p>
      </td>
      {headerKeys.map((header, i) => (
        <td className={`px-1`} key={i}>
          <div className={`${header} ${comparison[header as keyof GuessShape]}`}>
            <div className="arrow">
            {entry[header as keyof TableEntry]}

            </div>
          </div>
        </td>
      ))}
    </tr>
  );
};
const emptyTableDisplay = () => {
  return <div>Guess a character to get started...</div>;
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
  const showEntries = entries.map((entry) => formatEntryForTable(entry));
  const comparedEntries = entries.map((entry) => compareCharacterEntry(matchCharacter, entry));

  return (
    <table className='m-auto' style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0' }}>
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
        {entries.length === 0 && emptyTableDisplay()}
      </tbody>
    </table>
  );
}
