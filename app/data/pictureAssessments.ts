/**
 * Picture assessments for Pre-K, Kindergarten, Grade 1, and Grade 2.
 * Each item is a picture stimulus, a short line for an adult to read aloud,
 * and three picture choices. The first five items in Pre-K, Kindergarten,
 * and Grade 1 follow the sample picture assessment.
 */
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
      picture: true,
      options: optionsUnique,
      correctAnswer: optionsUnique[correct],
      difficulty,
      topic,
      subject,
      grade,
    };
  });
}

const PREK_ELA: Row[] = [
  ['🐶 🐱 🐶', 'Tap the picture that matches the first picture in the dog row.', ['🐱', '🐶', '🐰'], 1, 'Visual matching', 'easy'],
  ['🍎 🍌 🍎', 'Tap the picture that matches the first picture in the fruit row.', ['🍐', '🍎', '🍌'], 1, 'Visual matching', 'easy'],
  ['🐮 🐮 🐷', 'Tap the animal that appears twice.', ['🐷', '🐸', '🐮'], 2, 'Picture recognition', 'easy'],
  ['🌞 🌙 🌞', 'Tap the picture that matches the first picture in the sky row.', ['⭐', '🌞', '🌙'], 1, 'Visual matching', 'easy'],
  ['🔴 🔵 🔴', 'Tap the color that matches the first circle.', ['🔵', '🟢', '🔴'], 2, 'Visual discrimination', 'easy'],
  ['🐱 🐶 🐱', 'Tap the animal that appears twice in the pet row.', ['🐶', '🐱', '🐭'], 1, 'Picture recognition', 'easy'],
  ['🚗 🚌 🚗', 'Tap the picture that matches the first vehicle.', ['🚌', '🚲', '🚗'], 2, 'Visual matching', 'medium'],
  ['🐸 🐸 🐢', 'Tap the animal you see two times in this row.', ['🐢', '🐸', '🐍'], 1, 'Picture recognition', 'medium'],
  ['🟩 🟨 🟩', 'Tap the color that matches the first square.', ['🟨', '🟥', '🟩'], 2, 'Visual discrimination', 'medium'],
  ['🐦 🐟 🐦', 'Tap the picture that is the same as the first picture.', ['🐟', '🐦', '🐝'], 1, 'Visual matching', 'medium'],
  ['🍌 🍌 🍎', 'Which fruit is shown twice?', ['🍎', '🍇', '🍌'], 2, 'Picture recognition', 'hard'],
  ['⚫ ⚪ ⚫', 'Tap the circle that matches the first circle.', ['⚪', '🔴', '⚫'], 2, 'Visual discrimination', 'hard'],
  ['🦁 🐯 🦁', 'Tap the animal that appears twice in the big-cat row.', ['🐯', '🦁', '🐻'], 1, 'Picture recognition', 'hard'],
  ['✏️ 📏 ✏️', 'Tap the picture that matches the first school tool.', ['📏', '✂️', '✏️'], 2, 'Visual matching', 'hard'],
  ['🦆 🐥 🦆', 'Tap the bird that appears twice.', ['🐥', '🦉', '🦆'], 2, 'Picture recognition', 'medium'],
  ['🟣 🟠 🟣', 'Tap the color that matches the first dot.', ['🟠', '🟣', '🟡'], 1, 'Visual discrimination', 'easy'],
];

