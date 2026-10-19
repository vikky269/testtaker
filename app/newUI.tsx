'use client';

import { useMemo, useState } from 'react';
import NavHeader from './components/NavHeader/NavHeader';
import QuizCardGrid from './components/Quizcard/QuizCard';
import { quizData } from './data/mockdata';

const newUI = () => {
  const [query, setQuery] = useState('');

  const tests = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return quizData;
    return quizData.filter((test) =>
      [test.title, test.category, test.level, test.id]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen">
      <NavHeader onSearch={setQuery} />
      <QuizCardGrid tests={tests} query={query} />
    </div>
  );
};

export default newUI