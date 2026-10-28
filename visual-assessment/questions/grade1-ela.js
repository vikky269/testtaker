/* Grade 1 ELA — 50 questions aligned to CCSS RF.1, L.1, RL.1 and RI.1.
 * `passage` = text the child reads independently. `check` blocks feed tests/validate.js.
 */
(function (root) {
  const VA = root.VA;
  const { N, W, A, L, G } = VA.O;
  const b = VA.makeBank({ prefix: 'G1-ELA', grade: 'grade1', subject: 'ela' });
  const q = b.q;
  const word = (text) => ({ type: 'text', text, big: true });
  const sentence = (text) => ({ type: 'text', text, big: true, sentence: true });

  /* ===== Phonological Awareness (6) ===== */
  q('RF.1.2.a', 'Long vs short vowel sounds', 'medium', 'The letter i can say its name, /eye/. Which picture has the LONG i sound?', null,
    A('pig', 'kite', 'fish'), 'kite', 'Kite has the long i sound. Pig and fish have the short i sound.',
    { speech: 'The letter i can say its name, eye. Which picture has the long i sound?', check: { kind: 'longVowel', correct: 'kite', vowel: 'i' } });
  q('RF.1.2.a', 'Long vs short vowel sounds', 'medium', 'Which picture has the LONG o sound, like the letter name /oh/?', null,
    A('log', 'boat', 'box'), 'boat', 'Boat has the long o sound. Log and box have the short o sound.',
    { speech: 'Which picture has the long o sound, like the name of the letter o?', check: { kind: 'longVowel', correct: 'boat', vowel: 'o' } });
  q('RF.1.2.b', 'Blend sounds (consonant blends)', 'hard', 'Blend the sounds: /f/ /r/ /o/ /g/. Which picture is it?', null,
    A('dog', 'frog', 'log'), 'frog', 'f-r-o-g blends to frog.',
    { speech: 'Blend the sounds. fff, rrr, o, g. Which picture is it?', check: { kind: 'blendSounds', sounds: ['f', 'r', 'o', 'g'], answer: 'frog' } });
  q('RF.1.2.b', 'Blend sounds (long vowel)', 'hard', 'Blend the sounds: /s/ /n/ /ay/ /k/. Which picture is it?', null,
    A('cake', 'snake', 'star'), 'snake', 's-n-ay-k blends to snake.',
    { speech: 'Blend the sounds. sss, nnn, ay, k. Which picture is it?', check: { kind: 'blendSounds', sounds: ['s', 'n', 'ay', 'k'], answer: 'snake' } });
  q('RF.1.2.c', 'Isolate the medial vowel sound', 'medium', 'What vowel sound is in the MIDDLE of DUCK?',
    { type: 'art', name: 'duck' }, L('o', 'u', 'a'), 'u', 'Duck has the short u sound in the middle.',
    { speech: 'What vowel sound is in the middle of the word duck?', check: { kind: 'medial', art: 'duck', vowel: 'u' } });
  q('RF.1.2.d', 'Segment a word into sounds', 'hard', 'How many sounds are in SHIP? (Remember: sh is one sound.)',
    { type: 'art', name: 'ship' }, N(2, 3, 4), 3, 'Ship has 3 sounds: /sh/ /i/ /p/.',
    { speech: 'How many sounds are in the word ship? Remember, sh is one sound.', check: { kind: 'phonemeCount', art: 'ship', n: 3 } });

  /* ===== Phonics and Word Recognition (16) ===== */
  q('RF.1.3.a', 'Consonant digraph sh', 'easy', 'Which picture starts with the /sh/ sound?', null,
    A('sun', 'ship', 'bus'), 'ship', 'The letters sh together say /sh/ at the start of ship.',
    { speech: 'Which picture starts with the sh sound?', check: { kind: 'initialDigraph', correct: 'ship', digraph: 'sh' } });
  q('RF.1.3.a', 'Consonant digraph ch', 'medium', 'Which picture starts with the /ch/ sound?', null,
    A('cat', 'chair', 'cup'), 'chair', 'The letters ch together say /ch/ at the start of chair.',
    { speech: 'Which picture starts with the ch sound?', check: { kind: 'initialDigraph', correct: 'chair', digraph: 'ch' } });
  q('RF.1.3.a', 'Consonant digraph sh at the end', 'hard', 'Which picture ENDS with the /sh/ sound?', null,
    A('duck', 'fish', 'tree'), 'fish', 'The letters sh together say /sh/ at the end of fish.',
    { speech: 'Which picture ends with the sh sound?', check: { kind: 'finalDigraph', correct: 'fish', digraph: 'sh' } });
  q('RF.1.3.b', 'Decode one-syllable words (blend)', 'medium', 'Read the word. Which picture matches?',
    word('frog'), A('frog', 'dog', 'log'), 'frog', 'f-r-o-g spells frog.', { check: { kind: 'decode', word: 'frog', art: 'frog' } });
  q('RF.1.3.b', 'Decode one-syllable words', 'medium', 'Read the word. Which picture matches?',
    word('duck'), A('bus', 'duck', 'cup'), 'duck', 'd-u-ck spells duck.', { check: { kind: 'decode', word: 'duck', art: 'duck' } });
  q('RF.1.3.b', 'Decode one-syllable words', 'medium', 'Read the word. Which picture matches?',
    word('bell'), A('ball', 'bed', 'bell'), 'bell', 'b-e-ll spells bell.', { check: { kind: 'decode', word: 'bell', art: 'bell' } });
  q('RF.1.3.b', 'Decode one-syllable words (blend)', 'hard', 'Read the word. Which picture matches?',
    word('drum'), A('drum', 'duck', 'bell'), 'drum', 'd-r-u-m spells drum.', { check: { kind: 'decode', word: 'drum', art: 'drum' } });
  q('RF.1.3.c', 'Final e makes the vowel say its name', 'medium', 'Which word has a silent e that makes the vowel say its name?', null,
    W('kit', 'kite', 'sit'), 'kite', 'In kite, the silent e makes the i say its name.');
  q('RF.1.3.c', 'Vowel team (ai)', 'medium', 'Which word has the LONG a sound?', null,
    W('ran', 'rain', 'rap'), 'rain', 'The vowel team ai says long a in rain.');
  q('RF.1.3.c', 'Vowel team (oa)', 'hard', 'Read the word. Which picture matches?',
    word('boat'), A('boat', 'bus', 'bed'), 'boat', 'The vowel team oa says long o in boat.', { check: { kind: 'decode', word: 'boat', art: 'boat' } });
  q('RF.1.3.d', 'Count syllables in a printed word', 'easy', 'How many syllables are in this word?',
    word('rabbit'), N(1, 2, 3), 2, 'Rab-bit has 2 vowel sounds, so 2 syllables.');
  q('RF.1.3.d', 'Count syllables in a printed word', 'hard', 'How many syllables are in this word?',
    word('butterfly'), N(2, 3, 4), 3, 'But-ter-fly has 3 syllables.');
  q('RF.1.3.e', 'Break two-syllable words into syllables', 'hard', 'Which shows how to break NAPKIN into syllables?', null,
    W('nap-kin', 'na-pkin', 'napk-in'), 'nap-kin', 'The word splits between the two middle consonants: nap-kin.');
  q('RF.1.3.f', 'Inflectional ending -s', 'medium', 'Read the word. Which picture shows it?',
    word('cats'), G(['cat', 1, 'row'], ['cat', 3, 'row'], ['dog', 3, 'row']), '3 cats', 'The ending -s means more than one cat.');
  q('RF.1.3.g', 'Irregularly spelled words', 'medium', 'Find the word: said', null, W('sad', 'said', 'sail'), 'said', 'Said is a tricky word. We just have to remember it.', { speech: 'Find the word: said' });
  q('RF.1.3.g', 'Irregularly spelled words', 'medium', 'Find the word: they', null, W('then', 'the', 'they'), 'they', 'They is a tricky word to remember.', { speech: 'Find the word: they' });

  /* ===== Conventions of Language (12) ===== */
  q('RF.1.1.a', 'Features of a sentence', 'easy', 'Which one is a complete sentence?', null,
    W('The dog runs fast.', 'dog runs', 'fast the'), 'The dog runs fast.', 'A sentence starts with a capital letter, tells a whole idea, and ends with a mark.');
  q('L.1.2.a', 'Capitalise names', 'medium', 'Which sentence is written correctly?', null,
    W('my friend is ana.', 'My friend is Ana.', 'my friend is Ana.'), 'My friend is Ana.', 'Start the sentence and the name Ana with capital letters.');
  q('L.1.2.a', 'Capitalise names', 'medium', 'Which sentence is written correctly?', null,
    W('mia and leo play.', 'Mia and Leo play.', 'Mia and leo play.'), 'Mia and Leo play.', 'Names of people start with capital letters.');
  q('L.1.2.b', 'End punctuation: exclamation', 'medium', 'What mark goes at the end?',
    sentence('Wow, that dog is big'), W('.', '?', '!'), '!', 'An exclamation shows strong feeling and ends with !');
  q('L.1.2.b', 'End punctuation: question', 'medium', 'What mark goes at the end?',
    sentence('Where is my hat'), W('.', '?', '!'), '?', 'A question ends with a question mark.');
  q('L.1.1.b', 'Common nouns', 'medium', 'Which word is a noun in this sentence?',
    sentence('The cat sat on the mat.'), W('cat', 'sat', 'on'), 'cat', 'A noun names a person, place or thing. Cat is a noun.');
  q('L.1.1.b', 'Proper nouns', 'medium', 'Which word is the name of one special person?', null,
    W('girl', 'Maya', 'teacher'), 'Maya', 'Maya is a proper noun, so it starts with a capital letter.');
  q('L.1.1.c', 'Subject-verb agreement', 'hard', 'Which sentence is right?', null,
    W('The dogs runs.', 'The dogs run.', 'The dog run.'), 'The dogs run.', 'More than one dog uses run. One dog uses runs.');
  q('L.1.1.d', 'Pronouns', 'medium', 'Which word can take the place of Tom?',
    sentence('Tom runs fast.'), W('He', 'She', 'They'), 'He', 'Tom is a boy, so we can say he.');
  q('L.1.1.e', 'Past tense verbs', 'medium', 'Which word fits?',
    sentence('Yesterday I ___ to the park.'), W('walk', 'walked', 'will walk'), 'walked', 'Yesterday already happened, so we say walked.');
  q('L.1.1.f', 'Adjectives', 'easy', 'Which word describes the dog?',
    sentence('The ___ dog barks.'), W('big', 'run', 'jump'), 'big', 'Big tells what kind of dog it is.');
  q('L.1.1.g', 'Conjunctions', 'hard', 'Which word fits?',
    sentence('I stayed inside ___ it was raining.'), W('because', 'but', 'so'), 'because', 'Because tells the reason I stayed inside.');

  /* ===== Vocabulary (6) ===== */
  q('L.1.4.a', 'Context clues', 'medium', 'The puppy was tiny. It fit in my hand. What does TINY mean?',
    { type: 'art', name: 'dog' }, W('very small', 'very loud', 'very fast'), 'very small', 'It fit in a hand, so tiny means very small.');
  q('L.1.4.a', 'Context clues', 'hard', 'The elephant was enormous. It was bigger than a car. What does ENORMOUS mean?',
    { type: 'art', name: 'elephant' }, W('very big', 'very quiet', 'very old'), 'very big', 'Bigger than a car, so enormous means very big.');
  q('L.1.4.c', 'Root words', 'medium', 'What is the root word in this word?',
    word('jumping'), W('jump', 'ing', 'jumpi'), 'jump', 'Take off -ing and the root word jump is left.');
  q('L.1.5.a', 'Sort words into categories', 'medium', 'Which word belongs in the group?',
    { type: 'sequence', items: [{ shape: 'circle', color: 'red' }, { shape: 'circle', color: 'blue' }, { shape: 'circle', color: 'green' }] },
    W('yellow', 'chair', 'run'), 'yellow', 'Red, blue, green and yellow are all colours.');
  q('L.1.5.b', 'Define a word by key attributes', 'easy', 'Which animal has wings and can fly?', null,
    A('fish', 'bird', 'dog'), 'bird', 'A bird has wings and can fly.');
  q('L.1.5.d', 'Shades of meaning (verbs)', 'hard', 'Which word means to run VERY fast?', null,
    W('stroll', 'sprint', 'tiptoe'), 'sprint', 'Stroll is slow. Tiptoe is quiet. Sprint is very fast.');

  /* ===== Reading Literature and Informational Text (10) ===== */
  q('RL.1.1', 'Key details in a story', 'easy', 'Where does Nina fly her kite?',
    { type: 'scene', bg: 'meadow', items: [{ art: 'girl', x: 20, y: 60, s: 70 }, { art: 'kite', x: 100, y: 5, s: 52 }] }, W('at the park', 'at school', 'at the beach'), 'at the park',
    'The story says Nina flies her kite at the park.',
    { passage: 'Nina has a red kite. She flies it at the park on windy days. Today the wind is strong, and her kite goes up very high.', alt: 'A girl on grass with a kite in the sky.' });
  q('RL.1.1', 'Key details in a story', 'medium', 'Which animal did the children NOT see?',
    { type: 'scene', bg: 'meadow', items: [{ art: 'cow', x: 10, y: 55, s: 70 }, { art: 'pig', x: 70, y: 60, s: 60 }, { art: 'hen', x: 130, y: 62, s: 56 }] }, A('cow', 'duck', 'pig', 'hen'), 'duck',
    'They saw cows, pigs and hens. There was no duck.',
    { passage: 'The class went to a farm. The children saw cows, pigs and hens. Then they ate lunch under a big tree.', alt: 'A cow, a pig and a hen on a farm.' });
  q('RL.1.2', 'Central message or lesson', 'hard', 'What is the lesson of this story?',
    { type: 'scene', bg: 'meadow', items: [{ art: 'mouse', x: 70, y: 52, s: 70 }] }, W('Small friends can help big friends.', 'Lions are fast.', 'Mice like cheese.'), 'Small friends can help big friends.',
    'The small mouse saved the big lion, so even small friends can help.',
    { passage: 'A little mouse woke a sleeping lion. The lion let the mouse go. Later, the lion got stuck in a net. The mouse chewed the net and set the lion free.', alt: 'A mouse standing in a meadow.' });
  q('RL.1.3', 'Setting', 'easy', 'Where did Maya and Ben go?',
    { type: 'scene', bg: 'snow', items: [{ art: 'tree', x: 15, y: 18, s: 100 }, { art: 'boy', x: 110, y: 60, s: 66 }] }, W('a snowy hill', 'a hot beach', 'a big store'), 'a snowy hill',
    'They went to a snowy hill with their sled.',
    { passage: 'Maya and Ben took their sled to the snowy hill. They slid down fast. Maya fell in the snow and laughed.', alt: 'A snowy scene with a tree and a child.' });
  q('RL.1.3', 'Major events', 'medium', 'What happened after the wind blew?',
    { type: 'scene', bg: 'meadow', items: [{ art: 'girl', x: 60, y: 58, s: 70 }, { art: 'cup', x: 125, y: 80, s: 36 }] }, W('The sign fell down.', 'The stand sold out.', 'It began to snow.'), 'The sign fell down.',
    'The wind knocked the sign down, and then Ana’s dad helped her.',
    { passage: 'Ana set up a lemonade stand. She sold cups of lemonade. Then a big wind knocked her sign down. Ana’s dad helped her fix it.', alt: 'A girl with a cup.' });
  q('RL.1.7', 'Use illustrations to describe the setting', 'medium', 'Look at the picture. Which sentence tells about it?',
    { type: 'scene', bg: 'rain', items: [{ art: 'boy', x: 62, y: 60, s: 66 }, { art: 'umbrella', x: 58, y: 10, s: 70 }] }, W('It is a rainy day.', 'It is a sunny day.', 'It is snowing.'), 'It is a rainy day.',
    'The picture shows rain and a boy with an umbrella.',
    { alt: 'A boy holding an umbrella while rain falls.' });
  q('RI.1.2', 'Main topic', 'medium', 'What is this text mostly about?',
    { type: 'scene', bg: 'meadow', items: [{ art: 'bee', x: 70, y: 45, s: 70 }] }, W('how bees live and make honey', 'how to ride a bike', 'why dogs bark'), 'how bees live and make honey',
    'Every sentence is about bees.',
    { passage: 'Bees make honey. Bees live in a hive. One hive can hold thousands of bees.', alt: 'A bee.' });
  q('RI.1.2', 'Main topic', 'hard', 'What is this text mostly about?',
    { type: 'scene', bg: 'snow', items: [{ art: 'penguin', x: 70, y: 48, s: 70 }] }, W('penguins', 'fish', 'snow'), 'penguins',
    'Each sentence tells about penguins.',
    { passage: 'Penguins are birds that cannot fly. They swim fast in cold water. Penguins eat fish.', alt: 'A penguin on snow.' });
  q('RI.1.1', 'Key details in an informational text', 'medium', 'What does an egg become first?',
    { type: 'scene', bg: 'pond', items: [{ art: 'egg', x: 78, y: 62, s: 44 }] }, W('a tadpole', 'a frog', 'a fish'), 'a tadpole',
    'The text says a frog egg becomes a tadpole.',
    { passage: 'A frog starts as an egg. The egg becomes a tadpole. The tadpole grows legs and becomes a frog.', alt: 'A frog by a pond.' });
  q('RI.1.7', 'Use the picture and the text', 'hard', 'The roots drink water from the soil. Which letter points to the roots?',
    { type: 'plant-labeled' }, L('A', 'B', 'C'), 'C', 'The roots are under the soil. The picture shows them at letter C.',
    { alt: 'A plant with three letters. A points to the flower, B to a leaf, C to the roots under the soil.' });

  VA.register('grade1', 'ela', b.list);
})(typeof window !== 'undefined' ? window : globalThis);
