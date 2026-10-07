const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const databaseDir = path.join(projectRoot, 'src', 'database');
const modelsDir = path.join(databaseDir, 'maindb', 'models');
const associationsFile = path.join(projectRoot, 'src', 'database', 'associations.ts');

const START_MARKER = '// AUTO-GENERATED ASSOCIATIONS IMPORTS START';
const END_MARKER = '// AUTO-GENERATED ASSOCIATIONS IMPORTS END';

const toPosix = (filePath) => filePath.split(path.sep).join('/');

const findAssociationFiles = (directory) => {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...findAssociationFiles(fullPath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.association.ts')) {
      files.push(fullPath);
    }
  }

  return files;
};

const buildImportLines = () => {
  if (!fs.existsSync(modelsDir)) {
    throw new Error('Could not find models directory in src/database/maindb/models');
  }

  const files = findAssociationFiles(modelsDir)
    .sort((a, b) => a.localeCompare(b))
    .map((absolutePath) => {
      const relativeFromDatabase = path.relative(databaseDir, absolutePath);
      const importPath = `./${toPosix(relativeFromDatabase).replace(/\.ts$/, '')}`;
      return `import '${importPath}';`;
    });

  return files.join('\n');
};

const updateAssociationsFile = () => {
  const initialSource = fs.existsSync(associationsFile)
    ? fs.readFileSync(associationsFile, 'utf8')
    : `${START_MARKER}\n${END_MARKER}\n`;

  const source = initialSource.includes(START_MARKER) && initialSource.includes(END_MARKER)
    ? initialSource
    : `${initialSource.trimEnd()}\n\n${START_MARKER}\n${END_MARKER}\n`;

  const generatedImports = buildImportLines();

  const startIndex = source.indexOf(START_MARKER);
  const endIndex = source.indexOf(END_MARKER);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    throw new Error('Could not find auto-generated markers in src/database/associations.ts');
  }

  const before = source.slice(0, startIndex + START_MARKER.length);
  const after = source.slice(endIndex);
  const next = `${before}\n${generatedImports}\n${after}`;

  fs.writeFileSync(associationsFile, next);
  console.log(`Generated ${generatedImports ? generatedImports.split('\n').length : 0} association imports.`);
};

updateAssociationsFile();
