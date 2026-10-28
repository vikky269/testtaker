/* Pre-Kindergarten ELA — 50 questions aligned to Head Start ELOF P-LIT 1-5 and P-LC 6-7.
 * `check` blocks are machine-readable facts used by tests/validate.js (with js/lexicon.js)
 * to verify every phonics relationship. They are never shown to students.
 */
(function (root) {
  const VA = root.VA;
  const { N, A, L, V } = VA.O;
  const b = VA.makeBank({ prefix: 'PK-ELA', grade: 'prek', subject: 'ela' });
  const q = b.q;

  const clap = (n) => ({ type: 'dots', n, pattern: 'line' });

  /* ===== Phonological Awareness (19): P-LIT 1 ===== */

  // Beginning sounds (8)
  q('P-LIT 1', 'Beginning sounds', 'easy', 'Which picture begins with the /b/ sound?', null,
    A('ball', 'cat', 'apple'), 'ball', 'Ball starts with the /b/ sound: b-b-ball.',
    { speech: 'Which picture begins with the buh sound?', check: { kind: 'initial', sound: 'b' } });
  q('P-LIT 1', 'Beginning sounds', 'easy', 'Which picture begins with the /s/ sound?', null,
    A('sun', 'dog', 'fish'), 'sun', 'Sun starts with the /s/ sound: sss-sun.',
    { speech: 'Which picture begins with the sss sound?', check: { kind: 'initial', sound: 's' } });
  q('P-LIT 1', 'Beginning sounds', 'easy', 'Which picture begins with the /m/ sound?', null,
    A('hat', 'moon', 'pig'), 'moon', 'Moon starts with the /m/ sound: mmm-moon.',
    { speech: 'Which picture begins with the mmm sound?', check: { kind: 'initial', sound: 'm' } });
  q('P-LIT 1', 'Beginning sounds', 'easy', 'Which picture begins with the /d/ sound?', null,
    A('bee', 'cup', 'dog'), 'dog', 'Dog starts with the /d/ sound: d-d-dog.',
    { speech: 'Which picture begins with the duh sound?', check: { kind: 'initial', sound: 'd' } });
  q('P-LIT 1', 'Beginning sounds', 'medium', 'Which picture begins with the /t/ sound?', null,
    A('sock', 'bus', 'table'), 'table', 'Table starts with the /t/ sound: t-t-table.',
    { speech: 'Which picture begins with the tuh sound?', check: { kind: 'initial', sound: 't' } });
  q('P-LIT 1', 'Beginning sounds', 'medium', 'Which picture begins with the /p/ sound?', null,
    A('key', 'pig', 'ball'), 'pig', 'Pig starts with the /p/ sound: p-p-pig.',
    { speech: 'Which picture begins with the puh sound?', check: { kind: 'initial', sound: 'p' } });
  q('P-LIT 1', 'Beginning sounds', 'medium', 'Which picture begins with the /f/ sound?', null,
    A('car', 'fish', 'sun'), 'fish', 'Fish starts with the /f/ sound: fff-fish.',
    { speech: 'Which picture begins with the fff sound?', check: { kind: 'initial', sound: 'f' } });
  q('P-LIT 1', 'Beginning sounds', 'medium', 'Which picture begins with the /h/ sound?', null,
    A('moon', 'duck', 'hat'), 'hat', 'Hat starts with the /h/ sound: h-h-hat.',
    { speech: 'Which picture begins with the huh sound?', check: { kind: 'initial', sound: 'h' } });

  // Rhyming (7)
  q('P-LIT 1', 'Rhyming', 'easy', 'Which picture rhymes with CAT?',
    { type: 'art', name: 'cat' }, A('hat', 'dog', 'sun'), 'hat', 'Cat and hat rhyme. They end with the same sound: -at.',
    { check: { kind: 'rhyme', target: 'cat' } });
  q('P-LIT 1', 'Rhyming', 'easy', 'Which picture rhymes with DOG?',
    { type: 'art', name: 'dog' }, A('cat', 'log', 'cup'), 'log', 'Dog and log rhyme: -og.',
    { check: { kind: 'rhyme', target: 'dog' } });
  q('P-LIT 1', 'Rhyming', 'easy', 'Which picture rhymes with BEE?',
    { type: 'art', name: 'bee' }, A('sun', 'tree', 'pig'), 'tree', 'Bee and tree rhyme: -ee.',
    { check: { kind: 'rhyme', target: 'bee' } });
  q('P-LIT 1', 'Rhyming', 'medium', 'Which picture rhymes with STAR?',
    { type: 'art', name: 'star' }, A('pig', 'car', 'hat'), 'car', 'Star and car rhyme: -ar.',
    { check: { kind: 'rhyme', target: 'star' } });
  q('P-LIT 1', 'Rhyming', 'medium', 'Which picture rhymes with MOUSE?',
    { type: 'art', name: 'mouse' }, A('house', 'cup', 'fish'), 'house', 'Mouse and house rhyme: -ouse.',
    { check: { kind: 'rhyme', target: 'mouse' } });
  q('P-LIT 1', 'Rhyming', 'medium', 'Which picture rhymes with FOX?',
    { type: 'art', name: 'fox' }, A('bed', 'box', 'bus'), 'box', 'Fox and box rhyme: -ox.',
    { check: { kind: 'rhyme', target: 'fox' } });
  q('P-LIT 1', 'Rhyming', 'hard', 'Which picture rhymes with CAKE?',
    { type: 'art', name: 'cake' }, A('ball', 'snake', 'duck'), 'snake', 'Cake and snake rhyme: -ake.',
    { check: { kind: 'rhyme', target: 'cake' } });

  // Syllables (4)
  q('P-LIT 1', 'Syllable awareness', 'easy', 'Clap the parts in CAT. How many claps?',
    { type: 'art', name: 'cat' },
    V(['1', clap(1)], ['2', clap(2)], ['3', clap(3)]), 1, 'Cat has one part: cat.',
    { speech: 'Clap the parts in the word cat. How many claps?', check: { kind: 'syllables', word: 'cat', n: 1 } });
  q('P-LIT 1', 'Syllable awareness', 'medium', 'Clap the parts in RABBIT. How many claps?',
    { type: 'art', name: 'rabbit' },
    V(['1', clap(1)], ['2', clap(2)], ['3', clap(3)]), 2, 'Rab-bit has two parts.',
    { speech: 'Clap the parts in the word rabbit. How many claps?', check: { kind: 'syllables', word: 'rabbit', n: 2 } });
  q('P-LIT 1', 'Syllable awareness', 'medium', 'Clap the parts in APPLE. How many claps?',
    { type: 'art', name: 'apple' },
    V(['1', clap(1)], ['2', clap(2)], ['3', clap(3)]), 2, 'Ap-ple has two parts.',
    { speech: 'Clap the parts in the word apple. How many claps?', check: { kind: 'syllables', word: 'apple', n: 2 } });
  q('P-LIT 1', 'Syllable awareness', 'hard', 'Clap the parts in BANANA. How many claps?',
    { type: 'art', name: 'banana' },
    V(['1', clap(1)], ['2', clap(2)], ['3', clap(3)]), 3, 'Ba-na-na has three parts.',
    { speech: 'Clap the parts in the word banana. How many claps?', check: { kind: 'syllables', word: 'banana', n: 3 } });

  /* ===== Print and Alphabet Knowledge (20): P-LIT 2 and P-LIT 3 ===== */

  // Uppercase letter recognition (6)
  q('P-LIT 3', 'Uppercase letter recognition', 'easy', 'Find the letter M.', null, L('M', 'N', 'W'), 'M', 'This is the letter M.');
  q('P-LIT 3', 'Uppercase letter recognition', 'easy', 'Find the letter A.', null, L('H', 'A', 'V'), 'A', 'This is the letter A.');
  q('P-LIT 3', 'Uppercase letter recognition', 'easy', 'Find the letter S.', null, L('S', 'C', 'Z'), 'S', 'This is the letter S.');
  q('P-LIT 3', 'Uppercase letter recognition', 'medium', 'Find the letter T.', null, L('L', 'T', 'F'), 'T', 'This is the letter T.');
  q('P-LIT 3', 'Uppercase letter recognition', 'medium', 'Find the letter B.', null, L('E', 'B', 'R'), 'B', 'This is the letter B.');
  q('P-LIT 3', 'Uppercase letter recognition', 'medium', 'Find the letter K.', null, L('K', 'H', 'X'), 'K', 'This is the letter K.');

  // Uppercase / lowercase matching (5)
  q('P-LIT 3', 'Matching uppercase and lowercase', 'easy', 'Find the small letter that matches A.',
    { type: 'letter', text: 'A' }, L('o', 'a', 'e'), 'a', 'The big letter A and the small letter a are partners.');
  q('P-LIT 3', 'Matching uppercase and lowercase', 'easy', 'Find the small letter that matches M.',
    { type: 'letter', text: 'M' }, L('m', 'n', 'w'), 'm', 'The big letter M and the small letter m are partners.');
  q('P-LIT 3', 'Matching uppercase and lowercase', 'medium', 'Find the small letter that matches S.',
    { type: 'letter', text: 'S' }, L('z', 'c', 's'), 's', 'The big letter S and the small letter s are partners.');
  q('P-LIT 3', 'Matching uppercase and lowercase', 'medium', 'Find the small letter that matches T.',
    { type: 'letter', text: 'T' }, L('f', 'l', 't'), 't', 'The big letter T and the small letter t are partners.');
  q('P-LIT 3', 'Matching uppercase and lowercase', 'hard', 'Find the small letter that matches G.',
    { type: 'letter', text: 'G' }, L('q', 'g', 'y'), 'g', 'The big letter G and the small letter g are partners.');

  // Letter sounds (4)
  q('P-LIT 3', 'Letter sounds', 'easy', 'Which letter does SUN start with?',
    { type: 'art', name: 'sun' }, L('S', 'F', 'H'), 'S', 'Sun starts with the letter S and the /s/ sound.',
    { check: { kind: 'letterSound', art: 'sun', letter: 'S' } });
  q('P-LIT 3', 'Letter sounds', 'medium', 'Which letter does BALL start with?',
    { type: 'art', name: 'ball' }, L('K', 'B', 'T'), 'B', 'Ball starts with the letter B and the /b/ sound.',
    { check: { kind: 'letterSound', art: 'ball', letter: 'B' } });
  q('P-LIT 3', 'Letter sounds', 'medium', 'Which letter does FISH start with?',
    { type: 'art', name: 'fish' }, L('F', 'L', 'S'), 'F', 'Fish starts with the letter F and the /f/ sound.',
    { check: { kind: 'letterSound', art: 'fish', letter: 'F' } });
  q('P-LIT 3', 'Letter sounds', 'medium', 'Which letter does PIG start with?',
    { type: 'art', name: 'pig' }, L('R', 'P', 'N'), 'P', 'Pig starts with the letter P and the /p/ sound.',
    { check: { kind: 'letterSound', art: 'pig', letter: 'P' } });

  // Print awareness (5)
  q('P-LIT 2', 'Print awareness: letters', 'easy', 'Which one is a letter?', null,
    V(['letter', { type: 'letter', text: 'R' }], ['number', { type: 'text', text: '4', big: true }], ['star', { type: 'art', name: 'star' }]),
    'letter', 'R is a letter. Letters are used to make words.');
  q('P-LIT 2', 'Print awareness: where to start reading', 'medium', 'Where do we start reading? Find the green dot.',
    { type: 'textline', lines: 3 },
    V(['start at top left', { type: 'textline', lines: 3, mark: 'top-left' }],
      ['start at top right', { type: 'textline', lines: 3, mark: 'top-right' }],
      ['start at bottom right', { type: 'textline', lines: 3, mark: 'bottom-right' }]),
    'start at top left', 'We start reading at the top left and read to the right.');
  q('P-LIT 2', 'Print awareness: parts of a book', 'easy', 'Which one is the FRONT of the book?', null,
    V(['front cover', { type: 'book', part: 'front' }], ['back cover', { type: 'book', part: 'back' }], ['spine', { type: 'book', part: 'spine' }]),
    'front cover', 'The front cover has the title and a picture.');
  q('P-LIT 2', 'Print awareness: words are made of letters', 'medium', 'Which one is a word?', null,
    V(['word', { type: 'text', text: 'cat' }], ['picture', { type: 'art', name: 'cat' }], ['number', { type: 'text', text: '7', big: true }]),
    'word', 'A word is made of letters. This word says cat.');
  q('P-LIT 2', 'Print awareness: print has meaning', 'easy', 'Which sign tells us to STOP?', null,
    A('tree', 'stopsign', 'kite'), 'stopsign', 'A red stop sign has the word STOP on it. It tells cars to stop.');

  /* ===== Comprehension and Text Structure (4): P-LIT 4 and P-LIT 5 ===== */
  q('P-LIT 5', 'Listening comprehension: key details', 'easy', 'What does Mia have?',
    { type: 'scene', bg: 'sky', items: [{ art: 'girl', x: 20, y: 62, s: 70 }, { art: 'kite', x: 100, y: 8, s: 56 }] },
    A('kite', 'ball', 'hat'), 'kite', 'Mia has a red kite.',
    { story: 'Mia has a red kite. The wind blows. The kite flies up high in the sky.', alt: 'A girl standing on grass, looking up at the sky.' });
  q('P-LIT 5', 'Listening comprehension: key details', 'medium', 'What did Dan the dog find?',
    { type: 'scene', bg: 'meadow', items: [{ art: 'dog', x: 70, y: 52, s: 80 }] },
    A('bone', 'shoe', 'ball'), 'bone', 'Dan dug in the yard and found a big bone.',
    { story: 'Dan the dog digs in the yard. He digs and digs. Then he finds a big bone.', alt: 'A dog standing in a yard.' });
  q('P-LIT 4', 'Story sequencing', 'medium', 'What happens LAST?',
    { type: 'scene', bg: 'meadow', items: [{ art: 'boy', x: 65, y: 55, s: 75 }] },
    A('seed', 'raincloud', 'flower'), 'flower', 'First a seed, next rain, last a flower grows.',
    { story: 'First, Tom plants a seed. Next, rain falls on the seed. Then, a pretty flower grows.', alt: 'A boy in a garden.' });
  q('P-LIT 4', 'Story sequencing', 'hard', 'What happens FIRST?',
    { type: 'scene', bg: 'sky', items: [{ art: 'nest', x: 65, y: 55, s: 75 }] },
    A('egg', 'chick', 'bird'), 'egg', 'The story starts with an egg. Then a chick hatches. Last the bird flies.',
    { story: 'A bird sits on an egg in a nest. The egg cracks. A baby chick comes out. Soon the bird grows big and flies away.', alt: 'A bird nest.' });

  /* ===== Vocabulary (7): P-LC 6 and P-LC 7 ===== */
  q('P-LC 6', 'Picture vocabulary', 'easy', 'Which picture shows a bicycle?', null, A('car', 'bicycle', 'boat'), 'bicycle', 'A bicycle has two wheels and pedals.');
  q('P-LC 6', 'Picture vocabulary', 'easy', 'Which picture shows an umbrella?', null, A('hat', 'shoe', 'umbrella'), 'umbrella', 'An umbrella keeps us dry in the rain.');
  q('P-LC 6', 'Picture vocabulary', 'medium', 'Which picture shows scissors?', null, A('scissors', 'pencil', 'key'), 'scissors', 'Scissors are used for cutting paper.');
  q('P-LC 6', 'Picture vocabulary', 'medium', 'Which picture shows a bed?', null, A('table', 'bed', 'cup'), 'bed', 'A bed is where we sleep.');
  q('P-LC 7', 'Word categories: animals', 'easy', 'Which one is an animal?', null, A('hat', 'cup', 'cow'), 'cow', 'A cow is an animal.');
  q('P-LC 7', 'Word categories: clothing', 'medium', 'Which one can you wear?', null, A('shoe', 'ball', 'kite'), 'shoe', 'We wear shoes on our feet.');
  q('P-LC 7', 'Word categories: which belongs', 'hard', 'Apple and banana are fruits. Which one is also a fruit?',
    { type: 'sequence', items: [{ art: 'apple' }, { art: 'banana' }] }, A('pear', 'dog', 'table'), 'pear', 'A pear is a fruit, just like an apple and a banana.');

  VA.register('prek', 'ela', b.list);
})(typeof window !== 'undefined' ? window : globalThis);
