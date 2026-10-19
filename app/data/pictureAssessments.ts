/**
 * Picture assessments.
 * Pre-K and Grade 1 Math use an illustrated bank of 20 questions.
 * Their ELA pools stay in "new picture based.html".
 * Kindergarten uses the illustrated bank of 20 Math + 20 ELA.
 * A quiz draws 10 of each.
 * Grade 2 keeps its own shorter picture pool and also draws 10 of each.
 */
import boss from './pictureBoss.json';
import { kindergartenVisual } from './kindergartenVisual';
import { grade1MathVisual, prekMathVisual } from './earlyMathVisual';

type Difficulty = 'easy' | 'medium' | 'hard';

interface PictureQuestion {
  id: string;
  question: string;
  stimulus: string;
  picture: true;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  topic: string;
  subject: 'math' | 'ela';
  grade: string;
}

type Row = [string, string, [string, string, string], 0 | 1 | 2, string, Difficulty];

function pack(grade: string, subject: 'math' | 'ela', rows: Row[]): PictureQuestion[] {
  const prompts = new Set<string>();
  return rows.map((row, i) => {
    const [stimulus, prompt, options, correct, topic, difficulty] = row;
    if (prompts.has(prompt)) {
      throw new Error(`Duplicate picture prompt in ${grade} ${subject}: ${prompt}`);
    }
    prompts.add(prompt);
    const optionsUnique = options.map((o, idx) => {
      const twins = options.slice(0, idx).filter((p) => p === o).length;
      return twins ? `${o}${'\u200b'.repeat(twins)}` : o;
    });
    if (optionsUnique.filter((o) => o === optionsUnique[correct]).length !== 1) {
      throw new Error(`Correct picture must be unique in ${grade} ${subject} #${i + 1}`);
    }
    return {
      id: `pic-${grade}-${subject}-${i + 1}`,
      question: prompt,
      stimulus,
      picture: true as const,
      options: optionsUnique,
      correctAnswer: optionsUnique[correct],
      difficulty,
      topic,
      subject,
      grade,
    };
  });
}

const G2_ELA: Row[] = [
  ['🐸 🐑 🧀', 'Which picture begins with the /sh/ sound?', ['🐸', '🐑', '🧀'], 1, 'Beginning sounds', 'easy'],
  ['🚂 🐸 🌙', 'Which picture begins with the same sound as truck?', ['🚂', '🐸', '🌙'], 0, 'Beginning sounds', 'easy'],
  ['🐍 🐝 🔑', 'Which picture rhymes with cake? Adult says “cake.”', ['🐝', '🐍', '🔑'], 1, 'Rhyming', 'easy'],
  ['🌧️ ☂️ 🕶️', 'Tap what you would take on a rainy walk.', ['🕶️', '☂️', '🍦'], 1, 'Vocabulary and context', 'easy'],
  ['🥚 🐣 🐥 🐔', 'Tap what comes last in the growing-chick sequence.', ['🐣', '🐔', '🥚'], 1, 'Sequencing', 'easy'],
  ['🐢 🧀 ☀️', 'Which picture begins with the /ch/ sound?', ['🐢', '🧀', '☀️'], 1, 'Beginning sounds', 'medium'],
  ['🐻 🍐 🚪', 'Which picture rhymes with chair? Adult says “chair.”', ['🍐', '🚪', '🐻'], 2, 'Rhyming', 'medium'],
  ['🏥 🏫 🏪', 'Tap the picture of a school.', ['🏥', '🏫', '🏪'], 1, 'Vocabulary', 'medium'],
  ['🥚 🐛 🦋', 'Tap what comes first in this life cycle.', ['🥚', '🦋', '🐛'], 0, 'Sequencing', 'medium'],
  ['🛏️ 📖 🌙', 'Tap the picture that shows reading.', ['🛏️', '📖', '🌙'], 1, 'Vocabulary', 'easy'],
  ['🚩 🐑 🐸', 'Which picture begins with the /fl/ sound?', ['🚩', '🐑', '🐸'], 0, 'Beginning sounds', 'hard'],
  ['🦊 📦 🐝', 'Which picture rhymes with box? Adult says “box.”', ['🐝', '📦', '🦊'], 2, 'Rhyming', 'hard'],
  ['🧀 🍎 🍞', 'Tap the picture that is a fruit.', ['🧀', '🍎', '🍞'], 1, 'Vocabulary', 'medium'],
  ['🌅 🌆 🌙', 'Tap what comes last in a day.', ['🌅', '🌙', '🌆'], 1, 'Sequencing', 'hard'],
  ['🦆 🐕 🚪', 'Which picture begins with the same sound as drum?', ['🦆', '🐕', '🚪'], 1, 'Beginning sounds', 'hard'],
  ['🎩 🧤 👢', 'Tap the picture you wear on your hands.', ['🎩', '🧤', '👢'], 1, 'Vocabulary', 'easy'],
];