const PREK_MATH: Row[] = [
  ['🍎 🍎 🍎', 'How many apples are there?', ['🍎', '🍎 🍎', '🍎 🍎 🍎'], 2, 'Counting 1–3', 'easy'],
  ['⭐ ⭐', 'How many stars are there?', ['⭐', '⭐ ⭐', '⭐ ⭐ ⭐'], 1, 'Counting 1–3', 'easy'],
  ['🐻', 'Tap the group with one bear.', ['🐻 🐻', '🐻', '🐻 🐻 🐻'], 1, 'Quantity', 'easy'],
  ['🔺 🔵 🔺', 'Tap the shape that matches the first shape.', ['🔵', '🟩', '🔺'], 2, 'Shape recognition', 'easy'],
  ['🍐 🍐 🍐 🍐', 'Tap the group with fewer pears.', ['🍐 🍐', '🍐 🍐 🍐 🍐', '🍐 🍐 🍐'], 0, 'Compare quantities', 'easy'],
  ['🍪', 'How many cookies are there?', ['🍪 🍪', '🍪', '🍪 🍪 🍪'], 1, 'Counting 1–3', 'easy'],
  ['🌸 🌸 🌸', 'Tap the group with three flowers.', ['🌸', '🌸 🌸', '🌸 🌸 🌸'], 2, 'Quantity', 'easy'],
  ['🟦', 'Tap the shape that matches this square.', ['🔺', '🟦', '⚪'], 1, 'Shape recognition', 'medium'],
  ['🐟 🐟', 'Tap the group with more fish.', ['🐟', '🐟 🐟 🐟', '🐟 🐟'], 1, 'Compare quantities', 'medium'],
  ['🍌 🍌 🍌 🍌', 'How many bananas are there?', ['🍌 🍌', '🍌 🍌 🍌', '🍌 🍌 🍌 🍌'], 2, 'Counting', 'medium'],
  ['⚪ ⚪ ⚪ ⚪ ⚪', 'Tap the group with fewer circles.', ['⚪ ⚪', '⚪ ⚪ ⚪ ⚪ ⚪', '⚪ ⚪ ⚪'], 0, 'Compare quantities', 'medium'],
  ['⬛ 🔺 ⬛', 'Tap the shape that comes next: square, triangle, square.', ['⬛', '🔺', '⚪'], 1, 'Patterns', 'hard'],
  ['🐻 🐻 🐻', 'Tap the group that has the same number of bears.', ['🐻', '🐻 🐻', '🐻 🐻 🐻'], 2, 'Quantity', 'hard'],
  ['🚗 🚗', 'How many cars are there?', ['🚗 🚗 🚗', '🚗', '🚗 🚗'], 2, 'Counting 1–3', 'easy'],
  ['🟡', 'Tap the group with one sun.', ['🟡 🟡', '🟡 🟡 🟡', '🟡'], 2, 'Quantity', 'medium'],
  ['🔺 🔺 🔺 🔺 🔺', 'Tap the group with more triangles.', ['🔺 🔺 🔺', '🔺', '🔺 🔺 🔺 🔺 🔺'], 2, 'Compare quantities', 'hard'],
];

