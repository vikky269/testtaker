/* Kindergarten Mathematics — 50 questions aligned to CCSS K.CC, K.OA, K.NBT, K.MD, K.G
 * (standards text taken from the supplied Common Core PDF, pp. 9-12).
 */
(function (root) {
  const VA = root.VA;
  const { N, W, A, SH, G, V } = VA.O;
  const b = VA.makeBank({ prefix: 'K-MATH', grade: 'kindergarten', subject: 'math' });
  const q = b.q;
  const J = (art, a, bb, op) => ({ type: 'join', art, a, b: bb, op });
  const tiles = (...items) => ({ type: 'tiles', items });

  /* ===== K.CC Counting and Cardinality (17) ===== */
  q('K.CC.A.1', 'Count by tens', 'easy', 'Count by tens. What number comes next?',
    tiles('10', '20', '30', '?'), N(31, 40, 50), 40, 'Counting by tens: 10, 20, 30, 40.');
  q('K.CC.A.1', 'Count to 100 by ones', 'medium', 'Count by ones. What number comes next?',
    tiles('97', '98', '99', '?'), N(98, 100, 110), 100, 'After 99 we say 100.');
  q('K.CC.A.2', 'Count forward from a given number', 'easy', 'Count on. What number is missing?',
    tiles('14', '15', '?', '17'), N(13, 16, 18), 16, '14, 15, 16, 17: the missing number is 16.');
  q('K.CC.A.2', 'Count forward from a given number', 'medium', 'The frog is on 18. It hops to the next number. Where does it land?',
    { type: 'numberline', from: 16, to: 21, marker: 18 }, N(17, 19, 20), 19, 'After 18 comes 19.');
  q('K.CC.A.3', 'Write numerals for a quantity', 'medium', 'Which number tells how many?',
    { type: 'objects', art: 'flower', count: 12, layout: 'line' }, N(11, 12, 13), 12, 'Count the flowers: there are 12.');
  q('K.CC.A.3', 'Zero as a count', 'medium', 'How many apples are on the tray?',
    { type: 'objects', art: 'apple', count: 0, layout: 'row' }, N(0, 1, 10), 0, 'The tray is empty. No apples is the number 0.');
  q('K.CC.A.3', 'Write numerals for a quantity', 'hard', 'Which number tells how many?',
    { type: 'objects', art: 'car', count: 17, layout: 'line' }, N(15, 17, 19), 17, 'There are 17 cars.');
  q('K.CC.B.4.b', 'Quantity stays the same when arranged differently', 'medium', 'Which group has the same number of apples as this group?',
    { type: 'objects', art: 'apple', count: 8, layout: 'scatter' },
    G(['apple', 7, 'row'], ['apple', 8, 'circle'], ['apple', 9, 'array', { cols: 3 }]), '8 apples',
    'Both groups have 8 apples. Moving the apples does not change how many there are.');
  q('K.CC.B.4.c', 'One more', 'medium', 'Which group has ONE MORE than this group?',
    { type: 'objects', art: 'bear', count: 4, layout: 'row' },
    G(['bear', 3, 'row'], ['bear', 5, 'row'], ['bear', 6, 'row']), '5 bears', 'One more than 4 is 5.');
  q('K.CC.B.4.c', 'One more', 'hard', 'Which number is ONE MORE than 6?',
    { type: 'objects', art: 'cube', count: 6, layout: 'row' }, N(5, 7, 8), 7, 'One more than 6 is 7.');
  q('K.CC.B.5', 'Counting objects in a circle', 'medium', 'How many butterflies?',
    { type: 'objects', art: 'butterfly', count: 11, layout: 'circle' }, N(10, 11, 12), 11, 'There are 11 butterflies.');
  q('K.CC.B.5', 'Counting scattered objects (up to 10)', 'medium', 'How many ladybugs?',
    { type: 'objects', art: 'bug', count: 10, layout: 'scatter' }, N(8, 10, 12), 10, 'There are 10 ladybugs.');
  q('K.CC.B.5', 'Counting objects in an array', 'hard', 'How many stars?',
    { type: 'objects', art: 'star', count: 15, layout: 'array', cols: 5 }, N(13, 15, 18), 15, '3 rows of 5 stars is 15 stars.');
  q('K.CC.C.6', 'Compare two groups: more', 'medium', 'Are there more cats or more dogs?',
    { type: 'groups', groups: [{ art: 'cat', count: 7 }, { art: 'dog', count: 5 }] },
    V(['cat', { type: 'art', name: 'cat' }], ['dog', { type: 'art', name: 'dog' }], ['same', { type: 'art', name: 'equals' }, true]),
    'cat', 'There are 7 cats and 5 dogs. 7 is more than 5.');
  q('K.CC.C.6', 'Compare groups: fewer', 'medium', 'Which group has FEWER birds?', null,
    G(['bird', 6, 'row'], ['bird', 9, 'scatter'], ['bird', 8, 'circle']), '6 birds', '6 is fewer than 8 and 9.');
  q('K.CC.C.7', 'Compare numerals: greatest', 'easy', 'Which number is the greatest?', null, VA.O.NF(3, 8, 5), 8, '8 is bigger than 5 and 3.');
  q('K.CC.C.7', 'Compare numerals: less than', 'medium', 'Which number is LESS than this number?',
    { type: 'text', text: '4', big: true }, N(2, 6, 9), 2, '2 is less than 4.');

  /* ===== K.OA Operations and Algebraic Thinking (14) ===== */
  q('K.OA.A.1', 'Represent addition with objects', 'medium', 'Which picture shows 2 + 3?', null,
    V(['2 + 3', J('apple', 2, 3, '+')], ['3 + 3', J('apple', 3, 3, '+')], ['2 + 2', J('apple', 2, 2, '+')]), '2 + 3',
    'The first picture has 2 apples and 3 more apples.', { optionLayout: 'stack' });
  q('K.OA.A.1', 'Represent subtraction with objects', 'medium', 'Which picture shows 5 - 2?', null,
    V(['5 - 2', J('bird', 5, 2, '-')], ['5 - 3', J('bird', 5, 3, '-')], ['4 - 2', J('bird', 4, 2, '-')]), '5 - 2',
    'Start with 5 and take away 2.', { optionLayout: 'stack' });
  q('K.OA.A.2', 'Addition word problem', 'easy', '4 birds are on a branch. 2 more birds come. How many birds now?',
    J('bird', 4, 2, '+'), N(5, 6, 7), 6, '4 and 2 more makes 6.');
  q('K.OA.A.2', 'Subtraction word problem', 'medium', '8 apples. 3 apples are eaten. How many apples are left?',
    J('apple', 8, 3, '-'), N(4, 5, 6), 5, '8 take away 3 leaves 5.');
  q('K.OA.A.2', 'Addition word problem', 'medium', '6 fish are swimming. 3 more fish swim in. How many fish are there now?',
    J('fish', 6, 3, '+'), N(8, 9, 10), 9, '6 and 3 more is 9.');
  q('K.OA.A.2', 'Subtraction word problem', 'hard', '7 ducks are in the pond. 4 swim away. How many ducks are left?',
    J('duck', 7, 4, '-'), N(2, 3, 4), 3, '7 take away 4 leaves 3.');
  q('K.OA.A.3', 'Decompose a number', 'medium', '5 apples. 2 are red. How many are green?',
    { type: 'objects-mixed', items: [{ art: 'apple', color: 'red', count: 2 }, { art: 'apple', color: 'green', count: 3 }], reveal: false },
    N(2, 3, 4), 3, '5 is 2 and 3. So 3 apples are green.', { alt: 'Five apples: some red, some green.' });
  q('K.OA.A.3', 'Decompose a number', 'medium', 'Which pair makes 4?',
    { type: 'objects', art: 'star', count: 4, layout: 'row' }, W('1 + 3', '2 + 3', '3 + 3'), '1 + 3', '1 + 3 = 4.');
  q('K.OA.A.3', 'Decompose a number: another way', 'hard', '6 can be made with 2 + 4. Which is ANOTHER way to make 6?',
    { type: 'objects-mixed', items: [{ art: 'ball', color: 'red', count: 2 }, { art: 'ball', color: 'blue', count: 4 }] },
    W('1 + 5', '3 + 4', '2 + 2'), '1 + 5', '1 + 5 = 6.');
  q('K.OA.A.4', 'Make 10', 'medium', '5 + ? = 10. How many more make 10?',
    { type: 'tenframe', filled: 5 }, N(4, 5, 6), 5, '5 and 5 more fill the ten frame.');
  q('K.OA.A.4', 'Make 10', 'hard', '7 + ? = 10. How many more make 10?',
    { type: 'tenframe', filled: 7 }, N(2, 3, 4), 3, '7 and 3 more make 10.');
  q('K.OA.A.5', 'Fluency within 5 (addition)', 'easy', 'What is 2 + 2?',
    { type: 'equation', parts: ['2', '+', '2', '=', '?'] }, N(3, 4, 5), 4, '2 + 2 = 4.');
  q('K.OA.A.5', 'Fluency within 5 (subtraction)', 'medium', 'What is 5 - 3?',
    { type: 'equation', parts: ['5', '-', '3', '=', '?'] }, N(1, 2, 3), 2, '5 - 3 = 2.');
  q('K.OA.A.5', 'Fluency within 5 (addition)', 'medium', 'What is 3 + 2?',
    { type: 'equation', parts: ['3', '+', '2', '=', '?'] }, N(4, 5, 6), 5, '3 + 2 = 5.');

  /* ===== K.NBT Number and Operations in Base Ten (4) ===== */
  q('K.NBT.A.1', 'Compose 11-19: ten and some ones', 'medium', 'How many counters in all?',
    { type: 'tenframe', filled: 13 }, N(12, 13, 14), 13, 'A full ten frame is 10, plus 3 more is 13.');
  q('K.NBT.A.1', 'Compose 11-19: equation', 'medium', 'Which equation matches the picture?',
    { type: 'tenframe', filled: 15 }, W('10 + 5', '5 + 5', '10 + 4'), '10 + 5', 'One full ten frame and 5 more: 10 + 5 = 15.');
  q('K.NBT.A.1', 'Compose 11-19: ten and some ones', 'hard', 'Which number is 10 and 8 ones?',
    { type: 'tenframe', filled: 18 }, N(16, 17, 18), 18, '10 and 8 ones make 18.');
  q('K.NBT.A.1', 'Compose 11-19: picture of a number', 'hard', 'Which picture shows 16?', null,
    V(['16', { type: 'tenframe', filled: 16, small: true }], ['15', { type: 'tenframe', filled: 15, small: true }], ['17', { type: 'tenframe', filled: 17, small: true }]), '16',
    '16 is one full ten frame and 6 more.', { optionLayout: 'stack' });

  /* ===== K.MD Measurement and Data (6) ===== */
  q('K.MD.A.1', 'Measurable attributes: length', 'easy', 'Which tool measures how LONG something is?', null,
    A('ruler', 'clock', 'scale'), 'ruler', 'A ruler measures length.');
  q('K.MD.A.1', 'Measurable attributes: weight', 'easy', 'Which one is the HEAVIEST?', null,
    A('feather', 'rock', 'leaf'), 'rock', 'A rock is heavier than a feather or a leaf.');
  q('K.MD.A.2', 'Directly compare length', 'medium', 'Which ribbon is the LONGEST?', null,
    V(['red ribbon', { type: 'bar', art: 'ribbon', len: 55, color: 'red' }],
      ['yellow ribbon', { type: 'bar', art: 'ribbon', len: 92, color: 'yellow' }],
      ['green ribbon', { type: 'bar', art: 'ribbon', len: 72, color: 'green' }]),
    'yellow ribbon', 'The yellow ribbon is the longest.', { optionLayout: 'stack' });
  q('K.MD.A.2', 'Directly compare height', 'medium', 'Which tower is the SHORTEST?', null,
    V(['tower of 6', { type: 'tower', n: 6 }], ['tower of 3', { type: 'tower', n: 3 }], ['tower of 4', { type: 'tower', n: 4 }]),
    'tower of 3', 'The tower with 3 blocks is the shortest.');
  q('K.MD.B.3', 'Classify and count', 'medium', 'How many RED balls are there?',
    { type: 'objects-mixed', items: [{ art: 'ball', color: 'red', count: 4 }, { art: 'ball', color: 'blue', count: 3 }, { art: 'ball', color: 'yellow', count: 2 }], reveal: true },
    N(3, 4, 5), 4, 'Sort the balls by colour. There are 4 red balls.');
  q('K.MD.B.3', 'Classify, count and compare categories', 'hard', 'Which colour has the MOST flowers?',
    { type: 'objects-mixed', items: [{ art: 'flower', color: 'red', count: 2 }, { art: 'flower', color: 'yellow', count: 5 }, { art: 'flower', color: 'purple', count: 3 }], reveal: true },
    V(['red', { type: 'shape', shape: 'circle', color: 'red' }], ['yellow', { type: 'shape', shape: 'circle', color: 'yellow' }], ['purple', { type: 'shape', shape: 'circle', color: 'purple' }]),
    'yellow', '5 yellow, 3 purple, 2 red. Yellow has the most.');

  /* ===== K.G Geometry (9) ===== */
  q('K.G.A.1', 'Position words: behind', 'medium', 'Which picture shows the dog BEHIND the tree?', null,
    V(['dog behind tree', { type: 'scene', bg: 'meadow', items: [{ art: 'dog', x: 88, y: 55, s: 70 }, { art: 'tree', x: 50, y: 10, s: 118 }] }],
      ['dog in front of tree', { type: 'scene', bg: 'meadow', items: [{ art: 'tree', x: 50, y: 10, s: 118 }, { art: 'dog', x: 80, y: 78, s: 64 }] }],
      ['dog beside tree', { type: 'scene', bg: 'meadow', items: [{ art: 'tree', x: 8, y: 10, s: 118 }, { art: 'dog', x: 125, y: 78, s: 64 }] }]),
    'dog behind tree', 'Behind means on the other side, hidden by the tree.');
  q('K.G.A.1', 'Position words: above', 'easy', 'Where is the sun? It is ___ the house.',
    { type: 'scene', bg: 'sky', items: [{ art: 'sun', x: 70, y: 0, s: 52 }, { art: 'house', x: 45, y: 55, s: 100 }] },
    W('above', 'below', 'beside'), 'above', 'The sun is up high, above the house.');
  q('K.G.A.2', 'Name shapes in any orientation', 'medium', 'Find the triangle.', null,
    SH({ shape: 'triangle', color: 'purple', rot: 180, label: 'upside-down triangle' }, { shape: 'rectangle', color: 'orange' }, { shape: 'circle', color: 'green' }),
    'upside-down triangle', 'A triangle is still a triangle when it is turned upside down.');
  q('K.G.A.2', 'Name shapes', 'medium', 'Find the hexagon.', null,
    SH({ shape: 'hexagon', color: 'blue', rot: 0 }, { shape: 'rectangle', color: 'red' }, { shape: 'triangle', color: 'yellow' }),
    'hexagon', 'A hexagon has 6 sides.');
  q('K.G.A.2', 'Name solid shapes', 'medium', 'Find the cylinder.', null,
    SH({ shape: 'cube' }, { shape: 'cylinder' }, { shape: 'cone' }), 'cylinder', 'A cylinder is like a can. It has two flat circles and a curved side.');
  q('K.G.A.3', 'Flat or solid', 'medium', 'Which shape is FLAT?', null,
    SH({ shape: 'cube' }, { shape: 'cone' }, { shape: 'circle', color: 'orange' }), 'circle', 'A circle is a flat shape. Cubes and cones are solid shapes.');
  q('K.G.B.4', 'Describe shapes: sides', 'hard', 'How many sides does this shape have?',
    { type: 'shape', shape: 'hexagon', color: 'purple' }, N(4, 6, 8), 6, 'A hexagon has 6 sides.');
  q('K.G.B.5', 'Build shapes from components', 'medium', 'This triangle is built with sticks and clay balls. How many sticks?',
    { type: 'build', shape: 'triangle' }, N(2, 3, 4), 3, 'The triangle has 3 sticks and 3 clay balls.');
  q('K.G.B.6', 'Compose shapes', 'hard', 'Put these two triangles together. What shape can they make?',
    { type: 'compose', kind: 'tri-tri-rect' },
    SH({ shape: 'rectangle', color: 'teal' }, { shape: 'circle', color: 'orange' }, { shape: 'hexagon', color: 'purple' }), 'rectangle',
    'Two triangles joined along their long sides make a rectangle.');

  VA.register('kindergarten', 'math', b.list);
})(typeof window !== 'undefined' ? window : globalThis);
