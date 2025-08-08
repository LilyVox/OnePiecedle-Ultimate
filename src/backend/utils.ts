import * as fs from 'fs';

export function saveDataToFile(fileName: string, objectType: string, objectToSave: object[]) {
  try {
    // Format the data as a TypeScript export
    const fileContent = `import type { ${objectType} } from "./types.ts";
export const ${fileName}:${objectType}[] = ${JSON.stringify(objectToSave, null, 2)};`;
    // Write the data to a TypeScript file
    fs.writeFileSync(fileName + '.ts', fileContent);
    console.log(`Data saved to ${fileName}.ts`);
  } catch (error) {
    console.error(`Error saving ${fileName}:`, error);
  }
}