const K_ELA: Row[] = [
  ['🐝 🐟 🐻', 'Which picture begins with the /b/ sound?', ['🐟', '🐝', '🐢'], 1, 'Beginning sounds', 'easy'],
  ['☀️ 🐍 🍎', 'Which picture begins with the /s/ sound?', ['🍎', '☀️', '🐻'], 1, 'Beginning sounds', 'easy'],
  ['🐱 🐟 🦇', 'Which picture rhymes with cat? Adult says “cat.”', ['🐟', '🐶', '🦇'], 2, 'Rhyming', 'easy'],
  ['🌱 🌷 🌳', 'Tap the picture that shows a flower.', ['🌷', '🚗', '🥄'], 0, 'Vocabulary', 'easy'],
  ['🥚 🐣 🐥', 'Tap what comes first in this sequence.', ['🐥', '🥚', '🐣'], 1, 'Sequencing', 'easy'],
  ['🐭 🐸 🍎', 'Which picture begins with the /m/ sound?', ['🐸', '🐭', '🍎'], 1, 'Beginning sounds', 'easy'],
  ['🐱 🎩 🐝', 'Which picture rhymes with hat? Adult says “hat.”', ['🐝', '🐱', '🎩'], 2, 'Rhyming', 'medium'],
  ['🌧️ ☂️ 🍦', 'Tap what you use in the rain.', ['🍦', '☂️', '🧸'], 1, 'Vocabulary', 'medium'],
  ['🌱 🌿 🌳', 'Tap what comes last as the plant grows.', ['🌱', '🌳', '🌿'], 1, 'Sequencing', 'medium'],
  ['🐷 🐸 🍎', 'Which picture begins with the /p/ sound?', ['🐸', '🐷', '🍎'], 1, 'Beginning sounds', 'medium'],
  ['🐟 🪨 🧦', 'Which picture rhymes with sock? Adult says “sock.”', ['🐟', '🪨', '🧦'], 1, 'Rhyming', 'hard'],
  ['🚌 🏠 🍎', 'Tap the picture that shows a place to live.', ['🚌', '🏠', '🍎'], 1, 'Vocabulary', 'medium'],
  ['⭐ 🌙 ☀️', 'Tap the picture of the moon.', ['⭐', '🌙', '☀️'], 1, 'Vocabulary', 'easy'],
  ['🐢 🐸 🐍', 'Which picture begins with the /t/ sound?', ['🐸', '🐍', '🐢'], 2, 'Beginning sounds', 'hard'],
  ['🥚 🐣 🐥', 'Tap what comes last in the egg, hatch, chick sequence.', ['🐣', '🐥', '🥚'], 1, 'Sequencing', 'hard'],
  ['🐶 🍞 🐍', 'Which picture begins with the /d/ sound?', ['🍞', '🐍', '🐶'], 2, 'Beginning sounds', 'hard'],
];

const K_MATH: Row[] = [
  ['🍓 🍓 🍓 🍓', 'How many strawberries are there?', ['3️⃣', '4️⃣', '5️⃣'], 1, 'Counting', 'easy'],
  ['🔵 🔵 🔵', 'Tap the number that tells how many dots there are.', ['2️⃣', '3️⃣', '4️⃣'], 1, 'Quantity and numerals', 'easy'],
  ['🔺', 'Which shape matches this shape?', ['⚪', '🔺', '🟦'], 1, 'Shape recognition', 'easy'],
  ['🍪 🍪 🍪 + 🍪 🍪', 'How many cookies are there altogether?', ['4️⃣', '5️⃣', '6️⃣'], 1, 'Addition within 10', 'easy'],
  ['🐠 🐠 🐠 🐠 🐠', 'Tap the group with fewer fish.', ['🐠 🐠', '🐠 🐠 🐠 🐠', '🐠 🐠 🐠'], 0, 'Compare quantities', 'easy'],
  ['⭐ ⭐ ⭐ ⭐ ⭐ ⭐', 'How many stars are in this group?', ['5️⃣', '6️⃣', '7️⃣'], 1, 'Counting', 'easy'],
  ['🍎 🍎 + 🍎 🍎 🍎', 'How many apples are there altogether?', ['4️⃣', '5️⃣', '6️⃣'], 1, 'Addition within 10', 'medium'],
  ['🟦', 'Which shape matches this square?', ['🔺', '⚪', '🟦'], 2, 'Shape recognition', 'medium'],
  ['🍐 🍐 🍐 🍐 🍐 🍐 🍐', 'How many pears are there?', ['6️⃣', '7️⃣', '8️⃣'], 1, 'Counting', 'medium'],
  ['🌸 🌸 🌸 🌸 🌸 🌸', 'Tap the group with more flowers.', ['🌸 🌸', '🌸 🌸 🌸 🌸 🌸 🌸', '🌸 🌸 🌸'], 1, 'Compare quantities', 'medium'],
  ['🔴 🔴 🔴 🔴', 'Which number tells how many red circles there are?', ['3️⃣', '4️⃣', '5️⃣'], 1, 'Quantity and numerals', 'medium'],
  ['⚪', 'Which shape matches this circle?', ['🔺', '⚪', '🟦'], 1, 'Shape recognition', 'easy'],
  ['🍌 🍌 🍌 + 🍌', 'How many bananas are there altogether?', ['3️⃣', '4️⃣', '5️⃣'], 1, 'Addition within 10', 'hard'],
  ['🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗', 'How many cars are there?', ['7️⃣', '8️⃣', '9️⃣'], 1, 'Counting', 'hard'],
  ['🔺 🟦 🔺', 'Which shape comes next in the pattern?', ['🟦', '🔺', '⚪'], 0, 'Patterns', 'hard'],
  ['🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟', 'Tap the number for nine fish.', ['8️⃣', '9️⃣', '🔟'], 1, 'Counting', 'hard'],
];

