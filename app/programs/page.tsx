'use client';

// app/programs/page.tsx
// Public "Programs" page — all programs offered by SmartMathz.
// Hover (desktop) or tap (mobile) a card to reveal its details overlay.

import { useState } from 'react';
import Link from 'next/link';

interface Program {
  id: string;
  name: string;
  emoji: string;          // fallback visual — replace with `image` when ready
  image?: string;         // e.g. '/images/programs/coding.png' (optional)
  tagline: string;
  description: string;    // shown in the hover overlay
  includes: string[];     // bullet points in the overlay
  idealFor: string;
}

// ── Edit this array to update the page — copy, images, ordering ──────────────
const PROGRAMS: Program[] = [
  {
    id: 'math',
    name: 'Math Tutoring',
    emoji: '📐',
    image: '/Math-Tutoring-1.png',
    tagline: 'Build confidence, one concept at a time',
    description:
      'One-on-one and small-group math tutoring matched to each student\'s school curriculum and pace, from foundational arithmetic to advanced high-school topics.',
    includes: [
      'Personalized lesson plans per student',
      'Curriculum-aligned (US, Canadian & more)',
      'Homework support & exam preparation',
      'Regular progress reports to parents',
    ],
    idealFor: 'All grades, Pre-K to 12th',
  },
  {
    id: 'coding',
    name: 'Coding (Python, Snap, Scratch)',
    emoji: '🐍',
    image: '/Coding-1-1.png',
    tagline: 'From first blocks to first programs',
    description:
      'A beginner-friendly coding journey: younger students start with visual block coding in Scratch and Snap, then graduate to real Python programming.',
    includes: [
      'Age-appropriate learning tracks',
      'Hands-on projects every module',
      'Games, animations & mini-apps',
      'Foundations for future STEM study',
    ],
    idealFor: 'Ages 7+ · no experience needed',
  },
  {
    id: 'webdev',
    name: 'Website Development (HTML, JavaScript, CSS)',
    emoji: '🌐',
    image: '/Web-development.png',
    tagline: 'Build and publish real websites',
    description:
      'Students learn how the web works by building it — structuring pages with HTML, styling with CSS, and adding interactivity with JavaScript.',
    includes: [
      'Build a personal portfolio site',
      'Responsive design fundamentals',
      'Intro to JavaScript interactivity',
      'Publish projects online',
    ],
    idealFor: 'Ages 10+ · creative problem-solvers',
  },
  {
    id: 'excel',
    name: 'Microsoft Excel',
    emoji: '📊',
    image: '/Excel.png',
    tagline: 'Data skills for school and beyond',
    description:
      'Practical spreadsheet mastery — from formulas and formatting to charts, functions, and data analysis skills students will use for life.',
    includes: [
      'Formulas & functions step by step',
      'Charts and data visualization',
      'Real-world projects & datasets',
      'Great for school assignments',
    ],
    idealFor: 'Ages 10+ · future-ready skills',
  },
  {
    id: 'design',
    name: 'Graphics Design & Animation (Canva & Adobe)',
    emoji: '🎨',
    image: '/Graphics.png',
    tagline: 'Turn imagination into visuals',
    description:
      'Creative design training using Canva and Adobe tools — posters, social graphics, presentations, and simple animations that bring ideas to life.',
    includes: [
      'Design principles made simple',
      'Canva & Adobe tool mastery',
      'Animation basics',
      'Portfolio of finished designs',
    ],
    idealFor: 'Creative students, ages 9+',
  },
  {
    id: 'uiux',
    name: 'UI/UX Designs',
    emoji: '💡',
    image: '/uiux.png',
    tagline: 'Design apps people love to use',
    description:
      'An introduction to user interface and user experience design — how apps and websites are planned, wireframed, and prototyped before they\'re built.',
    includes: [
      'Wireframing & prototyping',
      'User-centered design thinking',
      'Hands-on design tools',
      'Capstone app-design project',
    ],
    idealFor: 'Ages 12+ · aspiring designers',
  },
  {
    id: 'career',
    name: 'Career Development Guidance',
    emoji: '🧭',
    image: '/Career.png',
    tagline: 'Clarity on the road ahead',
    description:
      'Mentorship sessions helping students discover strengths, explore career paths, and build the study habits and soft skills that carry them forward.',
    includes: [
      'Strengths & interests discovery',
      'Career path exploration',
      'Study skills & goal setting',
      'College & subject-choice guidance',
    ],
    idealFor: 'Middle & high-school students',
  },
  {
    id: 'chess',
    name: 'Chess Lessons for Beginners',
    emoji: '♟️',
    image: '/Chess.png',
    tagline: 'Think three moves ahead',
    description:
      'Chess from the ground up — rules, tactics, and strategy — building patience, planning, and critical-thinking skills that transfer to the classroom.',
    includes: [
      'Rules, openings & tactics',
      'Weekly practice games',
      'Puzzle-based learning',
      'Friendly tournaments',
    ],
    idealFor: 'Ages 6+ · complete beginners welcome',
  },
  {
    id: 'finance',
    name: 'Financial Literacy',
    emoji: '💰',
    image: '/Financial.png',
    tagline: 'Money smarts, early',
    description:
      'Age-appropriate money education — saving, budgeting, earning, and smart spending — giving students a healthy relationship with money for life.',
    includes: [
      'Saving & budgeting basics',
      'Needs vs. wants decision-making',
      'Intro to banking & investing',
      'Fun, real-life money scenarios',
    ],
    idealFor: 'Ages 8+ · lifelong value',
  },
  {
    id: 'library',
    name: 'Weekend Virtual Library',
    emoji: '📚',
    image: '/Weekend.png',
    tagline: 'A quiet space to learn together',
    description:
      'Supervised weekend study sessions where students read, complete homework, and get help on the spot — structure and accountability, every weekend.',
    includes: [
      'Supervised study sessions',
      'Homework help on demand',
      'Reading challenges & rewards',
      'Consistent weekend routine',
    ],
    idealFor: 'All enrolled students',
  },
  {
    id: 'ela',
    name: 'ELA (English Language Arts)',
    emoji: '✍️',
    image: '/ela.png',
    tagline: 'Read deeper, write stronger',
    description:
      'Reading comprehension, grammar, vocabulary, and writing skills — building articulate readers and confident writers across all grade levels.',
    includes: [
      'Reading comprehension strategies',
      'Grammar & vocabulary building',
      'Essay & creative writing',
      'Exam-style practice',
    ],
    idealFor: 'All grades',
  },
  {
    id: 'science',
    name: 'Science Coaching',
    emoji: '🔬',
    image: '/science.jpeg',
    tagline: 'Curiosity, explained',
    description:
      'Engaging science tutoring across biology, chemistry, and physics concepts — matched to the student\'s grade and school curriculum.',
    includes: [
      'Grade-aligned science topics',
      'Concept-first explanations',
      'Experiments & demonstrations',
      'Test & exam preparation',
    ],
    idealFor: 'All grades',
  },
  {
    id: 'sat',
    name: 'SAT / SSAT Preparation',
    emoji: '🎯',
    image: '/ssat.jpeg',
    tagline: 'Test-day confidence',
    description:
      'Structured preparation for the SAT and SSAT — content review, test strategies, timed practice, and score-focused coaching.',
    includes: [
      'Diagnostic assessment & study plan',
      'Math & reading/writing review',
      'Timed practice tests',
      'Test-taking strategy coaching',
    ],
    idealFor: 'High-school students',
  },
];

