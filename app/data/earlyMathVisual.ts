/**
 * Illustrated Math banks for Pre-K and Grade 1.
 * Each bank has 20 questions. A session still draws 10.
 * ELA for these grades stays on the existing bank.
 */
type Difficulty = 'easy' | 'medium' | 'hard';

interface VisualQuestion {
  id: string;
  question: string;
  stimulus: string;
  picture: true;
  options: string[];
  correctAnswer: string;
  difficulty: Difficulty;
  topic: string;
  subject: 'math';
  grade: string;
  solution: string;
}

function item(
  grade: string,
  number: number,
  topic: string,
  difficulty: Difficulty,
  stimulus: string,
  question: string,
  options: string[],
  correctAnswer: string,
  solution: string,
): VisualQuestion {
  if (!options.includes(correctAnswer)) throw new Error(`${grade} math ${number} answer missing`);
  if (new Set(options).size !== options.length) throw new Error(`${grade} math ${number} duplicate option`);
  return {
    id: `${grade}-math-${number}`,
    question,
    stimulus,
    picture: true,
    options,
    correctAnswer,
    difficulty,
    topic,
    subject: 'math',
    grade,
    solution,
  };
}

const prek: VisualQuestion[] = [
  item('pre-k', 1, 'Counting', 'easy', 'kvis:count:apple:1', 'How many apples do you see?', ['1', '2', '3', '4'], '1', 'There is 1 apple.'),
  item('pre-k', 2, 'Counting', 'easy', 'kvis:count:star:2', 'How many stars do you see?', ['1', '2', '3', '4'], '2', 'There are 2 stars.'),
  item('pre-k', 3, 'Counting', 'easy', 'kvis:count:duck:3', 'How many ducks do you see?', ['2', '3', '4', '5'], '3', 'There are 3 ducks.'),
  item('pre-k', 4, 'Counting', 'hard', 'kvis:count:ball:5', 'How many balls do you see?', ['3', '4', '5', '6'], '5', 'There are 5 balls.'),
  item('pre-k', 5, 'Compare', 'easy', 'kvis:compare:apple:1:4', 'Which group has more apples?', ['Group A', 'Group B', 'They have the same number', 'Neither group'], 'Group B', 'Group B has 4 apples. Group A has 1.'),
  item('pre-k', 6, 'Compare', 'medium', 'kvis:compare:star:4:2', 'Which group has fewer stars?', ['Group A', 'Group B', 'They have the same number', 'Neither group'], 'Group B', 'Group B has 2 stars. Group A has 4.'),
  item('pre-k', 7, 'Addition', 'easy', 'kvis:add:star:2:1', 'How many stars are there altogether?', ['2', '3', '4', '5'], '3', '2 stars and 1 star make 3.'),
  item('pre-k', 8, 'Subtraction', 'easy', 'kvis:sub:block:4:1', 'Four blocks are shown. One is taken away. How many blocks are left?', ['2', '3', '4', '5'], '3', '4 take away 1 leaves 3.'),
  item('pre-k', 9, 'Counting', 'easy', 'kvis:next:1:2:3', 'What number comes next?', ['4', '5', '1', '2'], '4', 'After 1, 2, 3 comes 4.'),
  item('pre-k', 10, 'Patterns', 'medium', 'kvis:pattern:circle,square,circle,square', 'What shape comes next in this pattern?', ['shape:circle', 'shape:square', 'shape:triangle', 'shape:rectangle'], 'shape:circle', 'The pattern is circle, square, circle, square. Circle comes next.'),
  item('pre-k', 11, 'Shapes', 'easy', 'kvis:tap', 'Which shape is a circle?', ['shape:circle', 'shape:triangle', 'shape:square', 'shape:rectangle'], 'shape:circle', 'The round shape is the circle.'),
  item('pre-k', 12, 'Shapes', 'medium', 'kvis:tap', 'Which shape has three sides?', ['shape:circle', 'shape:triangle', 'shape:square', 'shape:rectangle'], 'shape:triangle', 'A triangle has three sides.'),
  item('pre-k', 13, 'Length', 'easy', 'kvis:length:2:5', 'Which row of blocks is longer?', ['Row A', 'Row B', 'They are the same', 'Neither row'], 'Row B', 'Row B has more blocks, so it is longer.'),
  item('pre-k', 14, 'Compare', 'easy', 'kvis:size', 'Which ball is bigger?', ['Ball A', 'Ball B', 'They are the same size', 'Neither ball'], 'Ball B', 'Ball B is the bigger ball.'),
  item('pre-k', 15, 'Addition', 'medium', 'kvis:add:apple:2:2', 'How many apples are there altogether?', ['2', '3', '4', '5'], '4', '2 apples and 2 apples make 4.'),
  item('pre-k', 16, 'Compare', 'medium', 'kvis:compare:duck:3:3', 'Do these groups have the same number of ducks?', ['Group A has more', 'Group B has more', 'They have the same number', 'Neither group has ducks'], 'They have the same number', 'Each group has 3 ducks.'),
  item('pre-k', 17, 'Counting', 'easy', 'kvis:count:block:4', 'How many blocks do you see?', ['2', '3', '4', '5'], '4', 'There are 4 blocks.'),
  item('pre-k', 18, 'Patterns', 'hard', 'kvis:pattern:triangle,triangle,circle,triangle,triangle', 'What shape comes next after triangle, triangle, circle, triangle, triangle?', ['shape:circle', 'shape:triangle', 'shape:square', 'shape:rectangle'], 'shape:circle', 'The pattern is triangle, triangle, circle. Circle comes next.'),
  item('pre-k', 19, 'Shapes', 'medium', 'kvis:tap', 'Which shape is a square?', ['shape:circle', 'shape:triangle', 'shape:square', 'shape:rectangle'], 'shape:square', 'The shape with four equal sides is the square.'),
  item('pre-k', 20, 'Subtraction', 'hard', 'kvis:sub:bird:5:2', 'Five birds are shown. Two fly away. How many birds are left?', ['2', '3', '4', '5'], '3', '5 take away 2 leaves 3.'),
];

