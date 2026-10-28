/* Loads the browser scripts into Node (they attach to globalThis.VA) so tests can use them. */
const path = require('path');
const root = path.join(__dirname, '..');

function load(files) {
  globalThis.window = undefined; // scripts pick globalThis when window is undefined
  files.forEach((f) => require(path.join(root, f)));
  return globalThis.VA;
}

const DATA_FILES = [
  'js/curriculum.js',
  'questions/helpers.js',
  'questions/prek-math.js',
  'questions/prek-ela.js',
  'questions/kindergarten-math.js',
  'questions/kindergarten-ela.js',
  'questions/grade1-math.js',
  'questions/grade1-ela.js',
  'js/question-data.js',
];

const ENGINE_FILES = ['js/question-selector.js', 'js/scoring.js', 'js/assessment-engine.js', 'js/persistence.js'];

module.exports = { load, DATA_FILES, ENGINE_FILES, root };
