/**
 * Build shsatMathPool.october.json from vision-extracted Q63–107.
 */
const fs = require('fs');
const path = require('path');

const IMG = 'w-full max-w-xl mx-auto mb-3 rounded-lg';
const img = (file, alt) =>
  `<img src="/shsat/math/october/${file}" alt="${alt}" class="${IMG}" />`;

const questions = [
  {
    n: 63,
    question:
      'If x = 9 and y = −7, what is the value of x(x − 2y)?',
    options: ['18', '45', '144', '207'],
    letter: 'D',
  },
  {
    n: 64,
    question: `<div>${img('q64-figure.png', 'Parallelogram PQRS with point T on PS')}<p>In the figure above, PQRS is a parallelogram. The measure of ∠PQT is 50°, and the measure of ∠PTQ is 70°. What is the measure of ∠QRS?</p></div>`,
    options: ['60°', '70°', '80°', '120°'],
    letter: 'E',
  },
  {
    n: 65,
    question:
      'M = 3N = P/4 = Q + 5 = R/7 > 0\nBased on the statement above, which variable has the greatest value?',
    options: ['M', 'N', 'P', 'R'],
    letter: 'D',
  },
  {
    n: 66,
    question: `<div>${img('q66-table.png', 'Dessert Choices table')}<p>The table above shows the number of times that different desserts were ordered at a restaurant. Based on this information, what is the probability of a customer ordering ice cream as a dessert?</p></div>`,
    options: ['25%', '30%', '40%', '48%'],
    letter: 'F',
  },
  {
    n: 67,
    question:
      'To make party invitations, Macie could buy a package of paper for $10.50, or she could buy x individual sheets of the same paper for $0.15 each. What is the largest value of x that would make buying the individual sheets less expensive than buying the package?',
    options: ['60', '65', '69', '70'],
    letter: 'C',
  },
  {
    n: 68,
    question:
      'At 1:00 p.m. one day, the temperature was 8 degrees above zero. During the rest of the day, the temperature fell 3 degrees per hour. What was the temperature at 7:00 p.m. that day?',
    options: ['−13°', '−10°', '−7°', '5°'],
    letter: 'F',
  },
  {
    n: 69,
    question:
      'A bag contains 75 marbles that are red, blue, or green. The ratio of red to blue marbles is 15:7, and the ratio of blue to green marbles is 7:3. If 2 blue marbles are removed and replaced with 2 green marbles, what will be the new ratio of red to green marbles?',
    options: ['3:1', '5:1', '15:3', '45:11'],
    letter: 'D',
  },
  {
    n: 70,
    question:
      'A roofing contractor uses shingles at a rate of 3 bundles for every 96 square feet of roof covered. At this rate, how many bundles of shingles will he need in order to cover a roof that is 416 square feet?',
    options: ['5', '12', '13', '14'],
    letter: 'G',
  },
  {
    n: 71,
    question: 'What is the least common multiple of 24, 6, and 18?',
    options: ['36', '48', '72', '144'],
    letter: 'C',
  },
  {
    n: 72,
    question:
      'One day, the Early Bird Restaurant used 15 dozen eggs for 200 breakfast customers. At this rate, approximately how many dozen eggs are needed for 300 breakfast customers?',
    options: ['20', '23', '25', '30'],
    letter: 'F',
  },
  {
    n: 73,
    question:
      'A cooler contains three types of beverages: 5 bottles of apple juice, 3 bottles of grape juice, and 6 bottles of orange juice. What is the probability that a bottle chosen at random from this cooler is not apple juice?',
    options: ['1/9', '5/14', '9/14', '2/3'],
    letter: 'C',
  },
  {
    n: 74,
    question:
      'A large circular dinner plate has a radius of 20 centimeters. A smaller circular plate with a circumference of 20π centimeters is placed in the center of the larger dinner plate. What is the area of the part of the larger dinner plate that is not covered by the smaller plate?',
    options: ['20π sq cm', '100π sq cm', '200π sq cm', '300π sq cm'],
    letter: 'H',
  },
  {
    n: 75,
    question: `<div>${img('q75-table.png', 'Prices for newspaper advertising')}<p>The table above shows prices for newspaper advertising. A store purchased 1/4 pages, 1/2 pages, and full pages of page space in equal numbers for a total of $11,500. What is the total amount of page space the store purchased?</p></div>`,
    options: ['1 3/4 pages', '10 pages', '16 1/2 pages', '17 1/2 pages'],
    letter: 'D',
  },
  {
    n: 76,
    question: 'How many positive odd numbers satisfy the inequality 3x + 8 ≤ 92?',
    options: ['13', '14', '17', '28'],
    letter: 'F',
  },
  {
    n: 77,
    question: 'If 36/y = 4x, what is the value of x when y = 3?',
    options: ['3', '4', '9', '12'],
    letter: 'A',
  },
  {
    n: 78,
    question:
      'Points X, Y, and Z are on a straight line, and Y is between X and Z. Length YZ = (3/5)XY, and length XY = 20 centimeters. What is the length of XZ?',
    options: ['12 cm', '24 cm', '30 cm', '32 cm'],
    letter: 'H',
  },
  {
    n: 79,
    question:
      'Bryana bought 1 3/4 yards of cloth at $8.00 per yard. If there was an 8% sales tax, what was the total cost of the cloth?',
    options: ['$12.96', '$14.08', '$15.12', '$16.08'],
    letter: 'C',
  },
  {
    n: 80,
    question: `<div>${img('q80-numberline.png', 'Number line with points M and N')}<p>On the number line above, MN = 5 5/6. What is the position of point M?</p></div>`,
    options: ['−7 1/6', '−4 1/2', '4 1/2', '7 1/6'],
    letter: 'F',
  },
  {
    n: 81,
    question:
      'A United States presidential coin is made from an alloy of four metals—copper, zinc, manganese, and nickel—with weights in the ratio of 177:12:7:4, respectively. The coin weighs a total of 8 grams. What is the weight of the zinc in this coin?',
    options: ['0.28 g', '0.48 g', '0.96 g', '48 g'],
    letter: 'B',
  },
  {
    n: 82,
    question:
      'Jack scored a mean of 15 points per game in his first 3 basketball games. In his 4th game, he scored 27 points. What is his mean score for the first 4 games?',
    options: ['15', '17', '18', '21'],
    letter: 'G',
  },
  {
    n: 83,
    question:
      'A cylindrical oil drum can hold 4,320 liters when it is completely full. Currently, the drum is 1/3 full of oil. How many kiloliters of oil need to be added in order to fill the drum completely?',
    options: ['1.44', '2.88', '4.32', '14.10'],
    letter: 'B',
  },
  {
    n: 84,
    question:
      "Nicole's age now is three times Carmen's age. If Carmen will be 17 in two years, how old was Nicole 5 years ago?",
    options: ['38 yr', '40 yr', '45 yr', '50 yr'],
    letter: 'F',
  },
  {
    n: 85,
    question:
      'A chemical decays in such a way that the amount left at the end of each week is 20% less than the amount at the beginning of that same week. What percent of the original amount is left after two weeks?',
    options: ['40%', '60%', '64%', '80%'],
    letter: 'C',
  },
  {
    n: 86,
    question:
      'If w − 1 is an odd integer, which one of the following must be an even integer?',
    options: ['w + 1', '2w − 1', '2w − 2', '2w + 1'],
    letter: 'G',
  },
  {
    n: 87,
    question:
      'Three students stand at the starting line of a running track and begin running laps at the same time. Ann completes 1 lap every 2 minutes, Jack completes 1 lap every 3 minutes, and Lee completes 1 lap every 4 minutes. How many laps does Ann complete before all three runners are once again at the starting line at the same time?',
    options: ['4', '6', '12', '20'],
    letter: 'B',
  },
  {
    n: 88,
    question: 'Simplify this expression: 4(7 − 3x) − (5 − x)',
    options: ['23 − 4x', '23 − 11x', '28 − 4x', '28 − 12x'],
    letter: 'F',
  },
  {
    n: 89,
    question: `<div>${img('q89-table.png', 'Pet Survey table')}<p>Amy surveyed students at her school about the number of pets they have. What is the probability that a student who participated in the survey has at least 2 pets?</p></div>`,
    options: ['7/40', '1/12', '1/8', '3/10'],
    letter: 'D',
  },
  {
    n: 90,
    question:
      'A large container is partially filled with n liters of water. Ito adds 10 liters of water to the container, making it 60% full. If Ignacio adds 6 more liters of water, the container will be 75% full. What is the value of n?',
    options: ['14', '15', '26', '30'],
    letter: 'E',
  },
  {
    n: 91,
    question:
      '5x³ + 3x + 9 + 1/x²\nIf x = 10, what is the value of the expression above?',
    options: ['2,539.01', '5,039.01', '5,039.1', '5,139'],
    letter: 'B',
  },
  {
    n: 92,
    question: `<div>${img('q92-figure.png', 'Square MNPQ with midpoints R, S, T and shaded triangles')}<p>R, S, and T are midpoints of the sides of square MNPQ, as shown above. What is the sum of the areas of the shaded triangles?</p></div>`,
    options: ['9 sq cm', '12 sq cm', '18 sq cm', '36 sq cm'],
    letter: 'E',
  },
  {
    n: 93,
    question:
      'The Chens spend $5 of every $8 they earn on planned expenses. If the family earns $29,600 in one year, how much will they spend on planned expenses that year?',
    options: ['$1,850', '$3,700', '$5,920', '$18,500'],
    letter: 'D',
  },
  {
    n: 94,
    question:
      'A pizza shop offers a choice of 3 sizes (small, medium, and large) and 7 different toppings. Different pizzas can be created by changing the size and/or the choice of toppings. If Cody wants to order a pizza with exactly 2 different toppings, how many different pizzas can he create?',
    options: ['6', '21', '63', '126'],
    letter: 'G',
  },
  {
    n: 95,
    question: `<div>${img('q95-table.png', 'Survey of cats per family')}<p>The table above shows the number of cats per family in 100 households in the Blaine neighborhood. By what percentage is the number of families with 1 cat greater than the number of families with 2 cats?</p></div>`,
    options: ['7%', '10%', '17%', '20%'],
    letter: 'D',
  },
  {
    n: 96,
    question:
      'A wooden box has a square base. The height of this box is 3 times the length of one side of the base. If one side of the base is 3 feet long, what is the volume of this box?',
    options: ['9 cu ft', '27 cu ft', '36 cu ft', '81 cu ft'],
    letter: 'H',
  },
  {
    n: 97,
    question:
      'On a bike trip, Rajiv traveled 65 kilometers in 5 hours, while Shaina traveled 72 kilometers in 4 hours. How much less was Rajiv’s mean speed, in kilometers per hour (kph), than Shaina’s?',
    options: ['1', '5', '7', '9'],
    letter: 'B',
  },
  {
    n: 98,
    question:
      'Points P, Q, R, and S represent −3, −1, 0, and 2, respectively, on a number line. How many units is the midpoint of PQ from the midpoint of RS?',
    options: ['1', '2', '3', '4'],
    letter: 'G',
  },
  {
    n: 99,
    question:
      'There are 1,000 cubic centimeters in 1 liter, and 1,000 cubic millimeters in 1 milliliter. How many cubic millimeters are there in 1,000 cubic centimeters?',
    options: ['1,000', '10,000', '100,000', '1,000,000'],
    letter: 'D',
  },
  {
    n: 100,
    question: `<div>${img('q100-figure.png', 'Quarter circle with inscribed right triangle')}<p>In the quarter circle above, what is y in terms of x?</p></div>`,
    options: [
      'x − 1',
      'x + 1',
      '(x + 1)/2',
      '√((x + 1)²/2)',
    ],
    letter: 'E',
  },
  {
    n: 101,
    question: `<div>${img('q101-numberline.png', 'Number line with points M, R, and T')}<p>The hash marks on the number line above are evenly spaced. What is the coordinate of point R?</p></div>`,
    options: ['7/40', '9/40', '11/40', '21/40'],
    letter: 'C',
  },
  {
    n: 102,
    question:
      'Phan chose an Internet service that charges $18.00 per month plus $0.024 per minute. Deion chose an Internet service that charges $30.00 per month for unlimited usage. At the end of the month, Phan’s and Deion’s charges were identical. For how many minutes did Phan use the Internet service that month?',
    options: ['50', '60', '100', '500'],
    letter: 'H',
  },
  {
    n: 103,
    question: `<div>${img('q103-figure.png', 'Shaded triangle on coordinate plane')}<p>What is the area of the shaded triangle shown above?</p></div>`,
    options: ['m + n', 'n − m', '2(n − m)', '4(n − m)'],
    letter: 'C',
  },
  {
    n: 104,
    question:
      'The decimal 0.06 can be written as the fraction x/50. What is the value of x?',
    options: ['3', '6', '12', '30'],
    letter: 'E',
  },
  {
    n: 105,
    question:
      'In a sample of 50 cars at a local dealership, there are 12 red cars and 10 cars with backup cameras. Of the 12 red cars, 4 have backup cameras. If a car is selected at random from the given sample, what is the probability that both of the following are true: the car is not red and does not have a backup camera?',
    options: ['3/5', '16/25', '19/25', '4/5'],
    letter: 'B',
  },
  {
    n: 106,
    question: `<div>${img('q106-table.png', 'Animal Cards table')}<p>The cards in the table above are mixed in a box. Which animal pictured on a card has exactly a 1 in 4 chance of being picked at random from the box?</p></div>`,
    options: ['cat', 'dog', 'fish', 'horse'],
    letter: 'F',
  },
  {
    n: 107,
    question:
      'Which number line below shows the solution set for 2x − 2 ≤ y ≤ 4x + 10 when y = 1?',
    options: [
      img('q107-optA.png', 'Number line option A'),
      img('q107-optB.png', 'Number line option B'),
      img('q107-optC.png', 'Number line option C'),
      img('q107-optD.png', 'Number line option D'),
    ],
    letter: 'C',
  },
];

