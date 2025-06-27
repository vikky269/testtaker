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
    grade: "grade-1",
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
    grade: "grade-2",
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
    grade: "grade-3",
    questions: [
      {
        id: "q1",
        question: "Liam has 3 boxes of pencils. Each box contains 12 pencils. How many pencils does he have in total?",
        options: ["36", "24", "30", "48"],
        correctAnswer: "36",
      },
      {
        id: "q2",
        question: "What is the value of the digit 7 in the number 7,421?",
        options: ["7 ones", "7 hundreds", "7 thousands", "7 tens"],
        correctAnswer: "7 thousands",
      },
      {
        id: "q3",
        question: "Which number is the same as 4 hundreds, 2 tens, and 8 ones?",
        options: ["428", "482", "248", "842"],
        correctAnswer: "428",
      },
      {
        id: "q4",
        question: "Which of the following is a multiple of 6?",
        options: ["14", "16", "18", "20"],
        correctAnswer: "18",
      },
      {
        id: "q5",
        question: "Sophie baked 24 cookies. She puts 4 cookies in each bag. How many bags can she fill?",
        options: ["6", "5", "4", "8"],
        correctAnswer: "6",
      },
      {
        id: "q6",
        question: "What is the perimeter of a rectangle that is 7 cm long and 5 cm wide?",
        options: ["24cm", "35cm", "26cm", "22cm"],
        correctAnswer: "24cm",
      },
      {
        id: "q7",
        question: "Which fraction is the same as one-half?",
        options: ["3/4", "2/4", "2/2", "1/3"],
        correctAnswer: "2/4",
      },
      {
        id: "q8",
        question: "What is the missing number? 9 × ___ = 63",
        options: ["6", "7", "8", "9"],
        correctAnswer: "7",
      },
      {
        id: "q9",
        question: "Round off 368 to the nearest hundred.",
        options: ["300", "350", "400", "370"],
        correctAnswer: "400",
      },
      {
        id: "q10",
        question: "Sarah read 3 books each week for 4 weeks. How many books did she read in all?",
        options: ["12", "16", "10", "14"],
        correctAnswer: "12",
      }
    ],
  },
   {
    grade: "grade-4",
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
        question: "A rectangle has a length of 9 cm and a width that is 2/3 of the length. What is the area of the rectangle?",
        options: ["60 cm²", "54 cm²", "36 cm²", "48 cm²"],
        correctAnswer: "54 cm²",
      },
      {
        id: "q4",
        question: "Compare using >, <, or =:  choose what best fill in the box 3/4 ☐ 5/8",
        options: [">", "<", "=", "Not Enough Information"],
        correctAnswer: ">",
      },
      {
        id: "q5",
        question: "In a class of 32 students, 3/8 are wearing glasses. How many students are wearing glasses?",
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
        question: "Jenny read 1/3 of her book on Monday, 1/4 on Tuesday, and 1/6 on Wednesday. What fraction of the book has she read in total? Has she finished the book?",
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
    grade: "grade-5",
    questions: [
      {
        id: "q1",
        question: "What is 3/5 of 45?",
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
        question: "A recipe calls for 2/3 cup of sugar. If you want to make 1.5 times the recipe, how much sugar do you need?",
        options: ["1 1/3 cups", "1 1/4 cups", "1 1/2 cups", "1 cup"],
        correctAnswer: "1 cup",
      },
      {
        id: "q9",
        question: "Which decimal is equal to 3/4?",
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
    grade: "grade-6",
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
    grade: "grade-7",
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
    grade: "grade-8",
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
    grade: "grade-9",
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
    grade: "grade-10",
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
    grade: "grade-11",
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
    grade: "grade-12",
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
