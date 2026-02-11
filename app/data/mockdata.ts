export interface QuizCardProps {
    id: string;
    imageSrc: string;
    title: string;
    level: string;
    category: string;
    difficulty: string;
    time: string;
    questions: number;
    onStart: () => void;
  }
  
  export const quizData: QuizCardProps[] = [
    {
      id: "state-test",
      imageSrc: "/image.png",
      title: "STATE TEST",
      level: "",
      category: "Maths",
      difficulty: "Easy",
      time: "20 min",
      questions: 20,
      onStart: () => console.log("Started Math Basics")
    },
    {
      id: "ssat",
      imageSrc: "/imone.png",
      title: "SSAT",
      level: "Grade 9",
      category: "Maths",
      difficulty: "Medium",
      time: "30 min",
      questions: 15,
      onStart: () => console.log("Started Reading Comprehension")
    },
    {
      id: "shat",
      imageSrc: "/imtwo.png",
      title: "SHAT",
      level: "Grade 8",
      category: "Math",
      difficulty: "Medium",
      time: "25 min",
      questions: 12,
      onStart: () => console.log("Started Science Explorer")
    },
    {
        id: "algebra-1-regent",
      imageSrc: "/imthree.png",
      title: "ALGEBRA 1 REGENT",
      level: "Grade 9",
      category: "Algebra",
      difficulty: "Hard",
      time: "35 min",
      questions: 18,
      onStart: () => console.log("Started History Quest")
    },
    {
        id: "algebra-2-regent",
      imageSrc: "/imfour.png",
      title: "ALGEBRA 2 REGENT",
      level: "Grade 8",
      category: "Algebra",
      difficulty: "Medium",
      time: "20 min",
      questions: 14,
      onStart: () => console.log("Started Grammar Check")
    },
    {
        id: "geometry-regent",
      imageSrc: "/imfive.png",
      title: "GEOMETRY REGENT",
      level: "Grade 8",
      category: "Geometry",
      difficulty: "Hard",
      time: "30 min",
      questions: 16,
      onStart: () => console.log("Started Geometry Fun")
    },
    {
        id: "psat",
      imageSrc: "/imsix.png",
      title: "PSAT",
      level: "Grade 7",
      category: "Math",
      difficulty: "Medium",
      time: "40 min",
      questions: 20,
      onStart: () => console.log("Started Earth Science")
    },
    {
        id: "njgpa",
      imageSrc: "/imseven.png",
      title: "NJGPA",
      level: "Grade 8",
      category: "Algebra",
      difficulty: "Hard",
      time: "40 min",
      questions: 20,
      onStart: () => console.log("Started Algebra Intro")
    },
    {
        id: "ap-calculus",
      imageSrc: "/imeight.png",
      title: "AP CALCULUS",
      level: "Grade 3",
      category: "Calculus",
      difficulty: "Easy",
      time: "20 min",
      questions: 10,
      onStart: () => console.log("Started Spelling Bee")
    },
    {
        id: "ap-calculus-ab",
      imageSrc: "/image.png",
      title: "AP CALCULUS AB",
      level: "Grade 10",
      category: "Calculus",
      difficulty: "Medium",
      time: "25 min",
      questions: 12,
      onStart: () => console.log("Started World Capitals")
    },
    {
        id: "sat",
      imageSrc: "/sat1.png",
      title: "SAT",
      level: "Grade 9",
      category: "Maths",
      difficulty: "Hard",
      time: "45 min",
      questions: 10,
      onStart: () => console.log("Started Physics Fundamentals")
    },
    {
        id: "asvab",
      imageSrc: "/imseven.png",
      title: "ASVAB",
      level: "Grade 6",
      category: "General",
      difficulty: "Medium",
      time: "30 min",
      questions: 15,
      onStart: () => console.log("Started Civics Awareness")
    },
    {
      id: "quiz-assessment",
      imageSrc: "/imseven.png",
      title: "QUIZ ASSESSMENT",
      level: "k-12",
      category: "Maths",
      difficulty: "Medium",
      time: "15 min",
      questions: 10,
      onStart: () => console.log("Started Civics Awareness")
    },
  ];
  