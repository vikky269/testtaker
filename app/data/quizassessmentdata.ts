export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface GradeLevelQuiz {
  grade: string;
  questions: QuizQuestion[];
}

export const quizAssessmentData: GradeLevelQuiz[] = [
  {
    grade: "pre-k",
    questions: [
      {
        id: "q1",
        question: "Subtract 5 – 5 ",
        options: ["0", "1", "2", "5"],
        correctAnswer: "0",
      },
      {
        id: "q2",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751576131/Screenshot_2025-07-03_215504_ljo8rp.png",
        options: ["5", "7", "3", "10"],
        correctAnswer: "10",
      },
      {
        id: "q3",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751576281/Screenshot_2025-07-03_215731_d7jxfa.png",
        options: ["5", "7", "3", "10"],
        correctAnswer: "5",
      },
      {
        id: "q4",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751555566/Screenshot_2025-07-03_161228_snytqb.png",
        options: ["3", "4", "5", "6"],
        correctAnswer: "4",
      },
      {
        id: "q5",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751555683/Screenshot_2025-07-03_161430_rk9zqz.png",
        options: ["A", "B", "C", "D"],
        correctAnswer: "D",
      },
      {
        id: "q6",
        question: "How many sides does a triangle have?",
        options: ["2", "3", "4", "5"],
        correctAnswer: "3",
      },
      {
        id: "q7",
        question: "What number comes before 8?",
        options: ["6", "7", "9", "10"],
        correctAnswer: "7",
      },
      {
        id: "q8",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751555983/Screenshot_2025-07-03_161925_f59za6.png",
        options: ["3 bananas", "5 bananas", "4 bananas", "2 bananas"],
        correctAnswer: "4 bananas",
      },
      {
        id: "q9",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751556129/Picture2_txgxxx.png",
        options: ["10", "5", "15", "51"],
        correctAnswer: "5",
      },
      {
        id: "q10",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751556244/Picture3_x1kdnp.png",
        options: ["6", "4", "2", "24"],
        correctAnswer: "6",
      }
    ],
  },
  {
    grade: "Kindergarten",
    questions: [
      {
        id: "q1",
        question: "Write the missing number: 1, 2, 3, __, 5",
        options: ["4", "5", "-6", "-4"],
        correctAnswer: "4",
      },
      {
        id: "q2",
        question: "9 - 3 = ?",
        options: ["12", "6", "5", "7"],
        correctAnswer: "6",
      },
      {
        id: "q3",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751515197/Screenshot_2025-07-03_045932_k2t6tj.png",
        options: ["16", "18", "20", "12"],
        correctAnswer: "16",
      },
      {
        id: "q4",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751515371/Screenshot_2025-07-03_050233_yk1dbu.png",
        options: ["Circle", "Dot", "Triangle", "None of the above"],
        correctAnswer: "Circle",
      },
      {
        id: "q5",
        question: "Mrs. Gabbie served 5 trays of cheese breads, 9 trays of caramel breads and 5 trays of drinks for her family reunion. How many trays of bread were there altogether?",
        options: ["19", "10", "14", "5"],
        correctAnswer: "14",
      },
      {
        id: "q6",
        question: "8 tens and 5 ones is equal to what number?",
        options: ["805", "85", "58", "81051"],
        correctAnswer: "85",
      },
      {
        id: "q7",
        question: "The old sewing machine is 12 inches wide, and the brand-new sewing machine is 14 inches wide. How much wider is the new machine than the old one?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
      },
      {
        id: "q8",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751516014/Screenshot_2025-07-03_051315_aovhxv.png",
        options: ["Square", "Cuboid", "Rectangle", "Cube"],
        correctAnswer: "Cube",
      },
      {
        id: "q9",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751516157/Screenshot_2025-07-03_051543_ewo27i.png",
        options: ["Cylinder", "Circle", "Cone", "Sphere"],
        correctAnswer: "Cylinder",
      },
      {
        id: "q10",
        question: "What number is missing?  (Sequence: 8, 9, __, 11, 12)",
        options: ["7", "9", "10", "9.5"],
        correctAnswer: "10",
      }
    ],
  },
  {
    grade: "1st-grade",
    questions: [
      {
        id: "q1",
        question: "Emma has 3 packs of stickers. Each pack has 6 stickers. She gives 5 stickers to her friend. How many stickers does she have now?",
        options: ["13", "18", "15", "11"],
        correctAnswer: "13",
      },
      {
        id: "q2",
        question: "Which number is the largest?",
        options: ["84", "48", "74", "64"],
        correctAnswer: "84",
      },
       {
        id: "q3",
        question: "What number is 10 more than 37?",
        options: ["47", "27", "36", "57"],
        correctAnswer: "47",
      },
       {
        id: "q4",
        question: "A toy costs 85 cents. You have one 50¢ coin and two 20¢ coins. How much money do you have?",
        options: ["85¢", "90¢", "70¢", "80¢"],
        correctAnswer: "90¢",
      },
       {
        id: "q5",
        question: "What is the missing number?  ___ + 15 = 28",
        options: ["12", "11", "13", "14"],
        correctAnswer: "13",
      },
       {
        id: "q6",
        question: "Which shape has 4 sides and 4 corners but is not a square?",
        options: ["Triangle", "Rectangle", "Circle", "Pentagon"],
        correctAnswer: "Rectangle",
      },
       {
        id: "q7",
        question: "There are 20 apples. 8 are green, and the rest are red. How many are red?",
        options: ["10", "12", "14", "18"],
        correctAnswer: "12",
      },
       {
        id: "q8",
        question: "What is <sup>1</sup>&frasl;<sub>2</sub> of 12?",
        options: ["5", "6", "4", "8"],
        correctAnswer: "6",
      },
       {
        id: "q9",
        question: "Which number is in the tens place in 74?",
        options: ["4", "0", "7", "1"],
        correctAnswer: "7",
      },
       {
        id: "q10",
        question: "You skip count by 5 starting at 10.What are the first 4 numbers?",
        options: ["10, 15, 20, 25", "10, 20, 30, 40", "5, 10, 15, 20", "15, 20, 25, 30"],
        correctAnswer: "10, 15, 20, 25",
      },
      {
        id: "q11",
        question: "Which word best completes the sentence: 'The cat ___ on the mat.'",
        options: ["sat", "run", "jump", "swim"],
        correctAnswer: "sat",
      },
      {
        id: "q12",
        question: "What is the main idea of a story?",
        options: ["The place it happens", "The most important message", "The name of the character", "The pictures"],
        correctAnswer: "The most important message",
      },
      {
        id: "q13",
        question: "Which of these is a complete sentence?",
        options: ["Running fast.", "The big dog.", "She reads books.", "On the mat."],
        correctAnswer: "She reads books.",
      },
      {
        id: "q14",
        question: "Which word is a noun?",
        options: ["Quickly", "Happy", "Chair", "Blue"],
        correctAnswer: "Chair",
      },
      {
        id: "q15",
        question: "What is the opposite of 'cold'?",
        options: ["Warm", "Big", "Fast",  "Wet"],
        correctAnswer: "Warm",
      },
      {
        id: "q16",
        question: "Which word rhymes with 'light'?",
        options: ["Bit", "Fight", "Lot", "Cat"],
        correctAnswer: "Fight",
      },
      {
        id: "q17",
        question: "What do we call the person who tells the story?",
        options: ["Reader", " Illustrator", "Author", "Narrator"],
        correctAnswer: "Narrator",
      },
      {
        id: "q18",
        question: "Which word is an action word?",
        options: ["Apple", "Run", "Green", "Chair"],
        correctAnswer: "Run",
      },
      {
        id: "q19",
        question: "What do you call the place and time a story happens?",
        options: ["Plot", "Theme", "Setting", "Title"],
        correctAnswer: "Setting",
      },
      {
        id: "q20",
        question: "Choose the correct punctuation for the sentence: 'Where is my hat___'",
        options: ["A. .", "B. !", "C. ?", "D. ,"],
        correctAnswer: "C. ?",
      },
    ],
  },
   {
    grade: "2nd-grade",
    questions: [
      {
        id: "q1",
        question: "A class collected 286 cans for recycling. Another class collected 179 cans. How many more cans did the first class collect?",
        options: ["97", "107", "117", "109"],
        correctAnswer: "107",
      },
      {
        id: "q2",
        question: "You have 3 quarters, 2 dimes, and 4 pennies. How much money do you have?",
        options: ["99¢", "94¢", "89¢", "79¢"],
        correctAnswer: "99¢",
      },
       {
        id: "q3",
        question: "What is the value of the missing number in this equation: 45 + ___ = 120?",
        options: ["65", "75", "85", "95"],
        correctAnswer: "75",
      },
      {
        id: "q4",
        question: "A bakery made 325 cookies. They sold 198. How many cookies were left?",
        options: ["127", "132", "117", "137"],
        correctAnswer: "127",
      },
      {
        id: "q5",
        question: "Which number sentence shows the correct regrouping for 403 - 176?",
        options: ["400 - 100 = 300", "403 - 176 = 227", "403 - 176 = 237", "403 - 176 = 217"],
        correctAnswer: "403 - 176 = 227",
      },
      {
        id: "q6",
        question: "Which number sentence is true?",
        options: ["48 < 84", "125 > 512", "39 = 93", "401 < 104"],
        correctAnswer: "48 < 84",
      },
      {
        id: "q7",
        question: "A triangle has 3 sides.How many sides do 4 triangles have in total?",
        options: ["9", "10", "12", "15"],
        correctAnswer: "12",
      },
      {
        id: "q8",
        question: "If you skip count by 4s starting from 8, what is the 5th number in the sequence?",
        options: ["24", "28", "32", "36"],
        correctAnswer: "24",
      },
      {
        id: "q9",
        question: "A farmer has 7 rows of corn. Each row has 8 corn plants. How many corn plants are there?",
        options: ["48", "54", "56", "64"],
        correctAnswer: "56",
      },
      {
        id: "q10",
        question: "Which number is halfway between 400 and 500?",
        options: ["440", "450", "460", "470"],
        correctAnswer: "450",
      },
       {
        id: "q11",
        question: "What is the main idea of the passage?",
        options: ["It gives details only", "It describes one event", "It explains the whole point", "It shows a timeline"],
        correctAnswer: "It explains the whole point",
      },
      {
        id: "q12",
        question: "Which of these words is a synonym for 'happy'?",
        options: ["Sad", "Angry", "Joyful", "Loud"],
        correctAnswer: "Joyful",
      },
       {
        id: "q13",
        question: "What part of speech is the word 'quietly'?",
        options: ["Noun", "Verb", "Adjective", "Adverb"],
        correctAnswer: "Adverb",
      },
      {
        id: "q14",
        question: "Which sentence uses correct punctuation?",
        options: ["He went to the store", "He went to the store.", "He went, to the store.", "He went to the store?"],
        correctAnswer: "He went to the store.",
      },
      {
        id: "q15",
        question: "What does the word 'predict' mean?",
        options: ["To look back", "To say what will happen", "To ask a question", "To end something"],
        correctAnswer: "To say what will happen",
      },
      {
        id: "q16",
        question: "Which sentence best supports the theme of friendship?",
        options: ["She gave her lunch to her friend.", "She left the class early.", "She wrote a test.", "She forgot her pencil."],
        correctAnswer: "She gave her lunch to her friend.",
      },
      {
        id: "q17",
        question: "Which word is spelled correctly?",
        options: ["Freind", "Friend", "Frend", "Frind"],
        correctAnswer: "Friend",
      },
      {
        id: "q18",
        question: "Choose the correct homophone: 'I can ___ the music.'",
        options: ["here", "hear", "hare", "heir"],
        correctAnswer: "hear",
      },
      {
        id: "q19",
        question: "What is a theme in a story?",
        options: ["The characters", "The lesson or message", "The setting", "The plot twist"],
        correctAnswer: "The lesson or message",
      },
      {
        id: "q20",
        question: "Which of the following is a metaphor?",
        options: ["She is as fast as a cheetah.", "She runs like the wind.", "She is a shining star.", "She jumped high."],
        correctAnswer: "She is a shining star.",
      },
    ],
  },
   {
    grade: "3rd-grade",
    questions: [
      {
        id: "q1",
        question: "A farmer has 6 baskets. Each basket holds 24 apples. He gave away 57 apples. How many apples does he have left?",
        options: ["87", "93", "75", "84"],
        correctAnswer: "87",
      },
      {
        id: "q2",
        question: "What is the smallest 4-digit number that can be made using the digits 3, 0, 5, and 7 only once?",
        options: ["3057", "3075", "5037", "5073"],
        correctAnswer: "3057",
      },
      {
        id: "q3",
        question: "If 3 pencils cost $1.50, how much do 5 pencils cost at the same rate?",
        options: ["$2.00", "$2.50", "$3.00", "$1.80"],
        correctAnswer: "$2.50",
      },
      {
        id: "q4",
        question: "What is the area of a rectangle that has a length of 13 cm and a width of 6 cm?",
        options: ["78 cm²", "76 cm²", "72 cm²", "80 cm²"],
        correctAnswer: "78 cm²",
      },
      {
        id: "q5",
        question: "A toy costs $15. A child saves $2.50 every week. How many full weeks will it take to save enough money?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "6",
      },
      {
        id: "q6",
        question: "Which number is not divisible by both 3 and 4?",
        options: ["12", "18", "24", "36"],
        correctAnswer: "18",
      },
      {
        id: "q7",
        question: "Which fraction is closest to 1 but not equal to 1?",
        options: ["3/4", "7/8", "5/6", "9/10"],
        correctAnswer: "9/10",
      },
      {
        id: "q8",
        question: "If a pizza is cut into 12 equal slices and you eat 3 slices, what fraction is left?",
        options: ["3/12", "9/12", "1/4", "1/2"],
        correctAnswer: "9/12",
      },
      {
        id: "q9",
        question: "Which number is missing in the pattern: 5, 10, __, 20, 25",
        options: ["12", "13", "14", "15"],
        correctAnswer: "15",
      },
      {
        id: "q10",
        question: "A car travels 60 miles in 1 hour. How far will it travel in 2 hours and 30 minutes?",
        options: ["120 miles", "130 miles", "150 miles", "160 miles"],
        correctAnswer: "150 miles",
      },
      {
        id: "q11",
        question: "What is the title of a story?",
        options: ["The last word", "The name of the story", "The author's name", "A chapter"],
        correctAnswer: "The name of the story",
      },
      {
        id: "q12",
        question: "Who is the main character?",
        options: ["The person who draws pictures", "The person who reads", "The most important character", "The animal in the story"],
        correctAnswer: "The most important character",
      },
       {
        id: "q13",
        question: "What is the setting of a story?",
        options: ["The problem", "The place and time of the story", "The title", "The page number"],
        correctAnswer: "The place and time of the story",
      },
      {
        id: "q14",
        question: "What happens at the beginning of a story?",
        options: ["The ending", "The middle part", "The first events", "The author’s name"],
        correctAnswer: "The first events",
      },
      {
        id: "q15",
        question: "Which word is a verb?",
        options: ["Run", "Happy", "School", "Blue"],
        correctAnswer: "Run",
      },
      {
        id: "q16",
        question: "What does 'illustrator' mean?",
        options: ["The person who writes the book", "A person who draws pictures in a book", "A character in the story", "A kind of story"],
        correctAnswer: "A person who draws pictures in a book",
      },
      {
        id: "q17",
        question: "Why is it important to identify the narrator's point of view?",
        options: ["To memorize the story", "To better understand how the events are told and interpreted", "To count the characters", "To find rhyming words"],
        correctAnswer: "To better understand how the events are told and interpreted",
      },
      {
        id: "q18",
        question: "What does the word 'reluctantly' mean in the sentence: <br> 'She reluctantly agreed to help with the chores.'?",
        options: ["Happily", "Without interest", "Willingly", "Unwillingly but agreeing"],
        correctAnswer: "Unwillingly but agreeing",
      },
      {
        id: "q19",
        question: "Which statement best describes a character trait?",
        options: ["Where the character lives", "What the character does for a job", "A quality that shows how the character thinks or acts", "The name of the character"],
        correctAnswer: "A quality that shows how the character thinks or acts",
      },
      {
        id: "q20",
        question: "What question should a reader ask to identify the theme of a story?",
        options: ["What did the character wear?", "Where did the story happen?", "What lesson did the character learn?", "How many pages are in the story?"],
        correctAnswer: "What lesson did the character learn?",
      }
    ],
  },
   {
    grade: "4th-grade",
    questions: [
      {
        id: "q1",
        question: "Eva buys 4 notebooks that each cost $3.75. She pays with a $20 bill. How much change will she receive?",
        options: ["$4.50", "$5.00", "$6.25", "$3.75"],
        correctAnswer: "$5.00",
      },
      {
        id: "q2",
        question: "What is the product of 38 and 26?",
        options: ["988", "912", "1012", "976"],
        correctAnswer: "988",
      },
      {
        id: "q3",
        question: "A rectangle has a length of 9 cm and a width that is <sup>2</sup>&frasl;<sub>3</sub> of the length. What is the area of the rectangle?",
        options: ["60 cm²", "54 cm²", "36 cm²", "48 cm²"],
        correctAnswer: "54 cm²",
      },
      {
        id: "q4",
        question: "Compare using >, <, or =:  choose what best fill in the box <sup>3</sup>&frasl;<sub>4</sub> ☐ <sup>5</sup>&frasl;<sub>8</sub>",
        options: [">", "<", "=", "Not Enough Information"],
        correctAnswer: ">",
      },
      {
        id: "q5",
        question: "In a class of 32 students, <sup>3</sup>&frasl;<sub>8</sub> are wearing glasses. How many students are wearing glasses?",
        options: ["10", "12", "14", "16"],
        correctAnswer: "12",
      },
      {
        id: "q6",
        question: "A baker has 120 cookies. He wants to divide them into boxes so that each box has 8 cookies. How many boxes will he need?",
        options: ["14", "15", "16", "18"],
        correctAnswer: "15",
      },
      {
        id: "q7",
        question: "Round 4,987 to the nearest hundred and to the nearest thousand.",
        options: ["4,900 and 5,000", "5,000 and 4,900", "5,000 and 5,000", "4,900 and 4,000"],
        correctAnswer: "5,000 and 5,000",
      },
      {
        id: "q8",
        question: "What is the perimeter of a square whose area is 81 square inches?",
        options: ["18 inches", "27 inches", "36 inches", "81 inches"],
        correctAnswer: "36 inches",
      },
      {
        id: "q9",
        question: "Jenny read <sup>1</sup>&frasl;<sub>3</sub> of her book on Monday, <sup>1</sup>&frasl;<sub>4</sub> on Tuesday, and <sup>1</sup>&frasl;<sub>6</sub> on Wednesday. What fraction of the book has she read in total? Has she finished the book?",
        options: ["Yes, 1 whole", "No, 3/4", "No, 2/3", "Yes, 7/6"],
        correctAnswer: "No, 3/4",
      },
      {
        id: "q10",
        question: "Fill in the missing number: 6 × ___ = (3 × 4) + (1 × 6)",
        options: ["4", "2", "3", "6"],
        correctAnswer: "3",
      },
      {
        id: "q11",
        question: "What is the main idea of a paragraph?",
        options: ["The title of the story", "The most important idea", "A fun word", "A quote from a character"],
        correctAnswer: "The most important idea",
      },
      {
        id: "q12",
        question: "Which sentence contains a simile?",
        options: ["He is a lion in battle.", "She runs fast.", "He was as quiet as a mouse.", "They walked together."],
        correctAnswer: "He was as quiet as a mouse.",
      },
       {
        id: "q13",
        question: "Why is it important to use evidence from a text?",
        options: ["To copy the story", "To guess the theme", "To support your answers with proof", "To make it longer"],
        correctAnswer: "To support your answers with proof",
      },
      {
        id: "q14",
        question: "Which of the following is an example of a first-person point of view?",
        options: ["He ran to the store.", "They wanted to leave.", "I was nervous before the test.", "She opened the door."],
        correctAnswer: "I was nervous before the test.",
      },
      {
        id: "q15",
        question: "What does the word 'precious' mean in this sentence: <br> 'She kept her necklace in a box because it was very precious to her.'?",
        options: ["Cheap", "Not useful", "Very valuable or special", "Broken"],
        correctAnswer: "Very valuable or special",
      },
      {
        id: "q16",
        question: "How can the setting of a story affect the plot?",
        options: ["It changes the title", "It tells the ending", "It helps shape the events and mood", "It adds more characters"],
        correctAnswer: "It helps shape the events and mood",
      },
      {
        id: "q17",
        question: "Which of these is a theme found in many stories?",
        options: ["The dog is fast", "Never give up", "Blue is a nice color", "The story takes place in a park"],
        correctAnswer: "Never give up",
      },
      {
        id: "q18",
        question: "Which sentence uses correct punctuation for dialogue?",
        options: ["“I love reading. said Maya.", "I love reading,” said Maya.", "“I love reading,” said Maya.", "“I love reading” said Maya"],
        correctAnswer: "“I love reading,” said Maya.",
      },
      {
        id: "q19",
        question: "What is the purpose of the conclusion in a nonfiction text?",
        options: ["To introduce characters", "To tell jokes", "To wrap up and restate key points", "To describe the setting"],
        correctAnswer: "To wrap up and restate key points",
      },
      {
        id: "q20",
        question: "Which of the following best describes a character trait?",
        options: ["The name of the character", "A quality that describes how a character thinks or acts", "The color of the character’s hair", "The number of friends they have"],
        correctAnswer: "A quality that describes how a character thinks or acts",
      }
    ],
  },
  {
    grade: "5th-grade",
    questions: [
      {
        id: "q1",
        question: "What is <sup>3</sup>&frasl;<sub>5</sub> of 45?",
        options: ["27", "15", "18", "30"],
        correctAnswer: "27",
      },
      {
        id: "q2",
        question: "A bag holds 3.75 pounds of flour. How many pounds are in 4 such bags?",
        options: ["15", "14.25", "12.5", "13.5"],
        correctAnswer: "15",
      },
      {
        id: "q3",
        question: "What is the volume of a box that is 5 cm long, 3 cm wide, and 4 cm high?",
        options: ["60 cm³", "12 cm³", "20 cm³", "70 cm³"],
        correctAnswer: "60 cm³",
      },
      {
        id: "q4",
        question: "Which of the following numbers is a prime number?",
        options: ["15", "18", "13", "21"],
        correctAnswer: "13",
      },
      {
        id: "q5",
        question: "What is the product of 234 and 6?",
        options: ["1404", "1344", "1254", "1320"],
        correctAnswer: "1404",
      },
      {
        id: "q6",
        question: "Which expression is equivalent to (2 × 5) + (3 × 4)?",
        options: ["10 + 12 = 22", "7 × 4 = 28", "2 + 5 + 3 + 4 = 14", "8 × 2 = 16"],
        correctAnswer: "10 + 12 = 22",
      },
      {
        id: "q7",
        question: "Round 7,496 to the nearest thousand.",
        options: ["7000", "7500", "8000", "7400"],
        correctAnswer: "7000",
      },
      {
        id: "q8",
        question: "A recipe calls for <sup>2</sup>&frasl;<sub>3</sub> cup of sugar. If you want to make 1.5 times the recipe, how much sugar do you need?",
        options: ["1 1/3 cups", "1 1/4 cups", "1 1/2 cups", "1 cup"],
        correctAnswer: "1 cup",
      },
      {
        id: "q9",
        question: "Which decimal is equal to <sup>3</sup>&frasl;<sub>4</sub>?",
        options: ["0.25", "0.50", "0.75", "1.25"],
        correctAnswer: "0.75",
      },
      {
        id: "q10",
        question: "What is the value of the expression: (6 × 8) ÷ 4?",
        options: ["10", "12", "14", "16"],
        correctAnswer: "12",
      },
      {
        id: "q11",
        question: "What is the theme of a story?",
        options: ["The location of the story", "The author’s name", "The lesson or message in the story", "The number of pages"],
        correctAnswer: "The lesson or message in the story"
      },
      {
        id: "q12",
        question: "Which of the following is an example of personification?",
        options: ["The wind whispered through the trees.", "The car is fast.", "She ran quickly.", "He shouted loudly."],
        correctAnswer: "The wind whispered through the trees."
      },
      {
        id: "q13",
        question: "How does an author support their main idea in nonfiction?",
        options: ["By adding jokes", "By using characters", "With facts, examples, and explanations", "With a colorful title"],
        correctAnswer: "With facts, examples, and explanations"
      },
      {
        id: "q14",
        question: "Which point of view uses 'he' and 'she' and is told by a narrator?",
        options: ["First person", "Second person", "Third person", "Author’s view"],
        correctAnswer: "Third person"
      },
      {
        id: "q15",
        question: "What is the function of a conclusion in an informational text?",
        options: ["To begin the text", "To describe the setting", "To end the story with a joke", "To summarize and restate key points"],
        correctAnswer: "To summarize and restate key points"
      },
      {
        id: "q16",
        question: "Which sentence contains a metaphor?",
        options: ["The clouds were like cotton.", "The clouds were cotton in the sky.", "The clouds moved.", "The sky was blue."],
        correctAnswer: "The clouds were cotton in the sky."
      },
      {
        id: "q17",
        question: "What does the phrase 'break the ice' mean in this sentence: <br> 'He told a joke to break the ice at the meeting.'?",
        options: ["To shatter something cold", "To start a conversation and make people feel comfortable", "To stop talking", "To leave the room"],
        correctAnswer: "To start a conversation and make people feel comfortable"
      },
      {
        id: "q18",
        question: "Which sentence is written in the passive voice?",
        options: ["The teacher gave the students homework.", "The students completed the test.", "The book was read by the class.", "She played the piano."],
        correctAnswer: "The book was read by the class."
      },
      {
        id: "q19",
        question: "Why do authors use descriptive language?",
        options: ["To confuse the reader", "To add color and detail to the text", "To end the story faster", "To change the setting"],
        correctAnswer: "To add color and detail to the text"
      },
      {
        id: "q20",
        question: "What is the best strategy to figure out the meaning of an unknown word?",
        options: ["Skip it", "Look at pictures", "Use context clues in the sentence", "Ask someone else"],
        correctAnswer: "Use context clues in the sentence"
      }
    ],
  },
  {
    grade: "6th-grade",
    questions: [
      {
        id: "q1",
        question: "A baker uses 2<sup>3</sup>&frasl;<sub>4</sub> cups of flour for one batch of cookies. How much flour is needed for 3<sup>1</sup>&frasl;<sub>2</sub> batches?",
        options: ["9<sup>5</sup>&frasl;<sub>8</sub> cups", "9<sup>7</sup>&frasl;<sub>8</sub> cups", "8<sup>1</sup>&frasl;<sub>2</sub> cups", "10 cups"],
        correctAnswer: "9<sup>7</sup>&frasl;<sub>8</sub> cups",
      },
      {
        id: "q2",
        question: "The expression (2x – 3)(x + 4) is expanded. What is the coefficient of the x-term in the expanded form?",
        options: ["2", "5", "-3", "5x"],
        correctAnswer: "5",
      },
      {
        id: "q3",
        question: "A number is divisible by both 6 and 8. What is the least possible positive number that meets this condition?",
        options: ["24", "48", "12", "36"],
        correctAnswer: "48",
      },
      {
        id: "q4",
        question: "A regular hexagon has a perimeter of 48 cm. What is the length of one side?",
        options: ["8 cm", "6 cm", "12 cm", "7 cm"],
        correctAnswer: "8 cm",
      },
      {
        id: "q5",
        question: "Which of the following has the greatest value?",
        options: ["<sup>3</sup>&frasl;<sub>4</sub>", "0.82", "<sup>8</sup>&frasl;<sub>10</sub>", "81%"],
        correctAnswer: "0.82",
      },
      {
        id: "q6",
        question: "Solve for x in the equation: <sup>2</sup>&frasl;<sub>3</sub>x - 5 = 7.",
        options: ["15", "18", "12", "9"],
        correctAnswer: "18",
      },
      {
        id: "q7",
        question: "A box contains 3 red, 4 blue, and 5 green marbles. If one marble is randomly selected, what is the probability it is not green?",
        options: ["<sup>3</sup>&frasl;<sub>4</sub>", "<sup>7</sup>&frasl;<sub>12</sub>", "<sup>5</sup>&frasl;<sub>12</sub>", "<sup>1</sup>&frasl;<sub>4</sub>"],
        correctAnswer: "<sup>3</sup>&frasl;<sub>4</sub>",
      },
      {
        id: "q8",
        question: "The equation y = 5x + 2 represents a pattern. What is the value of y when x = –3?",
        options: ["-13", "-15", "-12", "-17"],
        correctAnswer: "-13",
      },
      {
        id: "q9",
        question: "A store is offering a 25% discount on an item that costs $84. What is the sale price?",
        options: ["$63.00", "$62.50", "$65.00", "$67.00"],
        correctAnswer: "$63.00",
      },
      {
        id: "q10",
        question: "If a triangle has side lengths of 7 cm, 24 cm, and 25 cm, is it a right triangle?",
        options: ["Yes, because 7² + 24² = 25²", "No, because 7 + 24 < 25", "No, because 24² + 25² ≠ 7²", "Yes, because it's isosceles"],
        correctAnswer: "Yes, because 7² + 24² = 25²",
      },
      {
        id: "q11",
        question: "What is a central idea in nonfiction text?",
        options: ["The main topic or point the author is making", "The first sentence", "The caption", "The last fact listed"],
        correctAnswer: "The main topic or point the author is making"
      },
      {
        id: "q12",
        question: "Which sentence contains an example of a hyperbole?",
        options: ["She cried for hours.", "I have a million things to do today.", "He ran to the store.", "The sun is bright."],
        correctAnswer: "I have a million things to do today."
      },
      {
        id: "q13",
        question: "Why do authors use foreshadowing in fiction?",
        options: ["To confuse the reader", "To hint at events that will happen later", "To introduce new characters", "To change the point of view"],
        correctAnswer: "To hint at events that will happen later"
      },
      {
        id: "q14",
        question: "What is a claim in argumentative writing?",
        options: ["A story from the past", "A personal feeling", "The main opinion or position the author takes", "A character’s name"],
        correctAnswer: "The main opinion or position the author takes"
      },
      {
        id: "q15",
        question: "Which of the following best describes an objective summary?",
        options: ["A summary with personal opinions", "A detailed retelling with emotions", "A brief, neutral restatement of main ideas", "A summary written like a poem"],
        correctAnswer: "A brief, neutral restatement of main ideas"
      },
      {
        id: "q16",
        question: "What is the difference between tone and mood?",
        options: ["Tone is the reader’s feeling; mood is the author’s word choice", "Tone is how the author feels; mood is how the reader feels", "They are the same", "Mood is used only in poems"],
        correctAnswer: "Tone is how the author feels; mood is how the reader feels"
      },
      {
        id: "q17",
        question: "How does dialogue help develop a character?",
        options: ["It shows the setting", "It lists their job", "It reveals thoughts, feelings, and relationships", "It creates a plot twist"],
        correctAnswer: "It reveals thoughts, feelings, and relationships"
      },
      {
        id: "q18",
        question: "Which sentence is written in active voice?",
        options: ["The homework was completed by Jake.", "The test was taken by the class.", "Jake completed the homework.", "The paper was torn."],
        correctAnswer: "Jake completed the homework."
      },
      {
        id: "q19",
        question: "What does the word 'elaborate' mean in this sentence: 'Can you elaborate on your idea?'",
        options: ["Change your idea", "Say it more clearly", "Explain it with more detail", "Delete your idea"],
        correctAnswer: "Explain it with more detail"
      },
      {
        id: "q20",
        question: "Why is it important to analyze how a text is structured?",
        options: ["To ignore confusing parts", "To see if it's fiction or nonfiction", "To understand how ideas connect and support meaning", "To find spelling mistakes"],
        correctAnswer: "To understand how ideas connect and support meaning"
      }

    ],
  },
   {
    grade: "7th-grade",
    questions: [
      {
        id: "q1",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751552188/Screenshot_2025-07-03_151607_vht1lb.png",
        options: ["6", "5", "4", "2"],
        correctAnswer: "6",
      },
      {
        id: "q2",
        question: "A jacket originally costs $80. It is marked up by 30%, then discounted by 20%. What is the final price?",
        options: ["$76.80", "$83.20", "$96.00", "$84.00"],
        correctAnswer: "$83.20",
      },
      {
        id: "q3",
        question: "The probability of spinning a red section on a spinner is <sup>2</sup>&frasl;<sub>5</sub>. What is the probability of not spinning red after two independent spins?",
        options: ["<sup>3</sup>&frasl;<sub>5</sub>", "<sup>9</sup>&frasl;<sub>25</sub>", "<sup>6</sup>&frasl;<sub>25</sub>", "<sup>12</sup>&frasl;<sub>25</sub>"],
        correctAnswer: "<sup>9</sup>&frasl;<sub>25</sub>",
      },
      {
        id: "q4",
        question: "Simplify the expression -4<sup>2</sup> + 3 × (2 - 7)",
        options: ["-31", "-29", "-25", "-19"],
        correctAnswer: "-31",
      },
      {
        id: "q5",
        question: "The dimensions of a rectangular prism are doubled. By what factor does the volume increase?",
        options: ["2", "4", "6", "8"],
        correctAnswer: "8",
      },
      {
        id: "q6",
        question: "What is the percent error if a student estimates a value to be 180, but the actual value is 200?",
        options: ["10%", "15%", "20%", "25%"],
        correctAnswer: "10%",
      },
      {
        id: "q7",
        question: "Which of the following is irrational?",
        options: ["&radic;81", "<sup>16</sup>&frasl;<sub>4</sub>", "π", "0.75"],
        correctAnswer: "π",
      },
      {
        id: "q8",
        question: "A triangle has two angles measuring 35° and 75°. What is the measure of the third angle?",
        options: ["65°", "70°", "80°", "85°"],
        correctAnswer: "70°",
      },
      {
        id: "q9",
        question: "Convert 3.61 into a fraction in simplest form.",
        options: ["<sup>361</sup>&frasl;<sub>100</sub>", "<sup>325</sup>&frasl;<sub>90</sub>", "<sup>358</sup>&frasl;<sub>99</sub>", "<sup>356</sup>&frasl;<sub>99</sub>"],
        correctAnswer: "<sup>361</sup>&frasl;<sub>100</sub>",
      },
      {
        id: "q10",
        question: "A car travels 160 miles in 2 hours 40 minutes. What is its average speed in miles per hour?",
        options: ["60 mph", "64 mph", "65 mph", "66 mph"],
        correctAnswer: "60 mph",
      },
      {
        id: "q11",
        question: "<h2>Use this Passage to answer Questions 1-3<h2> <br> The tide was beginning to pull out, revealing the jagged rocks along the shoreline. Lucia stood at the water's edge, scanning the horizon for signs of the pod. Every summer, the dolphins returned to this cove, and every year, she tried to photograph them—but this time was different. She was working on a science fair project to track their migration patterns, and her camera wasn't just for pictures anymore—it was for data.<br> What is the main conflict in the passage?",
        options: ["Lucia is worried about the weather.", "Lucia is waiting for the dolphins to arrive for her project.", "Lucia is trying to decide whether to swim.", "Lucia is late for her science class."],
        correctAnswer: "Lucia is waiting for the dolphins to arrive for her project.",
      },
      {
        id: "q12",
        question: "Which sentence best supports Lucia’s motivation?",
        options: ["“The tide was beginning to pull out...”", "“Every year, she tried to photograph them...”", "“She was working on a science fair project...”", "“Lucia stood at the water’s edge...”"],
        correctAnswer: "“She was working on a science fair project...”",
      },
      {
        id: "q13",
        question: "What is the tone of the passage?",
        options: ["Critical", "Hopeful", "Sarcastic", "Indifferent"],
        correctAnswer: "Hopeful",
      },
      {
        id: "q14",
        question: "Which type of figurative language is used in this sentence? <br>'The leaves danced across the sidewalk in the wind.'",
        options: ["Simile", "Metaphor", "Personification", "Hyperbole"],
        correctAnswer: "Personification",
      },
      {
        id: "q15",
        question: "What is the effect of first-person point of view in a narrative?",
        options: ["It allows the reader to know everything about all characters.", "It gives a limited and personal view of events.", "It removes all emotional connection.",  "It uses the pronouns “he” and “she” to tell the story."],
        correctAnswer: "It gives a limited and personal view of events.",
      },
      {
        id: "q16",
        question: "What does the word “tedious” most likely mean in this sentence? <br> 'The long lecture on ancient pottery was so tedious that several students fell asleep.'",
        options: ["Exciting", "Boring", "Challenging", "Informative"],
        correctAnswer: "Boring",
      },
      {
        id: "q17",
        question: "What is the central idea of an informational text?",
        options: ["A sentence that describes a character", "The most interesting detail in the first paragraph", "The overall message or point the author is making", "The author's opinion about the topic"],
        correctAnswer: "The overall message or point the author is making",
      },
      {
        id: "q18",
        question: "Which revision best improves sentence clarity? <br> 'Running through the forest, the birds chirped loudly.'",
        options: ["Running through the forest, loud birds chirped.", "The birds chirped loudly as they ran through the forest.", "As I ran through the forest, I heard the birds chirping loudly.", "The forest was running, and the birds chirped loudly."],
        correctAnswer: "As I ran through the forest, I heard the birds chirping loudly.",
      },
      {
        id: "q19",
        question: "What is the purpose of a counterclaim in argumentative writing?",
        options: ["To repeat the claim using different words", "To agree with opposing arguments", "To acknowledge and refute an opposing viewpoint", "To summarize the main ideas"],
        correctAnswer: "To acknowledge and refute an opposing viewpoint",
      },
      {
        id: "q20",
        question: "Which sentence best supports a theme of resilience?",
        options: ["Even though she had failed twice, she trained harder and finally won.", "He preferred staying indoors, watching movies all weekend.", "The sun rose slowly over the empty hills.", "They agreed to meet after school to work on the project."],
        correctAnswer: "Even though she had failed twice, she trained harder and finally won.",
      },
    ],
  },
   {
    grade: "8th-grade",
    questions: [
      {
        id: "q1",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751552865/Screenshot_2025-07-03_152729_oh10fh.png",
        options: ["7", "6", "8", "5"],
        correctAnswer: "7",
      },
      {
        id: "q2",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751553086/Screenshot_2025-07-03_153109_vvs0zy.png",
        options: ["(1, 5)", "(2, 7)", "(3, 9)", "(1, 4)"],
        correctAnswer: "(1, 5)",
      },
      {
        id: "q3",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1751553357/Screenshot_2025-07-03_153543_spyqlm.png",
        options: ["16", "-16", "<sup>1</sup>&frasl;<sub>16</sub>", "<sup>1</sup>&frasl;<sub>8</sub>"],
        correctAnswer: "<sup>1</sup>&frasl;<sub>16</sub>",
      },
      {
        id: "q4",
        question: "What is the distance between the points A(–3, 2) and B(4, –2)?",
        options: ["6", "7", "&radic;65", "&radic;49"],
        correctAnswer: "&radic;65",
      },
      {
        id: "q5",
        question: "A cylinder has a height of 10 cm and a radius of 3 cm. What is the volume? (Use π ≈ 3.14)",
        options: ["282.6 cm³", "94.2 cm³", "314.0 cm³", "188.4 cm³"],
        correctAnswer: "282.6 cm³",
      },
      {
        id: "q6",
        question: "Simplify the expression: 3x² – 2x + 5x² – 4 + 6x",
        options: ["8x² + 4x – 4", "8x² + 4x + 4", "8x² + 6x – 4", "8x² + 6x + 4"],
        correctAnswer: "8x² + 6x – 4",
      },
      {
        id: "q7",
        question: "Which number is irrational?",
        options: ["<sup>4</sup>&frasl;<sub>7</sub>", "&radic;36", "&radic;50", "3.25"],
        correctAnswer: "&radic;50",
      },
      {
        id: "q8",
        question: "The function f(x) = 2x² – 3x + 1. What is the value of f(–2)?",
        options: ["15", "17", "9", "11"],
        correctAnswer: "15",
      },
      {
        id: "q9",
        question: "Which equation has no solution?",
        options: ["2x + 5 = 2x + 5", "4x – 1 = 4x + 3", "x – 2 = 2x – 2", "3x + 6 = 3(x + 2)"],
        correctAnswer: "4x – 1 = 4x + 3",
      },
      {
        id: "q10",
        question: "The sum of two numbers is 20. Their difference is 4. What is the product of the two numbers?",
        options: ["96", "99", "104", "100"],
        correctAnswer: "96",
      },
      {
        id: "q11",
        question: "<h2>Use this Passage to answer Questions 1-3<h2>  <br> The clatter of keyboard keys echoed in the nearly silent lab. Amira leaned forward, her eyes scanning line after line of code. One error—just one misplaced character—could crash the entire program. Her team was counting on her to find the bug before the regional robotics competition. She took a deep breath and reminded herself: every problem has a solution. You just have to think your way through it. <br>What does the passage suggest about Amira’s character?",
        options: ["She is impatient and careless.", "She works best under pressure.", "She is unsure about her project.", "She doesn’t like working with a team."],
        correctAnswer: "She works best under pressure.",
      },
      {
        id: "q12",
        question: "What is the theme of the passage?",
        options: ["Working in silence is more productive than collaboration.", "Technology is the future of education.", "Perseverance and logical thinking can solve complex problems.", "One mistake always leads to failure."],
        correctAnswer: "Perseverance and logical thinking can solve complex problems.",
      },
      {
        id: "q13",
        question: "Which detail best supports the idea that Amira is focused?",
        options: ["“Her team was counting on her...”", "“She leaned forward, her eyes scanning line after line...”", "“The clatter of keyboard keys...”", "“She reminded herself to take a deep breath...”"],
        correctAnswer: "“She leaned forward, her eyes scanning line after line...”",
      },
      {
        id: "q14",
        question: "What is the primary effect of foreshadowing in literature?",
        options: ["It slows down the narrative.", "It reveals the ending to the reader.", "It creates suspense and prepares readers for future events.", "It introduces new characters."],
        correctAnswer: "It creates suspense and prepares readers for future events.",
      },
      {
        id: "q15",
        question: "Which of the following best explains a counterargument in argumentative writing?",
        options: ["A statement that weakens your own claim.", "An opposing viewpoint presented and addressed to strengthen your argument.", "A summary of your conclusion.",  "A rhetorical question meant to distract."],
        correctAnswer: "An opposing viewpoint presented and addressed to strengthen your argument.",
      },
      {
        id: "q16",
        question: "Identify the type of irony in the following: <br> 'A firefighter’s house burns down while he’s on duty.'",
        options: ["Verbal irony", "Situational irony", "Dramatic irony", "Structural irony"],
        correctAnswer: "Situational irony",
      },
      {
        id: "q17",
        question: "Which of these best supports a central idea in a nonfiction text?",
        options: ["A joke told by the author.", "An anecdote that reflects personal feelings.", "A statistic from a credible source.", "A vague generalization."],
        correctAnswer: "A statistic from a credible source.",
      },
      {
        id: "q18",
        question: "What is the impact of an unreliable narrator on a narrative?",
        options: ["It creates a predictable plot.", "It enhances reader trust.", "It forces readers to question the truth and interpret the story more critically.", "It limits character development."],
        correctAnswer: "It forces readers to question the truth and interpret the story more critically.",
      },
      {
        id: "q19",
        question: "Which sentence demonstrates correct use of a semicolon?",
        options: ["I wanted to stay longer; but I had to leave.", "I wanted to stay longer; however, I had to leave.", "I wanted to stay longer; and I had to leave.", "I wanted to stay longer, however I had to leave."],
        correctAnswer: "I wanted to stay longer; however, I had to leave.",
      },
      {
        id: "q20",
        question: "Which element of plot is typically used to introduce the main conflict?",
        options: ["Climax", "Falling Action", "Rising Action", "Resolution"],
        correctAnswer: "Rising Action",
      },
    ],
  },
   {
    grade: "9th-grade",
    questions: [
      {
        id: "q1",
        question: "Solve the quadratic equation: x² - 6x + 8 = 0",
        options: ["x = 2 or x = 4", "x = -2 or x = -4", "x = 1 or x = 8", "x = 3 or x = 5"],
        correctAnswer: "x = 2 or x = 4",
      },
      {
        id: "q2",
        question: "Which expression is equivalent to (3x - 2)(x + 4)?",
        options: ["3x² + 10x - 8", "3x² + 14x + 8", "3x² - 2x + 8", "3x² + 12x - 8"],
        correctAnswer: "3x² + 12x - 8",
      },
      {
        id: "q3",
        question: "A line has a slope of 3 and passes through the point (2, -1). What is its equation?",
        options: ["y = 3x - 5", "y = 3x + 5", "y = 3x + 1", "y = 3x - 7"],
        correctAnswer: "y = 3x - 5",
      },
      {
        id: "q4",
        question: "If f(x) = 2x² - 3x + 1, what is f(-2)?",
        options: ["15", "19", "8", "7"],
        correctAnswer: "15",
      },
      {
        id: "q5",
        question: "Which system of equations has no solution?",
        options: ["y = 2x + 3 and y = -x + 1", "y = 3x - 1 and y = 3x + 2", " y = x² and y = -x²", "y = x + 1 and y = 2x - 5"],
        correctAnswer: "y = 3x - 1 and y = 3x + 2",
      },
      {
        id: "q6",
        question: "What is the axis of symmetry of the function f(x) = x² - 6x + 5?",
        options: ["x = 3", "x = -3", "x = 2", "x = 1"],
        correctAnswer: "x = 3",
      },
      {
        id: "q7",
        question: "Which inequality represents all real values of x for which the expression √(x - 4) is defined?",
        options: ["x > 4", "x ≤ 4", "x ≥ 4", "x < 4"],
        correctAnswer: "x ≥ 4",
      },
      {
        id: "q8",
        question: "What is the solution to the system: y = x² and y = 2x + 3?",
        options: ["x = 1, x = 3", "x = -1, x = 3", "x = -1, x = -3", "x = 2, x = -1"],
        correctAnswer: "x = -1, x = 3",
      },
      {
        id: "q9",
        question: "If a triangle has sides of lengths 6, 8, and 10, what type of triangle is it?",
        options: ["Equilateral", "Isosceles", "Right", "Obtuse"],
        correctAnswer: "Right",
      },
      {
        id: "q10",
        question: "Find the x-intercepts of the graph y = x² - 4x - 5.",
        options: ["x = -5, x = 1", "x = -1, x = 5", "x = -4, x = 5", "x = -5, x = 4"],
        correctAnswer: "x = -5, x = 1",
      },
            {
        id: "q11",
        question: "Which sentence contains an example of dramatic irony?",
        options: ["The thunderstorm roared above.", "The audience knows Juliet is alive, but Romeo does not.", "The trees whispered secrets.", "The sun rose above the horizon."],
        correctAnswer: "The audience knows Juliet is alive, but Romeo does not.",
      },
      {
        id: "q12",
        question: "Which of the following best defines an allusion?",
        options: ["A comparison using 'like' or 'as'", "A reference to a historical or literary figure", "An exaggeration", "A humorous statement"],
        correctAnswer: "A reference to a historical or literary figure",
      },
      {
        id: "q13",
        question: "In literary analysis, what does the term 'tone' refer to?",
        options: ["The sound of the words", "The author's attitude toward the subject", "The point of view", "The setting"],
        correctAnswer: "The author's attitude toward the subject",
      },
      {
        id: "q14",
        question: "Which line from a poem is an example of iambic pentameter?",
        options: ["The night was dark and full of dreadful sounds.", "Shall I compare thee to a summer's day?", "I wandered lonely as a cloud that floats", "The wind blew cold across the silent lake."],
        correctAnswer: "Shall I compare thee to a summer's day?",
      },
      {
        id: "q15",
        question: "What is the primary function of counterclaims in an argumentative essay?",
        options: ["To discredit the argument", "To present an alternative view", "To support the claim",  "To conclude the argument"],
        correctAnswer: "To present an alternative view",
      },
      {
        id: "q16",
        question: "Which of the following best represents a theme in 'Of Mice and Men'?",
        options: ["The pursuit of justice", "The power of dreams and isolation", "The value of education", "The celebration of wealth"],
        correctAnswer: "The power of dreams and isolation",
      },
      {
        id: "q17",
        question: "What is the effect of using second-person point of view in writing?",
        options: ["Creates intimacy with the reader", "Offers full insight into all characters", "Builds suspense", "Provides emotional detachment"],
        correctAnswer: "Creates intimacy with the reader",
      },
      {
        id: "q18",
        question: "Which literary device is used when inanimate objects are given human traits?",
        options: ["Metaphor", "Simile", "Personification", "Irony"],
        correctAnswer: "Personification",
      },
      {
        id: "q19",
        question: "In informational texts, what is the purpose of a text feature such as a sidebar?",
        options: ["To distract the reader", "To present off-topic ideas", "To provide additional or related information", "To replace the main text"],
        correctAnswer: "To provide additional or related information",
      },
      {
        id: "q20",
        question: "What is a motif in literature?",
        options: ["A character’s internal conflict", "A recurring element with symbolic meaning", "The plot’s turning point", "The central antagonist"],
        correctAnswer: "A recurring element with symbolic meaning",
      },
    ],
  },
   {
    grade: "10th-grade",
    questions: [
      {
        id: "q1",
        question: "What is the solution to the system of equations: 3x - 2y = 7 and 2x + y = 1?",
        options: ["(1, -1)", "(2, -1)", "(3, 2)", "(4, 1)"],
        correctAnswer: "(2, -1)",
      },
      {
        id: "q2",
        question: "What is the discriminant of the quadratic equation 2x² - 4x + 1 = 0?",
        options: ["8", "0", "4", "12"],
        correctAnswer: "8",
      },
      {
        id: "q3",
        question: "Which of the following functions represents exponential growth",
        options: ["y = 2x + 3", "y = 3x² - 1", "y = 5<sup>x<sup>", "y = <sup>x</sup>&frasl;<sub>2</sub>"],
        correctAnswer: "y = 5<sup>x<sup>",
      },
      {
        id: "q4",
        question: "What is the domain of the function f(x) = √(x - 3)?",
        options: ["x ≥ 0", "x ≤ 3", "x > 3", "x ≥ 3"],
        correctAnswer: "x ≥ 3",
      },
      {
        id: "q5",
        question: "What is the value of sin(30°)?",
        options: ["0", "1", "1/2", "√3/2"],
        correctAnswer: "1/2",
      },
      {
        id: "q6",
        question: "What is the solution to |2x - 1| = 5?",
        options: ["x = 3 or x = -2", "x = 2 or x = -3", "x = 2 or x = -1", "x = 3 or x = 1"],
        correctAnswer: "x = 3 or x = -2",
      },
      {
        id: "q7",
        question: "Which of the following is a characteristic of a linear function?",
        options: ["Constant rate of change", "Variable exponents", "No y-intercept", "Curved graph"],
        correctAnswer: "Constant rate of change",
      },
      {
        id: "q8",
        question: "The volume of a cylinder is given by V = πr²h. What is the volume when r = 3 and h = 4?",
        options: ["36π", "27π", "12π", "48π"],
        correctAnswer: "36π",
      },
      {
        id: "q9",
        question: "What transformation occurs to the graph of y = x² if we graph y = (x - 2)² + 3?",
        options: ["Shift right 2, up 3", "Shift left 2, up 3", "Shift right 2, down 3", "Shift left 2, down 3"],
        correctAnswer: "Shift right 2, up 3",
      },
      {
        id: "q10",
        question: "A line passes through points (1,2) and (3,6). What is its slope?",
        options: ["1", "2", "3", "4"],
        correctAnswer: "2",
      },
      {
        id: "q11",
        question: "Which sentence contains an example of a metaphor?",
        options: ["The clouds were like cotton candy.", "The thunder roared angrily.", "Time is a thief.", "He ran as fast as lightning."],
        correctAnswer: "Time is a thief.",
      },
      {
        id: "q12",
        question: "What is the central theme of George Orwell’s 'Animal Farm'?",
        options: ["Animal behavior", "The corrupting influence of power", "Environmental justice", "Rural life in England"],
        correctAnswer: "The corrupting influence of power",
      },
      {
        id: "q13",
        question: "What is the purpose of a counterclaim in argumentative writing?",
        options: ["To confuse the reader", "To introduce a new topic", "To acknowledge opposing views", "To restate the claim"],
        correctAnswer: "To acknowledge opposing views",
      },
      {
        id: "q14",
        question: "Which of the following best describes the tone of the narrator in 'Of Mice and Men'?",
        options: ["Sarcastic", "Hopeful", "Objective", "Jubilant"],
        correctAnswer: "Objective",
      },
      {
        id: "q15",
        question: "What does the word 'elated' most likely mean in the sentence: <br> 'She was elated when she heard the good news'? ",
        options: ["Sad", "Joyful", "Angry",  "Nervous"],
        correctAnswer: "Joyful",
      },
      {
        id: "q16",
        question: "What is the main function of a thesis statement in an essay?",
        options: ["To introduce the conclusion", "To provide background information", "To state the main argument", "To list the sources"],
        correctAnswer: "To state the main argument",
      },
      {
        id: "q17",
        question: "In literature, what is foreshadowing?",
        options: ["A hint of what is to come", "A detailed character analysis", "A flashback to earlier events", "A summary of the story"],
        correctAnswer: "A hint of what is to come",
      },
      {
        id: "q18",
        question: "Which sentence uses correct parallel structure?",
        options: ["She likes reading, to swim, and biking.", "He enjoys running, jumping, and to swim.", "They like to hike, to bike, and to swim.", "We went shopping, to the movies, and ate dinner."],
        correctAnswer: "They like to hike, to bike, and to swim.",
      },
      {
        id: "q19",
        question: "Which figure of speech is used in the sentence: <br> 'The wind whispered through the trees'?",
        options: ["Metaphor", "Simile", "Hyperbole", "Personification"],
        correctAnswer: "Personification",
      },
      {
        id: "q20",
        question: "What is the point of view in 'The Great Gatsby'?",
        options: ["First person", "Second person", "Third-person limited", "Omniscient"],
        correctAnswer: "First person",
      },
    ],
  },
  {
    grade: "11th-grade",
    questions: [
      {
        id: "q1",
        question: "Determine the derivative of the function f(x) = 3x³ − 5x² + 2x − 7.",
        options: ["f'(x) = 9x² − 10x + 2", "f'(x) = 6x − 10 + 2", "f'(x) = 9x² − 5x + 2", "f'(x) = 3x² − 10x + 2"],
        correctAnswer: "f'(x) = 9x² − 10x + 2"
      },
      {
        id: "q2",
        question: "Solve for x in the exponential equation: 2<sup>(x + 1)</sup> = 16",
        options: ["x = 4", "x = 3", "x = 5", "x = 2"],
        correctAnswer: "x = 3"
      },
      {
        id: "q3",
        question: "Given f(x) = <sup>x − 4</sup>&frasl;<sub>3</sub>, identify the inverse function f⁻¹(x).",
        options: ["f⁻¹(x) = 3x + 4", "f⁻¹(x) = 3x − 4", "f⁻¹(x) = x/3 − 4", "f⁻¹(x) = x/3 + 4"],
        correctAnswer: "f⁻¹(x) = 3x + 4"
      },
      {
        id: "q4",
        question: "Solve the system: 2x + 3y = 12 and x − y = 1.",
        options: ["x = 3, y = 1", "x = 2, y = 2", "x = 3, y = 2", "x = 4, y = 1"],
        correctAnswer: "x = 3, y = 2"
      },
      {
        id: "q5",
        question: "What are the roots of the quadratic equation: x² − 6x + 8 = 0?",
        options: ["x = 2, x = 4", "x = −2, x = −4", "x = 1, x = 8", "x = 3, x = −3"],
        correctAnswer: "x = 2, x = 4"
      },
      {
        id: "q6",
        question: "If sin(θ) = 3/5 and θ lies in the second quadrant, determine the value of cos(θ).",
        options: ["cos(θ) = −4/5", "cos(θ) = 4/5", "cos(θ) = −3/5", "cos(θ) = 3/5"],
        correctAnswer: "cos(θ) = −4/5"
      },
      {
        id: "q7",
        question: "Identify the domain of the function f(x) = √(2x − 6).",
        options: ["x ≥ 3", "x > 3", "x ≤ 3", "x ≤ −3"],
        correctAnswer: "x ≥ 3"
      },
      {
        id: "q8",
        question: "Simplify the expression: (2x² − 3x + 5) − (x² + x − 2).",
        options: ["x² − 4x + 7", "x² − 4x + 3", "3x² − 2x + 3", "3x² − 4x + 3"],
        correctAnswer: "x² − 4x + 3"
      },
      {
        id: "q9",
        question: "Which of the following functions represents exponential decay?",
        options: ["f(x) = 2<sup>x</sup>", "f(x) = 3x + 1", "f(x) = 0.5<sup>x</sup>", "f(x) = x²"],
        correctAnswer: "f(x) = 0.5<sup>x</sup>"
      },
      {
        id: "q10",
        question: "Determine the equation of a line passing through (2, 5) with slope −3.",
        options: ["y = −3x + 11", "y = 3x + 5", "y = −2x + 3", "y = −3x − 1"],
        correctAnswer: "y = −3x + 11"
      },
      {
        id: "q11",
        question: "Passage 1: <br> The forest was unusually silent that morning, save for the occasional rustle of leaves stirred by a gentle wind. Sunlight filtered through the canopy, casting golden rays on the damp earth. As Clara walked deeper into the woods, she felt both a sense of wonder and a prickling unease, as if the forest itself was holding its breath.<br>  What is the tone of this passage?",
        options: ["Cheerful", "Tense", "Humorous", "Indifferent"],
        correctAnswer: "Tense"
      },
      {
        id: "q12",
        question: "Which literary device is used in the phrase 'the forest itself was holding its breath'?",
        options: ["Simile", "Hyperbole", "Personification", "Alliteration"],
        correctAnswer: "Personification"
      },
      {
        id: "q13",
        question: "Passage 2: <br> Throughout history, scientific discovery has relied not only on brilliant minds, but also on the collaboration of diverse teams. From the laboratories of Marie Curie to the engineering marvels of NASA, innovation thrives when ideas intersect and evolve. The future of science depends not solely on individual intellect, but on shared pursuit. <br> What is the main idea of this passage?",
        options: ["Marie Curie discovered radiation.", "Scientific innovation depends on individual effort.", "Collaboration enhances scientific discovery.", "NASA is the greatest scientific organization."],
        correctAnswer: "Collaboration enhances scientific discovery."
      },
      {
        id: "q14",
        question: "What is the author's tone in this Passage 2?",
        options: ["Critical", "Reflective", "Sarcastic", "Indifferent"],
        correctAnswer: "Reflective"
      },
      {
        id: "q15",
        question: 'Passage 3: <br> "We must learn to live together as brothers or perish together as fools". These words, spoken by Dr. Martin Luther King Jr., remain relevant in a world still grappling with division and conflict. The quote is a timeless call to unity, underscoring the urgent need for empathy, dialogue, and mutual respect. <br>   What rhetorical device is most evident in the quote by Dr. King?',
        options: ["Irony", "Repetition", "Metaphor", "Antithesis"],
        correctAnswer: "Antithesis"
      },
      {
        id: "q16",
        question: "What is the purpose of including this quote in the Passage 3?",
        options: ["To emphasize conflict", "To support an argument about unity", "To highlight political instability", "To question authority"],
        correctAnswer: "To support an argument about unity"
      },
      {
        id: "q17",
        question: "What is the purpose of an anecdote in persuasive writing?",
        options: ["To confuse the reader", "To entertain with fiction", "To add humor", "To provide a personal example that supports a point"],
        correctAnswer: "To provide a personal example that supports a point"
      },
      {
        id: "q18",
        question: "Which of the following sentences contains a misplaced modifier?",
        options: ["Running to the store, the rain began to fall.", "The dog chased the cat.", "She opened the door quickly.", "He made a delicious cake for dessert."],
        correctAnswer: "Running to the store, the rain began to fall."
      },
      {
        id: "q19",
        question: "What is the meaning of connotation?",
        options: ["The dictionary definition of a word", "The emotional or cultural meaning associated with a word", "The part of speech of a word", "The root word"],
        correctAnswer: "The emotional or cultural meaning associated with a word"
      },
      {
        id: "q20",
        question: "What is the most effective way to revise a vague thesis statement?",
        options: ["Make it longer", "Add emotional language", "Be specific and clearly state your position", "Start with a question"],
        correctAnswer: "Be specific and clearly state your position"
      }
    ],
  },
   {
    grade: "12th-grade",
    questions: [
      {
        id: "q1",
        question: "What is the derivative of x²?",
        options: ["x", "2x", "x²", "2"],
        correctAnswer: "2x",
      },
      {
        id: "q2",
        question: "Evaluate: ∫2x dx",
        options: ["x² + C", "2x + C", "x + C", "2x² + C"],
        correctAnswer: "x² + C",
      }
    ],
  },
   {
    grade: "sat",
    questions: [
      {
        id: "q1",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752217874/Screenshot_2025-07-11_080932_v19q6s.png",
        options: ["NO CHANGE", "pounds", "pounds, however", "pounds, yet"],
        correctAnswer: "pounds, yet",
      },
      {
        id: "q2",
        question: "György Buzsáki, the Biggs Professor of Neuroscience at the New York University Grossman School of Medicine, conducted a study of mice brain cells to investigate ______ According to Buzsáki’s research, certain experiences are immediately followed by five to twenty “sharp wave ripples” of neurons that linger in the brain until sleep, during which the ripples are reactivated and consolidated into a lasting memory.Which choice completes the text so that it conforms to the conventions of Standard English?",
        options: ["how are mammalian experiences converted into permanent memories?", "how are mammalian experiences converted into permanent memories.", "how mammalian experiences are converted into permanent memories?", "how mammalian experiences are converted into permanent memories."],
        correctAnswer: "how mammalian experiences are converted into permanent memories.",
      },
      {
        id: "q3",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752218267/Screenshot_2025-07-11_081725_mulbao.png",
        options: ["NO CHANGE", "It ranks", "Those rank", "Theirs rank"],
        correctAnswer: "It ranks",
      },
      {
        id: "q4",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752218466/Screenshot_2025-07-11_082049_yafz3g.png",
        options: ["the declaration actually had several intended audiences", "many Haitian people opposed the revolution and the declaration", "aspects of the declaration were modeled on similar documents from other countries.", "the French government may have been surprised by the declaration"],
        correctAnswer: "the declaration actually had several intended audiences",
      },
      {
        id: "q5",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752218773/Screenshot_2025-07-11_082556_lbjow6.png",
        options: ["Canada and Australia have similar precipitation levels but very different amounts of freshwater resources per capita.", "Sierra Leone and Brazil have similar precipitation levels and similar amounts of freshwater resources per capita.", "Brazil has the second highest precipitation level and the second highest amount of freshwater resources per capita.", "Sierra Leone and Australia have very similar amounts of freshwater resources per capita but very different precipitation levels."],
        correctAnswer: "Canada and Australia have similar precipitation levels but very different amounts of freshwater resources per capita.",
      },
      {
        id: "q6",
        question: "In 2008 a complete set of ancient pessoi (glass game pieces) was uncovered from beneath a paving stone in modern-day Israel. Due to their small size, pessoi were easily misplaced, making a whole set a rare find. This has led some experts to suggest that the set may have been buried intentionally; however, without clear evidence, archaeologists are left to ______ what happened. Which choice completes the text with the most logical and precise word or phrase?",
        options: ["dismiss", "catalog", "speculate about", "expand on"],
        correctAnswer: "speculate about",
      },
      {
        id: "q7",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752219798/Screenshot_2025-07-11_084300_ttrdxp.png",
        options: ["To show Jane’s regret after her outburst against Mrs. Reed", "To portray Jane as a rebellious and angry child who deserves punishment", "To explore Jane’s complex feelings of love and hate towards Mrs. Reed", "To reveal the source of Jane’s resentment toward Mrs. Reed"],
        correctAnswer: "To show Jane’s regret after her outburst against Mrs. Reed",
      },
      {
        id: "q8",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752220124/Screenshot_2025-07-11_084825_e3h4fo.png",
        options: ["redress", "exacerbate", "reimburse", "commemorate"],
        correctAnswer: "exacerbate",
      },
      {
        id: "q9",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752220277/Screenshot_2025-07-11_085103_tse7vi.png",
        options: ["They may have written about different topics, but Equiano and Sinclair both influenced readers.", "The 1807 Slave Trade Act resulted in part from a book by Equiano, while the 1906 Pure Food and Drug Act resulted in part from a book by Sinclair.", "The Interesting Narrative of the Life of Olaudah Equiano and The Jungle are two works of literature that contributed to new legislation (concerning the slave trade and food safety, respectively).", "Although both are powerful works of literature that contributed to new legislation, Equiano’s book is an autobiography, while Sinclair’s is fictional."],
        correctAnswer: "Although both are powerful works of literature that contributed to new legislation, Equiano’s book is an autobiography, while Sinclair’s is fictional.",
      },
      {
        id: "q10",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752220623/Screenshot_2025-07-11_085645_kx0fel.png",
        options: ["Muscari is primarily known for his culinary tastes, as indicated by is favorite restaurant.", "Muscari carries himself with a modest and understated demeanor in public settings.", "Muscari has a deep appreciation for nature.", "Muscari adopts a dramatic and confident presence."],
        correctAnswer: "Muscari adopts a dramatic and confident presence.",
      },
      {
        id: "q11",
        question: "The state fair sells food coupons for $2 each and ride coupons for $3 each. If Marlon wants to buy at least 15 coupons and spend no more than $40, what is the largest number of ride coupons he can buy?",
        options: ["9", "10", "11", "12"],
        correctAnswer: "10",
      },
      {
        id: "q12",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752322733/Screenshot_2025-07-12_130947_zv2oee.png",
        options: ["{-2, -6}", "{-2}", "{3}", "There are no solutions to the given equation."],
        correctAnswer: "{3}",
      },
      {
        id: "q13",
        question: "The graph of a line in the xy-plane is totally vertical and has a negative x-intercept. Which of the following could represent a line with these conditions?",
        options: ["x = -5", "y = -4", "y = -x – 2", "x = -4y"],
        correctAnswer: "x = -5",
      },
      {
        id: "q14",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752323071/Screenshot_2025-07-12_132412_pxjwwj.png",
        options: ["It would be twice the original force.", "It would be four times the original force", "It would be ½ of the original force.", "It would be ¼ of the original force."],
        correctAnswer: "It would be ¼ of the original force.",
      },
      {
        id: "q15",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752323255/Screenshot_2025-07-12_132720_qmoogl.png",
        options: ["<sup>40</sup>&frasl;<sub>188</sub>", "<sup>40</sup>&frasl;<sub>100</sub>", "<sup>60</sup>&frasl;<sub>188</sub>", "<sup>40</sup>&frasl;<sub>78</sub>"],
        correctAnswer: "<sup>40</sup>&frasl;<sub>78</sub>",
      },
      {
        id: "q16",
        question: "Triangle ABC has a right angle B. If side AB has a length of 7 units and side BC has a length of 24 units, what is the length in units of side AC?",
        options: ["25 units", "30 units", "35 units", "40 units"],
        correctAnswer: "25 units",
      },
      {
        id: "q17",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752323652/Screenshot_2025-07-12_133355_reiroq.png",
        options: ["a", "b", "c", "d"],
        correctAnswer: "c",
      },
      {
        id: "q18",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752323826/Screenshot_2025-07-12_133651_tbnz5i.png",
        options: ["a", "b", "c", "d"],
        correctAnswer: "d",
      },
      {
        id: "q19",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752324070/Screenshot_2025-07-12_134056_pxr3bt.png",
        options: ["a", "b", "c", "d"],
        correctAnswer: "b",
      },
      {
        id: "q20",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752324183/Screenshot_2025-07-12_134249_dwlkfq.png",
        options: ["a", "b", "c", "d"],
        correctAnswer: "a",
      },
    ],
  },
    {
    grade: "ssat",
    questions: [
      {
        id: "q1",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752959367/q1_wdmjwh.jpg",
        options: ["The Aftermath of World War II", "The Marshall Plan: A Program forEuropean Reconstruction", "The Economic Destruction of Europe", "George C. Marshall: The Man behind"],
        correctAnswer: "The Marshall Plan: A Program forEuropean Reconstruction",
      },
      {
        id: "q2",
        question: "The tone of the author toward the Marshall Plan is",
        options: ["objective", "Excited", "Insistent", "Anxious"],
        correctAnswer: "objective",
      },
      {
        id: "q3",
        question: "All of the following are true about theMarshall Plan EXCEPT",
        options: ["It provided economic assistance to 16 countries", "It went into action in 1948", "It supplied economic aid for a period spanning four years", "It gave each of the participating countries 12 billion dollars"],
        correctAnswer: "It gave each of the participating countries 12 billion dollars",
      },
      {
        id: "q4",
        question: "Each of the following questions consists of one word followed by five words or phrases. You are to select the one word or phrase whose meaning is closest to the word in capital letters. <br> HARSH",
        options: ["Severe", "Useless", "Poor", "Angry"],
        correctAnswer: "Severe",
      },
      {
        id: "q5",
        question: "Select the one word or phrase whose meaning is closest to the word in capital letters. <br> SECURE: ",
        options: ["Unssen", "Aware", "Safe",  "Knotty"],
        correctAnswer: "Safe",
      },
      {
        id: "q6",
        question: "Select the one word or phrase whose meaning is closest to the word in capital letters. <br> CHRONIC:",
        options: ["meet with", "look at", "help with", "point out"],
        correctAnswer: "meet with",
      },
      {
        id: "q7",
        question: "Select the one word or phrase whose meaning is closest to the word in capital letters. <br> QUENCH:",
        options: ["unknown", "quiet", "cheerless", "trembling"],
        correctAnswer: "trembling",
      },
      {
        id: "q8",
        question: "Hammer is to nail as",
        options: ["screwdriver is to screw", "Axe is to wood", "lathe is to molding", "chisel is to marble"],
        correctAnswer: "screwdriver is to screw",
      },
      {
        id: "q9",
        question: "Tremor is to earthquake as",
        options: ["desert is to sandstorm", "faucet is to deluge", "wind is to tornado", "flood is to river"],
        correctAnswer: "wind is to tornado",
      },
      {
        id: "q10",
        question: "Cartographer is to map as chef is to",
        options: ["Silverware", "Table", "Meal", "Ingredient"],
        correctAnswer: "Ingredient",
      },
      {
        id: "q11",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752955115/Screenshot_2025-07-19_205700_kqq9cw.png",
        options: ["12", "18", "24", "36"],
        correctAnswer: "36",
      },
      {
        id: "q12",
        question: "If n is a positive odd integer, which of the following is an even integer?",
        options: ["3n-1", "2n+3", "2n-1", "n+2"],
        correctAnswer: "3n-1",
      },
      {
        id: "q13",
        question: "Of the following fractions which is closest to 37%?",
        options: ["<sup>1</sup>&frasl;<sub>3</sub>", "<sup>1</sup>&frasl;<sub>4</sub>", "<sup>2</sup>&frasl;<sub>5</sub>", "<sup>3</sup>&frasl;<sub>8</sub>"],
        correctAnswer: "<sup>3</sup>&frasl;<sub>8</sub>",
      },
      {
        id: "q14",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752955934/Screenshot_2025-07-19_211156_omrdlz.png",
        options: ["18", "20", "22", "24"],
        correctAnswer: "24",
      },
      {
        id: "q15",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752956151/Screenshot_2025-07-19_211535_ehs4fk.png",
        options: ["21", "24", "27", "28"],
        correctAnswer: "28",
      },
      {
        id: "q16",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752956371/Screenshot_2025-07-19_211913_obynet.png",
        options: ["24", "36", "31 ", "40"],
        correctAnswer: "40",
      },
      {
        id: "q17",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752956541/Screenshot_2025-07-19_212200_gqecyp.png",
        options: ["1.92", "2.88", "4.08", "5.04"],
        correctAnswer: "5.04",
      },
      {
        id: "q18",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752956966/Screenshot_2025-07-19_212910_gbnafu.png",
        options: ["11", "14", "21", "24"],
        correctAnswer: "14",
      },
      {
        id: "q19",
        question: "Sophie is making bows for packages and uses 1.25m of ribbon per bow. If she has 12 metres of ribbon and makes as many complete bows as possible.  How much ribbon in metres will remain?",
        options: ["0.60", "0.75", "0.85", "1.75"],
        correctAnswer: "0.75",
      },
      {
        id: "q20",
        question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1752957511/Screenshot_2025-07-19_213813_m4ivy0.png",
        options: ["150", "135", "120", "105"],
        correctAnswer: "150",
      },
    ],
  },
   {
    grade: "algebra-1",
    questions: [
      {
        id: "q1",
        question: "What is 2 + 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
      },
      {
        id: "q2",
        question: "Which number comes after 6?",
        options: ["5", "7", "8", "9"],
        correctAnswer: "7",
      }
    ],
  },
   {
    grade: "geometry",
    questions: [
      {
        id: "q1",
        question: "What is 2 + 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
      },
      {
        id: "q2",
        question: "Which number comes after 6?",
        options: ["5", "7", "8", "9"],
        correctAnswer: "7",
      }
    ],
  },
   {
    grade: "algebra-2",
    questions: [
      {
        id: "q1",
        question: "What is 2 + 3?",
        options: ["4", "5", "6", "7"],
        correctAnswer: "5",
      },
      {
        id: "q2",
        question: "Which number comes after 6?",
        options: ["5", "7", "8", "9"],
        correctAnswer: "7",
      }
    ],
  },
];
