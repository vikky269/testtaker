'use client';

import { ChoiceFace, isPictureChoice, KinderScene } from '@/app/components/KinderArt';
import VisualFigure from '@/app/components/VisualFigure';
import ListenButton, { showVoiceListen } from '@/app/components/ListenButton';

export function isPictureQuestion(q: {
  picture?: boolean;
  stimulus?: string;
  visualKind?: string;
  visual?: unknown;
} | null | undefined) {
  if (q?.visualKind === 'va' && q.visual) return true;
  return Boolean(q?.picture && q?.stimulus);
}

export function isVaPictureQuestion(q: {
  visualKind?: string;
  visual?: unknown;
  optionVisuals?: unknown;
} | null | undefined) {
  return q?.visualKind === 'va';
}

export function pictureLabel(option: string) {
  return option.replace(/\u200b/g, '');
}

/** Pre-K and Kindergarten keep the read-aloud note when Listen is unavailable. */
export function showReadAloud(grade?: string) {
  const key = (grade ?? '').toLowerCase().replace(/\s+/g, '');
  return key === 'pre-k' || key === 'prek' || key === 'kindergarten' || key === 'k';
}

/** Giant tiles are for symbols and short numbers. Words and sentences stay regular text. */
export function usesLargePictureChoices(options: string[]) {
  if (options.length > 0 && options.every(isPictureChoice)) return true;
  return options.every((option) => {
    const text = pictureLabel(option).trim();
    return text.length > 0 && text.length <= 8 && !/\p{L}{3,}/u.test(text);
  });
}

/** Prefer a 2-col / stack layout when VA options include picture tiles. */
export function usesVaPictureOptions(q: {
  visualKind?: string;
  optionVisuals?: ({ type: string } | null)[] | null;
  optionLayout?: string;
} | null | undefined) {
  if (q?.visualKind !== 'va') return false;
  if (q.optionLayout === 'stack') return false;
  return Boolean(q.optionVisuals?.some((v) => v && v.type !== 'none'));
}

type ShapeKind = 'circle' | 'triangle' | 'rectangle' | 'square' | 'pentagon' | 'hexagon';

const SHAPE_KIND: Record<string, ShapeKind> = {
  '🔵': 'circle',
  '○': 'circle',
  '🔺': 'triangle',
  '△': 'triangle',
  '▭': 'rectangle',
  '▬': 'rectangle',
  '□': 'square',
  '🟦': 'square',
  '⬠': 'pentagon',
  '⬟': 'pentagon',
  '⬡': 'hexagon',
  '⬢': 'hexagon',
};

function polygonPoints(sides: number, cx: number, cy: number, r: number, startDeg = -90) {
  return Array.from({ length: sides }, (_, i) => {
    const angle = (Math.PI / 180) * ((360 / sides) * i + startDeg);
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

function ShapeIcon({ kind }: { kind: ShapeKind }) {
  const stroke = '#1a1a1a';
  if (kind === 'circle') {
    return (
      <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
        <circle cx="42" cy="42" r="28" fill="#2F80ED" stroke={stroke} strokeWidth="3" />
      </svg>
    );
  }
  if (kind === 'triangle') {
    return (
      <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
        <polygon points="42,12 74,70 10,70" fill="#F25C2A" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'rectangle') {
    return (
      <svg width="96" height="84" viewBox="0 0 96 84" aria-hidden>
        <rect x="10" y="22" width="76" height="40" fill="#ffffff" stroke={stroke} strokeWidth="3" />
      </svg>
    );
  }
  if (kind === 'square') {
    return (
      <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
        <rect x="16" y="16" width="52" height="52" fill="#3D7EE8" stroke={stroke} strokeWidth="3" />
      </svg>
    );
  }
  const sides = kind === 'pentagon' ? 5 : 6;
  const fill = kind === 'pentagon' ? '#7FB509' : '#F6C445';
  const start = kind === 'hexagon' ? 0 : -90;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
      <polygon points={polygonPoints(sides, 42, 42, 30, start)} fill={fill} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

function Stimulus({ stimulus }: { stimulus: string }) {
  if (stimulus.startsWith('kvis:')) return <KinderScene stimulus={stimulus} />;
  if (stimulus === 'va-visual') return null;
  const tokens = stimulus.split(/\s+/).filter(Boolean);
  if (!tokens.some((token) => SHAPE_KIND[token])) {
    return <div className="max-w-full text-6xl leading-tight tracking-wide md:text-7xl">{stimulus}</div>;
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      {tokens.map((token, index) =>
        SHAPE_KIND[token] ? (
          <ShapeIcon key={`${token}-${index}`} kind={SHAPE_KIND[token]} />
        ) : (
          <span key={`${token}-${index}`} className="text-6xl leading-none md:text-7xl">
            {token}
          </span>
        )
      )}
    </div>
  );
}

export default function PicturePrompt({
  stimulus,
  prompt,
  grade,
  visual,
  story,
  passage,
  alt,
  speech,
}: {
  stimulus: string;
  prompt: string;
  grade?: string;
  visual?: { type: string; [key: string]: unknown } | null;
  story?: string;
  passage?: string;
  alt?: string;
  speech?: string;
}) {
  const read = story || passage;
  const isVa = Boolean(visual && visual.type && visual.type !== 'none') || stimulus === 'va-visual';
  const voiceOn = showVoiceListen(grade);
  // Prefer phonics-friendly speech text when the bank provides it (e.g. "buh" for /b/).
  const questionSpeech = (speech || pictureLabel(prompt)).trim();

  return (
    <div className="mb-7 flex flex-col items-center text-center">
      <div className="flex w-full max-w-xl flex-col items-center gap-3 sm:flex-row sm:items-start sm:justify-center sm:gap-4">
        <p className="text-lg font-semibold leading-snug text-neutral-800 md:text-xl">
          {pictureLabel(prompt)}
        </p>
        {voiceOn ? (
          <ListenButton text={questionSpeech} label="Read the question aloud" className="shrink-0" />
        ) : null}
      </div>
      {read ? (
        <div className="mt-3 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-[#d7e4c0] bg-[#f7fbe9] px-4 py-3 text-left text-base font-medium leading-relaxed text-[#1a2e05] sm:flex-row sm:items-start sm:justify-between">
          <p className="flex-1">{read}</p>
          {voiceOn ? (
            <ListenButton text={read} label="Read the story aloud" className="shrink-0 self-end sm:self-start" />
          ) : null}
        </div>
      ) : null}
      {isVa ? (
        <div className="mt-4 w-full">
          <VisualFigure visual={visual} alt={alt} />
        </div>
      ) : (
        <div className="mt-4">
          <Stimulus stimulus={stimulus} />
        </div>
      )}
      {!voiceOn && showReadAloud(grade) && (
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
          An adult can read this aloud
        </p>
      )}
    </div>
  );
}

export { ChoiceFace, isPictureChoice };
