// app/data/satdata.ts
// SmartMathz SAT Readiness Diagnostic — 20 questions.
// Section boundaries (index into this array, 0-based):
//   Reading & Writing   0–9   (10 questions)
//   Math                10–19 (10 questions)
// Modeled on the Digital SAT's real domain structure (College Board, 2024+):
//   R&W: Information & Ideas, Craft & Structure, Expression of Ideas, Standard English Conventions
//   Math: Algebra, Advanced Math, Problem-Solving & Data Analysis, Geometry & Trigonometry
// This is a fixed-form diagnostic, not the real adaptive-module SAT.

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  solution?: string;
}

export const SAT_SECTIONS = [
  { key: 'reading', label: 'Reading & Writing', start: 0,  end: 10 },
  { key: 'math',    label: 'Math',              start: 10, end: 20 },
] as const;

export type SATSectionKey = typeof SAT_SECTIONS[number]['key'];

export const SAT_SECTION_LABELS: Record<SATSectionKey, string> = {
  reading: 'Reading & Writing',
  math: 'Math',
};

// Domain tag per question id — used for the domain-level report breakdown.
// R&W domains: 'info' (Information & Ideas), 'craft' (Craft & Structure),
//   'expression' (Expression of Ideas), 'conventions' (Standard English Conventions)
// Math domains: 'algebra', 'advanced' (Advanced Math), 'data' (Problem-Solving & Data Analysis), 'geometry'
export const SAT_DOMAIN_TAGS: Record<string, string> = {
  sat_e1: 'info', sat_e2: 'craft', sat_e3: 'craft', sat_e4: 'expression', sat_e5: 'expression',
  sat_e6: 'conventions', sat_e7: 'conventions', sat_e8: 'conventions', sat_e9: 'info', sat_e10: 'expression',
  sat_m1: 'algebra', sat_m2: 'algebra', sat_m3: 'advanced', sat_m4: 'advanced', sat_m5: 'data',
  sat_m6: 'data', sat_m7: 'geometry', sat_m8: 'advanced', sat_m9: 'geometry', sat_m10: 'algebra',
};

export const SAT_DOMAIN_LABELS: Record<string, string> = {
  info: 'Information & Ideas', craft: 'Craft & Structure',
  expression: 'Expression of Ideas', conventions: 'Standard English Conventions',
  algebra: 'Algebra', advanced: 'Advanced Math',
  data: 'Problem-Solving & Data Analysis', geometry: 'Geometry & Trigonometry',
};

