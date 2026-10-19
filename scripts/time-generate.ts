import { generateGradeAssessment } from '../app/utils/gradeAssessmentGenerator';

async function main() {
  const t0 = Date.now();
  const g = await generateGradeAssessment('7th-grade', {
    delayMs: 0,
    onProgress: (m) => console.log('  ', m),
  });
  console.log('done in', Date.now() - t0, 'ms', g.questions.length, g.meta);
  const t1 = Date.now();
  const g2 = await generateGradeAssessment('7th-grade', { delayMs: 0 });
  console.log('second draw in', Date.now() - t1, 'ms');
  const same = g.questions.every((q, i) => q.id === g2.questions[i]?.id);
  console.log('identical draws?', same);
}
main();
