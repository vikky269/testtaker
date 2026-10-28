/* Curriculum registry.
 * Every standard code used by a question MUST exist here (the validator enforces this),
 * so no standard can be invented or misspelled.
 *
 * Sources
 *  - K / Grade 1 Mathematics: Common Core State Standards for Mathematics (supplied PDF, pp. 9-16)
 *  - K / Grade 1 ELA:        Common Core ELA-Literacy (thecorestandards.org)
 *  - Pre-K:                  Head Start Early Learning Outcomes Framework (ELOF), ages 3-5:
 *                            P-MATH 1-10, P-LIT 1-6, P-LC 1-7 (headstart.gov)
 */
(function (root) {
  const VA = (root.VA = root.VA || {});

  const GRADES = {
    prek: { id: 'prek', label: 'Pre-Kindergarten', short: 'Pre-K', framework: 'Head Start ELOF' },
    kindergarten: { id: 'kindergarten', label: 'Kindergarten', short: 'Kindergarten', framework: 'Common Core (CCSS)' },
    grade1: { id: 'grade1', label: 'Grade 1', short: 'Grade 1', framework: 'Common Core (CCSS)' },
  };

  // code -> { fw, domain, text }
  const S = {};
  const add = (fw, domain, list) => {
    Object.keys(list).forEach((code) => (S[code] = { fw, domain, text: list[code] }));
  };

  /* ---------------- Pre-K Mathematics (ELOF) ---------------- */
  add('ELOF', 'Counting and Cardinality', {
    'P-MATH 1': 'Child knows number names and the count sequence.',
    'P-MATH 2': 'Child recognizes the number of objects in a small set.',
    'P-MATH 3': 'Child understands the relationship between numbers and quantities.',
    'P-MATH 4': 'Child compares numbers.',
    'P-MATH 5': 'Child associates a quantity with written numerals up to 5 and begins to write numbers.',
  });
  add('ELOF', 'Operations and Algebraic Thinking', {
    'P-MATH 6': 'Child understands addition as adding to and understands subtraction as taking away from.',
    'P-MATH 7': 'Child understands simple patterns.',
  });
  add('ELOF', 'Measurement', {
    'P-MATH 8': 'Child measures objects by their various attributes using standard and non-standard measurement. Uses differences in attributes to make comparisons.',
  });
  add('ELOF', 'Geometry and Spatial Sense', {
    'P-MATH 9': 'Child identifies, describes, compares, and composes shapes.',
    'P-MATH 10': 'Child explores the positions of objects in space.',
  });

  /* ---------------- Pre-K ELA (ELOF) ---------------- */
  add('ELOF', 'Phonological Awareness', {
    'P-LIT 1': 'Child understands that spoken language is made up of smaller sound units (rhyme, beginning sounds, sound segments).',
  });
  add('ELOF', 'Print and Alphabet Knowledge', {
    'P-LIT 2': 'Child understands how print is used and the rules that govern it (functions and conventions of print).',
    'P-LIT 3': 'Child identifies letters of the alphabet and produces their sounds.',
  });
  add('ELOF', 'Comprehension and Text Structure', {
    'P-LIT 4': 'Child understands story structure through storytelling and retelling.',
    'P-LIT 5': 'Child asks and answers questions about a book read aloud.',
  });
  add('ELOF', 'Vocabulary', {
    'P-LC 6': 'Child understands and uses a wide variety of words for a variety of purposes.',
    'P-LC 7': 'Child shows understanding of word categories and relationships among words.',
  });

  /* ---------------- Kindergarten Mathematics (CCSS, supplied PDF) ---------------- */
  add('CCSS', 'Counting and Cardinality', {
    'K.CC.A.1': 'Count to 100 by ones and by tens.',
    'K.CC.A.2': 'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).',
    'K.CC.A.3': 'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).',
    'K.CC.B.4': 'Understand the relationship between numbers and quantities; connect counting to cardinality.',
    'K.CC.B.4.b': 'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.',
    'K.CC.B.4.c': 'Understand that each successive number name refers to a quantity that is one larger.',
    'K.CC.B.5': 'Count to answer "how many?" questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1-20, count out that many objects.',
    'K.CC.C.6': 'Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group.',
    'K.CC.C.7': 'Compare two numbers between 1 and 10 presented as written numerals.',
  });
  add('CCSS', 'Operations and Algebraic Thinking', {
    'K.OA.A.1': 'Represent addition and subtraction with objects, fingers, mental images, drawings, sounds, acting out situations, verbal explanations, expressions, or equations.',
    'K.OA.A.2': 'Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.',
    'K.OA.A.3': 'Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation.',
    'K.OA.A.4': 'For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.',
    'K.OA.A.5': 'Fluently add and subtract within 5.',
  });
  add('CCSS', 'Number and Operations in Base Ten', {
    'K.NBT.A.1': 'Compose and decompose numbers from 11 to 19 into ten ones and some further ones; understand that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones.',
  });
  add('CCSS', 'Measurement and Data', {
    'K.MD.A.1': 'Describe measurable attributes of objects, such as length or weight. Describe several measurable attributes of a single object.',
    'K.MD.A.2': 'Directly compare two objects with a measurable attribute in common, to see which object has "more of"/"less of" the attribute, and describe the difference.',
    'K.MD.B.3': 'Classify objects into given categories; count the numbers of objects in each category and sort the categories by count.',
  });
  add('CCSS', 'Geometry', {
    'K.G.A.1': 'Describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to.',
    'K.G.A.2': 'Correctly name shapes regardless of their orientations or overall size.',
    'K.G.A.3': 'Identify shapes as two-dimensional (lying in a plane, "flat") or three-dimensional ("solid").',
    'K.G.B.4': 'Analyze and compare two- and three-dimensional shapes, in different sizes and orientations, using informal language to describe their similarities, differences, parts (e.g., number of sides and vertices/"corners") and other attributes.',
    'K.G.B.5': 'Model shapes in the world by building shapes from components (e.g., sticks and clay balls) and drawing shapes.',
    'K.G.B.6': 'Compose simple shapes to form larger shapes.',
  });

  /* ---------------- Grade 1 Mathematics (CCSS, supplied PDF) ---------------- */
  add('CCSS', 'Operations and Algebraic Thinking', {
    '1.OA.A.1': 'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions.',
    '1.OA.A.2': 'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20.',
    '1.OA.B.3': 'Apply properties of operations as strategies to add and subtract (commutative and associative properties).',
    '1.OA.B.4': 'Understand subtraction as an unknown-addend problem.',
    '1.OA.C.5': 'Relate counting to addition and subtraction (e.g., by counting on 2 to add 2).',
    '1.OA.C.6': 'Add and subtract within 20, demonstrating fluency for addition and subtraction within 10 (counting on, making ten, decomposing a number leading to a ten, using the relationship between addition and subtraction).',
    '1.OA.D.7': 'Understand the meaning of the equal sign, and determine if equations involving addition and subtraction are true or false.',
    '1.OA.D.8': 'Determine the unknown whole number in an addition or subtraction equation relating three whole numbers.',
  });
  add('CCSS', 'Number and Operations in Base Ten', {
    '1.NBT.A.1': 'Count to 120, starting at any number less than 120. In this range, read and write numerals and represent a number of objects with a written numeral.',
    '1.NBT.B.2': 'Understand that the two digits of a two-digit number represent amounts of tens and ones.',
    '1.NBT.B.2.a': '10 can be thought of as a bundle of ten ones, called a "ten."',
    '1.NBT.B.2.b': 'The numbers from 11 to 19 are composed of a ten and one, two, three, four, five, six, seven, eight, or nine ones.',
    '1.NBT.B.2.c': 'The numbers 10, 20, 30, 40, 50, 60, 70, 80, 90 refer to one, two, three, four, five, six, seven, eight, or nine tens (and 0 ones).',
    '1.NBT.B.3': 'Compare two two-digit numbers based on meanings of the tens and ones digits, recording the results of comparisons with the symbols >, =, and <.',
    '1.NBT.C.4': 'Add within 100, including adding a two-digit number and a one-digit number, and adding a two-digit number and a multiple of 10.',
    '1.NBT.C.5': 'Given a two-digit number, mentally find 10 more or 10 less than the number, without having to count.',
    '1.NBT.C.6': 'Subtract multiples of 10 in the range 10-90 from multiples of 10 in the range 10-90.',
  });
  add('CCSS', 'Measurement and Data', {
    '1.MD.A.1': 'Order three objects by length; compare the lengths of two objects indirectly by using a third object.',
    '1.MD.A.2': 'Express the length of an object as a whole number of length units, by laying multiple copies of a shorter object (the length unit) end to end.',
    '1.MD.B.3': 'Tell and write time in hours and half-hours using analog and digital clocks.',
    '1.MD.C.4': 'Organize, represent, and interpret data with up to three categories; ask and answer questions about the total number of data points, how many in each category, and how many more or less are in one category than in another.',
  });
  add('CCSS', 'Geometry', {
    '1.G.A.1': 'Distinguish between defining attributes (e.g., triangles are closed and three-sided) versus non-defining attributes (e.g., color, orientation, overall size); build and draw shapes to possess defining attributes.',
    '1.G.A.2': 'Compose two-dimensional shapes or three-dimensional shapes to create a composite shape, and compose new shapes from the composite shape.',
    '1.G.A.3': 'Partition circles and rectangles into two and four equal shares, describe the shares using the words halves, fourths, and quarters, and use the phrases half of, fourth of, and quarter of.',
  });

  /* ---------------- Kindergarten ELA (CCSS) ---------------- */
  add('CCSS', 'Print Concepts and Letter Knowledge', {
    'RF.K.1.a': 'Follow words from left to right, top to bottom, and page by page.',
    'RF.K.1.c': 'Understand that words are separated by spaces in print.',
    'RF.K.1.d': 'Recognize and name all upper- and lowercase letters of the alphabet.',
  });
  add('CCSS', 'Phonological Awareness', {
    'RF.K.2.a': 'Recognize and produce rhyming words.',
    'RF.K.2.b': 'Count, pronounce, blend, and segment syllables in spoken words.',
    'RF.K.2.c': 'Blend and segment onsets and rimes of single-syllable spoken words.',
    'RF.K.2.d': 'Isolate and pronounce the initial, medial vowel, and final sounds (phonemes) in three-phoneme (consonant-vowel-consonant, or CVC) words.',
    'RF.K.2.e': 'Add or substitute individual sounds (phonemes) in simple, one-syllable words to make new words.',
  });
  add('CCSS', 'Phonics and Word Recognition', {
    'RF.K.3': 'Know and apply grade-level phonics and word analysis skills in decoding words.',
    'RF.K.3.a': 'Demonstrate basic knowledge of one-to-one letter-sound correspondences by producing the primary sound or many of the most frequent sounds for each consonant.',
    'RF.K.3.b': 'Associate the long and short sounds with the common spellings (graphemes) for the five major vowels.',
    'RF.K.3.c': 'Read common high-frequency words by sight (e.g., the, of, to, you, she, my, is, are, do, does).',
    'RF.K.3.d': 'Distinguish between similarly spelled words by identifying the sounds of the letters that differ.',
  });
  add('CCSS', 'Language and Vocabulary', {
    'L.K.1.b': 'Use frequently occurring nouns and verbs.',
    'L.K.1.c': 'Form regular plural nouns orally by adding /s/ or /es/.',
    'L.K.2.a': 'Capitalize the first word in a sentence and the pronoun I.',
    'L.K.2.b': 'Recognize and name end punctuation.',
    'L.K.5.a': 'Sort common objects into categories (e.g., shapes, foods) to understand the concepts the categories represent.',
    'L.K.5.b': 'Relate frequently occurring verbs and adjectives to their opposites (antonyms).',
    'L.K.5.c': 'Identify real-life connections between words and their use.',
  });
  add('CCSS', 'Reading Literature', {
    'RL.K.1': 'With prompting and support, ask and answer questions about key details in a text.',
    'RL.K.2': 'With prompting and support, retell familiar stories, including key details.',
    'RL.K.3': 'With prompting and support, identify characters, settings, and major events in a story.',
    'RL.K.7': 'With prompting and support, describe the relationship between illustrations and the story in which they appear.',
  });

  /* ---------------- Grade 1 ELA (CCSS) ---------------- */
  add('CCSS', 'Phonological Awareness', {
    'RF.1.2.a': 'Distinguish long from short vowel sounds in spoken single-syllable words.',
    'RF.1.2.b': 'Orally produce single-syllable words by blending sounds (phonemes), including consonant blends.',
    'RF.1.2.c': 'Isolate and pronounce initial, medial vowel, and final sounds (phonemes) in spoken single-syllable words.',
    'RF.1.2.d': 'Segment spoken single-syllable words into their complete sequence of individual sounds (phonemes).',
  });
  add('CCSS', 'Phonics and Word Recognition', {
    'RF.1.3.a': 'Know the spelling-sound correspondences for common consonant digraphs.',
    'RF.1.3.b': 'Decode regularly spelled one-syllable words.',
    'RF.1.3.c': 'Know final -e and common vowel team conventions for representing long vowel sounds.',
    'RF.1.3.d': 'Use knowledge that every syllable must have a vowel sound to determine the number of syllables in a printed word.',
    'RF.1.3.e': 'Decode two-syllable words following basic patterns by breaking the words into syllables.',
    'RF.1.3.f': 'Read words with inflectional endings.',
    'RF.1.3.g': 'Recognize and read grade-appropriate irregularly spelled words.',
  });
  add('CCSS', 'Conventions of Language', {
    'RF.1.1.a': 'Recognize the distinguishing features of a sentence (e.g., first word, capitalization, ending punctuation).',
    'L.1.1.b': 'Use common, proper, and possessive nouns.',
    'L.1.1.c': 'Match singular and plural nouns with the correct verb forms in basic sentences.',
    'L.1.1.d': 'Use personal, possessive, and indefinite pronouns.',
    'L.1.1.e': 'Use verb tenses to show past, present, and future time.',
    'L.1.1.f': 'Use frequently occurring adjectives.',
    'L.1.1.g': 'Use frequently occurring conjunctions, such as and, but, or, so, and because.',
    'L.1.1.j': 'Produce and expand complete simple and compound sentences of four types (statements, questions, commands, exclamations).',
    'L.1.2.a': 'Capitalize dates and names of people.',
    'L.1.2.b': 'Use end punctuation for sentences.',
    'L.1.2.d': 'Use conventional spelling for common spelling patterns and frequently occurring irregular words.',
  });
  add('CCSS', 'Vocabulary', {
    'L.1.4.a': 'Use sentence-level context as a clue to the meaning of a word or phrase.',
    'L.1.4.c': 'Identify frequently occurring root words and their inflected forms (e.g., look, looks, looked, looking).',
    'L.1.5.a': 'Sort words into categories (e.g., colors, clothing) to gain a sense of the concepts the categories represent.',
    'L.1.5.b': 'Define words by category and by one or more key attributes.',
    'L.1.5.d': 'Distinguish shades of meaning among verbs differing in manner and adjectives differing in intensity.',
  });
  add('CCSS', 'Reading Literature and Informational Text', {
    'RL.1.1': 'Ask and answer questions about key details in a text.',
    'RL.1.2': 'Retell stories, including key details, and demonstrate understanding of their central message or lesson.',
    'RL.1.3': 'Describe characters, settings, and major events in a story, using key details.',
    'RL.1.7': 'Use illustrations and details in a story to describe its characters, setting, or events.',
    'RI.1.1': 'Ask and answer questions about key details in a text.',
    'RI.1.2': 'Identify the main topic and retell key details of a text.',
    'RI.1.7': 'Use the illustrations and details in a text to describe its key ideas.',
  });

  VA.GRADES = GRADES;
  VA.STANDARDS = S;
  VA.SUBJECTS = { math: 'Mathematics', ela: 'English Language Arts' };
})(typeof window !== 'undefined' ? window : globalThis);
