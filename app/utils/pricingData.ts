// app/utils/pricingData.ts
// SmartMathz pricing — category × grade × package
// Monthly hours: P1=8, P2=16, P3=20
// ADAPTERS has higher rates; RISERS/EXPLORERS/ACES/WHIZZES share the lower table
// SmartMathz adjuster = -$20/hr from standard hourly rate

export const SM_ADJUSTER = 20;

export interface PricePoint {
  monthlyHours: number;
  standardMonthlyFee: number;
  standardHourlyRate: number;
}

export interface GradePricing {
  packageI: PricePoint;
  packageII: PricePoint;
  packageIII: PricePoint;
}

// ADAPTERS pricing
const ADAPTERS: Record<string, GradePricing> = {
  'pre-k':        { packageI:{monthlyHours:8,standardMonthlyFee:416,standardHourlyRate:52},   packageII:{monthlyHours:16,standardMonthlyFee:672,standardHourlyRate:42}, packageIII:{monthlyHours:20,standardMonthlyFee:780,standardHourlyRate:39} },
  'kindergarten': { packageI:{monthlyHours:8,standardMonthlyFee:416,standardHourlyRate:52},   packageII:{monthlyHours:16,standardMonthlyFee:672,standardHourlyRate:42}, packageIII:{monthlyHours:20,standardMonthlyFee:780,standardHourlyRate:39} },
  '1st-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:416,standardHourlyRate:52},   packageII:{monthlyHours:16,standardMonthlyFee:672,standardHourlyRate:42}, packageIII:{monthlyHours:20,standardMonthlyFee:780,standardHourlyRate:39} },
  '2nd-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:416,standardHourlyRate:52},   packageII:{monthlyHours:16,standardMonthlyFee:672,standardHourlyRate:42}, packageIII:{monthlyHours:20,standardMonthlyFee:780,standardHourlyRate:39} },
  '3rd-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:416,standardHourlyRate:52},   packageII:{monthlyHours:16,standardMonthlyFee:672,standardHourlyRate:42}, packageIII:{monthlyHours:20,standardMonthlyFee:780,standardHourlyRate:39} },
  '4th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:428,standardHourlyRate:53.5}, packageII:{monthlyHours:16,standardMonthlyFee:696,standardHourlyRate:44}, packageIII:{monthlyHours:20,standardMonthlyFee:810,standardHourlyRate:41} },
  '5th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:428,standardHourlyRate:53.5}, packageII:{monthlyHours:16,standardMonthlyFee:696,standardHourlyRate:44}, packageIII:{monthlyHours:20,standardMonthlyFee:810,standardHourlyRate:41} },
  '6th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:428,standardHourlyRate:53.5}, packageII:{monthlyHours:16,standardMonthlyFee:696,standardHourlyRate:44}, packageIII:{monthlyHours:20,standardMonthlyFee:810,standardHourlyRate:41} },
  '7th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:440,standardHourlyRate:55},   packageII:{monthlyHours:16,standardMonthlyFee:720,standardHourlyRate:45}, packageIII:{monthlyHours:20,standardMonthlyFee:840,standardHourlyRate:42} },
  '8th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:440,standardHourlyRate:55},   packageII:{monthlyHours:16,standardMonthlyFee:720,standardHourlyRate:45}, packageIII:{monthlyHours:20,standardMonthlyFee:840,standardHourlyRate:42} },
  '9th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:440,standardHourlyRate:55},   packageII:{monthlyHours:16,standardMonthlyFee:720,standardHourlyRate:45}, packageIII:{monthlyHours:20,standardMonthlyFee:840,standardHourlyRate:42} },
  '10th-grade':   { packageI:{monthlyHours:8,standardMonthlyFee:456,standardHourlyRate:57},   packageII:{monthlyHours:16,standardMonthlyFee:752,standardHourlyRate:47}, packageIII:{monthlyHours:20,standardMonthlyFee:880,standardHourlyRate:44} },
  '11th-grade':   { packageI:{monthlyHours:8,standardMonthlyFee:456,standardHourlyRate:57},   packageII:{monthlyHours:16,standardMonthlyFee:752,standardHourlyRate:47}, packageIII:{monthlyHours:20,standardMonthlyFee:880,standardHourlyRate:44} },
  '12th-grade':   { packageI:{monthlyHours:8,standardMonthlyFee:456,standardHourlyRate:57},   packageII:{monthlyHours:16,standardMonthlyFee:752,standardHourlyRate:47}, packageIII:{monthlyHours:20,standardMonthlyFee:880,standardHourlyRate:44} },
  'sat':          { packageI:{monthlyHours:8,standardMonthlyFee:456,standardHourlyRate:57},   packageII:{monthlyHours:16,standardMonthlyFee:752,standardHourlyRate:47}, packageIII:{monthlyHours:20,standardMonthlyFee:880,standardHourlyRate:44} },
  'ssat':         { packageI:{monthlyHours:8,standardMonthlyFee:456,standardHourlyRate:57},   packageII:{monthlyHours:16,standardMonthlyFee:752,standardHourlyRate:47}, packageIII:{monthlyHours:20,standardMonthlyFee:880,standardHourlyRate:44} },
};

