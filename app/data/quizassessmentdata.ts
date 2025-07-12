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
      }
    ],
  },

   {
    grade: "2nd-grade",
    questions: [
      {
        id: "q1",
        question: ". A class collected 286 cans for recycling. Another class collected 179 cans. How many more cans did the first class collect?",
        options: ["97", "107", "117", "109"],
        correctAnswer: "97",
      },
      {
        id: "q2",
        question: "You have 3 quarters, 2 dimes, and 4 pennies. How much money do you have?",
        options: ["99¢", "94¢", "89¢", "79¢"],
        correctAnswer: "94¢",
      },
       {
        id: "q3",
        question: "What is the value of the missing number in this equation: 45 + ___ = 120?",
        options: ["65", "75", "85", "95"],
        correctAnswer: "85",
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
      }
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
        question:"What is the product of 234 and 6?",
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
      }
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
      }

    ],
  },
   {
    grade: "9th-grade",
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
    grade: "10th-grade",
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
    grade: "11th-grade",
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
];
