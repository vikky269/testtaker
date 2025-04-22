
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import quizTests from "./data/quiztest";

const stateOptions = ["New York", "New Jersey", "Georgia", "Texas", "Maryland", "Ohio"];
const gradeOptions = ["Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"];

export default function Home() {
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
    <div className="min-h-screen p-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">SmartMathz Test Taker</h1>
        <p className="text-center text-gray-700 mb-6">Select a test to begin your preparation.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quizTests.map((test) => (
            <div
              key={test.id}
              className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition cursor-pointer text-center"
              onClick={() => handleTestClick(test.id)}
            >
              <h2 className="text-lg font-semibold text-gray-900">{test.name}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for test confirmation or State/Grade Selection */}
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
                  <span className="font-semibold">{quizTests.find((test) => test.id === selectedTest)?.name}</span>{" "}
                  test?
                </p>
                <div className="mt-4">
                  <button className="p-2 bg-red-600 text-white rounded-lg mr-5" onClick={resetSelection}>
                    Cancel
                  </button>
                  <button className="py-2 px-4 bg-green-600 text-white rounded-lg" onClick={handleStartTest}>
                    Start
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