const G1_ELA: Row[] = [
  ['🐸 🐐 🦊', 'Which picture begins with the same sound as fish?', ['🐸', '🐐', '🦊'], 2, 'Beginning sounds', 'easy'],
  ['🐝 🌳 🥁', 'Which picture rhymes with tree? Adult says “tree.”', ['🐝', '🌳', '🥁'], 1, 'Rhyming', 'easy'],
  ['🌧️ ☂️ 👢', 'Tap what you might use when it starts raining.', ['🍦', '☂️', '🛏️'], 1, 'Vocabulary and context', 'easy'],
  ['🥚 🐣 🐔', 'Tap the picture that comes last in the sequence.', ['🥚', '🐣', '🐔'], 2, 'Sequencing', 'easy'],
  ['🐈 🐕 🐈', 'Tap the picture that is different from the first and last pictures.', ['🐈', '🐕', '🐈'], 1, 'Categorization', 'easy'],
  ['🐍 ☀️ 🧦', 'Which picture begins with the same sound as sun?', ['🐍', '☀️', '🧦'], 1, 'Beginning sounds', 'easy'],
  ['🐱 🧢 🐟', 'Which picture rhymes with map? Adult says “map.”', ['🐟', '🐱', '🧢'], 2, 'Rhyming', 'medium'],
  ['🥶 🧥 🍦', 'Tap what you might wear when it is cold.', ['🍦', '🧥', '🕶️'], 1, 'Vocabulary and context', 'medium'],
  ['🌱 🌷 🥀', 'Tap what comes last as a flower grows, blooms, then wilts.', ['🌱', '🌷', '🥀'], 2, 'Sequencing', 'medium'],
  ['🚌 🚗 🚌', 'Tap the picture that is different in the vehicle row.', ['🚌', '🚗', '🚌'], 1, 'Categorization', 'medium'],
  ['🧀 🐸 🐑', 'Which picture begins with the same sound as ship?', ['🧀', '🐸', '🐑'], 2, 'Beginning sounds', 'hard'],
  ['🌙 🥄 🚪', 'Which picture rhymes with moon? Adult says “moon.”', ['🚪', '🥄', '🌙'], 1, 'Rhyming', 'hard'],
  ['🛏️ 📚 🌙', 'Tap what you might use when it is time to sleep.', ['📚', '🛏️', '🚌'], 1, 'Vocabulary and context', 'medium'],
  ['🐛 → ?', 'Tap what comes next after the caterpillar.', ['🥚', '🦋', '🐛'], 1, 'Sequencing', 'hard'],
  ['🍎 🍌 🍎', 'Tap the fruit that is different from the first and last.', ['🍎', '🍌', '🍎'], 1, 'Categorization', 'easy'],
  ['🔑 🪁 🐐', 'Which picture begins with the same sound as kite?', ['🐐', '🔑', '🪁'], 1, 'Beginning sounds', 'hard'],
];

