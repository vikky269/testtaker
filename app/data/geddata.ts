// app/data/geddata.ts
// SmartMathz GED Comprehensive Diagnostic Assessment — 80 MCQs.
// Section boundaries (by index into this array, 0-based):
//   Mathematical Reasoning        0–23   (24 questions)
//   Reasoning Through Language Arts 24–45 (22 questions)
//   Science                       46–64  (19 questions)
//   Social Studies                65–79  (15 questions)
// These boundaries are also exported below so the quiz page and
// ScoreUtils never hardcode them twice.

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  solution?: string;
}

export const GED_SECTIONS = [
  { key: 'math',    label: 'Mathematical Reasoning',          start: 0,  end: 24 },
  { key: 'rla',     label: 'Reasoning Through Language Arts', start: 24, end: 46 },
  { key: 'science', label: 'Science',                         start: 46, end: 65 },
  { key: 'social',  label: 'Social Studies',                  start: 65, end: 80 },
] as const;


export const GED_SECTION_LABELS: Record<GEDSectionKey, string> = {
  math: "Mathematical Reasoning",
  rla: "Reasoning Through Language Arts",
  science: "Science",
  social: "Social Studies",
};

export type GEDSectionKey = typeof GED_SECTIONS[number]['key'];

export const gedQuestions: QuizQuestion[] = [
  // ── Section A: Mathematical Reasoning (24) ──────────────────────────────
  { id: "ged1",  question: "Evaluate: -8 + 15 - 6", options: ["-29", "-1", "1", "13"], correctAnswer: "1" },
  { id: "ged2",  question: "Which number is greatest?", options: ["5/8", "0.58", "61%", "0.7"], correctAnswer: "61%" },
  { id: "ged3",  question: "Evaluate: 3/4 + 2/3", options: ["5/7", "17/12", "7/12", "6/5"], correctAnswer: "17/12" },
  { id: "ged4",  question: "What is 3.6 x 0.25?", options: ["0.09", "0.9", "9", "90"], correctAnswer: "0.9" },
  { id: "ged5",  question: "A recipe uses 3 cups of flour for every 2 cups of milk. How many cups of flour are needed for 8 cups of milk?", options: ["6", "10", "12", "16"], correctAnswer: "12" },
  { id: "ged6",  question: "A jacket originally costs $80 and is discounted 25%. What is the sale price?", options: ["$20", "$55", "$60", "$65"], correctAnswer: "$60" },
  { id: "ged7",  question: "A population increased from 2,400 to 3,000. What was the percent increase?", options: ["20%", "25%", "40%", "60%"], correctAnswer: "25%" },
  { id: "ged8",  question: "Simplify: 4(2x - 3) + 5x", options: ["13x - 3", "13x - 12", "8x - 7", "9x - 12"], correctAnswer: "13x - 12" },
  { id: "ged9",  question: "If a = 4 and b = -2, evaluate: 3a - 2b", options: ["8", "12", "16", "20"], correctAnswer: "16" },
  { id: "ged10", question: "Factor: x^2 + 7x + 12", options: ["(x + 6)(x + 2)", "(x + 4)(x + 3)", "(x - 4)(x - 3)", "(x + 12)(x + 1)"], correctAnswer: "(x + 4)(x + 3)" },
  { id: "ged11", question: "Solve: 5x - 7 = 28", options: ["5", "7", "9", "21"], correctAnswer: "7" },
  { id: "ged12", question: "Solve: 3(x + 4) = 2x + 17", options: ["3", "5", "7", "29"], correctAnswer: "5" },
  { id: "ged13", question: "Solve: 4x - 5 <= 19", options: ["x <= 6", "x >= 6", "x <= 4", "x >= 4"], correctAnswer: "x <= 6" },
  { id: "ged14", question: "What is the slope of the line through (2, 3) and (6, 11)?", options: ["1/2", "2", "4", "8"], correctAnswer: "2" },
  { id: "ged15", question: "Which equation has slope -2 and y-intercept 5?", options: ["y = 5x - 2", "y = -2x + 5", "y = 2x - 5", "y = -5x + 2"], correctAnswer: "y = -2x + 5" },
  { id: "ged16", question: "If f(x) = 2x^2 - 3, what is f(4)?", options: ["13", "16", "29", "61"], correctAnswer: "29" },
  { id: "ged17", question: "Which table represents a linear relationship?", options: ["x: 1,2,3; y: 2,4,8", "x: 1,2,3; y: 5,8,11", "x: 1,2,3; y: 1,4,9", "x: 1,2,3; y: 3,6,12"], correctAnswer: "x: 1,2,3; y: 5,8,11" },
  { id: "ged18", question: "A rectangle is 12 feet long and 7 feet wide. What is its area?", options: ["19 sq ft", "38 sq ft", "84 sq ft", "168 sq ft"], correctAnswer: "84 sq ft" },
  { id: "ged19", question: "A circle has radius 5 cm. Using pi ≈ 3.14, approximately what is its area?", options: ["15.7 cm^2", "31.4 cm^2", "78.5 cm^2", "157 cm^2"], correctAnswer: "78.5 cm^2" },
  { id: "ged20", question: "A right triangle has legs measuring 9 and 12. What is the hypotenuse?", options: ["13", "15", "18", "21"], correctAnswer: "15" },
  { id: "ged21", question: "A rectangular box measures 5 x 4 x 3 inches. What is its volume?", options: ["12 in^3", "20 in^3", "47 in^3", "60 in^3"], correctAnswer: "60 in^3" },
  { id: "ged22", question: "Data set: 6, 8, 8, 10, 13. What is the mean?", options: ["8", "9", "10", "13"], correctAnswer: "9" },
  { id: "ged23", question: "Data set: 6, 8, 8, 10, 13. What is the median?", options: ["6", "8", "9", "10"], correctAnswer: "8" },
  { id: "ged24", question: "A bag contains 4 red, 3 blue, and 3 green balls. What is the probability of randomly selecting a blue ball?", options: ["3/10", "1/2", "3/7", "7/10"], correctAnswer: "3/10" },

  // ── Section B: Reasoning Through Language Arts (22) ─────────────────────
  { id: "ged25", question: "Passage: <br> Remote work has expanded rapidly as communication technology has improved. Supporters argue that employees benefit from shorter commutes, greater flexibility, and the ability to work for companies outside their immediate geographic area.<br>  Employers may also reduce office expenses. Critics, however, point to difficulties in collaboration, employee isolation, and the challenge of maintaining a common workplace culture. <br> Research suggests that the success of remote work often depends less on where employees work than on how organizations manage communication, expectations, and performance.  <br> What is the central idea?", options: ["Remote work should replace offices entirely.", "Remote work always makes employees more productive.", "Remote work has advantages and disadvantages, and effective management influences its success.", "Technology has eliminated workplace problems."], correctAnswer: "Remote work has advantages and disadvantages, and effective management influences its success." },
  { id: "ged26", question: "In the remote-work passage, which benefit to employers is specifically mentioned?", options: ["Higher taxes", "Reduced office expenses", "Longer working hours", "More employees"], correctAnswer: "Reduced office expenses" },
  { id: "ged27", question: "Which can reasonably be inferred from the remote-work passage?", options: ["Management practices affect remote-work outcomes.", "Employees dislike flexibility.", "Offices will disappear.", "Remote employees always work alone."], correctAnswer: "Management practices affect remote-work outcomes." },
  { id: "ged28", question: "The author's tone in the remote-work passage is best described as:", options: ["angry", "humorous", "balanced", "sarcastic"], correctAnswer: "balanced" },
  { id: "ged29", question: "Passage: <br> Elena stood outside the classroom holding the application she had completed the night before. She had almost thrown it away twice. No one in her family had attended college, and the scholarship seemed intended for students far more accomplished than she considered herself. When the counselor opened the door, Elena hesitated. Then she remembered her mother's words: <i>'You cannot receive an opportunity you refuse to ask for.'</i> Elena took a breath and stepped inside. <br> Elena's primary conflict is:", options: ["with her counselor", "with her mother", "internal self-doubt", "lack of an application"], correctAnswer: "internal self-doubt" },
  { id: "ged30", question: "In the Elena passage, her mother's statement primarily encourages Elena to:", options: ["avoid failure", "take initiative", "abandon college", "ask her mother for money"], correctAnswer: "take initiative" },
  { id: "ged31", question: "What can be inferred about Elena when she steps inside?", options: ["Her fear has completely disappeared.", "She has decided to act despite uncertainty.", "She no longer wants the scholarship.", "Her counselor forced her to apply."], correctAnswer: "She has decided to act despite uncertainty." },
  { id: "ged32", question: "Which theme is best supported by the Elena passage?", options: ["Opportunity sometimes requires courage.", "Education is inexpensive.", "Families should make career decisions.", "Success requires no uncertainty."], correctAnswer: "Opportunity sometimes requires courage." },
  { id: "ged33", question: "Passage A: The city should expand public transportation. Reliable buses and trains can connect workers to employment opportunities while reducing traffic congestion. A transportation study found that neighborhoods receiving more frequent bus service experienced a 12% increase in public-transit use over two years.. <br> Passage B: The city should focus transportation funding on road expansion instead. Most households own cars, and wider roads may reduce congestion at heavily traveled intersections. Residents also value the flexibility private vehicles provide. <br> Which passage provides the stronger quantitative evidence?", options: ["Passage A", "Passage B", "Both equally", "Neither"], correctAnswer: "Passage A" },
  { id: "ged34", question: "What evidence would most strengthen Passage B (road expansion)?", options: ["The number of buses in another country", "Data showing road expansion significantly reduced travel times", "An opinion that cars look better", "The history of railroad construction"], correctAnswer: "Data showing road expansion significantly reduced travel times" },
  { id: "ged35", question: "What is the primary disagreement between the authors of Passages A and B?", options: ["Whether transportation matters", "How transportation funding should be prioritized", "Whether people work", "Whether cities have roads"], correctAnswer: "How transportation funding should be prioritized" },
  { id: "ged36", question: "Which is a fact rather than an opinion, from the transportation passages?", options: ["Public transit is the best transportation system.", "Cars are more comfortable.", "The study reported a 12% increase in transit use.", "Roads are unattractive."], correctAnswer: "The study reported a 12% increase in transit use." },
  { id: "ged37", question: "In the sentence \"The committee's decision was unanimous,\" unanimous means:", options: ["delayed", "disputed", "agreed upon by everyone", "secret"], correctAnswer: "agreed upon by everyone" },
  { id: "ged38", question: "The word reluctant most nearly means:", options: ["unwilling or hesitant", "enthusiastic", "careless", "confused"], correctAnswer: "unwilling or hesitant" },
  { id: "ged39", question: "Choose the grammatically correct sentence.", options: ["Each of the students have completed their work.", "Each of the students has completed the work.", "Each of the students were completing their work.", "Each students has completed their work."], correctAnswer: "Each of the students has completed the work." },
  { id: "ged40", question: "Which sentence is punctuated correctly?", options: ["After the meeting we went to lunch.", "After the meeting, we went to lunch.", "After, the meeting we went to lunch.", "After the meeting we, went to lunch."], correctAnswer: "After the meeting, we went to lunch." },
  { id: "ged41", question: "Choose the correct word: Neither Maria nor her sisters _____ available.", options: ["is", "are", "was", "be"], correctAnswer: "are" },
  { id: "ged42", question: "Which sentence avoids a run-on?", options: ["David finished his assignment he submitted it online.", "David finished his assignment, he submitted it online.", "David finished his assignment, and he submitted it online.", "David finished his assignment and, submitted it online."], correctAnswer: "David finished his assignment, and he submitted it online." },
  { id: "ged43", question: "Which sentence uses the apostrophe correctly?", options: ["The teachers desk is upstairs.", "The teacher's desk is upstairs.", "The teachers' desk is upstairs, when referring to one teacher.", "The teacher desk's is upstairs."], correctAnswer: "The teacher's desk is upstairs." },
  { id: "ged44", question: "Which revision is most concise?", options: ["Due to the fact that it was raining, the game was canceled.", "Because it was raining, the game was canceled.", "The game was canceled due to there being rain happening.", "The fact of rain was why cancellation occurred."], correctAnswer: "Because it was raining, the game was canceled." },
  { id: "ged45", question: "Choose the correctly spelled word.", options: ["definately", "definetely", "definitely", "definitly"], correctAnswer: "definitely" },
  { id: "ged46", question: "Which transition best completes: \"Solar power requires significant initial investment. _____, operating costs can be relatively low over time.\"", options: ["For example", "However", "Similarly", "Therefore"], correctAnswer: "However" },

  // ── Section C: Science (19) ──────────────────────────────────────────────
  { id: "ged47", question: "Which structure contains most of a cell's genetic material?", options: ["Cell membrane", "Nucleus", "Cytoplasm", "Ribosome"], correctAnswer: "Nucleus" },
  { id: "ged48", question: "Photosynthesis primarily allows plants to:", options: ["obtain energy from sunlight", "absorb oxygen only", "reproduce without cells", "eliminate water"], correctAnswer: "obtain energy from sunlight" },
  { id: "ged49", question: "Two parents each carry one recessive allele for a genetic condition. Which scientific concept predicts whether their child may inherit it?", options: ["Natural selection", "Heredity", "Evaporation", "Plate tectonics"], correctAnswer: "Heredity" },
  { id: "ged50", question: "Which system transports oxygen and nutrients throughout the human body?", options: ["Digestive", "Circulatory", "Skeletal", "Nervous"], correctAnswer: "Circulatory" },
  { id: "ged51", question: "In an ecosystem, removing a major predator would most directly affect:", options: ["only the predator", "populations throughout the food web", "Earth's orbit", "atmospheric pressure only"], correctAnswer: "populations throughout the food web" },
  { id: "ged52", question: "A car increases its velocity from 10 m/s to 20 m/s. The car is:", options: ["accelerating", "stationary", "losing mass", "evaporating"], correctAnswer: "accelerating" },
  { id: "ged53", question: "Which is an example of chemical energy being transformed into mechanical energy?", options: ["A gasoline engine moving a car", "A mirror reflecting light", "Ice melting", "A rock remaining still"], correctAnswer: "A gasoline engine moving a car" },
  { id: "ged54", question: "An atom containing 6 protons is carbon. What determines the identity of an element?", options: ["Number of neutrons only", "Number of electrons only", "Number of protons", "Atomic size"], correctAnswer: "Number of protons" },
  { id: "ged55", question: "Which is a chemical change?", options: ["Ice melting", "Water boiling", "Paper being cut", "Iron rusting"], correctAnswer: "Iron rusting" },
  { id: "ged56", question: "According to Newton's Third Law, when a swimmer pushes water backward:", options: ["the water pushes the swimmer forward", "the swimmer stops moving", "gravity disappears", "the swimmer loses mass"], correctAnswer: "the water pushes the swimmer forward" },
  { id: "ged57", question: "What primarily causes Earth's seasons?", options: ["Earth's changing distance from the Sun", "Earth's axial tilt as it revolves around the Sun", "Changes in the Moon", "Ocean currents alone"], correctAnswer: "Earth's axial tilt as it revolves around the Sun" },
  { id: "ged58", question: "Which process is part of the water cycle?", options: ["Mutation", "Condensation", "Combustion", "Digestion"], correctAnswer: "Condensation" },
  { id: "ged59", question: "Most earthquakes occur:", options: ["near tectonic plate boundaries", "only near rivers", "at Earth's poles", "only in deserts"], correctAnswer: "near tectonic plate boundaries" },
  { id: "ged60", question: "Which is a renewable resource?", options: ["Coal", "Petroleum", "Solar energy", "Natural gas"], correctAnswer: "Solar energy" },
  { id: "ged61", question: "A researcher gives different amounts of fertilizer to four identical groups of tomato plants, keeping soil, water, and sunlight the same. What is the independent variable?", options: ["Plant height", "Amount of fertilizer", "Amount of sunlight", "Tomato species"], correctAnswer: "Amount of fertilizer" },
  { id: "ged62", question: "In the fertilizer experiment, what is the dependent variable?", options: ["Amount of fertilizer", "Type of soil", "Plant growth", "Amount of water"], correctAnswer: "Plant growth" },
  { id: "ged63", question: "In the fertilizer experiment, why should water and sunlight remain constant?", options: ["They are control variables.", "They are dependent variables.", "They increase the sample size.", "They eliminate the need for measurements."], correctAnswer: "They are control variables." },
  { id: "ged64", question: '<img src="https://res.cloudinary.com/dhoecxgs7/image/upload/v1787796441/fertilizers_mk1jir.png" alt="Fertilizer growth data table" class="w-full max-w-xl mx-auto mb-4 rounded-lg" /><p class="text-center">From the table in the image above, which conclusion is best supported?</p>', options: ["Fertilizer always prevents growth.", "Increasing fertilizer from 10g to 15g produced no additional average growth.", "Plants cannot grow without fertilizer.", "15g caused plants to shrink."], correctAnswer: "Increasing fertilizer from 10g to 15g produced no additional average growth." },
  { id: "ged65", question: "Why would repeating the fertilizer experiment with more plants improve the study?", options: ["It guarantees the hypothesis is correct.", "It reduces the importance of unusual individual results.", "It changes the independent variable.", "It prevents data collection."], correctAnswer: "It reduces the importance of unusual individual results." },

  // ── Section D: Social Studies (15) ───────────────────────────────────────
  { id: "ged66", question: "The U.S. Constitution divides the federal government into three branches primarily to:", options: ["eliminate elections", "prevent excessive concentration of power", "eliminate state governments", "increase presidential authority"], correctAnswer: "prevent excessive concentration of power" },
  { id: "ged67", question: "Which branch interprets federal laws?", options: ["Legislative", "Executive", "Judicial", "Local"], correctAnswer: "Judicial" },
  { id: "ged68", question: "Congress passes a bill, but the President rejects it. This is an example of:", options: ["federalism", "checks and balances", "judicial review", "direct democracy"], correctAnswer: "checks and balances" },
  { id: "ged69", question: "Which freedom is protected by the First Amendment?", options: ["Freedom of speech", "Guaranteed employment", "Free housing", "Exemption from taxes"], correctAnswer: "Freedom of speech" },
  { id: "ged70", question: "The Declaration of Independence primarily explained:", options: ["how to create banks", "why the colonies sought independence from Britain", "how to elect senators", "why the Constitution should be amended"], correctAnswer: "why the colonies sought independence from Britain" },
  { id: "ged71", question: "One major consequence of the Civil War was:", options: ["the end of slavery in the United States", "independence from Britain", "creation of the United Nations", "women's nationwide suffrage immediately following the war"], correctAnswer: "the end of slavery in the United States" },
  { id: "ged72", question: "The Civil Rights Movement of the 1950s and 1960s primarily sought to:", options: ["expand racial equality and civil rights", "establish colonies overseas", "abolish federal elections", "decrease industrial production"], correctAnswer: "expand racial equality and civil rights" },
  { id: "ged73", question: "Which would be considered a primary source for studying World War II?", options: ["A history textbook written in 2024", "A soldier's diary written in 1944", "A recent documentary", "A modern encyclopedia"], correctAnswer: "A soldier's diary written in 1944" },
  { id: "ged74", question: "If demand for a product rises while supply stays unchanged, the price will generally:", options: ["rise", "fall", "become zero", "remain unchanged in every case"], correctAnswer: "rise" },
  { id: "ged75", question: "Inflation is:", options: ["a general increase in prices over time", "a decrease in population", "an increase in the value of every currency", "the elimination of unemployment"], correctAnswer: "a general increase in prices over time" },
  { id: "ged76", question: "Which is an example of government fiscal policy?", options: ["Congress changes tax rates.", "A family opens a savings account.", "A store changes its hours.", "A consumer purchases a car."], correctAnswer: "Congress changes tax rates." },
  { id: "ged77", question: "A person can spend $500 on a vacation or a training course. If they choose the vacation, the training course represents the:", options: ["inflation rate", "opportunity cost", "profit margin", "supply curve"], correctAnswer: "opportunity cost" },
  { id: "ged78", question: "Why have many major cities historically developed near rivers or coastlines?", options: ["Waterways facilitated transportation and trade.", "Rivers prevented all conflict.", "Agriculture cannot occur inland.", "Governments required everyone to live near water."], correctAnswer: "Waterways facilitated transportation and trade." },
{ id: "ged79", question: '<img src="https://res.cloudinary.com/dhoecxgs7/image/upload/v1787796994/unemployment_zrsy6g.png" alt="Unemployment rate table 2020-2023" class="w-full max-w-xl mx-auto mb-4 rounded-lg" /><p class="text-center">What general trend occurred between 2020 and 2023?</p>', options: ["Unemployment increased.", "Unemployment generally decreased.", "Unemployment doubled.", "No change occurred."], correctAnswer: "Unemployment generally decreased." },
  { id: "ged80", question: "A politician says, \"The unemployment rate declined every single year in the table\" (2020: 8.1%, 2021: 5.4%, 2022: 3.6%, 2023: 3.6%). Which evaluation is most accurate?", options: ["The claim is fully supported.", "The claim is not fully supported because the rate was unchanged from 2022 to 2023.", "The table contains no unemployment information.", "The claim cannot be evaluated using data."], correctAnswer: "The claim is not fully supported because the rate was unchanged from 2022 to 2023." },
];