const oddLetters = ['A', 'B', 'C', 'D'];
const evenLetters = ['E', 'F', 'G', 'H'];

const pool = [];
const reportLines = [];
let needsReview = 0;

for (const q of questions) {
  const letters = q.n % 2 === 1 ? oddLetters : evenLetters;
  const idx = letters.indexOf(q.letter);
  if (idx < 0 || idx >= q.options.length) {
    throw new Error(`Bad letter ${q.letter} for Q${q.n}`);
  }
  const correctAnswer = q.options[idx];
  const id = `shsatm_o_${String(q.n).padStart(2, '0')}`;
  const item = {
    id,
    question: q.question,
    options: q.options,
    correctAnswer,
    solution: '',
    domain: 'Math',
    subtopic: 'General',
    difficulty: 'medium',
    source: 'october-pdf',
    sourceNumber: q.n,
  };
  if (q.needsReview) {
    item.needsReview = true;
    item.reviewNote = q.reviewNote || '';
    needsReview++;
  }
  pool.push(item);
  const preview =
    typeof correctAnswer === 'string' && correctAnswer.includes('<img')
      ? '[img option]'
      : String(correctAnswer).slice(0, 40);
  reportLines.push(
    `${id}: ${q.letter} → ${preview} | ${String(q.question)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 70)}`
  );
}

