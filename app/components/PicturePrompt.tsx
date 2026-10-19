import { ChoiceFace, isPictureChoice, KinderScene } from '@/app/components/KinderArt';

export function isPictureQuestion(q: { picture?: boolean; stimulus?: string } | null | undefined) {
  return Boolean(q?.picture && q?.stimulus);
}

export function pictureLabel(option: string) {
  return option.replace(/\u200b/g, '');
}

/** Pre-K and Kindergarten keep the read-aloud note. Grade 1 and above do not. */
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
}: {
  stimulus: string;
  prompt: string;
  grade?: string;
}) {
  return (
    <div className="mb-7 flex flex-col items-center text-center">
      <Stimulus stimulus={stimulus} />
      <p className="mt-4 max-w-xl text-lg font-semibold leading-snug text-neutral-800 md:text-xl">
        {pictureLabel(prompt)}
      </p>
      {showReadAloud(grade) && (
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
          An adult can read this aloud
        </p>
      )}
    </div>
  );
}
