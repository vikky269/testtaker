"use client"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import quizTests from "./data/quiztest";

// const quizTests = [
//   "SAT", "ASVAB", "SSAT", "SHAT", "STATE TEST", "ALGEBRA 1 REGENT", "ALGEBRA 2 REGENT",
//   "GEOMETRY REGENT", "AP CALCULUS", "AP CALCULUS AB", "PSAT"
// ];

export default function Home() {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const router = useRouter()

  const handleStartTest = () => {
    if (selectedTest) {
        router.push(`/quiz/${selectedTest}`);
      }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">SmartMathz Test Taker</h1>
        <p className="text-center text-gray-700 mb-6">Select a test to begin your preparation.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quizTests.map((test) => (
            <div
              key={test.id}
              className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition cursor-pointer text-center"
              onClick={() => setSelectedTest(test.id)}
            >
              <h2 className="text-lg font-semibold text-gray-900">{test.name}</h2>
            </div>
          ))}
        </div>
      </div>
      {selectedTest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80">
             Ready to take the {quizTests.find((test) => test.id === selectedTest)?.name} test?
            <div className="mt-4">
              <button
                className="p-2 bg-red-600 text-white rounded-lg mr-2"
                onClick={() => setSelectedTest(null)}
              >
                Cancel
              </button>
              
                <button 
                className="p-2 bg-green-600 text-white rounded-lg"
                onClick={handleStartTest}
                >
                    Start
                </button>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}