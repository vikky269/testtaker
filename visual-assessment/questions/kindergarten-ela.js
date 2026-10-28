/* Kindergarten ELA — 50 questions aligned to CCSS RF.K, L.K and RL.K.
 * `check` blocks are machine-readable facts used by tests/validate.js (with js/lexicon.js).
 */
(function (root) {
  const VA = root.VA;
  const { N, W, A, L, V } = VA.O;
  const b = VA.makeBank({ prefix: 'K-ELA', grade: 'kindergarten', subject: 'ela' });
  const q = b.q;
  const dot = (color) => ({ type: 'shape', shape: 'circle', color });

  /* ===== Print Concepts and Letter Knowledge (9) ===== */
  q('RF.K.1.d', 'Uppercase letter recognition', 'easy', 'Find the letter G.', null, L('C', 'G', 'Q'), 'G', 'This is the capital letter G.');
  q('RF.K.1.d', 'Uppercase letter recognition', 'easy', 'Find the letter R.', null, L('P', 'R', 'B'), 'R', 'This is the capital letter R.');
  q('RF.K.1.d', 'Uppercase letter recognition', 'medium', 'Find the letter Y.', null, L('V', 'Y', 'X'), 'Y', 'This is the capital letter Y.');
  q('RF.K.1.d', 'Lowercase letter recognition', 'medium', 'Find the small letter b.', null, L('d', 'b', 'p'), 'b', 'The small b has its belly on the right.');
  q('RF.K.1.d', 'Lowercase letter recognition', 'medium', 'Find the small letter h.', null, L('n', 'h', 'b'), 'h', 'This is the small letter h.');
  q('RF.K.1.d', 'Match uppercase to lowercase', 'medium', 'Find the small letter that matches this big letter.',
    { type: 'letter', text: 'D' }, L('b', 'd', 'p'), 'd', 'Big D and small d are partners.');
  q('RF.K.1.d', 'Match lowercase to uppercase', 'hard', 'Find the big letter that matches this small letter.',
    { type: 'letter', text: 'e' }, L('F', 'E', 'L'), 'E', 'Small e and big E are partners.');
  q('RF.K.1.c', 'Words are separated by spaces', 'medium', 'How many words are in this sentence?',
    { type: 'text', text: 'I see a dog.', big: true, words: true }, N(3, 4, 5), 4, 'The words are: I, see, a, dog. There are 4 words.');
  q('RF.K.1.a', 'Follow text top to bottom', 'medium', 'We read from the top down. Which colour line do we read SECOND?',
    { type: 'textline', lines: 3, colors: true },
    V(['red', dot('red')], ['blue', dot('blue')], ['green', dot('green')]), 'blue', 'We read the top line first, then the next line down. The second line is blue.');

  /* ===== Phonological Awareness (14) ===== */
  q('RF.K.2.a', 'Rhyming', 'easy', 'Which picture rhymes with HEN?',
    { type: 'art', name: 'hen' }, A('pig', 'pen', 'sun'), 'pen', 'Hen and pen rhyme: -en.', { check: { kind: 'rhyme', target: 'hen' } });
  q('RF.K.2.a', 'Rhyming', 'medium', 'Which picture rhymes with CLOCK?',
    { type: 'art', name: 'clock' }, A('sock', 'bus', 'bed'), 'sock', 'Clock and sock rhyme: -ock.', { check: { kind: 'rhyme', target: 'clock' } });
  q('RF.K.2.a', 'Rhyming', 'medium', 'Which picture rhymes with BOAT?',
    { type: 'art', name: 'boat' }, A('coat', 'bell', 'bee'), 'coat', 'Boat and coat rhyme: -oat.', { check: { kind: 'rhyme', target: 'boat' } });
  q('RF.K.2.b', 'Count syllables', 'medium', 'How many parts do you hear in ELEPHANT?',
    { type: 'art', name: 'elephant' }, N(2, 3, 4), 3, 'El-e-phant has 3 parts.', { speech: 'How many parts do you hear in the word elephant?', check: { kind: 'syllables', word: 'elephant', n: 3 } });
  q('RF.K.2.b', 'Count syllables', 'easy', 'How many parts do you hear in MONKEY?',
    { type: 'art', name: 'monkey' }, N(1, 2, 3), 2, 'Mon-key has 2 parts.', { speech: 'How many parts do you hear in the word monkey?', check: { kind: 'syllables', word: 'monkey', n: 2 } });
  q('RF.K.2.c', 'Blend onset and rime', 'medium', 'Put the sounds together: /h/ ... /en/. Which picture is it?', null,
    A('hen', 'pig', 'pen'), 'hen', '/h/ and /en/ blend to make hen.', { speech: 'Put the sounds together. huh, en. Which picture is it?', check: { kind: 'blend', onset: 'h', rime: 'en', answer: 'hen' } });
  q('RF.K.2.c', 'Blend onset and rime', 'hard', 'Put the sounds together: /d/ ... /og/. Which picture is it?', null,
    A('dog', 'log', 'pig'), 'dog', '/d/ and /og/ blend to make dog.', { speech: 'Put the sounds together. duh, og. Which picture is it?', check: { kind: 'blend', onset: 'd', rime: 'og', answer: 'dog' } });
  q('RF.K.2.d', 'Isolate the first sound', 'easy', 'What is the FIRST sound in BUS?',
    { type: 'art', name: 'bus' }, L('d', 'b', 'p'), 'b', 'Bus starts with /b/.', { speech: 'What is the first sound in the word bus?', check: { kind: 'initialLetter', art: 'bus', letter: 'b' } });
  q('RF.K.2.d', 'Isolate the first sound', 'medium', 'What is the FIRST sound in FOX?',
    { type: 'art', name: 'fox' }, L('v', 'f', 't'), 'f', 'Fox starts with /f/.', { speech: 'What is the first sound in the word fox?', check: { kind: 'initialLetter', art: 'fox', letter: 'f' } });
  q('RF.K.2.d', 'Isolate the last sound', 'medium', 'What is the LAST sound in SUN?',
    { type: 'art', name: 'sun' }, L('s', 'u', 'n'), 'n', 'Sun ends with /n/.', { speech: 'What is the last sound in the word sun?', check: { kind: 'finalLetter', art: 'sun', letter: 'n' } });
  q('RF.K.2.d', 'Isolate the middle sound', 'hard', 'What is the MIDDLE sound in PIG?',
    { type: 'art', name: 'pig' }, L('a', 'i', 'u'), 'i', 'Pig has the short /i/ sound in the middle.', { speech: 'What is the middle sound in the word pig?', check: { kind: 'medial', art: 'pig', vowel: 'i' } });
  q('RF.K.2.d', 'Isolate the middle sound', 'hard', 'What is the MIDDLE sound in BED?',
    { type: 'art', name: 'bed' }, L('e', 'a', 'o'), 'e', 'Bed has the short /e/ sound in the middle.', { speech: 'What is the middle sound in the word bed?', check: { kind: 'medial', art: 'bed', vowel: 'e' } });
  q('RF.K.2.e', 'Substitute the first sound', 'hard', 'Change the /l/ in LOG to /d/. Which picture is the new word?',
    { type: 'art', name: 'log' }, A('dog', 'cat', 'sun'), 'dog', 'Log with /d/ at the start is dog.', { speech: 'Change the first sound in log to duh. What is the new word?', check: { kind: 'substitute', from: 'log', newOnset: 'd', answer: 'dog' } });
  q('RF.K.2.e', 'Substitute the first sound', 'hard', 'Change the /m/ in MOUSE to /h/. Which picture is the new word?',
    { type: 'art', name: 'mouse' }, A('house', 'mouse', 'cup'), 'house', 'Mouse with /h/ at the start is house.', { speech: 'Change the first sound in mouse to huh. What is the new word?', check: { kind: 'substitute', from: 'mouse', newOnset: 'h', answer: 'house' } });

  /* ===== Phonics and Word Recognition (12) ===== */
  q('RF.K.3.a', 'Letter-sound correspondence', 'easy', 'Which letter makes the /r/ sound?', null, L('n', 'r', 'w'), 'r', 'The letter r says /r/.', { speech: 'Which letter makes the rrr sound?' });
  q('RF.K.3.a', 'Letter-sound correspondence', 'medium', 'Which letter makes the /l/ sound?', null, L('b', 'l', 'k'), 'l', 'The letter l says /l/.', { speech: 'Which letter makes the lll sound?' });
  q('RF.K.3.a', 'Letter-sound correspondence', 'medium', 'Which letter makes the /n/ sound?', null, L('m', 'n', 'h'), 'n', 'The letter n says /n/.', { speech: 'Which letter makes the nnn sound?' });
  q('RF.K.3.b', 'Long and short vowel sounds', 'hard', 'The letter a can say its name, /ay/. Which picture has the LONG a sound?', null,
    A('cat', 'cake', 'hat'), 'cake', 'Cake says /ay/ in the middle. Cat and hat have the short a.', { speech: 'The letter a can say its name, ay. Which picture has the long a sound?', check: { kind: 'longVowel', correct: 'cake', vowel: 'a' } });
  q('RF.K.3', 'Decode CVC words', 'easy', 'Read the word. Which picture matches?',
    { type: 'text', text: 'sun', big: true }, A('sun', 'bus', 'cup'), 'sun', 'S-u-n spells sun.', { speech: 'Read the word. Which picture matches?', check: { kind: 'cvc', word: 'sun', art: 'sun' } });
  q('RF.K.3', 'Decode CVC words', 'medium', 'Read the word. Which picture matches?',
    { type: 'text', text: 'pig', big: true }, A('pen', 'pig', 'hen'), 'pig', 'P-i-g spells pig.', { speech: 'Read the word. Which picture matches?', check: { kind: 'cvc', word: 'pig', art: 'pig' } });
  q('RF.K.3', 'Decode CVC words', 'medium', 'Read the word. Which picture matches?',
    { type: 'text', text: 'bed', big: true }, A('bed', 'bus', 'bug'), 'bed', 'B-e-d spells bed.', { speech: 'Read the word. Which picture matches?', check: { kind: 'cvc', word: 'bed', art: 'bed' } });
  q('RF.K.3.c', 'High-frequency words', 'easy', 'Find the word: the', null, W('he', 'the', 'she'), 'the', 'This word says the.', { speech: 'Find the word: the' });
  q('RF.K.3.c', 'High-frequency words', 'medium', 'Find the word: is', null, W('in', 'is', 'it'), 'is', 'This word says is.', { speech: 'Find the word: is' });
  q('RF.K.3.c', 'High-frequency words', 'medium', 'Find the word: you', null, W('yes', 'you', 'your'), 'you', 'This word says you.', { speech: 'Find the word: you' });
  q('RF.K.3.d', 'Similarly spelled words', 'hard', 'Which word says CAT?', null, W('cot', 'cat', 'cut'), 'cat', 'Cat has the letter a in the middle.', { speech: 'Which word says cat?' });
  q('RF.K.3.d', 'Similarly spelled words', 'hard', 'Which word says PIN?', null, W('pan', 'pin', 'pen'), 'pin', 'Pin has the letter i in the middle.', { speech: 'Which word says pin?' });

  /* ===== Language and Vocabulary (8) ===== */
  q('L.K.1.b', 'Verbs', 'medium', 'The bird can ___.',
    { type: 'art', name: 'bird' }, W('fly', 'blue', 'nest'), 'fly', 'Fly is an action word. A bird can fly.', { speech: 'The bird can blank. Which word fits?' });
  q('L.K.1.b', 'Nouns', 'easy', 'Which word names the picture?',
    { type: 'art', name: 'house' }, W('run', 'house', 'big'), 'house', 'House is a naming word (a noun).');
  q('L.K.1.c', 'Regular plural nouns', 'medium', 'Which word tells about the picture?',
    { type: 'objects', art: 'cat', count: 3, layout: 'row' }, W('cat', 'cats', 'cate'), 'cats', 'We add s when there is more than one: cats.');
  q('L.K.2.a', 'Capitalise the first word', 'medium', 'Which sentence starts the right way?',
    { type: 'art', name: 'dog' }, W('the dog can run.', 'The dog can run.', 'the Dog can run.'), 'The dog can run.', 'A sentence starts with a capital letter.', { speech: 'Which sentence starts the right way? A sentence begins with a capital letter.' });
  q('L.K.2.b', 'End punctuation', 'medium', 'What mark goes at the end?',
    { type: 'text', text: 'Can you jump', big: true }, W('.', '?', '!'), '?', 'A question ends with a question mark.', { speech: 'Can you jump. What mark goes at the end?' });
  q('L.K.5.a', 'Sort into categories', 'medium', 'Which one does NOT belong with the animals?', null,
    A('cow', 'pig', 'apple', 'hen'), 'apple', 'Cow, pig and hen are farm animals. An apple is a fruit.');
  q('L.K.5.b', 'Opposites', 'medium', 'The sun is HOT. What is the opposite of hot?',
    { type: 'art', name: 'sun' }, W('cold', 'red', 'soft'), 'cold', 'The opposite of hot is cold.');
  q('L.K.5.b', 'Opposites', 'medium', 'The elephant is BIG. What is the opposite of big?',
    { type: 'art', name: 'elephant' }, W('small', 'tall', 'loud'), 'small', 'The opposite of big is small.');

  /* ===== Reading Literature (7) ===== */
  q('RL.K.1', 'Key details', 'easy', 'What did the wind blow away?',
    { type: 'scene', bg: 'sky', items: [{ art: 'boy', x: 65, y: 55, s: 75 }] }, A('hat', 'kite', 'ball'), 'hat', 'The wind blew Sam’s red hat away.',
    { story: 'Sam has a red hat. The wind blows hard. It blows the hat away. Sam runs after it.', alt: 'A boy standing outside on a windy day.' });
  q('RL.K.1', 'Key details', 'medium', 'What did the frog catch?',
    { type: 'scene', bg: 'pond', items: [{ art: 'frog', x: 70, y: 52, s: 75 }] }, A('bug', 'fish', 'bee'), 'bug', 'The frog jumped and caught the bug.',
    { story: 'A frog sits on a log by the pond. A little bug crawls by. The frog jumps. He catches the bug.', alt: 'A frog by a pond.' });
  q('RL.K.2', 'Retell: events in order', 'medium', 'What did Pip do LAST?',
    { type: 'scene', bg: 'pond', items: [{ art: 'duck', x: 70, y: 55, s: 70 }] }, W('swam in the pond', 'took a nap', 'ate a snack'), 'took a nap', 'Pip swam first and took a nap last.',
    { story: 'Pip the duck went to the pond. He swam and swam. Then he took a nap under a tree.', alt: 'A duck near a pond.' });
  q('RL.K.3', 'Characters', 'easy', 'Who is the story about?',
    { type: 'scene', bg: 'meadow', items: [{ art: 'tree', x: 20, y: 20, s: 100 }, { art: 'carrot', x: 135, y: 80, s: 40 }] }, A('rabbit', 'tree', 'carrot'), 'rabbit', 'The story is about Lily the rabbit.',
    { story: 'Lily the rabbit hops to the garden. She finds a big, orange carrot. Lily is happy.', alt: 'A garden with a tree and a carrot.' });
  q('RL.K.3', 'Setting', 'medium', 'Where does the story happen?', null,
    V(['beach', { type: 'scene', bg: 'beach', items: [{ art: 'sun', x: 130, y: 5, s: 40 }] }], ['classroom', { type: 'scene', bg: 'room', items: [{ art: 'table', x: 50, y: 40, s: 90 }] }], ['farm', { type: 'scene', bg: 'meadow', items: [{ art: 'cow', x: 60, y: 60, s: 70 }] }]),
    'beach', 'Ben and his dad are at the beach by the sea.',
    { story: 'Ben and his dad go to the beach. They hear the waves. They build a big sandcastle by the sea.' });
  q('RL.K.3', 'Major events', 'hard', 'What happened to the nest?',
    { type: 'scene', bg: 'sky', items: [{ art: 'tree', x: 55, y: 15, s: 110 }] }, W('It fell from the tree', 'It was painted', 'It flew away'), 'It fell from the tree', 'The strong wind made the nest fall from the tree.',
    { story: 'A little bird sat in a nest in a tall tree. A strong wind blew. The nest fell down. Dad bird helped build a new nest.', alt: 'A tall tree.' });
  q('RL.K.7', 'Illustrations and the story', 'medium', 'Listen: "The bird sits in the tree." Which picture shows this part?', null,
    V(['bird in tree', { type: 'scene', bg: 'sky', items: [{ art: 'tree', x: 50, y: 12, s: 118 }, { art: 'bird', x: 78, y: 28, s: 40 }] }],
      ['bird flying above', { type: 'scene', bg: 'sky', items: [{ art: 'tree', x: 50, y: 40, s: 100 }, { art: 'bird', x: 78, y: 2, s: 36 }] }],
      ['bird on the ground', { type: 'scene', bg: 'meadow', items: [{ art: 'tree', x: 20, y: 12, s: 118 }, { art: 'bird', x: 130, y: 92, s: 36 }] }]),
    'bird in tree', 'The picture with the bird sitting in the tree matches the words.', { speech: 'Listen. The bird sits in the tree. Which picture shows this part?' });

  VA.register('kindergarten', 'ela', b.list);
})(typeof window !== 'undefined' ? window : globalThis);