const G2_MATH: Row[] = [
  ['🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎 🍎', 'Which number tells how many apples there are?', ['11', '12', '13'], 1, 'Counting', 'easy'],
  ['🍪 🍪 🍪 🍪 🍪 🍪 + 🍪 🍪 🍪 🍪 🍪 🍪 🍪', 'How many cookies are there altogether?', ['12', '13', '14'], 1, 'Addition within 20', 'easy'],
  ['⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ − ⭐ ⭐ ⭐ ⭐ ⭐ ⭐', 'How many stars are left?', ['8️⃣', '9️⃣', '🔟'], 1, 'Subtraction within 20', 'easy'],
  ['🔟 🍎 🍎 🍎 🍎', 'How many is one ten and four ones?', ['13', '14', '15'], 1, 'Place value', 'easy'],
  ['📏', 'Which object is the longest?', ['✏️', '📎', '📏'], 2, 'Length comparison', 'easy'],
  ['🍌 🍌 🍌 🍌 🍌 🍌 🍌 🍌 🍌 + 🍌 🍌 🍌 🍌 🍌 🍌 🍌 🍌', 'How many bananas are there altogether?', ['16', '17', '18'], 1, 'Addition within 20', 'medium'],
  ['🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 − 🐟 🐟 🐟 🐟 🐟', 'How many fish are left?', ['8️⃣', '9️⃣', '🔟'], 1, 'Subtraction within 20', 'medium'],
  ['2️⃣ 4️⃣ 6️⃣ ?', 'Which number comes next when counting by twos?', ['7️⃣', '8️⃣', '9️⃣'], 1, 'Patterns', 'medium'],
  ['🔟 🔟', 'Tap the number for two groups of ten.', ['18', '20', '22'], 1, 'Place value', 'medium'],
  ['🐠 🐠 🐠 🐠 🐠 🐠 🐠 🐠 🐠 🐠 🐠 − 🐠 🐠 🐠', 'How many fish are left after three swim away?', ['7️⃣', '8️⃣', '9️⃣'], 1, 'Subtraction within 20', 'medium'],
  ['🍐 🍐 🍐 🍐 🍐 🍐 🍐 + 🍐 🍐 🍐 🍐 🍐 🍐', 'How many pears are there altogether?', ['12', '13', '14'], 1, 'Addition within 20', 'hard'],
  ['📎 ✏️ 📏', 'Which object is the shortest?', ['📏', '✏️', '📎'], 2, 'Length comparison', 'easy'],
  ['🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 − 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', 'How many cookies are left?', ['8️⃣', '9️⃣', '🔟'], 1, 'Subtraction within 20', 'hard'],
  ['🔺 🟦 🟦 🔺 🟦 🟦 🔺 ?', 'Which shape comes next in the pattern?', ['🔺', '🟦', '⚪'], 1, 'Patterns', 'hard'],
  ['🔟 🍎 🍎 🍎 🍎 🍎 🍎', 'How many is one ten and six ones?', ['15', '16', '17'], 1, 'Place value', 'hard'],
  ['🍪 🍪 🍪 🍪 🍪 + 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪 🍪', 'How many cookies are five plus nine?', ['13', '14', '15'], 1, 'Addition within 20', 'hard'],
];

const grade2 = {
  math: pack('2', 'math', G2_MATH),
  ela: pack('2', 'ela', G2_ELA),
};

type BossGrade = 'pre-k' | 'kindergarten' | '1';

export function getPictureBank(gradeKey: BossGrade | '2') {
  if (gradeKey === '2') return grade2;
  if (gradeKey === 'kindergarten') return kindergartenVisual;
  if (gradeKey === 'pre-k') {
    return { math: prekMathVisual, ela: (boss['pre-k'] as { ela: PictureQuestion[] }).ela };
  }
  if (gradeKey === '1') {
    return { math: grade1MathVisual, ela: (boss['1'] as { ela: PictureQuestion[] }).ela };
  }
  return boss[gradeKey] as { math: PictureQuestion[]; ela: PictureQuestion[] };
}
