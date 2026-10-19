/**
 * Kindergarten picture bank: 20 Math and 20 ELA.
 * A session still draws 10 of each. Other grades do not use this file.
 */

type Difficulty = 'easy' | 'medium' | 'hard';

interface KinderQuestion {
  id: string;
  question: string;
  stimulus: string;
  picture: true;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  topic: string;
  subject: 'math' | 'ela';
  grade: 'kindergarten';
  solution: string;
}

function item(
  subject: 'math' | 'ela',
  number: number,
  topic: string,
  difficulty: Difficulty,
  stimulus: string,
  question: string,
  options: string[],
  correctAnswer: string,
  solution: string,
): KinderQuestion {
  if (!options.includes(correctAnswer)) {
    throw new Error(`Kindergarten ${subject} ${number} answer is not an option`);
  }
  if (new Set(options).size !== options.length) {
    throw new Error(`Kindergarten ${subject} ${number} has a repeated option`);
  }
  return {
    id: `kvis-${subject}-${number}`,
    question,
    stimulus,
    picture: true,
    options,
    correctAnswer,
    difficulty,
    topic,
    subject,
    grade: 'kindergarten',
    solution,
  };
}

const math: KinderQuestion[] = [
  item('math', 1, 'Counting', 'easy', 'kvis:count:apple:5', 'How many apples do you see?', ['3', '5', '7', '4'], '5', 'There are 5 apples.'),
  item('math', 2, 'Counting', 'easy', 'kvis:count:star:3', 'How many stars do you see?', ['2', '3', '4', '1'], '3', 'There are 3 stars.'),
  item('math', 3, 'Counting', 'easy', 'kvis:count:duck:4', 'How many ducks do you see?', ['3', '4', '5', '6'], '4', 'There are 4 ducks.'),
  item('math', 4, 'Length', 'medium', 'kvis:length', 'Which row of blocks is longer?', ['Row A', 'Row B', 'They are the same', 'Neither row'], 'Row B', 'Row B has more blocks, so it is longer.'),
  item('math', 5, 'Counting', 'hard', 'kvis:count:block:10', 'How many blocks do you see?', ['8', '9', '10', '7'], '10', 'There are 10 blocks.'),
  item('math', 6, 'Compare', 'easy', 'kvis:compare:apple:2:5', 'Which group has more apples?', ['Group A', 'Group B', 'They have the same number', 'Neither group'], 'Group B', 'Group B has 5 apples. Group A has 2.'),
  item('math', 7, 'Compare', 'medium', 'kvis:compare:star:6:3', 'Which group has fewer stars?', ['Group A', 'Group B', 'They have the same number', 'Neither group'], 'Group B', 'Group B has 3 stars. Group A has 6.'),
  item('math', 8, 'Addition', 'easy', 'kvis:add:star:3:2', 'How many stars are there altogether?', ['4', '5', '6', '7'], '5', '3 stars and 2 stars make 5.'),
  item('math', 9, 'Addition', 'medium', 'kvis:add:apple:4:1', 'How many apples are there altogether?', ['4', '5', '6', '3'], '5', '4 apples and 1 apple make 5.'),
  item('math', 10, 'Addition', 'hard', 'kvis:add:duck:4:3', 'How many ducks are there altogether?', ['6', '7', '8', '5'], '7', '4 ducks and 3 ducks make 7.'),
  item('math', 11, 'Subtraction', 'easy', 'kvis:sub:block:5:2', 'Five blocks are shown. Two are taken away. How many blocks are left?', ['2', '3', '4', '5'], '3', '5 take away 2 leaves 3.'),
  item('math', 12, 'Subtraction', 'medium', 'kvis:sub:bird:6:1', 'Six birds are shown. One flies away. How many birds are left?', ['4', '5', '6', '7'], '5', '6 take away 1 leaves 5.'),
  item('math', 13, 'Subtraction', 'hard', 'kvis:sub:apple:8:3', 'Eight apples are shown. Three are eaten. How many apples are left?', ['4', '5', '6', '3'], '5', '8 take away 3 leaves 5.'),
  item('math', 14, 'Counting', 'easy', 'kvis:next:2:3:4', 'What number comes next?', ['5', '6', '2', '1'], '5', 'After 2, 3, 4 comes 5.'),
  item('math', 15, 'Counting', 'medium', 'kvis:next:6:7:8', 'What number comes next after 6, 7, 8?', ['9', '10', '5', '7'], '9', 'After 6, 7, 8 comes 9.'),
  item('math', 16, 'Teen numbers', 'easy', 'kvis:ten:1:3', 'One ten and three ones make which number?', ['13', '31', '10', '3'], '13', 'One ten and three ones is 13.'),
  item('math', 17, 'Teen numbers', 'hard', 'kvis:ten:1:6', 'One ten and six ones make which number?', ['16', '61', '10', '6'], '16', 'One ten and six ones is 16.'),
  item('math', 18, 'Shapes', 'easy', 'kvis:tap', 'Which shape is a triangle?', ['shape:circle', 'shape:triangle', 'shape:square', 'shape:rectangle'], 'shape:triangle', 'A triangle has 3 sides.'),
  item('math', 19, 'Shapes', 'medium', 'kvis:tap', 'Which shape has no corners?', ['shape:circle', 'shape:triangle', 'shape:square', 'shape:rectangle'], 'shape:circle', 'A circle has no corners.'),
  item('math', 20, 'Patterns', 'hard', 'kvis:pattern:circle,circle,square,circle,circle', 'What shape comes next in this pattern?', ['shape:circle', 'shape:square', 'shape:triangle', 'shape:rectangle'], 'shape:square', 'The pattern is circle, circle, square. Square comes next.'),
];