export const satQuestions: QuizQuestion[] = [
  // ── Reading & Writing (10) ────────────────────────────────────────────────
  {
    id: "sat_e1",
    question: "Marine biologists studying coral bleaching have found that reefs exposed to brief, moderate heat stress before a major heatwave often survive better than reefs with no prior exposure. This phenomenon, called thermal priming, suggests corals may retain a kind of physiological memory of past stress.<br><br>Which choice best states the main idea of the text?",
    options: [
      "Coral reefs cannot survive any exposure to heat stress.",
      "Prior mild heat exposure may help corals withstand later, more severe heat stress.",
      "Marine biologists have stopped studying coral bleaching.",
      "All reefs respond to heatwaves in exactly the same way."
    ],
    correctAnswer: "Prior mild heat exposure may help corals withstand later, more severe heat stress.",
    solution: "<p>The passage's central claim is that corals with prior mild heat exposure ('thermal priming') <b>survive later heatwaves better</b> than those without it — this is the main idea the rest of the passage supports.</p>"
  },
  {
    id: "sat_e2",
    question: "The novelist's prose was often described as spare: she favored short, declarative sentences over ornate description, trusting readers to fill in emotional detail she left unstated.<br><br>As used in the text, what does 'spare' most nearly mean?",
    options: ["Extra or unused", "Minimal and unadorned", "Merciful or forgiving", "Available for a different purpose"],
    correctAnswer: "Minimal and unadorned",
    solution: "<p>In context, 'spare' describes writing style — short sentences, little decoration — meaning <b>minimal and unadorned</b>, not any of the word's other common meanings (extra, merciful, available).</p>"
  },
  {
    id: "sat_e3",
    question: "A city council debated whether to fund a new bike-share program. Proponents cited reduced traffic congestion and lower emissions; opponents worried about the cost of maintaining docking stations. After months of study, the council approved a scaled-down pilot program.<br><br>Which choice best describes the function of the final sentence in the text?",
    options: [
      "It introduces a new argument against the program.",
      "It reports the outcome that resulted from the debate described earlier.",
      "It contradicts the opponents' concerns about cost.",
      "It restates the proponents' original argument."
    ],
    correctAnswer: "It reports the outcome that resulted from the debate described earlier.",
    solution: "<p>The final sentence tells us what actually happened — the council's decision — functioning as the <b>resolution</b> to the debate the passage just described.</p>"
  },
  {
    id: "sat_e4",
    question: "Which choice completes the text with the most logical transition?<br><br>The lab's initial results seemed to confirm the hypothesis. _____, a second, larger trial failed to replicate the finding, raising questions about the original study's methodology.",
    options: ["For example", "Similarly", "However", "As a result"],
    correctAnswer: "However",
    solution: "<p>The second sentence <b>contrasts</b> with the first (initial confirmation vs. failed replication), so a contrast transition like 'However' is needed — not a continuation word like 'Similarly' or 'As a result'.</p>"
  },
  {
    id: "sat_e5",
    question: "Which choice most logically completes the text?<br><br>Urban beekeeping has grown in popularity over the past decade. Rooftop hives now appear on office buildings, hotels, and even hospitals, as city dwellers seek ways to support declining pollinator populations. _____",
    options: [
      "Bees are dangerous and should be avoided in cities.",
      "This trend reflects a broader public interest in urban conservation efforts.",
      "The first beehive was invented in the 19th century.",
      "Most hospitals do not have rooftops."
    ],
    correctAnswer: "This trend reflects a broader public interest in urban conservation efforts.",
    solution: "<p>The passage is building toward a conclusion about <em>why</em> this trend matters. Only one option logically extends the idea already established (growing interest in supporting pollinators) rather than contradicting or veering off-topic.</p>"
  },
  {
    id: "sat_e6",
    question: "Choose the option that correctly completes the sentence.<br><br>Neither the coach nor the players _____ satisfied with the referee's final call.",
    options: ["was", "were", "is", "has been"],
    correctAnswer: "were",
    solution: "<p>With 'neither...nor,' the verb agrees with the <b>closer subject</b> — here, 'the players' (plural) — so the correct verb is 'were.'</p>"
  },
  {
    id: "sat_e7",
    question: "Choose the option that correctly completes the sentence.<br><br>The museum's new exhibit, _____ features rare fossils from three continents, opens to the public next week.",
    options: ["which", "who", "whom", "that, which"],
    correctAnswer: "which",
    solution: "<p>'Which' correctly introduces a nonrestrictive (extra, set-off-by-commas) clause describing the exhibit. 'Who'/'whom' are used for people, not objects.</p>"
  },
  {
    id: "sat_e8",
    question: "Which choice uses punctuation correctly?",
    options: [
      "The recipe calls for, flour sugar, and eggs.",
      "The recipe calls for flour, sugar, and eggs.",
      "The recipe calls for flour sugar and eggs.",
      "The recipe calls for flour; sugar, and eggs."
    ],
    correctAnswer: "The recipe calls for flour, sugar, and eggs.",
    solution: "<p>A series of three or more items requires commas between each item, including before the final 'and' (the Oxford comma) — no comma belongs right after 'for.'</p>"
  },
  {
    id: "sat_e9",
    question: "Two economists studied wage growth in manufacturing towns after a major factory closure. One concluded that automation was the primary driver of job loss; the other argued that outsourcing played the larger role. Both agreed that retraining programs had only a modest effect on reemployment rates.<br><br>Based on the text, on which point do the two economists agree?",
    options: [
      "Automation was the primary cause of job loss.",
      "Outsourcing played the larger role in job loss.",
      "Retraining programs had only a modest effect on reemployment.",
      "The factory closure had no effect on wages."
    ],
    correctAnswer: "Retraining programs had only a modest effect on reemployment.",
    solution: "<p>The passage explicitly states the economists disagreed on the <em>cause</em> of job loss but <b>'both agreed'</b> that retraining programs had only a modest effect — that's the one point of consensus.</p>"
  },
  {
    id: "sat_e10",
    question: "Which choice most effectively combines the two sentences while keeping the same meaning?<br><br>The bridge was completed in 1937. It was, at the time, the longest suspension bridge in the world.",
    options: [
      "The bridge was completed in 1937, it was the longest suspension bridge in the world.",
      "Completed in 1937, the bridge was, at the time, the longest suspension bridge in the world.",
      "The bridge, completed, in 1937 was the longest suspension bridge, in the world, at the time.",
      "Being completed in 1937 and the longest suspension bridge in the world at the time, the bridge."
    ],
    correctAnswer: "Completed in 1937, the bridge was, at the time, the longest suspension bridge in the world.",
    solution: "<p>This option correctly combines both ideas into one grammatically complete sentence, using a participial phrase ('Completed in 1937') to open — avoiding the run-on and fragment errors in the other options.</p>"
  },

  // ── Math (10) ──────────────────────────────────────────────────────────────
  {
    id: "sat_m1",
    question: "If 3x - 7 = 2x + 5, what is the value of x?",
    options: ["12", "2", "-12", "-2"],
    correctAnswer: "12",
    solution: "<p><strong>Step 1:</strong> Subtract 2x from both sides: x - 7 = 5.<br><strong>Step 2:</strong> Add 7: x = 12.<br><strong>Answer:</strong> 12.</p>"
  },
  {
    id: "sat_m2",
    question: "A line has a slope of 4 and passes through the point (2, 3). What is the y-intercept of the line?",
    options: ["-5", "5", "-2", "11"],
    correctAnswer: "-5",
    solution: "<p><strong>Step 1:</strong> Use y = mx + b: 3 = 4(2) + b.<br><strong>Step 2:</strong> 3 = 8 + b → b = -5.<br><strong>Answer:</strong> -5.</p>"
  },
  {
    id: "sat_m3",
    question: "Which value of x satisfies the equation x² - 6x + 9 = 0?",
    options: ["3", "-3", "9", "6"],
    correctAnswer: "3",
    solution: "<p><strong>Step 1:</strong> Factor: x² - 6x + 9 = (x - 3)².<br><strong>Step 2:</strong> Set (x - 3)² = 0 → x = 3 (a repeated root).<br><strong>Answer:</strong> 3.</p>"
  },
  {
    id: "sat_m4",
    question: "A population of bacteria doubles every 3 hours. If there are 200 bacteria at time zero, how many will there be after 9 hours?",
    options: ["1,600", "1,800", "600", "800"],
    correctAnswer: "1,600",
    solution: "<p><strong>Step 1:</strong> 9 hours ÷ 3-hour doubling period = 3 doublings.<br><strong>Step 2:</strong> 200 × 2³ = 200 × 8 = 1,600.<br><strong>Answer:</strong> 1,600.</p>"
  },
  {
    id: "sat_m5",
    question: "A survey of 250 randomly selected students found that 40% own a car. Based on this sample, about how many of the school's 1,500 students are expected to own a car?",
    options: ["600", "500", "375", "150"],
    correctAnswer: "600",
    solution: "<p><strong>Step 1:</strong> Apply the sample rate to the full population: 40% of 1,500.<br><strong>Step 2:</strong> 0.40 × 1,500 = 600.<br><strong>Answer:</strong> 600.</p>"
  },
  {
    id: "sat_m6",
    question: "The table shows the number of hours studied and the test score for 4 students: (1, 65), (2, 72), (3, 79), (4, 86). Based on this linear pattern, what score would be predicted for 6 hours of study?",
    options: ["100", "93", "97", "104"],
    correctAnswer: "100",
    solution: "<p><strong>Step 1:</strong> The scores increase by 7 for every additional hour (a constant rate of change).<br><strong>Step 2:</strong> From 4 hours (86) to 6 hours is 2 more steps: 86 + 7 + 7 = 100.<br><strong>Answer:</strong> 100.</p>"
  },
  {
    id: "sat_m7",
    question: "A right triangle has legs of length 8 and 15. What is the length of the hypotenuse?",
    options: ["17", "23", "13", "19"],
    correctAnswer: "17",
    solution: "<p><strong>Step 1:</strong> Pythagorean theorem: c² = a² + b².<br><strong>Step 2:</strong> c² = 8² + 15² = 64 + 225 = 289.<br><strong>Step 3:</strong> c = √289 = 17.<br><strong>Answer:</strong> 17.</p>"
  },
  {
    id: "sat_m8",
    question: "If f(x) = 2x² - 3x + 1, what is f(-2)?",
    options: ["15", "11", "-1", "3"],
    correctAnswer: "15",
    solution: "<p><strong>Step 1:</strong> Substitute x = -2: 2(-2)² - 3(-2) + 1.<br><strong>Step 2:</strong> 2(4) + 6 + 1 = 8 + 6 + 1 = 15.<br><strong>Answer:</strong> 15.</p>"
  },
  {
    id: "sat_m9",
    question: "A circle has a diameter of 14 cm. What is its area, in terms of π?",
    options: ["49π cm²", "14π cm²", "28π cm²", "196π cm²"],
    correctAnswer: "49π cm²",
    solution: "<p><strong>Step 1:</strong> Radius = diameter ÷ 2 = 7 cm.<br><strong>Step 2:</strong> Area = πr² = π(7²) = 49π cm².<br><strong>Answer:</strong> 49π cm².</p>"
  },
  {
    id: "sat_m10",
    question: "Solve the system: 2x + y = 10 and x - y = 2",
    options: ["(4, 2)", "(2, 4)", "(6, -2)", "(3, 4)"],
    correctAnswer: "(4, 2)",
    solution: "<p><strong>Step 1:</strong> Add the two equations: (2x + y) + (x - y) = 10 + 2 → 3x = 12 → x = 4.<br><strong>Step 2:</strong> Substitute: 4 - y = 2 → y = 2.<br><strong>Answer:</strong> (4, 2).</p>"
  },
];