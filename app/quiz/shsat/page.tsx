'use client';

// SHSAT diagnostic — ELA (60 min, 50 Q) then Math (60 min, 50 Q).
// Question sets drawn once per attempt and locked in localStorage.

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, withTimeout } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

import {
  SECTION_ORDER,
  SECTION_TITLE,
  SECTION_TIME,
  type SHSATSectionKey,
} from '@/app/data/shsatConfig';
import {
  drawFullAttempt,
  lookupByIds,
  idsOf,
  type SHSATQuestion,
} from '@/app/utils/shsatRandomizer';
import {
  loadShsatAttempt,
  saveShsatAttempt,
  clearShsatAttempt,
} from '@/app/data/shsatAttemptStorage';
import { calculateArrayScore } from '@/app/utils/ScoreUtils';
import { annotateShsatQuestionsForSkills } from '@/app/utils/shsatSkillAreas';
import QuizBody from '@/app/quizBody/quizBody';
import ResultsScreen from '@/app/modals/resultScreen';

type SectionDurations = Record<SHSATSectionKey, number>;
const EMPTY_DURATIONS: SectionDurations = { ela: 0, math: 0 };

export default function ShsatQuizPage() {
  const router = useRouter();

  const [currentSection, setCurrentSection] = useState<SHSATSectionKey>('ela');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sectionQuestions, setSectionQuestions] = useState<Record<
    SHSATSectionKey,
    SHSATQuestion[]
  > | null>(null);

  const [transitionModal, setTransitionModal] = useState<{
    fromLabel: string;
    toLabel: string;
    next: SHSATSectionKey;
  } | null>(null);
  const [unansweredModal, setUnansweredModal] = useState<{
    count: number;
    toLabel: string;
    isFinal: boolean;
  } | null>(null);

  const [restoring, setRestoring] = useState(true);
  const hasSavedRef = useRef(false);
  const studentInfoRef = useRef<{
    id: string;
    fullName: string;
    email: string;
    gender: string;
  } | null>(null);
  const sectionStartRef = useRef<Record<SHSATSectionKey, number | null>>({
    ela: null,
    math: null,
  });
  const sectionDurationRef = useRef<SectionDurations>({ ...EMPTY_DURATIONS });
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const init = async () => {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (user) {
        const { data: profile } = await supabase
          .from('student_profile')
          .select('full_name, gender')
          .eq('id', user.id)
          .maybeSingle();
        studentInfoRef.current = {
          id: user.id,
          fullName: profile?.full_name || user.email || 'Student',
          email: user.email ?? '',
          gender: profile?.gender || 'N/A',
        };
        localStorage.setItem('activeStudent', JSON.stringify(studentInfoRef.current));
      }

      const existing = loadShsatAttempt();
      if (existing && existing.status === 'in_progress' && existing.elaIds?.length) {
        toast.success('Resuming your SHSAT assessment — picking up where you left off.');
        setSectionQuestions({
          ela: lookupByIds('ela', existing.elaIds),
          math: lookupByIds('math', existing.mathIds),
        });
        setCurrentSection(existing.section || 'ela');
        setCurrentQuestionIndex(existing.currentQuestionIndex || 0);
        setAnswers(existing.answers || {});
        sectionDurationRef.current = {
          ...EMPTY_DURATIONS,
          ...(existing.sectionDurations || {}),
        };
        sectionStartRef.current = { ela: null, math: null };
        sectionStartRef.current[existing.section || 'ela'] = Date.now();
      } else {
        const drawn = drawFullAttempt();
        setSectionQuestions(drawn);
        saveShsatAttempt({
          status: 'in_progress',
          section: 'ela',
          currentQuestionIndex: 0,
          answers: {},
          elaIds: idsOf(drawn.ela),
          mathIds: idsOf(drawn.math),
          sectionDurations: { ...EMPTY_DURATIONS },
          updatedAt: Date.now(),
        });
        sectionStartRef.current = { ela: Date.now(), math: null };
      }

      setRestoring(false);
    };
    init();
  }, []);

  const activeQuestions = useMemo(() => {
    if (!sectionQuestions) return [];
    return sectionQuestions[currentSection];
  }, [sectionQuestions, currentSection]);

  const persist = useCallback(() => {
    if (!sectionQuestions || submitted) return;
    saveShsatAttempt({
      status: 'in_progress',
      section: currentSection,
      currentQuestionIndex,
      answers,
      elaIds: idsOf(sectionQuestions.ela),
      mathIds: idsOf(sectionQuestions.math),
      sectionDurations: { ...sectionDurationRef.current },
      updatedAt: Date.now(),
    });
  }, [sectionQuestions, currentSection, currentQuestionIndex, answers, submitted]);

  useEffect(() => {
    if (restoring || submitted || !sectionQuestions) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(persist, 800);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [persist, restoring, submitted, sectionQuestions]);

  const handleSelect = (question: string, option: string) => {
    if (answers[question] === option) {
      const u = { ...answers };
      delete u[question];
      setAnswers(u);
    } else {
      setAnswers({ ...answers, [question]: option });
    }
  };
  const handleNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((p) => p + 1);
    }
  };
  const handlePrev = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((p) => p - 1);
  };

  const recordSectionEnd = (key: SHSATSectionKey) => {
    const start = sectionStartRef.current[key];
    if (start) {
      sectionDurationRef.current[key] += Math.round((Date.now() - start) / 1000);
      sectionStartRef.current[key] = null;
    }
  };

  const proceedToSection = (next: SHSATSectionKey) => {
    recordSectionEnd(currentSection);
    sectionStartRef.current[next] = Date.now();
    setCurrentSection(next);
    setCurrentQuestionIndex(0);
    setTransitionModal(null);
    setUnansweredModal(null);
  };

  const handleSectionSubmit = () => {
    const unanswered = activeQuestions.filter((q) => !answers[q.question]).length;
    const nextIndex = SECTION_ORDER.indexOf(currentSection) + 1;
    const next = SECTION_ORDER[nextIndex];

    if (unanswered > 0) {
      setUnansweredModal({
        count: unanswered,
        toLabel: next ? SECTION_TITLE[next] : '',
        isFinal: !next,
      });
      return;
    }
    if (next) {
      setTransitionModal({
        fromLabel: SECTION_TITLE[currentSection],
        toLabel: SECTION_TITLE[next],
        next,
      });
    } else {
      finalizeSubmit();
    }
  };

  const confirmUnanswered = () => {
    const nextIndex = SECTION_ORDER.indexOf(currentSection) + 1;
    const next = SECTION_ORDER[nextIndex];
    setUnansweredModal(null);
    if (next) proceedToSection(next);
    else finalizeSubmit();
  };

  const confirmTransition = () => {
    if (transitionModal) proceedToSection(transitionModal.next);
  };

  const handleTimeUp = () => {
    const nextIndex = SECTION_ORDER.indexOf(currentSection) + 1;
    const next = SECTION_ORDER[nextIndex];
    if (next) proceedToSection(next);
    else finalizeSubmit();
  };

  const saveToLeaderboard = async (durations: SectionDurations) => {
    if (hasSavedRef.current || !sectionQuestions) return;
    hasSavedRef.current = true;

    let student = studentInfoRef.current;
    if (!student) {
      const saved = localStorage.getItem('activeStudent');
      if (saved) {
        try {
          student = JSON.parse(saved);
        } catch {
          /* ignore */
        }
      }
    }
    if (!student) {
      const result = await withTimeout(supabase.auth.getSession());
      const user = result?.data?.session?.user;
      if (user) {
        const { data: profile } = await supabase
          .from('student_profile')
          .select('full_name, gender')
          .eq('id', user.id)
          .maybeSingle();
        student = {
          id: user.id,
          fullName: profile?.full_name || user.email || 'Student',
          email: user.email ?? '',
          gender: profile?.gender || 'N/A',
        };
      }
    }
    if (!student) {
      toast.error("You're not logged in — this result will NOT be saved!", {
        duration: 8000,
      });
      hasSavedRef.current = false;
      return;
    }

    const allQuestions = [...sectionQuestions.ela, ...sectionQuestions.math];
    const elaScore = calculateArrayScore(sectionQuestions.ela, answers);
    const mathScore = calculateArrayScore(sectionQuestions.math, answers);
    const overall = calculateArrayScore(allQuestions, answers);
    const totalTime = durations.ela + durations.math;

    const { error } = await supabase.from('leaderboard').insert([
      {
        full_name: student.fullName,
        email: student.email,
        grade: 'SHSAT',
        math_score: Number(mathScore),
        ela_score: Number(elaScore),
        science_score: 0,
        overall_score: Number(overall),
        total_time: totalTime,
        math_duration: durations.math,
        ela_duration: durations.ela,
        science_duration: null,
        test_type: 'shsat',
        gender: student.gender,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('SHSAT leaderboard save error:', error);
      hasSavedRef.current = false;
      toast.error('Could not save your result. Please contact SmartMathz.');
      return;
    }

    toast.success('Result saved ✓');

    const { error: subError } = await supabase.from('test_submissions').insert([
      {
        user_id: student.id,
        full_name: student.fullName,
        email: student.email,
        grade: 'SHSAT',
        test_type: 'shsat',
        questions: allQuestions,
        answers,
        math_score: Number(mathScore),
        ela_score: Number(elaScore),
        science_score: null,
        overall_score: Number(overall),
        durations: {
          totalDuration: totalTime,
          mathDuration: durations.math,
          elaDuration: durations.ela,
        },
      },
    ]);
    if (subError) console.error('SHSAT test sheet save error:', subError);
  };

  const finalizeSubmit = () => {
    recordSectionEnd(currentSection);
    setTransitionModal(null);
    setUnansweredModal(null);
    setSubmitted(true);
    clearShsatAttempt();
    setTimeout(() => {
      saveToLeaderboard({ ...sectionDurationRef.current });
    }, 100);
  };

  const handleGoHome = () => {
    localStorage.removeItem('activeStudent');
    clearShsatAttempt();
    router.push('/');
  };

  const handleReview = () => {
    router.push('/quiz/shsat/review');
  };

  if (restoring || !sectionQuestions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#7FB509] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Preparing your SHSAT assessment...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    const elaQs = sectionQuestions.ela;
    const mathQs = sectionQuestions.math;
    const overallScore = calculateArrayScore([...elaQs, ...mathQs], answers);
    const answeredCount = Object.keys(answers).filter((k) =>
      [...elaQs, ...mathQs].find((q) => q.question === k)
    ).length;

    const skillQuestions = annotateShsatQuestionsForSkills(
      [...elaQs, ...mathQs],
      elaQs
    );

    return (
      <ResultsScreen
        isGrade9Or10={true}
        isSat={false}
        satReadingScore={Number(calculateArrayScore(elaQs, answers))}
        satMathScore={Number(calculateArrayScore(mathQs, answers))}
        satCorrectCount={[...elaQs, ...mathQs].filter(
          (q) => answers[q.question] === q.correctAnswer
        ).length}
        calculateSectionScore={() => null}
        calculateScore={() => ({ combined: overallScore })}
        totalQuestions={elaQs.length + mathQs.length}
        answeredCount={answeredCount}
        onGoHome={handleGoHome}
        onReview={handleReview}
        gradeLabel="SHSAT Readiness Diagnostic"
        studentName={studentInfoRef.current?.fullName}
        quizQuestions={skillQuestions}
        answers={answers}
      />
    );
  }

  const elapsed = sectionDurationRef.current[currentSection] ?? 0;
  const timerDuration = Math.max(30, SECTION_TIME[currentSection] - elapsed);

  return (
    <QuizBody
      testid="shsat"
      stateParam={undefined}
      gradeParam="shsat"
      normalizedGrade="shsat"
      isSATQuiz={false}
      isGrade9Or10={true}
      includeScience={false}
      isSat={false}
      isPsat={false}
      isGed={false}
      quizSection={currentSection}
      satSection="reading"
      isSatReading={false}
      activeQuestions={activeQuestions}
      currentQuestionIndex={currentQuestionIndex}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      answers={answers}
      timerDuration={timerDuration}
      timerIdentifier={`shsat-${currentSection}-60m`}
      onTimeUp={handleTimeUp}
      onSelect={handleSelect}
      onNext={handleNext}
      onPrev={handlePrev}
      onSubmit={handleSectionSubmit}
      unansweredCount={0}
      showConfirmModal={false}
      showConfirmElaModal={false}
      showConfirmSubmissionModal={false}
      showGradeModal={false}
      showScienceModal={false}
      showSatModal={false}
      onCancelConfirm={() => {}}
      onConfirmMathSubmit={() => {}}
      onCancelElaConfirm={() => {}}
      onConfirmElaSubmit={() => {}}
      onCancelSubmission={() => {}}
      onConfirmFinalSubmit={() => {}}
      onSkipEla={() => {}}
      onTakeEla={() => {}}
      onTakeScience={() => {}}
      onContinueMath={() => {}}
      gedTransitionModal={
        transitionModal
          ? { fromLabel: transitionModal.fromLabel, toLabel: transitionModal.toLabel }
          : null
      }
      onGedTransitionContinue={confirmTransition}
      gedUnansweredModal={unansweredModal}
      onGedUnansweredCancel={() => setUnansweredModal(null)}
      onGedUnansweredConfirm={confirmUnanswered}
    />
  );
}
