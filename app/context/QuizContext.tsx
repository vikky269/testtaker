"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizContextType {
  answers: Record<string, string>; // Stores selected answers
  setAnswers: (answers: Record<string, string>) => void;
  quizData: Question[];
  setQuizData: (data: Question[]) => void;
  selectedQuestions: Question[]; // Store only the 20 selected questions
  setSelectedQuestions: (questions: Question[]) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]); // New state

  return (
    <QuizContext.Provider value={{ 
      answers, 
      setAnswers, 
      quizData, 
      setQuizData, 
      selectedQuestions, 
      setSelectedQuestions 
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) throw new Error("useQuiz must be used within a QuizProvider");
  return context;
}
