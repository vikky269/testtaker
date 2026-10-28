/* Pre-Kindergarten Mathematics — 50 questions aligned to Head Start ELOF P-MATH 1-10. */
(function (root) {
  const VA = root.VA;
  const { N, A, SH, G, V } = VA.O;
  const b = VA.makeBank({ prefix: 'PK-MATH', grade: 'prek', subject: 'math' });
  const q = b.q;

  /* ===== Counting and Cardinality (25) ===== */

  // P-MATH 1 — count sequence (2)
  q('P-MATH 1', 'Count sequence: missing number', 'easy', 'What number is missing?',
    { type: 'numberline', from: 1, to: 5, hide: [4] }, N(3, 4, 6), 4,
    'We count 1, 2, 3, 4, 5. The missing number is 4.');
  q('P-MATH 1', 'Count sequence: what comes next', 'easy', 'The frog is on number 7. What number comes next?',
    { type: 'numberline', from: 5, to: 10, marker: 7 }, N(6, 8, 9), 8,
    'After 7 we say 8.');

  // P-MATH 2 — recognise small sets (3)
  q('P-MATH 2', 'Recognising small sets (dice pattern)', 'easy', 'How many dots? Look quickly!',
    { type: 'dots', n: 3, pattern: 'dice' }, N(2, 3, 4), 3, 'There are 3 dots.');
  q('P-MATH 2', 'Recognising small sets (dice pattern)', 'easy', 'How many dots do you see?',
    { type: 'dots', n: 5, pattern: 'dice' }, N(4, 5, 6), 5, 'There are 5 dots.');
  q('P-MATH 2', 'Recognising small sets (scattered)', 'medium', 'How many dots are there?',
    { type: 'dots', n: 4, pattern: 'scatter' }, N(3, 4, 5), 4, 'There are 4 dots.');

  // P-MATH 3 — counting objects and counting out (8)
  q('P-MATH 3', 'Counting objects', 'easy', 'How many apples?',
    { type: 'objects', art: 'apple', count: 5, layout: 'row' }, N(3, 5, 7), 5, 'There are five apples.');
  q('P-MATH 3', 'Counting objects', 'easy', 'How many ducks?',
    { type: 'objects', art: 'duck', count: 4, layout: 'scatter' }, N(3, 4, 5), 4, 'There are four ducks.');
  q('P-MATH 3', 'Counting objects (scattered)', 'medium', 'How many stars?',
    { type: 'objects', art: 'star', count: 7, layout: 'scatter' }, N(6, 7, 8), 7, 'There are seven stars.');
  q('P-MATH 3', 'Counting objects', 'easy', 'How many balloons?',
    { type: 'objects', art: 'balloon', count: 3, layout: 'row' }, N(2, 3, 4), 3, 'There are three balloons.');
  q('P-MATH 3', 'Counting objects (circle)', 'medium', 'How many fish?',
    { type: 'objects', art: 'fish', count: 9, layout: 'circle' }, N(8, 9, 10), 9, 'There are nine fish.');
  q('P-MATH 3', 'Counting objects (array)', 'medium', 'How many cars?',
    { type: 'objects', art: 'car', count: 6, layout: 'array', cols: 3 }, N(5, 6, 7), 6, 'There are six cars: 3 on top and 3 on the bottom.');
  q('P-MATH 3', 'Counting out a given number', 'medium', 'Which group has 4 flowers?', null,
    G(['flower', 3, 'row'], ['flower', 4, 'circle'], ['flower', 5, 'scatter']), '4 flowers',
    'Count each group. The group with four flowers is the right one.');
  q('P-MATH 3', 'Counting out a given number', 'easy', 'Which group has 2 cats?', null,
    G(['cat', 1, 'row'], ['cat', 2, 'row'], ['cat', 4, 'scatter']), '2 cats',
    'Two cats is the group with a pair of cats.');

  // P-MATH 4 — comparing and ordinal position (6)
  q('P-MATH 4', 'Comparing groups: most', 'easy', 'Which group has the most?', null,
    G(['star', 2, 'scatter'], ['star', 5, 'scatter'], ['star', 3, 'scatter']), '5 stars',
    'Five stars is more than three or two.');
  q('P-MATH 4', 'Comparing groups: fewest', 'medium', 'Which group has the fewest?', null,
    G(['fish', 4, 'scatter'], ['fish', 2, 'scatter'], ['fish', 5, 'scatter']), '2 fish',
    'Two fish is fewer than four or five.');
  q('P-MATH 4', 'Comparing groups: same number', 'medium', 'Which group has the same number as this group?',
    { type: 'objects', art: 'bee', count: 3, layout: 'scatter' },
    G(['butterfly', 2, 'row'], ['butterfly', 3, 'circle'], ['butterfly', 5, 'scatter']), '3 butterflies',
    'Three bees and three butterflies are the same number.');
  q('P-MATH 4', 'Comparing two groups: more', 'medium', 'Which has more: apples or bananas?',
    { type: 'groups', groups: [{ art: 'apple', count: 3 }, { art: 'banana', count: 5 }] },
    V(['apple', { type: 'art', name: 'apple' }], ['banana', { type: 'art', name: 'banana' }], ['same', { type: 'art', name: 'equals' }, true]),
    'banana', 'There are 5 bananas and only 3 apples, so there are more bananas.');
  q('P-MATH 4', 'Ordinal position: first', 'easy', 'Which animal is FIRST in line?',
    { type: 'queue', items: ['pig', 'cat', 'dog', 'hen'], goal: 'door' }, A('cat', 'pig', 'hen'), 'pig',
    'The pig is the closest to the door, so it is first.');
  q('P-MATH 4', 'Ordinal position: third', 'hard', 'Which animal is THIRD in line?',
    { type: 'queue', items: ['rabbit', 'cow', 'frog', 'pig', 'hen'], goal: 'door' }, A('cow', 'frog', 'hen'), 'frog',
    'First is the rabbit, second is the cow, third is the frog.');

  // P-MATH 5 — numerals and quantity (6)
  q('P-MATH 5', 'Matching numerals to quantities', 'easy', 'Which number tells how many balls?',
    { type: 'objects', art: 'ball', count: 3, layout: 'scatter' }, N(2, 3, 5), 3, 'There are 3 balls, so the number 3.');
  q('P-MATH 5', 'Matching numerals to quantities', 'easy', 'Which number tells how many birds?',
    { type: 'objects', art: 'bird', count: 4, layout: 'row' }, N(2, 4, 5), 4, 'There are 4 birds, so the number 4.');
  q('P-MATH 5', 'Matching quantities to numerals', 'medium', 'Which group matches this number?',
    { type: 'text', text: '5', big: true },
    G(['bee', 3, 'scatter'], ['bee', 4, 'row'], ['bee', 5, 'circle']), '5 bees', 'The number 5 matches the group of five bees.');
  q('P-MATH 5', 'Zero: no objects', 'medium', 'How many apples are in the basket?',
    { type: 'art', name: 'basket', alt: 'An empty basket' }, N(0, 1, 2), 0, 'The basket is empty, so there are 0 apples.');
  q('P-MATH 5', 'Recognising numerals', 'easy', 'Find the number 7.', null, VA.O.NV(4, 7, 9), 7, 'This is the number 7.');
  q('P-MATH 5', 'Recognising numerals', 'medium', 'Which number is this?',
    { type: 'text', text: '8', big: true }, N(3, 6, 8), 8, 'This is the number 8.');

  /* ===== Operations and Algebraic Thinking (9) ===== */

  // P-MATH 6 — informal addition / subtraction (5)
  q('P-MATH 6', 'Adding to (objects)', 'easy', '2 ducks are swimming. 1 more duck comes. How many ducks now?',
    { type: 'join', art: 'duck', a: 2, b: 1, op: '+' }, N(2, 3, 4), 3, '2 ducks and 1 more duck make 3 ducks.');
  q('P-MATH 6', 'Putting together (objects)', 'easy', 'How many stars altogether?',
    { type: 'join', art: 'star', a: 3, b: 2, op: '+' }, N(4, 5, 6), 5, '3 stars and 2 stars make 5 stars.');
  q('P-MATH 6', 'Adding to (objects)', 'medium', 'How many balls altogether?',
    { type: 'join', art: 'ball', a: 1, b: 3, op: '+' }, N(3, 4, 5), 4, '1 ball and 3 balls make 4 balls.');
  q('P-MATH 6', 'Taking away (objects)', 'medium', '5 balloons. 2 balloons pop! How many are left?',
    { type: 'join', art: 'balloon', a: 5, b: 2, op: '-' }, N(2, 3, 4), 3, '5 take away 2 leaves 3.');
  q('P-MATH 6', 'Taking away (objects)', 'medium', '4 birds. 3 birds fly away. How many birds are left?',
    { type: 'join', art: 'bird', a: 4, b: 3, op: '-' }, N(0, 1, 2), 1, '4 take away 3 leaves 1 bird.');

  // P-MATH 7 — patterns (4)
  q('P-MATH 7', 'Colour pattern (AB)', 'easy', 'What comes next in the pattern?',
    { type: 'sequence', items: [{ shape: 'circle', color: 'red' }, { shape: 'circle', color: 'blue' }, { shape: 'circle', color: 'red' }, { shape: 'circle', color: 'blue' }] },
    SH({ shape: 'circle', color: 'red', label: 'red circle' }, { shape: 'circle', color: 'blue', label: 'blue circle' }, { shape: 'circle', color: 'green', label: 'green circle' }),
    'red circle', 'The pattern is red, blue, red, blue. Red comes next.');
  q('P-MATH 7', 'Shape pattern (AB)', 'easy', 'What comes next?',
    { type: 'sequence', items: [{ shape: 'circle', color: 'orange' }, { shape: 'square', color: 'orange' }, { shape: 'circle', color: 'orange' }, { shape: 'square', color: 'orange' }] },
    SH({ shape: 'circle', color: 'orange' }, { shape: 'square', color: 'orange' }, { shape: 'triangle', color: 'orange' }),
    'circle', 'The pattern is circle, square, circle, square. A circle comes next.');
  q('P-MATH 7', 'Picture pattern (AAB)', 'medium', 'What comes next in the pattern?',
    { type: 'sequence', items: [{ art: 'apple' }, { art: 'apple' }, { art: 'banana' }, { art: 'apple' }, { art: 'apple' }] },
    A('apple', 'banana', 'grapes'), 'banana', 'The pattern is apple, apple, banana. A banana comes next.');
  q('P-MATH 7', 'Picture pattern (ABC)', 'hard', 'What comes next?',
    { type: 'sequence', items: [{ art: 'star' }, { art: 'heart' }, { art: 'moon' }, { art: 'star' }, { art: 'heart' }] },
    A('star', 'heart', 'moon'), 'moon', 'The pattern is star, heart, moon. After a heart comes the moon.');

  /* ===== Measurement (4) ===== */
  q('P-MATH 8', 'Comparing length', 'easy', 'Which pencil is the longest?', null,
    V(['red pencil', { type: 'bar', art: 'pencil', len: 42, color: 'red' }],
      ['blue pencil', { type: 'bar', art: 'pencil', len: 96, color: 'blue' }],
      ['green pencil', { type: 'bar', art: 'pencil', len: 68, color: 'green' }]),
    'blue pencil', 'The blue pencil stretches the furthest, so it is the longest.', { optionLayout: 'stack' });
  q('P-MATH 8', 'Comparing height', 'easy', 'Which tree is the tallest?', null,
    V(['short tree', { type: 'sized', art: 'tree', scale: 0.5 }],
      ['tall tree', { type: 'sized', art: 'tree', scale: 0.95 }],
      ['middle tree', { type: 'sized', art: 'tree', scale: 0.72 }]),
    'tall tree', 'The tall tree reaches the highest.');
  q('P-MATH 8', 'Comparing size', 'medium', 'Which fish is the smallest?', null,
    V(['small fish', { type: 'sized', art: 'fish', scale: 0.4 }],
      ['big fish', { type: 'sized', art: 'fish', scale: 0.95 }],
      ['medium fish', { type: 'sized', art: 'fish', scale: 0.68 }]),
    'small fish', 'The small fish takes up the least space.');
  q('P-MATH 8', 'Comparing weight', 'medium', 'Which animal is the heaviest?', null,
    A('elephant', 'cat', 'bird'), 'elephant', 'An elephant is much heavier than a cat or a bird.');

  /* ===== Geometry and Spatial Sense (12) ===== */

  // P-MATH 9 — shapes (9)
  q('P-MATH 9', 'Naming shapes', 'easy', 'Find the triangle.', null,
    SH({ shape: 'circle', color: 'red' }, { shape: 'triangle', color: 'blue' }, { shape: 'square', color: 'yellow' }),
    'triangle', 'A triangle has 3 sides and 3 corners.');
  q('P-MATH 9', 'Shapes in different orientations', 'hard', 'Find the square.', null,
    SH({ shape: 'square', color: 'green', rot: 45, label: 'tilted square' }, { shape: 'circle', color: 'purple' }, { shape: 'triangle', color: 'orange' }),
    'tilted square', 'A square is still a square when it is turned. It has 4 equal sides.');
  q('P-MATH 9', 'Naming shapes', 'medium', 'Find the rectangle.', null,
    SH({ shape: 'rectangle', color: 'blue' }, { shape: 'circle', color: 'orange' }, { shape: 'triangle', color: 'green' }),
    'rectangle', 'A rectangle has 4 sides: 2 long and 2 short.');
  q('P-MATH 9', 'Matching shapes', 'medium', 'Which shape is the same as this shape?',
    { type: 'shape', shape: 'hexagon', color: 'yellow' },
    SH({ shape: 'hexagon', color: 'red', rot: 30, label: 'red hexagon' }, { shape: 'square', color: 'yellow', label: 'yellow square' }, { shape: 'circle', color: 'yellow', label: 'yellow circle' }),
    'red hexagon', 'Both shapes are hexagons. The colour and the turn do not change the shape.');
  q('P-MATH 9', 'Sorting by shape: odd one out', 'medium', 'Which shape does not belong?', null,
    SH({ shape: 'circle', color: 'blue', label: 'circle one' }, { shape: 'circle', color: 'blue', label: 'circle two' }, { shape: 'square', color: 'blue', label: 'square' }, { shape: 'circle', color: 'blue', label: 'circle three' }),
    'square', 'Three shapes are circles. The square does not belong.');
  q('P-MATH 9', 'Sorting by shape: matching group', 'hard', 'Which row has only triangles?', null,
    V(['all triangles', { type: 'shape-row', items: [{ shape: 'triangle', color: 'red' }, { shape: 'triangle', color: 'blue' }, { shape: 'triangle', color: 'green' }] }],
      ['triangles and a circle', { type: 'shape-row', items: [{ shape: 'triangle', color: 'red' }, { shape: 'circle', color: 'red' }, { shape: 'triangle', color: 'red' }] }],
      ['triangles and a square', { type: 'shape-row', items: [{ shape: 'square', color: 'blue' }, { shape: 'triangle', color: 'blue' }, { shape: 'triangle', color: 'blue' }] }]),
    'all triangles', 'Every shape in the first row is a triangle.', { optionLayout: 'stack' });
  q('P-MATH 9', 'Shapes in the world', 'easy', 'Which one looks like a circle?', null,
    A('clock', 'book', 'kite'), 'clock', 'A clock face is round like a circle.');
  q('P-MATH 9', 'Shapes in the world', 'medium', 'Which one looks like a rectangle?', null,
    A('ball', 'book', 'sun'), 'book', 'A book cover is a rectangle.');
  q('P-MATH 9', 'Solid shapes', 'medium', 'Which shape is like a ball?', null,
    SH({ shape: 'cube' }, { shape: 'sphere' }, { shape: 'cone' }), 'sphere', 'A sphere is round all over, like a ball.');

  // P-MATH 10 — positions in space (3)
  q('P-MATH 10', 'Position words: on / under / beside', 'easy', 'Which picture shows the ball ON the table?', null,
    V(['ball on table', { type: 'scene', bg: 'room', items: [{ art: 'table', x: 55, y: 45, s: 100 }, { art: 'ball', x: 85, y: 20, s: 40 }] }],
      ['ball under table', { type: 'scene', bg: 'room', items: [{ art: 'table', x: 55, y: 35, s: 100 }, { art: 'ball', x: 85, y: 88, s: 36 }] }],
      ['ball beside table', { type: 'scene', bg: 'room', items: [{ art: 'table', x: 15, y: 40, s: 100 }, { art: 'ball', x: 135, y: 90, s: 40 }] }]),
    'ball on table', 'On means on the top.');
  q('P-MATH 10', 'Position words: in front / behind', 'medium', 'Which picture shows the cat IN FRONT of the house?', null,
    V(['cat in front', { type: 'scene', bg: 'meadow', items: [{ art: 'house', x: 40, y: 12, s: 120 }, { art: 'cat', x: 78, y: 82, s: 56 }] }],
      ['cat behind', { type: 'scene', bg: 'meadow', items: [{ art: 'cat', x: 72, y: 40, s: 56 }, { art: 'house', x: 40, y: 12, s: 120 }] }],
      ['cat beside', { type: 'scene', bg: 'meadow', items: [{ art: 'house', x: 5, y: 12, s: 120 }, { art: 'cat', x: 138, y: 82, s: 56 }] }]),
    'cat in front', 'In front means closer to us than the house.');
  q('P-MATH 10', 'Position words: inside', 'easy', 'Which picture shows the puppy INSIDE the box?', null,
    V(['puppy inside', { type: 'scene', bg: 'room', items: [{ art: 'dog', x: 70, y: 30, s: 60 }, { art: 'box-front', x: 52, y: 55, s: 96 }] }],
      ['puppy on top', { type: 'scene', bg: 'room', items: [{ art: 'box', x: 52, y: 62, s: 90 }, { art: 'dog', x: 70, y: 12, s: 60 }] }],
      ['puppy beside', { type: 'scene', bg: 'room', items: [{ art: 'box', x: 10, y: 55, s: 96 }, { art: 'dog', x: 120, y: 78, s: 60 }] }]),
    'puppy inside', 'Inside means in the middle of the box.');

  VA.register('prek', 'math', b.list);
})(typeof window !== 'undefined' ? window : globalThis);