const outJson = path.join(
  __dirname,
  '..',
  'app',
  'data',
  'shsatMathPool.october.json'
);
fs.writeFileSync(outJson, JSON.stringify(pool, null, 2) + '\n', 'utf8');

const imgDir = path.join(__dirname, '..', 'public', 'shsat', 'math', 'october');
const images = fs
  .readdirSync(imgDir)
  .filter((f) => f.endsWith('.png') && !f.includes('options-all'));

const report = [
  'SHSAT October PDF → JSON extract report',
  'Source: SHSAT Mock Assessment (October).pdf',
  `JSON: ${outJson}`,
  `Questions extracted: ${pool.length} (MC 63–107; grid-in 58–62 skipped)`,
  `Images saved to public/shsat/math/october: ${images.length}`,
  `needsReview: ${needsReview}`,
  '',
  'Method:',
  '- Rendered 14 PDF pages via pdf-to-img (png, scale 2.5) to SHSAT/_preview/october/.',
  '- Read page images with vision; odd Qs options A–D, even Qs E–H.',
  '- Mapped answer-key letters to option TEXT for correctAnswer.',
  '- Cropped stem/option figures to public/shsat/math/october/.',
  '',
  'Image files:',
  ...images.map((f) => `- ${f}`),
  '',
  'Per-question:',
  ...reportLines,
  '',
].join('\n');

fs.writeFileSync(path.join(__dirname, '_october_extract_report.txt'), report, 'utf8');
console.log(`Wrote ${pool.length} questions → ${outJson}`);
console.log(`Images: ${images.length}; needsReview: ${needsReview}`);
