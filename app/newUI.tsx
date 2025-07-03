import React from 'react'
import NavHeader from './components/NavHeader/NavHeader'
import QuizCardGrid from './components/Quizcard/QuizCard'

const newUI = () => {
  return (
    <div className="min-h-screen">
        <NavHeader />
       <QuizCardGrid />
         
    </div>
  )
}

export default newUI