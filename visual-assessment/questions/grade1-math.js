/* Grade 1 Mathematics — 50 questions aligned to CCSS 1.OA, 1.NBT, 1.MD, 1.G
 * (standards text taken from the supplied Common Core PDF, pp. 13-16).
 */
(function (root) {
  const VA = root.VA;
  const { N, W, A, SH, V } = VA.O;
  const b = VA.makeBank({ prefix: 'G1-MATH', grade: 'grade1', subject: 'math' });
  const q = b.q;
  const J = (art, a, bb, op) => ({ type: 'join', art, a, b: bb, op });
  const eq = (...parts) => ({ type: 'equation', parts });
  const tiles = (...items) => ({ type: 'tiles', items });

  /* ===== 1.OA Operations and Algebraic Thinking (18) ===== */
  q('1.OA.A.1', 'Word problem: add to (result unknown)', 'easy', 'Mia has 9 stickers. She gets 5 more. How many stickers does Mia have now?',
    J('star', 9, 5, '+'), N(13, 14, 15), 14, '9 + 5 = 14.');
  q('1.OA.A.1', 'Word problem: take from (result unknown)', 'easy', '12 birds are on a wire. 5 fly away. How many birds are left?',
    J('bird', 12, 5, '-'), N(6, 7, 8), 7, '12 - 5 = 7.');
  q('1.OA.A.1', 'Word problem: put together', 'medium', 'There are 8 red balls and 7 blue balls. How many balls are there in all?',
    { type: 'objects-mixed', items: [{ art: 'ball', color: 'red', count: 8 }, { art: 'ball', color: 'blue', count: 7 }] }, N(14, 15, 16), 15, '8 + 7 = 15.');
  q('1.OA.A.1', 'Word problem: compare', 'medium', 'Ben has 9 apples. Ana has 6 apples. How many MORE apples does Ben have?',
    { type: 'groups', groups: [{ art: 'apple', count: 9, label: 'Ben' }, { art: 'apple', count: 6, label: 'Ana' }] }, N(3, 4, 15), 3, '9 - 6 = 3. Ben has 3 more apples.');
  q('1.OA.A.1', 'Word problem: change unknown', 'hard', 'There are 8 ducks. Some more ducks come. Now there are 13 ducks. How many ducks came?',
    eq('8', '+', '?', '=', '13'), N(4, 5, 6), 5, '8 + 5 = 13, so 5 ducks came.');
  q('1.OA.A.1', 'Word problem: start unknown', 'hard', 'Some frogs sat on a log. Then 4 more frogs jumped on. Now there are 11 frogs. How many frogs were on the log at first?',
    eq('?', '+', '4', '=', '11'), N(6, 7, 8), 7, '7 + 4 = 11, so there were 7 frogs at first.');
  q('1.OA.A.2', 'Add three numbers', 'medium', 'Meg has 4 red, 3 blue and 6 green crayons. How many crayons does she have in all?',
    { type: 'objects-mixed', items: [{ art: 'crayon', color: 'red', count: 4 }, { art: 'crayon', color: 'blue', count: 3 }, { art: 'crayon', color: 'green', count: 6 }] },
    N(12, 13, 14), 13, '4 + 3 + 6 = 13.');
  q('1.OA.B.3', 'Commutative property', 'easy', 'If 8 + 3 = 11, then 3 + 8 = ?',
    eq('3', '+', '8', '=', '?'), N(10, 11, 12), 11, 'We can add in any order. 3 + 8 = 11 too.');
  q('1.OA.B.4', 'Subtraction as unknown addend', 'medium', 'Think: 8 + ? = 10. What is 10 - 8?',
    { type: 'tenframe', filled: 8 }, N(1, 2, 3), 2, 'It takes 2 more to get from 8 to 10, so 10 - 8 = 2.');
  q('1.OA.B.4', 'Subtraction as unknown addend', 'hard', 'Think: 9 + ? = 14. What is 14 - 9?',
    eq('14', '-', '9', '=', '?'), N(4, 5, 6), 5, '9 + 5 = 14, so 14 - 9 = 5.');
  q('1.OA.C.5', 'Count on to add', 'medium', 'Count on to add 7 + 2. Where do you land?',
    { type: 'numberline', from: 6, to: 12, marker: 7, hops: 2 }, N(8, 9, 10), 9, 'Start at 7 and count on 2: 8, 9.');
  q('1.OA.C.6', 'Make a ten to add', 'medium', 'Make a ten! How many counters in all: 8 and 5?',
    { type: 'tenframe', filled: 8, second: 5 }, N(12, 13, 14), 13, '8 + 2 = 10, then 10 + 3 = 13.');
  q('1.OA.C.6', 'Doubles plus one', 'hard', 'Use doubles: 7 + 7 = 14. So 7 + 8 = ?',
    eq('7', '+', '8', '=', '?'), N(14, 15, 16), 15, '7 + 8 is one more than 7 + 7, so it is 15.');
  q('1.OA.C.6', 'Subtract within 20', 'medium', 'What is 13 - 4?',
    J('apple', 13, 4, '-'), N(8, 9, 10), 9, '13 - 4 = 9.');
  q('1.OA.D.7', 'Meaning of the equal sign (true)', 'medium', 'Which equation is TRUE?', null,
    VA.O.WV('5 + 2 = 2 + 5', '6 = 7 - 2', '4 + 1 = 6'), '5 + 2 = 2 + 5', 'Both sides equal 7.');
  q('1.OA.D.7', 'Meaning of the equal sign (false)', 'hard', 'Which equation is FALSE?', null,
    VA.O.WV('6 = 6', '7 = 8 - 1', '5 + 2 = 2 + 4'), '5 + 2 = 2 + 4', '5 + 2 is 7, but 2 + 4 is 6. They are not equal.');
  q('1.OA.D.8', 'Unknown number in an equation', 'medium', 'What number makes this true?',
    eq('8', '+', '?', '=', '11'), N(2, 3, 4), 3, '8 + 3 = 11.');
  q('1.OA.D.8', 'Unknown number in a subtraction equation', 'hard', 'What number makes this true?',
    eq('5', '=', '?', '-', '3'), N(2, 7, 8), 8, '8 - 3 = 5.');

  /* ===== 1.NBT Number and Operations in Base Ten (14) ===== */
  q('1.NBT.A.1', 'Count to 120 from any number', 'easy', 'What number comes next?',
    tiles('107', '108', '109', '?'), N(100, 110, 119), 110, 'After 109 comes 110.');
  q('1.NBT.A.1', 'Count to 120 from any number', 'medium', 'What number is missing?',
    tiles('115', '116', '?', '118'), N(114, 117, 119), 117, '115, 116, 117, 118.');
  q('1.NBT.A.1', 'Read numerals to 120', 'medium', 'Which number is one hundred twelve?', null,
    VA.O.NV(102, 112, 121), 112, 'One hundred twelve is written 112.', { speech: 'Which number is one hundred twelve?' });
  q('1.NBT.B.2.a', 'A ten is a bundle of ten ones', 'easy', 'How many ones make 1 ten?',
    { type: 'tenframe', filled: 10 }, N(5, 10, 100), 10, '10 ones make 1 ten.');
  q('1.NBT.B.2.b', 'Teen numbers: a ten and some ones', 'medium', 'This shows 14. How many ones are with the ten?',
    { type: 'base10', tens: 1, ones: 4 }, N(1, 4, 14), 4, '14 is 1 ten and 4 ones.');
  q('1.NBT.B.2', 'Tens and ones in a two-digit number', 'medium', 'What does the picture show?',
    { type: 'base10', tens: 3, ones: 6 }, W('3 tens and 6 ones', '6 tens and 3 ones', '36 tens'), '3 tens and 6 ones', '3 tens and 6 ones make 36.');
  q('1.NBT.B.2.c', 'Multiples of ten', 'medium', 'Which number is 5 tens and 0 ones?',
    { type: 'base10', tens: 5, ones: 0 }, N(5, 50, 55), 50, '5 tens is 50.');
  q('1.NBT.B.2', 'Read a base-ten picture', 'hard', 'Which number does the picture show?',
    { type: 'base10', tens: 4, ones: 7 }, N(37, 47, 74), 47, '4 tens and 7 ones make 47.');
  q('1.NBT.B.3', 'Compare two-digit numbers', 'medium', 'Which symbol makes this true?',
    { type: 'numcompare', a: 38, b: 52 }, W('<', '>', '='), '<', '5 tens is more than 3 tens, so 38 < 52.');
  q('1.NBT.B.3', 'Compare two-digit numbers (same tens)', 'hard', 'Which symbol makes this true?',
    { type: 'numcompare', a: 71, b: 67 }, W('<', '>', '='), '>', '7 tens is more than 6 tens, so 71 > 67.');
  q('1.NBT.C.4', 'Add a two-digit and a one-digit number', 'medium', 'What is 34 + 5?',
    { type: 'base10', tens: 3, ones: 4, plus: 5 }, N(38, 39, 84), 39, '4 ones + 5 ones = 9 ones, so 34 + 5 = 39.');
  q('1.NBT.C.5', 'Ten more', 'medium', 'What is 10 MORE than 24?',
    { type: 'base10', tens: 2, ones: 4 }, N(14, 25, 34), 34, 'Ten more adds 1 ten: 24 becomes 34.');
  q('1.NBT.C.5', 'Ten less', 'hard', 'What is 10 LESS than 62?',
    { type: 'base10', tens: 6, ones: 2 }, N(52, 61, 72), 52, 'Ten less takes away 1 ten: 62 becomes 52.');
  q('1.NBT.C.6', 'Subtract multiples of ten', 'hard', 'What is 70 - 30?',
    { type: 'base10', tens: 7, ones: 0, take: 3 }, N(30, 40, 100), 40, '7 tens take away 3 tens leaves 4 tens, which is 40.');

  /* ===== 1.MD Measurement and Data (11) ===== */
  q('1.MD.A.1', 'Order three objects by length', 'medium', 'Which pencil is in the MIDDLE in length?', null,
    V(['red pencil', { type: 'bar', art: 'pencil', len: 46, color: 'red' }],
      ['blue pencil', { type: 'bar', art: 'pencil', len: 94, color: 'blue' }],
      ['green pencil', { type: 'bar', art: 'pencil', len: 70, color: 'green' }]),
    'green pencil', 'Red is shortest and blue is longest. Green is in the middle.', { optionLayout: 'stack' });
  q('1.MD.A.1', 'Compare lengths indirectly', 'hard', 'Green is longer than blue. Blue is longer than red. Which ribbon is the SHORTEST?', null,
    V(['red ribbon', { type: 'art', name: 'ribbon-roll', color: 'red' }], ['blue ribbon', { type: 'art', name: 'ribbon-roll', color: 'blue' }], ['green ribbon', { type: 'art', name: 'ribbon-roll', color: 'green' }]),
    'red ribbon', 'Green > blue > red, so red is the shortest.');
  q('1.MD.A.2', 'Length as a number of units', 'medium', 'How long is the pencil? Count the cubes.',
    { type: 'measure', object: 'pencil', n: 5 }, N(4, 5, 6), 5, 'The pencil is 5 cubes long.');
  q('1.MD.A.2', 'Length as a number of units', 'medium', 'How long is the ribbon? Count the cubes.',
    { type: 'measure', object: 'ribbon', n: 7 }, N(6, 7, 8), 7, 'The ribbon is 7 cubes long.');
  q('1.MD.A.2', 'Measure with no gaps or overlaps', 'hard', 'Which shows the right way to measure?', null,
    V(['no gaps or overlaps', { type: 'measure', object: 'crayon', n: 4, small: true }],
      ['gaps', { type: 'measure', object: 'crayon', n: 4, gap: true, small: true }],
      ['overlaps', { type: 'measure', object: 'crayon', n: 4, overlap: true, small: true }]),
    'no gaps or overlaps', 'Units must touch end to end with no gaps and no overlaps.', { optionLayout: 'stack' });
  q('1.MD.B.3', 'Tell time to the hour', 'easy', 'What time does the clock show?',
    { type: 'clock', h: 3, m: 0 }, W('2:00', '3:00', '4:00'), '3:00', 'The short hand points to 3 and the long hand points to 12: 3 o’clock.');
  q('1.MD.B.3', 'Tell time to the half hour', 'medium', 'What time does the clock show?',
    { type: 'clock', h: 8, m: 30 }, W('6:40', '7:30', '8:30'), '8:30', 'The short hand is between 8 and 9 and the long hand points to 6: half past 8.');
  q('1.MD.B.3', 'Match digital time to an analog clock', 'medium', 'Which clock shows this time?',
    { type: 'digital', h: 5, m: 30 },
    V(['5:30', { type: 'clock', h: 5, m: 30 }], ['6:00', { type: 'clock', h: 6, m: 0 }], ['5:00', { type: 'clock', h: 5, m: 0 }]), '5:30',
    'Half past 5 means the long hand points to 6.');
  q('1.MD.C.4', 'Interpret data: total', 'medium', 'How many children voted in all?',
    { type: 'pictograph', title: 'Favourite fruit', rows: [{ art: 'apple', count: 5 }, { art: 'banana', count: 3 }, { art: 'grapes', count: 4 }] },
    N(10, 12, 13), 12, '5 + 3 + 4 = 12 children.');
  q('1.MD.C.4', 'Interpret data: how many more', 'hard', 'How many MORE children like dogs than cats?',
    { type: 'pictograph', title: 'Favourite pet', rows: [{ art: 'cat', count: 4 }, { art: 'dog', count: 7 }, { art: 'fish', count: 2 }] },
    N(2, 3, 11), 3, '7 - 4 = 3 more.');
  q('1.MD.C.4', 'Interpret data: fewest', 'medium', 'Which colour has the FEWEST?',
    { type: 'barchart', title: 'Balloons', bars: [{ color: 'red', count: 6 }, { color: 'blue', count: 3 }, { color: 'green', count: 5 }] },
    V(['red', { type: 'shape', shape: 'circle', color: 'red' }], ['blue', { type: 'shape', shape: 'circle', color: 'blue' }], ['green', { type: 'shape', shape: 'circle', color: 'green' }]),
    'blue', 'Blue has 3, which is fewer than 5 or 6.');

  /* ===== 1.G Geometry (7) ===== */
  q('1.G.A.1', 'Defining attribute: closed shape', 'medium', 'A triangle is closed and has 3 straight sides. Which one is a triangle?', null,
    SH({ shape: 'triangle', color: 'teal', rot: 35, label: 'tilted triangle' }, { shape: 'open-triangle', color: 'orange', label: 'open shape' }, { shape: 'square', color: 'purple' }),
    'tilted triangle', 'It is closed and has 3 sides. The open shape is not closed.');
  q('1.G.A.1', 'Non-defining attributes: size, colour, orientation', 'hard', 'All of these are squares except one. Which one is NOT a square?', null,
    SH({ shape: 'square', color: 'blue', label: 'big square' }, { shape: 'square', color: 'red', rot: 45, label: 'tilted square' }, { shape: 'rectangle', color: 'green', label: 'long rectangle' }, { shape: 'square', color: 'yellow', label: 'small square' }),
    'long rectangle', 'A square has 4 equal sides. Colour, size and turn do not matter.');
  q('1.G.A.1', 'Defining attribute: number of sides', 'medium', 'Which shape has exactly 4 sides?', null,
    SH({ shape: 'triangle', color: 'red' }, { shape: 'circle', color: 'blue' }, { shape: 'trapezoid', color: 'green' }), 'trapezoid', 'A trapezoid has 4 sides.');
  q('1.G.A.2', 'Compose shapes', 'medium', 'Two squares are put side by side. What shape do they make?',
    { type: 'compose', kind: 'sq-sq-rect' },
    SH({ shape: 'rectangle', color: 'teal' }, { shape: 'triangle', color: 'orange' }, { shape: 'circle', color: 'purple' }), 'rectangle', 'Two squares side by side make a rectangle.');
  q('1.G.A.2', 'Compose shapes', 'hard', 'Two half-circles are put together. What shape do they make?',
    { type: 'compose', kind: 'semi-semi-circle' },
    SH({ shape: 'circle', color: 'orange' }, { shape: 'rectangle', color: 'blue' }, { shape: 'triangle', color: 'green' }), 'circle', 'Two half-circles join to make a whole circle.');
  q('1.G.A.3', 'Partition into halves', 'medium', 'Which shows HALVES (2 equal shares)?', null,
    V(['2 equal parts', { type: 'fraction', shape: 'circle', parts: 2, shaded: 1 }], ['2 unequal parts', { type: 'fraction', shape: 'circle', parts: 2, shaded: 1, equal: false }], ['4 parts', { type: 'fraction', shape: 'circle', parts: 4, shaded: 1 }]),
    '2 equal parts', 'Halves are 2 equal shares.');
  q('1.G.A.3', 'Partition into fourths', 'hard', 'What part of the rectangle is shaded?',
    { type: 'fraction', shape: 'rect', parts: 4, shaded: 1 }, W('one half', 'one fourth', 'all of it'), 'one fourth',
    'The rectangle has 4 equal parts and 1 is shaded: one fourth (a quarter).');

  VA.register('grade1', 'math', b.list);
})(typeof window !== 'undefined' ? window : globalThis);
