
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, FileText, Star } from 'lucide-react'
import { quizData, QuizCardProps } from "../../data/mockdata"
import { Lato } from 'next/font/google'

const lato = Lato({
  subsets: ['latin'], 
  variable: '--font-lato',
  weight: ['400', '700'], 
})

const stateOptions = ["New York", "New Jersey", "Georgia", "Texas", "Maryland", "Ohio"];
const gradeOptions = ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];


function QuizCard({ id, imageSrc, title, level, category, difficulty, time, questions, onStart,}: QuizCardProps) {

  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [isStateTest, setIsStateTest] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);


  const router = useRouter();

  const handleTestClick = (testId: string) => {
    if (testId === "state-test") {
      setIsStateTest(true);
      setSelectedTest(testId);
      setStep(1); // Reset to first step
    } else {
      setSelectedTest(testId);
    }
  };

  const handleStartTest = () => {
    if (isStateTest && selectedState && selectedGrade) {
      const state = selectedState.toLowerCase().replace(/\s/g, "-");
      const grade = selectedGrade.toLowerCase().replace(" ", "-");
      router.push(`/quiz/state-test?state=${state}&grade=${grade}`);
    } else if (!isStateTest && selectedTest) {
      router.push(`/quiz/${selectedTest}`);
    }
  };

  const resetSelection = () => {
    setSelectedTest(null);
    setIsStateTest(false);
    setSelectedState(null);
    setSelectedGrade(null);
  };

  return (
    <Card className={`${lato.variable} flex flex-col justify-between rounded-2xl overflow-hidden shadow-md w-92  px-3 cursor-pointer min-h-[420px]`}>
      <div className="relative h-40 w-full mt-[-.5rem]">
        <Image
          src={imageSrc}
          alt="Quiz Cover"
          fill
          className="object-cover rounded-[7px] cursor-pointer hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>
      <CardContent className="px-1 py-6 space-y-2 flex flex-col justify-between flex-grow mt-[-2rem] ">
        <h3 className="text-lg font-semibold font-lato text-[#222222]">{title}</h3>
        <div className="flex flex-wrap text-[16px] text-[#6E6E73] gap-x-2 font-lato">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-green-500" />
            <span>{level}</span>
          </div>
          <span className="mx-1">|</span>
          <span>{category}</span>
          <span className="mx-1">|</span>
          <span>{difficulty}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm gap-x-4">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{questions} Questions</span>
          </div>
        </div>

        {selectedTest && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-80">
            {isStateTest ? (
              <>
                {step === 1 && (
                  <>
                    <p className="font-semibold mb-3">Select your state:</p>
                    <div className="space-y-2">
                      {stateOptions.map((state) => (
                        <button
                          key={state}
                          className={`block w-full cursor-pointer p-2 border rounded-md ${selectedState === state ? "bg-blue-600 font-semibold text-white" : ""
                            }`}
                          onClick={() => setSelectedState(state)}
                        >
                          {state}
                        </button>
                      ))}
                    </div>
                    <button
                      className="mt-4 py-2 px-8 bg-blue-600 cursor-pointer text-white rounded-lg disabled:opacity-50"
                      onClick={() => setStep(2)}
                      disabled={!selectedState}
                    >
                      Next
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <p className="font-semibold mb-3">Select your grade:</p>
                    <div className="space-y-2">
                      {gradeOptions.map((grade) => (
                        <button
                          key={grade}
                          className={`block cursor-pointer w-full p-2 border rounded-md  ${selectedGrade === grade ? "bg-blue-600 font-semibold text-white" : ""
                            }`}
                          onClick={() => setSelectedGrade(grade)}
                        >
                          {grade}
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-between">
                      <button
                        className="py-2 px-6 bg-gray-400 text-white rounded-lg cursor-pointer"
                        onClick={() => setStep(1)}
                      >
                        Prev
                      </button>
                      <button
                        className="py-2 px-6 bg-green-600 text-white cursor-pointer rounded-lg disabled:opacity-50"
                        onClick={handleStartTest}
                        disabled={!selectedGrade}
                      >
                        Start
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <p>
                  Ready to take the{" "}
                  <span className="font-semibold">{quizData.find((test) => test.id === selectedTest)?.title}</span>{" "}
                  test?
                </p>
                <div className="mt-4">
                  <button className="p-2 cursor-pointer bg-red-600 text-white rounded-lg mr-5" onClick={resetSelection}>
                    Cancel
                  </button>
                  <button className="py-2 px-4 cursor-pointer bg-green-600 text-white rounded-lg" onClick={handleStartTest}>
                    Start
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

        <hr className='shadow inset-3'></hr>

        <Button
          variant="outline"
          className="w-full  border-[#7FB509] text-[#7FB509] mt-2 cursor-pointer font-lato font-bold text-lg hover:bg-[#7FB509] hover:text-white transition-colors duration-300"
          //onClick={onStart}
          onClick={() => handleTestClick(id)}
        >
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  )
}

export default function QuizCardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-14 lg:grid-cols-3 lg:gap-12 2xl:grid-cols-4 2xl:gap-12 gap-5 space-y-3">
      {quizData.map((quiz, index) => (
        <QuizCard key={index} {...quiz} />
      ))}
    </div>
  )
}