const grade1: VisualQuestion[] = [
  item('1', 1, 'Addition', 'easy', 'kvis:add:apple:3:4', 'How many apples are there altogether?', ['6', '7', '8', '9'], '7', '3 apples and 4 apples make 7.'),
  item('1', 2, 'Subtraction', 'easy', 'kvis:sub:block:8:2', 'Eight blocks are shown. Two are taken away. How many blocks are left?', ['5', '6', '7', '10'], '6', '8 take away 2 leaves 6.'),
  item('1', 3, 'Counting', 'easy', 'kvis:next:37:38:39', 'What number comes next?', ['38', '40', '41', '49'], '40', 'After 37, 38, 39 comes 40.'),
  item('1', 4, 'Counting', 'medium', 'kvis:next:10:20:30', 'Count by tens. What number comes next?', ['35', '40', '50', '60'], '40', 'After 10, 20, 30 comes 40.'),
  item('1', 5, 'Counting', 'easy', 'kvis:cards:26', 'What is 1 more than this number?', ['25', '27', '36', '28'], '27', '1 more than 26 is 27.'),
  item('1', 6, 'Place value', 'medium', 'kvis:cards:24', 'What is 10 more than this number?', ['25', '34', '44', '14'], '34', '10 more than 24 is 34.'),
  item('1', 7, 'Compare', 'medium', 'kvis:cards:46:64:14', 'Which of these numbers is the greatest?', ['46', '64', '14', 'They are equal'], '64', '64 is greater than 46 and 14.'),
  item('1', 8, 'Place value', 'medium', 'kvis:tens:4:2', 'Which number is 4 tens and 2 ones?', ['42', '24', '40', '2'], '42', '4 tens and 2 ones is 42.'),
  item('1', 9, 'Addition', 'medium', 'kvis:add:star:7:5', 'How many stars are there altogether?', ['11', '12', '13', '14'], '12', '7 stars and 5 stars make 12.'),
  item('1', 10, 'Subtraction', 'hard', 'kvis:sub:apple:9:6', 'Nine apples are shown. Six are eaten. How many apples are left?', ['2', '3', '4', '15'], '3', '9 take away 6 leaves 3.'),
  item('1', 11, 'Addition', 'hard', 'kvis:add:duck:9:6', 'How many ducks are there altogether?', ['14', '15', '16', '13'], '15', '9 ducks and 6 ducks make 15.'),
  item('1', 12, 'Length', 'easy', 'kvis:length:5:8', 'Which row of blocks is longer?', ['Row A', 'Row B', 'They are the same', 'Neither row'], 'Row B', 'Row B has 8 blocks. Row A has 5.'),
  item('1', 13, 'Shapes', 'medium', 'kvis:tap', 'Which shape is a rectangle?', ['shape:circle', 'shape:triangle', 'shape:square', 'shape:rectangle'], 'shape:rectangle', 'The long four-sided shape is the rectangle.'),
  item('1', 14, 'Time', 'easy', 'kvis:clock:4:00', 'What time does the clock show?', ['4:00', '12:04', '4:30', '3:00'], '4:00', 'The hour hand is on 4 and the minute hand is on 12.'),
  item('1', 15, 'Time', 'medium', 'kvis:clock:6:30', 'What time is shown on this clock?', ['6:00', '6:30', '7:30', '5:30'], '6:30', 'The minute hand is on 6, so it is half past 6.'),
  item('1', 16, 'Place value', 'hard', 'kvis:tens:5:7', 'Which number is 5 tens and 7 ones?', ['57', '75', '50', '7'], '57', '5 tens and 7 ones is 57.'),
  item('1', 17, 'Compare', 'medium', 'kvis:cards:58:85', 'Which number is greater?', ['58', '85', 'They are equal', 'Neither'], '85', '85 is greater than 58.'),
  item('1', 18, 'Addition', 'easy', 'kvis:add:block:6:4', 'How many blocks are there altogether?', ['9', '10', '11', '12'], '10', '6 blocks and 4 blocks make 10.'),
  item('1', 19, 'Subtraction', 'hard', 'kvis:sub:bird:12:5', 'Twelve birds are shown. Five fly away. How many birds are left?', ['6', '7', '8', '17'], '7', '12 take away 5 leaves 7.'),
  item('1', 20, 'Counting', 'medium', 'kvis:next:8:7:6', 'Count backward. What number comes next?', ['5', '4', '9', '7'], '5', 'After 8, 7, 6 comes 5.'),
];

for (const bank of [prek, grade1]) {
  const seen = new Set<string>();
  for (const q of bank) {
    if (seen.has(q.question)) throw new Error(`Duplicate prompt: ${q.question}`);
    seen.add(q.question);
  }
}

export const prekMathVisual = prek;
export const grade1MathVisual = grade1;