// RISERS / EXPLORERS / ACES / WHIZZES — shared lower rate
const RISERS: Record<string, GradePricing> = {
  'pre-k':        { packageI:{monthlyHours:8,standardMonthlyFee:400,standardHourlyRate:50},   packageII:{monthlyHours:16,standardMonthlyFee:640,standardHourlyRate:40}, packageIII:{monthlyHours:20,standardMonthlyFee:740,standardHourlyRate:37} },
  'kindergarten': { packageI:{monthlyHours:8,standardMonthlyFee:400,standardHourlyRate:50},   packageII:{monthlyHours:16,standardMonthlyFee:640,standardHourlyRate:40}, packageIII:{monthlyHours:20,standardMonthlyFee:740,standardHourlyRate:37} },
  '1st-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:400,standardHourlyRate:50},   packageII:{monthlyHours:16,standardMonthlyFee:640,standardHourlyRate:40}, packageIII:{monthlyHours:20,standardMonthlyFee:740,standardHourlyRate:37} },
  '2nd-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:400,standardHourlyRate:50},   packageII:{monthlyHours:16,standardMonthlyFee:640,standardHourlyRate:40}, packageIII:{monthlyHours:20,standardMonthlyFee:740,standardHourlyRate:37} },
  '3rd-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:400,standardHourlyRate:50},   packageII:{monthlyHours:16,standardMonthlyFee:640,standardHourlyRate:40}, packageIII:{monthlyHours:20,standardMonthlyFee:740,standardHourlyRate:37} },
  '4th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:412,standardHourlyRate:51.5}, packageII:{monthlyHours:16,standardMonthlyFee:664,standardHourlyRate:42}, packageIII:{monthlyHours:20,standardMonthlyFee:770,standardHourlyRate:39} },
  '5th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:412,standardHourlyRate:51.5}, packageII:{monthlyHours:16,standardMonthlyFee:664,standardHourlyRate:42}, packageIII:{monthlyHours:20,standardMonthlyFee:770,standardHourlyRate:39} },
  '6th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:412,standardHourlyRate:51.5}, packageII:{monthlyHours:16,standardMonthlyFee:664,standardHourlyRate:42}, packageIII:{monthlyHours:20,standardMonthlyFee:770,standardHourlyRate:39} },
  '7th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:424,standardHourlyRate:53},   packageII:{monthlyHours:16,standardMonthlyFee:688,standardHourlyRate:43}, packageIII:{monthlyHours:20,standardMonthlyFee:800,standardHourlyRate:40} },
  '8th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:424,standardHourlyRate:53},   packageII:{monthlyHours:16,standardMonthlyFee:688,standardHourlyRate:43}, packageIII:{monthlyHours:20,standardMonthlyFee:800,standardHourlyRate:40} },
  '9th-grade':    { packageI:{monthlyHours:8,standardMonthlyFee:424,standardHourlyRate:53},   packageII:{monthlyHours:16,standardMonthlyFee:688,standardHourlyRate:43}, packageIII:{monthlyHours:20,standardMonthlyFee:800,standardHourlyRate:40} },
  '10th-grade':   { packageI:{monthlyHours:8,standardMonthlyFee:440,standardHourlyRate:55},   packageII:{monthlyHours:16,standardMonthlyFee:720,standardHourlyRate:45}, packageIII:{monthlyHours:20,standardMonthlyFee:840,standardHourlyRate:42} },
  '11th-grade':   { packageI:{monthlyHours:8,standardMonthlyFee:440,standardHourlyRate:55},   packageII:{monthlyHours:16,standardMonthlyFee:720,standardHourlyRate:45}, packageIII:{monthlyHours:20,standardMonthlyFee:840,standardHourlyRate:42} },
  '12th-grade':   { packageI:{monthlyHours:8,standardMonthlyFee:440,standardHourlyRate:55},   packageII:{monthlyHours:16,standardMonthlyFee:720,standardHourlyRate:45}, packageIII:{monthlyHours:20,standardMonthlyFee:840,standardHourlyRate:42} },
  'sat':          { packageI:{monthlyHours:8,standardMonthlyFee:440,standardHourlyRate:55},   packageII:{monthlyHours:16,standardMonthlyFee:720,standardHourlyRate:45}, packageIII:{monthlyHours:20,standardMonthlyFee:840,standardHourlyRate:42} },
  'ssat':         { packageI:{monthlyHours:8,standardMonthlyFee:440,standardHourlyRate:55},   packageII:{monthlyHours:16,standardMonthlyFee:720,standardHourlyRate:45}, packageIII:{monthlyHours:20,standardMonthlyFee:840,standardHourlyRate:42} },
};