export default function ProgramsPage() {
  // Tap-to-toggle for touch devices (hover handles desktop via CSS)
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-[#f4f9ec] to-white">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
          <span className="inline-flex items-center gap-2 bg-[#7FB509]/10 text-[#3a5a09] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7FB509]" />
            SmartMathz Programs
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Every Skill. <span className="text-[#7FB509]">One Place.</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-base sm:text-lg">
            From math mastery to coding, design, chess, and financial literacy —
            explore the full range of programs we offer. Hover over any program to see what it includes.
          </p>
        </div>
      </section>

      {/* ── Programs grid ── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROGRAMS.map(program => {
            const isActive = activeId === program.id;
            return (
              <div key={program.id}
                onClick={() => setActiveId(isActive ? null : program.id)}
                onMouseLeave={() => setActiveId(null)}
                className="group relative rounded-2xl border border-gray-100 bg-white shadow-sm
                           hover:shadow-lg hover:border-[#7FB509]/40 transition-all duration-300
                           cursor-pointer overflow-hidden min-h-[210px]">

                {/* ── Card face ── */}
                <div className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-40 h-40 rounded-2xl bg-[#f4f9ec] flex items-center justify-center mb-4
                                  group-hover:scale-110 transition-transform duration-300">
                    {program.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={program.image} alt={program.name} className="w-70 h-70 object-contain" />
                    ) : (
                      <span className="text-4xl">{program.emoji}</span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">{program.name}</h3>
                  <p className="text-xs text-gray-400">{program.tagline}</p>
                </div>

                {/* ── Details overlay — hover (desktop) / tap (mobile) ── */}
                <div className={`absolute inset-0 bg-[#1a2e05]/[0.97] text-white p-5 flex flex-col
                                 transition-all duration-300 ease-out
                                 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}
                                 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{program.emoji}</span>
                    <h4 className="font-bold text-sm leading-tight">{program.name}</h4>
                  </div>

                  <p className="text-[11.5px] text-white/75 leading-relaxed mb-3">
                    {program.description}
                  </p>

                  <ul className="space-y-1 mb-3">
                    {program.includes.map(item => (
                      <li key={item} className="flex items-start gap-1.5 text-[11px] text-white/90">
                        <span className="text-[#7FB509] font-bold mt-[1px]">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-16 rounded-3xl bg-[#1a2e05] text-white text-center px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Not sure which program fits best?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-7 text-sm sm:text-base">
            Take our free assessment and we'll recommend the perfect learning path
            based on your child's strengths and goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login"
              className="bg-[#7FB509] hover:bg-[#8fc61a] text-[#1a2e05] font-bold px-7 py-3 rounded-full transition-colors text-sm">
              Take the Free Assessment
            </Link>
            <Link href="/subscribe"
              className="border border-white/25 hover:bg-white/10 text-white font-semibold px-7 py-3 rounded-full transition-colors text-sm">
              Enroll Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}