const G1_MATH: Row[] = [
  ['🍎 🍎 🍎 🍎 🍎 🍎', 'Which number tells how many apples there are?', ['5️⃣', '6️⃣', '7️⃣'], 1, 'Counting and cardinality', 'easy'],
  ['🔴 🔴 🔴 🔴 + 🔴 🔴', 'How many counters are there altogether?', ['5️⃣', '6️⃣', '7️⃣'], 1, 'Addition', 'easy'],
  ['🍪 🍪 🍪 🍪 🍪 − 🍪 🍪', 'How many cookies are left?', ['2️⃣', '3️⃣', '4️⃣'], 1, 'Subtraction', 'easy'],
  ['🟦 🔺 🟦 🔺 🟦 ?', 'Which shape comes next in the pattern?', ['🟦', '🔺', '⚪'], 1, 'Patterns', 'easy'],
  ['📏', 'Which object is longest?', ['✏️', '🖍️', '📏'], 2, 'Length comparison', 'easy'],
  ['⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐ ⭐', 'Which number tells how many stars there are?', ['7️⃣', '8️⃣', '9️⃣'], 1, 'Counting and cardinality', 'medium'],
  ['🍌 🍌 🍌 + 🍌 🍌 🍌 🍌', 'How many bananas are there altogether?', ['6️⃣', '7️⃣', '8️⃣'], 1, 'Addition', 'medium'],
  ['🐟 🐟 🐟 🐟 🐟 🐟 🐟 − 🐟 🐟 🐟', 'How many fish are left?', ['3️⃣', '4️⃣', '5️⃣'], 1, 'Subtraction', 'medium'],
  ['🍎 🍎 🍌 🍎 🍎 🍌 🍎 ?', 'Which picture comes next in this fruit pattern?', ['🍎', '🍌', '🍪'], 0, 'Patterns', 'medium'],
  ['✏️ 📏 🖍️', 'Which object is shortest?', ['📏', '✏️', '🖍️'], 2, 'Length comparison', 'medium'],
  ['🍐 🍐 🍐 🍐 🍐 🍐 🍐 🍐 🍐', 'Which number tells how many pears there are?', ['8️⃣', '9️⃣', '🔟'], 1, 'Counting and cardinality', 'hard'],
  ['🍪 🍪 🍪 🍪 🍪 🍪 − 🍪', 'How many cookies are left after one is eaten?', ['4️⃣', '5️⃣', '6️⃣'], 1, 'Subtraction', 'hard'],
  ['🐻 🐻 + 🐻 🐻 🐻 🐻 🐻', 'How many bears are there altogether?', ['6️⃣', '7️⃣', '8️⃣'], 1, 'Addition', 'hard'],
  ['🔺 🔺 🟦 🔺 🔺 🟦 🔺 ?', 'Which shape comes next in this longer pattern?', ['🔺', '🟦', '⚪'], 0, 'Patterns', 'hard'],
  ['🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗 🚗', 'Which number tells how many cars there are?', ['9️⃣', '🔟', '8️⃣'], 1, 'Counting and cardinality', 'easy'],
  ['🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸 − 🌸 🌸 🌸 🌸 🌸', 'How many flowers are left?', ['2️⃣', '3️⃣', '4️⃣'], 1, 'Subtraction', 'hard'],
];

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

function bothUnique(grade: string, math: PictureQuestion[], ela: PictureQuestion[]) {
  const seen = new Set<string>();
  for (const q of [...math, ...ela]) {
    if (seen.has(q.question)) {
      throw new Error(`Picture prompt used in both subjects for ${grade}: ${q.question}`);
    }
    seen.add(q.question);
  }
}

const BANKS = {
  'pre-k': { math: pack('pre-k', 'math', PREK_MATH), ela: pack('pre-k', 'ela', PREK_ELA) },
  kindergarten: { math: pack('kindergarten', 'math', K_MATH), ela: pack('kindergarten', 'ela', K_ELA) },
  '1': { math: pack('1', 'math', G1_MATH), ela: pack('1', 'ela', G1_ELA) },
  '2': { math: pack('2', 'math', G2_MATH), ela: pack('2', 'ela', G2_ELA) },
};

for (const [grade, bank] of Object.entries(BANKS)) bothUnique(grade, bank.math, bank.ela);

export function getPictureBank(gradeKey: 'pre-k' | 'kindergarten' | '1' | '2') {
  return BANKS[gradeKey];
}
