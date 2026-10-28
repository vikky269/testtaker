import banks from '../app/data/visualAssessmentBanks.json' with { type: 'json' };

for (const g of ['pre-k', 'kindergarten', '1']) {
  const math = banks[g].math;
  const ela = banks[g].ela;
  console.log(g, math.length, ela.length, math[0].id, math[0].domain, math[0].visual?.type);
  if (math.length !== 50 || ela.length !== 50) throw new Error('expected 50+50');
}
console.log('ok');
