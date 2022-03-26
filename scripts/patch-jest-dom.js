import fs from 'fs';
import path from 'path';

// TODO: This file should be temporary:
// https://github.com/beefchimi/react-hooks/issues/28
// https://github.com/testing-library/jest-dom/issues/427

const encoding = 'utf8';

const typesPath = path.resolve(
  'node_modules',
  '@types',
  'testing-library__jest-dom',
  'index.d.ts',
);

const referenceContent = 'reference types="jest"';
const referenceDeclaration = `/// <${referenceContent} />`;

fs.readFile(typesPath, encoding, (readError, data) => {
  if (readError) throw readError;

  let lines = data.split('\n');

  const jestTypesIndex = lines.findIndex((line) =>
    line.includes(referenceContent),
  );

  if (lines[jestTypesIndex] === referenceDeclaration) {
    lines = lines
      .slice(0, jestTypesIndex)
      .concat(lines.slice(jestTypesIndex + 1));
  }

  fs.writeFile(typesPath, lines.join('\n'), encoding, (writeError) => {
    if (writeError) throw writeError;
  });
});
