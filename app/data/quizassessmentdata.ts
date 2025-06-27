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
    grade: "1st-grade",
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
    grade: "2nd-grade",
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
        question: "Simplify: 2x + 3x - 5x",
        options: ["0", "5x", "-5x", "2x"],
        correctAnswer: "0",
      },
      {
        id: "q2",
        question: "What is the solution to the equation 2x = 10?",
        options: ["2", "5", "10", "20"],
        correctAnswer: "5",
      }
    ],
  },
   {
    grade: "7th-grade",
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
    grade: "8th-grade",
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
  }
];
