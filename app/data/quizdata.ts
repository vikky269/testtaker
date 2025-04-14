const quizData: Record<string, { question: string; options: string[]; answer: string }[]> = {
    "asvab": [

        { question: "The adrenal glands are part of the _________?", 
          options: ["Immune system", "Endocrine system", "Emphatic system", "Respiratory system"], 
          answer: "Endocrine system"
         },

        { question: "Which of the following is exchanged between two or more atoms that undergo ionic bonding?", 
          options: ["Neutrons", "Transitory electrons", "Valence electrons", "Electrical charges"], 
          answer: "Valence electrons" 
        },

        { question: "Which of the following statements is NOT true of metals?",
           options: ["Most of them are good conductors of heat", "Most of them are gases at room temperature", "Most of them are ductile", "They make up the majority of elements on the periodic table"], 
           answer: "Most of them are gases at room temperature"
           },

        { question: "Select the answer that is closest in meaning to the underlined portion, The group hiked along a (precipitous) slope that many found unnerving.",
           options: ["Rugged", "Dangerous", "Steep", "Wet"],
           answer: "Steep" 
          },

        { question: "Select the answer that is closest in meaning to the underlined portion, Stanley was so (besotted) with his prom date that he spent most of the dance gazing at her adoringly.", 
           options: ["Infatuated", "Infuriated", "Perplexed", "Engrossed"],
           answer: "Infatuated" 
          },

        { question: "Select the answer that is closest in meaning to the underlined portion,    Saline is taking a philosophy class but finds most of the readings to be very (obscure) so she has not benefitted much from them.", 
          options: ["Opinionated", "Unclear", "Offensive", "Benign"], 
          answer: "Unclear" 
        },

        { question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1743182128/Picture1_zgirym.png", 
          options: ["Discus the major risks associated with internet use", "Talk about the importance of anti-virus programs", "Outline important considerations for passwords", "Discuss why certain types of passwords shouldn’t be used"],
           answer: "Outline important considerations for passwords" 
          },

        { question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1743187045/Picture2_yqt7jk.png", 
           options: ["Research Paper", "Book", "Eyewitness interview", "Magazine article"],
           answer: "Eyewitness interview" 
          },

        { question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1743187492/Picture3_jclu2w.png", 
          options: ["Gardner believed that linguistic intelligence was the most desirable type to have", "Most people who have a high level of intrapersonal intelligence do well in school", "People who have a high level of interpersonal intelligence work well in groups", "People who have mathematical intelligence would do the best on a standard IQ test"], 
          answer: "People who have a high level of interpersonal intelligence work well in groups" 
        },

        { question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1743188898/Picture4_npvkbv.png", 
          options: ["To talk about the benefits of sleep", "To discuss how much sleep people should get", "To identify which hormones can boost immunity", "To present strategies for improving memory and concentration"], 
          answer: "To talk about the benefits of sleep"
         },

        { question: "If 16x + 4 = 100, what is the value of x?", 
          options: ["6", "7", "8", "9"], 
          answer: "6"
         },

        { question: "If x is 20% of 200, what is the value of x?",
           options: ["40", "80", "100", "150"], 
           answer: "40" 
          },

        { question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1743343937/indicies_jyenms.jpg", 
          options: [
            "A",
            "B",
            "C",
            "D"
          ],
          answer: "D"
          },

        { question: "What is the midpoint of a line segment that runs from the point (6, 20) to the point (10, 40)?", 
          options: ["(30, 8)", "(16, 60)", "(8, 30)", "(7, 15)"], 
          answer: "(8, 30)" 
        },
       

        { question: "A six-sided die has sides numbered 1 through 6. What is the probability of throwing a 3 or a 4?", 
          options: ["1 in 6", "1 in 3", "1 in 2", "1 in 4"],
           answer: "1 in 3" 
          },

        { question: "What is the resistance of the circuit formed by a 40W lightbulb plugged into a wall outlet with a 120V differential?",
           options: ["360Ω", "30Ω", "4,800Ω", "13.3Ω"],
            answer: "360Ω"
           },

        { question: "What is another term for the insulation between the electrode plates of a capacitor?", 
          options: ["Synapse", "Dielectric", "Flux capacitor", "Dielectric cage"], 
          answer: "Dielectric"
         },

        { question: "All of the following are parts of a bipolar junction transistor except:",
           options: ["Emitter", "Collector", "Base", "Transformer"], 
           answer: "Transformer" 
          },

        { question: "Which of the following is the least likely sign of catalytic converter trouble?", 
          options: ["Reduced acceleration", "Dark exhaust smoke", "Exhaust that smells like sulfur", "Rough engine idle"], 
          answer: "Dark exhaust smoke" 
        },

        { question: "https://res.cloudinary.com/dhoecxgs7/image/upload/v1743215352/Picture5_r4o8ze.png", 
          options: ["A", "B", "C",], 
          answer: "B" 
        },

        // dummy questions for testing

        {
          "question": "What is the square root of 144?",
          "options": ["10", "11", "12", "13"],
          "answer": "12"
        },
        {
          "question": "Which planet is known as the Red Planet?",
          "options": ["Earth", "Venus", "Mars", "Jupiter"],
          "answer": "Mars"
        },
        {
          "question": "What is the chemical symbol for gold?",
          "options": ["Ag", "Au", "Pb", "Pt"],
          "answer": "Au"
        },
        {
          "question": "How many sides does a hexagon have?",
          "options": ["5", "6", "7", "8"],
          "answer": "6"
        },
        {
          "question": "Who wrote the play 'Romeo and Juliet'?",
          "options": ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
          "answer": "William Shakespeare"
        },
        {
          "question": "What is the powerhouse of the cell?",
          "options": ["Nucleus", "Ribosome", "Mitochondrion", "Golgi apparatus"],
          "answer": "Mitochondrion"
        },
        {
          "question": "What gas do plants primarily use for photosynthesis?",
          "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
          "answer": "Carbon Dioxide"
        },
        {
          "question": "Which U.S. president issued the Emancipation Proclamation?",
          "options": ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "Theodore Roosevelt"],
          "answer": "Abraham Lincoln"
        },
        {
          "question": "What is the largest ocean on Earth?",
          "options": ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
          "answer": "Pacific Ocean"
        },
        {
          "question": "What is the capital of France?",
          "options": ["Madrid", "Berlin", "Paris", "Rome"],
          "answer": "Paris"
        },
        {
          "question": "Which element is found in all organic compounds?",
          "options": ["Oxygen", "Carbon", "Nitrogen", "Hydrogen"],
          "answer": "Carbon"
        },
        {
          "question": "What is the freezing point of water in Fahrenheit?",
          "options": ["0°F", "32°F", "100°F", "212°F"],
          "answer": "32°F"
        },
        {
          "question": "Who developed the theory of relativity?",
          "options": ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Nikola Tesla"],
          "answer": "Albert Einstein"
        },
        {
          "question": "What is the longest river in the world?",
          "options": ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
          "answer": "Nile River"
        },
        {
          "question": "Which country is known as the Land of the Rising Sun?",
          "options": ["China", "South Korea", "Japan", "Thailand"],
          "answer": "Japan"
        },
        {
          "question": "What is the SI unit of force?",
          "options": ["Joule", "Watt", "Newton", "Pascal"],
          "answer": "Newton"
        },
        {
          "question": "Which gas makes up the majority of Earth's atmosphere?",
          "options": ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"],
          "answer": "Nitrogen"
        },
        {
          "question": "Which blood type is known as the universal donor?",
          "options": ["A", "B", "O", "AB"],
          "answer": "O"
        },
        {
          "question": "How many continents are there on Earth?",
          "options": ["5", "6", "7", "8"],
          "answer": "7"
        },
        {
          "question": "What is the capital of the United States?",
          "options": ["New York", "Washington, D.C.", "Los Angeles", "Chicago"],
          "answer": "Washington, D.C."
        },
        {
          "question": "What is the name of the largest bone in the human body?",
          "options": ["Humerus", "Femur", "Tibia", "Fibula"],
          "answer": "Femur"
        },
        {
          "question": "What is the speed of light in a vacuum?",
          "options": ["300,000 km/s", "150,000 km/s", "3,000 km/s", "30,000 km/s"],
          "answer": "300,000 km/s"
        },
        {
          "question": "Which of these elements is a noble gas?",
          "options": ["Oxygen", "Nitrogen", "Helium", "Carbon"],
          "answer": "Helium"
        },
        {
          "question": "Which country is home to the Great Pyramid of Giza?",
          "options": ["Mexico", "Greece", "India", "Egypt"],
          "answer": "Egypt"
        },
        {
          "question": "What is the smallest unit of life?",
          "options": ["Organ", "Tissue", "Cell", "Molecule"],
          "answer": "Cell"
        }
    ],
    "geometry-regent": [
      { question: "What is the slope-intercept form of a line?", options: ["ax² + bx + c = 0", "y = mx + b", "a² + b² = c²"], answer: "y = mx + b" },
      { question: "What is the slope of a horizontal line?", options: ["0", "Undefined", "1"], answer: "0" },
      { question: "How many solutions does a system of two parallel lines have?", options: ["One", "Infinite", "None"], answer: "None" },
      { question: "What does the 'm' represent in y = mx + b?", options: ["Slope", "Y-intercept", "X-intercept"], answer: "Slope" },
      { question: "What is the slope of a vertical line?", options: ["0", "Undefined", "1"], answer: "Undefined" },
      { question: "How do you find the x-intercept of a linear equation?", options: ["Set y = 0", "Set x = 0", "Solve for b"], answer: "Set y = 0" },
      { question: "What is the equation of a line that passes through (0, 5) with a slope of 2?", options: ["y = 2x + 5", "y = 5x + 2", "y = 2x - 5"], answer: "y = 2x + 5" },
      { question: "If two lines have the same slope, what does that mean?", options: ["They are perpendicular", "They are parallel", "They intersect"], answer: "They are parallel" },
      { question: "What does a negative slope indicate?", options: ["Increasing function", "Decreasing function", "Constant function"], answer: "Decreasing function" },
      { question: "What happens when two lines have slopes that are negative reciprocals?", options: ["They are parallel", "They are perpendicular", "They do not intersect"], answer: "They are perpendicular" },
    ],
    "sat": [
      { question: "What is the sum of angles in a triangle?", options: ["90°", "180°", "360°"], answer: "180°" },
      { question: "What is the formula for the area of a circle?", options: ["πr²", "2πr", "πd"], answer: "πr²" },
      { question: "How many sides does a hexagon have?", options: ["4", "5", "6"], answer: "6" },
      { question: "What type of triangle has two equal sides?", options: ["Scalene", "Isosceles", "Equilateral"], answer: "Isosceles" },
      { question: "What is the formula for the perimeter of a rectangle?", options: ["2(l + w)", "l × w", "l + w"], answer: "2(l + w)" },
      { question: "How many degrees are in a right angle?", options: ["45°", "90°", "180°"], answer: "90°" },
      { question: "A quadrilateral with all sides equal and angles at 90° is called?", options: ["Rectangle", "Rhombus", "Square"], answer: "Square" },
      { question: "What is the Pythagorean theorem?", options: ["a² + b² = c²", "a + b = c", "a² - b² = c²"], answer: "a² + b² = c²" },
      { question: "What is the name of a polygon with 8 sides?", options: ["Hexagon", "Heptagon", "Octagon"], answer: "Octagon" },
      { question: "What is the volume formula for a cylinder?", options: ["πr²h", "2πr", "πr³"], answer: "πr²h" },
    ],
    "ap-calculus": [
      { question: "What is the derivative of x²?", options: ["2x", "x", "x³"], answer: "2x" },
      { question: "What is the integral of x?", options: ["x²/2", "x²", "1/x"], answer: "x²/2" },
      { question: "What does the derivative represent?", options: ["Slope of a function", "Area under a curve", "Function's maximum"], answer: "Slope of a function" },
      { question: "What is the limit of (sin x)/x as x approaches 0?", options: ["1", "0", "Infinity"], answer: "1" },
      { question: "What is the second derivative used for?", options: ["Finding slope", "Finding concavity", "Finding limits"], answer: "Finding concavity" },
      { question: "What is the chain rule used for?", options: ["Implicit differentiation", "Differentiating composite functions", "Integrating functions"], answer: "Differentiating composite functions" },
      { question: "What is the integral of e^x?", options: ["e^x", "xe^x", "e^(x-1)"], answer: "e^x" },
      { question: "What is the derivative of sin x?", options: ["cos x", "tan x", "-cos x"], answer: "cos x" },
      { question: "What is L'Hôpital's Rule used for?", options: ["Evaluating limits", "Finding derivatives", "Solving integrals"], answer: "Evaluating limits" },
      { question: "What does the fundamental theorem of calculus connect?", options: ["Differentiation and Integration", "Limits and Sequences", "Algebra and Geometry"], answer: "Differentiation and Integration" },
    ],
    "ssat": [],
    "njgpa": [],
    "psat": [],
    "ap-calculus-ab": [],
    "algebra-1-regent": [],
    "algebra-2-regent": [],
    "state-test": [],
    "shat": [],

  };

  export default quizData;