export function toGradeKey(raw: string): string {
  const g = raw.toLowerCase().trim().replace(/\s+/g, '-');
  if (g.includes('pre')) return 'pre-k';
  if (g.includes('kinder')) return 'kindergarten';
  if (g.includes('1st')) return '1st-grade';
  if (g.includes('2nd')) return '2nd-grade';
  if (g.includes('3rd')) return '3rd-grade';
  if (g.includes('4th')) return '4th-grade';
  if (g.includes('5th')) return '5th-grade';
  if (g.includes('6th')) return '6th-grade';
  if (g.includes('7th')) return '7th-grade';
  if (g.includes('8th')) return '8th-grade';
  if (g.includes('9th')) return '9th-grade';
  if (g.includes('10th')) return '10th-grade';
  if (g.includes('11th')) return '11th-grade';
  if (g.includes('12th')) return '12th-grade';
  if (g.includes('ssat')) return 'ssat';
  if (g.includes('sat')) return 'sat';
  return '1st-grade';
}

export function getPricingTable(categoryName: string, grade: string): GradePricing | null {
  const key = toGradeKey(grade);
  if (categoryName === 'ADAPTERS') return ADAPTERS[key] ?? null;
  return RISERS[key] ?? null; // RISERS, EXPLORERS, ACES, WHIZZES
}

export interface ComputedPrice {
  sessions: number;
  standardHourlyRate: number;
  standardMonthlyFee: number;
  smHourlyRate: number;
  smMonthlyFee: number;
  smBiweekly: number;
  savingsPercent: number;
  smInvestment: number;
}

export function computePrice(pp: PricePoint): ComputedPrice {
  const smHourlyRate   = pp.standardHourlyRate - SM_ADJUSTER;
  const smMonthlyFee   = Math.round(smHourlyRate * pp.monthlyHours);
  const smBiweekly     = smMonthlyFee / 2;
  const savingsPercent = Math.round(((pp.standardMonthlyFee - smMonthlyFee) / pp.standardMonthlyFee) * 100);
  const smInvestment   = pp.standardMonthlyFee - smMonthlyFee;
  return { sessions: pp.monthlyHours, standardHourlyRate: pp.standardHourlyRate, standardMonthlyFee: pp.standardMonthlyFee, smHourlyRate, smMonthlyFee, smBiweekly, savingsPercent, smInvestment };
}

export function computeCustomPrice(standardHourlyRate: number, monthlyHours: number): ComputedPrice {
  const standardMonthlyFee = Math.round(standardHourlyRate * monthlyHours);
  return computePrice({ monthlyHours, standardMonthlyFee, standardHourlyRate });
}