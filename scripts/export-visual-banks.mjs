/**
 * Load the standalone visual-assessment banks and write
 * app/data/visualAssessmentBanks.json for the Next.js quiz.
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const va = path.join(root, 'visual-assessment');

const sandbox = { console, Math, Array, Object, String, Number, Boolean, Error, JSON };
sandbox.globalThis = sandbox;
sandbox.window = sandbox;
vm.createContext(sandbox);

function run(rel) {
  const code = fs.readFileSync(path.join(va, rel), 'utf8');
  vm.runInContext(code, sandbox, { filename: rel });
}

const files = [
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

for (const f of files) run(f);

const VA = sandbox.VA;
const grades = [
  ['prek', 'pre-k'],
  ['kindergarten', 'kindergarten'],
  ['grade1', '1'],
];

const out = {};
for (const [vaGrade, appGrade] of grades) {
  out[appGrade] = {
    math: VA.QuestionBank.getBank(vaGrade, 'math'),
    ela: VA.QuestionBank.getBank(vaGrade, 'ela'),
  };
  console.log(
    appGrade,
    'math',
    out[appGrade].math.length,
    'ela',
    out[appGrade].ela.length
  );
}

const dest = path.join(root, 'app', 'data', 'visualAssessmentBanks.json');
fs.writeFileSync(dest, JSON.stringify(out));
console.log('Wrote', dest, Math.round(fs.statSync(dest).size / 1024) + 'kb');
