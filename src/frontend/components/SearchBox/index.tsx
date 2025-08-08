import groupBy from "lodash-es/groupBy.js";
import { matchSorter } from "match-sorter";
import * as React from "react";
import {
  Combobox,
  ComboboxGroup,
  ComboboxItem,
  ComboboxSeparator,
} from "./combobox.tsx";
import { type Character, type SearchCharacter } from "../../../backend/types.ts";
import "./style.css";

export default function SelectionBox({list, selectionMade, label}: {list: SearchCharacter[], selectionMade: (item:SearchCharacter)=> Character, label:string }) {
  const [value, setValue] = React.useState("");
  const deferredValue = React.useDeferredValue(value);
  const resultsLength = 10;
  const minGuessLength = 2;

  const matches = React.useMemo(() => {
    const items = matchSorter(list, deferredValue, { keys: ["name", "mainAffiliation"] });
    return Object.entries(groupBy(items, "mainAffiliation"));
  }, [deferredValue, list]);

  return (
    <label className="label">
      {label}
      <Combobox
        autoSelect
        autoComplete="both"
        placeholder="e.g., Luffy"
        value={value}
        onChange={setValue}
        style={{display:'flex'}}
        >
        {matches.length ? (
          matches.map(([type, items], i) => (
            <React.Fragment key={type}>
              <ComboboxGroup label={type}>
                {items.map((item) => (
                  <ComboboxItem key={item.index} value={item.name} onClick={()=>selectionMade(item)}/>
                ))}
              </ComboboxGroup>
              {i < matches.length - 1 && <ComboboxSeparator />}
            </React.Fragment>
          ))
        ) : (
          <div className="no-results">No results found</div>
        )}
      </Combobox>
    </label>
  );
}