const ela: KinderQuestion[] = [
  item('ela', 1, 'Letters', 'easy', 'kvis:tap', 'Find the letter M.', ['letter:A', 'letter:M', 'letter:S', 'letter:T'], 'letter:M', 'The capital M is the second card.'),
  item('ela', 2, 'Letters', 'easy', 'kvis:tap', 'Find the lowercase letter m.', ['letter:M', 'letter:m', 'letter:n', 'letter:w'], 'letter:m', 'The lowercase m is the short letter m.'),
  item('ela', 3, 'Letters', 'medium', 'kvis:after:C', 'Which letter comes after C?', ['letter:B', 'letter:D', 'letter:A', 'letter:E'], 'letter:D', 'D comes after C.'),
  item('ela', 4, 'Beginning sounds', 'easy', 'kvis:listen', 'Which picture starts with the b sound?', ['pic:ball', 'pic:cat', 'pic:apple', 'pic:sun'], 'pic:ball', 'Ball starts with the b sound.'),
  item('ela', 5, 'Beginning sounds', 'easy', 'kvis:listen', 'Which picture starts with the s sound?', ['pic:hat', 'pic:sun', 'pic:dog', 'pic:moon'], 'pic:sun', 'Sun starts with the s sound.'),
  item('ela', 6, 'Beginning sounds', 'medium', 'kvis:listen', 'Which picture starts with the m sound?', ['pic:moon', 'pic:sun', 'pic:dog', 'pic:fish'], 'pic:moon', 'Moon starts with the m sound.'),
  item('ela', 7, 'Rhyming', 'easy', 'kvis:ref:cat', 'Which picture rhymes with cat?', ['pic:hat', 'pic:dog', 'pic:sun', 'pic:cup'], 'pic:hat', 'Cat and hat rhyme.'),
  item('ela', 8, 'Rhyming', 'medium', 'kvis:ref:bee', 'Which picture rhymes with bee?', ['pic:tree', 'pic:cup', 'pic:fish', 'pic:bed'], 'pic:tree', 'Bee and tree rhyme.'),
  item('ela', 9, 'Vocabulary', 'easy', 'kvis:tap', 'Which picture is something you wear on your head?', ['pic:hat', 'pic:book', 'pic:apple', 'pic:fish'], 'pic:hat', 'A hat is worn on the head.'),
  item('ela', 10, 'Syllables', 'medium', 'kvis:ref:apple', 'How many parts do you hear in apple?', ['1', '2', '3', '4'], '2', 'Apple has two parts: ap-ple.'),
  item('ela', 11, 'Story', 'easy', 'kvis:story:rain', 'It is raining. Which picture would keep you dry?', ['pic:umbrella', 'pic:sun', 'pic:book', 'pic:apple'], 'pic:umbrella', 'An umbrella keeps you dry in the rain.'),
  item('ela', 12, 'Story', 'medium', 'kvis:story:bird', 'The bird sat in the tree. Where is the bird?', ['In the tree', 'Under the water', 'On a bus', 'In a cup'], 'In the tree', 'The picture shows the bird in the tree.'),
  item('ela', 13, 'Vocabulary', 'easy', 'kvis:size', 'Which ball is smaller?', ['Ball A', 'Ball B', 'They are the same size', 'Neither ball'], 'Ball A', 'Ball A is the smaller ball.'),
  item('ela', 14, 'Vocabulary', 'medium', 'kvis:tap', 'Which picture is an animal?', ['pic:rabbit', 'pic:chair', 'pic:book', 'pic:cup'], 'pic:rabbit', 'A rabbit is an animal.'),
  item('ela', 15, 'Letters', 'easy', 'kvis:ref:sun', 'Which letter begins the word sun?', ['letter:M', 'letter:S', 'letter:T', 'letter:B'], 'letter:S', 'Sun begins with S.'),
  item('ela', 16, 'Beginning sounds', 'hard', 'kvis:listen', 'Sun, sock, star, and fish. Which picture begins with a different sound?', ['pic:sun', 'pic:sock', 'pic:star', 'pic:fish'], 'pic:fish', 'Sun, sock, and star begin with s. Fish begins with f.'),
  item('ela', 17, 'Story', 'medium', 'kvis:story:seed', 'A seed is planted first. Then it is watered. What comes first?', ['pic:seed', 'pic:sprout', 'pic:umbrella', 'pic:apple'], 'pic:seed', 'The seed is planted first.'),
  item('ela', 18, 'Letters', 'easy', 'kvis:tap', 'Which letter is a capital A?', ['letter:a', 'letter:A', 'letter:o', 'letter:m'], 'letter:A', 'The capital A is the tall letter A.'),
  item('ela', 19, 'Story', 'hard', 'kvis:story:boots', 'Liam put on boots and splashed in puddles. What did he put on?', ['pic:boot', 'pic:hat', 'pic:umbrella', 'pic:book'], 'pic:boot', 'Liam put on boots.'),
  item('ela', 20, 'Rhyming', 'hard', 'kvis:ref:jar', 'Which picture rhymes with jar?', ['pic:star', 'pic:cat', 'pic:sun', 'pic:book'], 'pic:star', 'Jar and star rhyme.'),
];

const prompts = new Set<string>();
for (const q of [...math, ...ela]) {
  if (prompts.has(q.question)) throw new Error(`Duplicate kindergarten prompt: ${q.question}`);
  prompts.add(q.question);
}

export const kindergartenVisual = { math, ela };
