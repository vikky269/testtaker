/** Illustrated pieces for the kindergarten picture assessment. */

const ICONS = [
  'apple', 'star', 'duck', 'ball', 'block', 'bird', 'cat', 'hat', 'sun', 'dog',
  'fish', 'moon', 'tree', 'cup', 'umbrella', 'book', 'rabbit', 'chair', 'bee',
  'bed', 'sock', 'seed', 'sprout', 'boot',
] as const;

export type KinderIconName = (typeof ICONS)[number];

export function isPictureChoice(option: string) {
  return /^(pic|shape|letter):/.test(option);
}

function choiceLabel(name: string) {
  return (
    <span className="text-sm font-semibold capitalize leading-tight">{name}</span>
  );
}

export function ChoiceFace({ option }: { option: string }) {
  if (option.startsWith('pic:')) {
    const name = option.slice(4);
    return (
      <span className="flex flex-col items-center gap-1">
        <KinderIcon name={name} />
        {choiceLabel(name)}
      </span>
    );
  }
  if (option.startsWith('shape:')) return <ShapeGlyph kind={option.slice(6)} />;
  if (option.startsWith('letter:')) return <LetterCard letter={option.slice(7)} />;
  return null;
}

export function KinderScene({ stimulus }: { stimulus: string }) {
  if (!stimulus.startsWith('kvis:')) return null;
  const parts = stimulus.slice(5).split(':');
  const [kind, a, b, c] = parts;

  if (kind === 'tap' || kind === 'listen') return null;

  if (kind === 'count') {
    return (
      <figure className="mb-2">
        <IconRow icon={a} count={Number(b)} />
      </figure>
    );
  }

  if (kind === 'add') {
    return (
      <figure className="mb-2 flex flex-wrap items-center justify-center gap-4">
        <IconRow icon={a} count={Number(b)} />
        <span className="text-4xl font-bold text-neutral-500" aria-hidden>+</span>
        <IconRow icon={a} count={Number(c)} />
      </figure>
    );
  }

  if (kind === 'sub') {
    const total = Number(b);
    const gone = Number(c);
    return (
      <figure className="mb-2">
        <IconRow icon={a} count={total} fadedFrom={total - gone} />
        <figcaption className="mt-2 text-sm font-medium text-neutral-500">The crossed pictures are taken away.</figcaption>
      </figure>
    );
  }

  if (kind === 'compare') {
    return (
      <figure className="mb-2 flex flex-wrap items-end justify-center gap-8">
        <Group label="Group A" icon={a} count={Number(b)} />
        <Group label="Group B" icon={a} count={Number(c)} />
      </figure>
    );
  }

  if (kind === 'ten') {
    const ones = Number(b);
    return (
      <figure className="mb-2 flex flex-wrap items-center justify-center gap-6">
        <div>
          <TenFrame filled={10} />
          <figcaption className="mt-2 text-sm font-semibold text-neutral-600">1 ten</figcaption>
        </div>
        <div>
          <IconRow icon="block" count={ones} />
          <figcaption className="mt-2 text-sm font-semibold text-neutral-600">{ones} ones</figcaption>
        </div>
      </figure>
    );
  }

  if (kind === 'next') {
    const nums = [a, b, c];
    return (
      <figure className="mb-2 flex items-center justify-center gap-3">
        {nums.map((n) => (
          <NumberCard key={n} value={n} />
        ))}
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-400 text-2xl text-neutral-400">?</span>
      </figure>
    );
  }

  if (kind === 'pattern') {
    const shapes = a.split(',');
    return (
      <figure className="mb-2 flex flex-wrap items-center justify-center gap-3">
        {shapes.map((shape, index) => (
          <ShapeGlyph key={`${shape}-${index}`} kind={shape} />
        ))}
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-400 text-2xl text-neutral-400">?</span>
      </figure>
    );
  }

  if (kind === 'length') {
    return (
      <figure className="mb-2 flex flex-col items-center gap-4">
        <Group label="Row A" icon="block" count={Number(a) || 3} />
        <Group label="Row B" icon="block" count={Number(b) || 6} />
      </figure>
    );
  }

  if (kind === 'cards') {
    const nums = [a, b, c].filter(Boolean);
    return (
      <figure className="mb-2 flex items-center justify-center gap-3">
        {nums.map((n) => (
          <NumberCard key={n} value={n} />
        ))}
      </figure>
    );
  }

  if (kind === 'tens') {
    const tens = Number(a);
    const ones = Number(b);
    return (
      <figure className="mb-2 flex flex-wrap items-end justify-center gap-6">
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: tens }, (_, index) => (
              <TenBar key={index} />
            ))}
          </div>
          <figcaption className="mt-2 text-sm font-semibold text-neutral-600">{tens} tens</figcaption>
        </div>
        <div>
          <IconRow icon="block" count={ones} />
          <figcaption className="mt-2 text-sm font-semibold text-neutral-600">{ones} ones</figcaption>
        </div>
      </figure>
    );
  }

  if (kind === 'clock') {
    return (
      <figure className="mb-2">
        <Clock hour={Number(a)} minute={Number(b)} />
      </figure>
    );
  }

  if (kind === 'size') {
    return (
      <figure className="mb-2 flex items-end justify-center gap-10">
        <div className="text-center">
          <KinderIcon name="ball" size={42} />
          <figcaption className="mt-2 text-sm font-semibold">Ball A</figcaption>
        </div>
        <div className="text-center">
          <KinderIcon name="ball" size={84} />
          <figcaption className="mt-2 text-sm font-semibold">Ball B</figcaption>
        </div>
      </figure>
    );
  }

  if (kind === 'ref') {
    return (
      <figure className="mb-2 flex flex-col items-center">
        <KinderIcon name={a} size={96} />
        <figcaption className="mt-1 text-base font-semibold capitalize text-neutral-700">{a}</figcaption>
      </figure>
    );
  }

  if (kind === 'after') {
    return (
      <figure className="mb-2 flex items-center justify-center gap-3">
        <LetterCard letter={a} />
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-400 text-2xl text-neutral-400">?</span>
      </figure>
    );
  }

  if (kind === 'story') return <Story id={a} />;

  return null;
}

function Story({ id }: { id: string }) {
  if (id === 'rain') {
    return (
      <figure className="mb-2" aria-label="A rain cloud">
        <svg width="180" height="110" viewBox="0 0 180 110">
          <ellipse cx="90" cy="42" rx="48" ry="26" fill="#D7E4F5" stroke="#1a1a1a" strokeWidth="3" />
          <ellipse cx="62" cy="48" rx="28" ry="20" fill="#D7E4F5" stroke="#1a1a1a" strokeWidth="3" />
          <ellipse cx="118" cy="50" rx="30" ry="20" fill="#D7E4F5" stroke="#1a1a1a" strokeWidth="3" />
          <path d="M55 78 l8 18 M90 78 l8 18 M125 78 l8 18" stroke="#2F80ED" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </figure>
    );
  }
  if (id === 'bird') {
    return (
      <figure className="mb-2 flex items-end justify-center gap-2" aria-label="A bird sitting in a tree">
        <KinderIcon name="tree" size={110} />
        <span className="-ml-16 mb-14"><KinderIcon name="bird" size={48} /></span>
      </figure>
    );
  }
  if (id === 'seed') {
    return (
      <figure className="mb-2" aria-label="A seed in the soil">
        <svg width="140" height="100" viewBox="0 0 140 100">
          <rect x="10" y="62" width="120" height="28" rx="8" fill="#8B5A2B" stroke="#1a1a1a" strokeWidth="3" />
          <ellipse cx="70" cy="58" rx="12" ry="16" fill="#C47A32" stroke="#1a1a1a" strokeWidth="3" />
        </svg>
      </figure>
    );
  }
  return (
    <figure className="mb-2" aria-label="Boots splashing in a puddle">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <ellipse cx="80" cy="78" rx="58" ry="14" fill="#7EB6E8" stroke="#1a1a1a" strokeWidth="3" />
        <path d="M48 70 v-28 h18 v10 h16 v18 z" fill="#3D7EE8" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
        <path d="M96 70 v-28 h18 v10 h16 v18 z" fill="#3D7EE8" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    </figure>
  );
}

function Group({ label, icon, count }: { label: string; icon: string; count: number }) {
  return (
    <div className="text-center">
      <IconRow icon={icon} count={count} />
      <div className="mt-2 text-sm font-bold text-neutral-700">{label}</div>
    </div>
  );
}

function IconRow({ icon, count, fadedFrom }: { icon: string; count: number; fadedFrom?: number }) {
  const size = count > 8 ? 36 : count > 5 ? 48 : 58;
  return (
    <div className="flex max-w-md flex-wrap justify-center gap-2">
      {Array.from({ length: count }, (_, index) => {
        const faded = fadedFrom != null && index >= fadedFrom;
        return (
          <span key={index} className={`relative ${faded ? 'opacity-40' : ''}`}>
            <KinderIcon name={icon} size={size} />
            {faded && (
              <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-red-600" aria-hidden>×</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function TenFrame({ filled }: { filled: number }) {
  return (
    <div className="grid grid-cols-5 gap-1 rounded-xl border-2 border-neutral-900 bg-white p-2" aria-label="Ten frame">
      {Array.from({ length: 10 }, (_, index) => (
        <span
          key={index}
          className={`h-7 w-7 rounded-full border-2 border-neutral-800 ${index < filled ? 'bg-[#F25C2A]' : 'bg-white'}`}
        />
      ))}
    </div>
  );
}

function TenBar() {
  return (
    <svg width="26" height="78" viewBox="0 0 26 78" aria-label="one ten">
      {Array.from({ length: 10 }, (_, index) => (
        <rect key={index} x="2" y={2 + index * 7.6} width="22" height="6" rx="1" fill="#3D7EE8" stroke="#1a1a1a" strokeWidth="1" />
      ))}
    </svg>
  );
}

function Clock({ hour, minute }: { hour: number; minute: number }) {
  const hand = (angle: number, length: number) => {
    const r = (angle * Math.PI) / 180;
    return [60 + length * Math.cos(r), 60 + length * Math.sin(r)];
  };
  const minuteAngle = (minute / 60) * 360 - 90;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30 - 90;
  const [mx, my] = hand(minuteAngle, 34);
  const [hx, hy] = hand(hourAngle, 22);
  return (
    <svg width="150" height="150" viewBox="0 0 120 120" aria-label="clock">
      <circle cx="60" cy="60" r="50" fill="#fff" stroke="#1a1a1a" strokeWidth="4" />
      <circle cx="60" cy="14" r="2" fill="#1a1a1a" />
      <circle cx="60" cy="106" r="2" fill="#1a1a1a" />
      <circle cx="14" cy="60" r="2" fill="#1a1a1a" />
      <circle cx="106" cy="60" r="2" fill="#1a1a1a" />
      <line x1="60" y1="60" x2={hx} y2={hy} stroke="#1a1a1a" strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="60" x2={mx} y2={my} stroke="#2F80ED" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="60" r="3.5" fill="#E23B3B" />
    </svg>
  );
}

function NumberCard({ value }: { value: string }) {
  return (
    <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-800 text-3xl font-bold text-white">
      {value}
    </span>
  );
}

function LetterCard({ letter }: { letter: string }) {
  return (
    <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-neutral-800 bg-white text-4xl font-bold text-neutral-900">
      {letter}
    </span>
  );
}

function ShapeGlyph({ kind }: { kind: string }) {
  const stroke = '#1a1a1a';
  if (kind === 'circle') {
    return (
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label="circle">
        <circle cx="36" cy="36" r="24" fill="#2F80ED" stroke={stroke} strokeWidth="3" />
      </svg>
    );
  }
  if (kind === 'triangle') {
    return (
      <svg width="72" height="72" viewBox="0 0 72 72" aria-label="triangle">
        <polygon points="36,10 66,62 6,62" fill="#F25C2A" stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'rectangle') {
    return (
      <svg width="84" height="72" viewBox="0 0 84 72" aria-label="rectangle">
        <rect x="8" y="20" width="68" height="34" fill="#ffffff" stroke={stroke} strokeWidth="3" />
      </svg>
    );
  }
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" aria-label="square">
      <rect x="14" y="14" width="44" height="44" fill="#7FB509" stroke={stroke} strokeWidth="3" />
    </svg>
  );
}

export function KinderIcon({ name, size = 64 }: { name: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label={name} role="img">
      <IconShape name={name} />
    </svg>
  );
}

function IconShape({ name }: { name: string }) {
  const ink = '#1a1a1a';
  switch (name) {
    case 'apple':
      return (
        <>
          <circle cx="32" cy="36" r="18" fill="#E23B3B" stroke={ink} strokeWidth="3" />
          <path d="M32 18 v8" stroke="#6B3F1D" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="40" cy="16" rx="7" ry="4" fill="#7FB509" stroke={ink} strokeWidth="2" />
        </>
      );
    case 'star':
      return <polygon points="32,6 39,24 58,24 43,36 49,54 32,43 15,54 21,36 6,24 25,24" fill="#F6C445" stroke={ink} strokeWidth="3" strokeLinejoin="round" />;
    case 'duck':
      return (
        <>
          <ellipse cx="30" cy="40" rx="18" ry="12" fill="#F6C445" stroke={ink} strokeWidth="3" />
          <circle cx="44" cy="30" r="10" fill="#F6C445" stroke={ink} strokeWidth="3" />
          <polygon points="52,28 62,32 52,36" fill="#F25C2A" stroke={ink} strokeWidth="2" />
          <circle cx="47" cy="28" r="1.5" fill={ink} />
        </>
      );
    case 'ball':
      return (
        <>
          <circle cx="32" cy="32" r="20" fill="#F25C2A" stroke={ink} strokeWidth="3" />
          <path d="M16 26 h32 M18 40 h28" stroke="#fff" strokeWidth="3" />
        </>
      );
    case 'block':
      return <rect x="12" y="16" width="40" height="34" rx="6" fill="#3D7EE8" stroke={ink} strokeWidth="3" />;
    case 'bird':
      return (
        <>
          <ellipse cx="34" cy="36" rx="16" ry="12" fill="#2F80ED" stroke={ink} strokeWidth="3" />
          <polygon points="48,34 60,38 48,42" fill="#F6C445" stroke={ink} strokeWidth="2" />
          <circle cx="40" cy="34" r="1.6" fill={ink} />
        </>
      );
    case 'cat':
      return (
        <>
          <circle cx="32" cy="36" r="16" fill="#F4A259" stroke={ink} strokeWidth="3" />
          <polygon points="18,28 14,12 28,22" fill="#F4A259" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          <polygon points="46,28 50,12 36,22" fill="#F4A259" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="26" cy="36" r="1.6" fill={ink} />
          <circle cx="38" cy="36" r="1.6" fill={ink} />
        </>
      );
    case 'hat':
      return (
        <>
          <rect x="22" y="16" width="20" height="18" rx="4" fill="#7B3FE4" stroke={ink} strokeWidth="3" />
          <rect x="12" y="32" width="40" height="8" rx="3" fill="#7B3FE4" stroke={ink} strokeWidth="3" />
        </>
      );
    case 'sun':
      return (
        <>
          <circle cx="32" cy="32" r="12" fill="#F6C445" stroke={ink} strokeWidth="3" />
          <path d="M32 6 v8 M32 50 v8 M6 32 h8 M50 32 h8 M13 13 l6 6 M45 45 l6 6 M51 13 l-6 6 M19 45 l-6 6" stroke="#F6C445" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case 'dog':
      return (
        <>
          <circle cx="32" cy="36" r="15" fill="#C47A32" stroke={ink} strokeWidth="3" />
          <ellipse cx="16" cy="32" rx="7" ry="12" fill="#C47A32" stroke={ink} strokeWidth="3" />
          <ellipse cx="48" cy="32" rx="7" ry="12" fill="#C47A32" stroke={ink} strokeWidth="3" />
          <circle cx="26" cy="34" r="1.6" fill={ink} />
          <circle cx="38" cy="34" r="1.6" fill={ink} />
        </>
      );
    case 'fish':
      return (
        <>
          <ellipse cx="34" cy="32" rx="16" ry="11" fill="#2F80ED" stroke={ink} strokeWidth="3" />
          <polygon points="14,32 4,22 4,42" fill="#2F80ED" stroke={ink} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="42" cy="30" r="1.6" fill={ink} />
        </>
      );
    case 'moon':
      return <path d="M36 8 a20 20 0 1 0 0 48 a14 14 0 1 1 0-48z" fill="#F6C445" stroke={ink} strokeWidth="3" />;
    case 'tree':
      return (
        <>
          <rect x="28" y="36" width="8" height="18" fill="#8B5A2B" stroke={ink} strokeWidth="2" />
          <circle cx="32" cy="28" r="16" fill="#7FB509" stroke={ink} strokeWidth="3" />
        </>
      );
    case 'cup':
      return <path d="M16 16 h28 l-4 32 h-20 z" fill="#F4F1EA" stroke={ink} strokeWidth="3" strokeLinejoin="round" />;
    case 'umbrella':
      return (
        <>
          <path d="M8 34 a24 24 0 0 1 48 0 z" fill="#E23B3B" stroke={ink} strokeWidth="3" />
          <path d="M32 34 v16" stroke={ink} strokeWidth="3" />
          <path d="M32 50 a6 6 0 0 0 10 0" fill="none" stroke={ink} strokeWidth="3" />
        </>
      );
    case 'book':
      return (
        <>
          <path d="M10 14 h20 v36 h-20 z" fill="#3D7EE8" stroke={ink} strokeWidth="3" />
          <path d="M34 14 h20 v36 h-20 z" fill="#7FB509" stroke={ink} strokeWidth="3" />
        </>
      );
    case 'rabbit':
      return (
        <>
          <ellipse cx="24" cy="18" rx="5" ry="12" fill="#F4F1EA" stroke={ink} strokeWidth="3" />
          <ellipse cx="40" cy="18" rx="5" ry="12" fill="#F4F1EA" stroke={ink} strokeWidth="3" />
          <circle cx="32" cy="40" r="14" fill="#F4F1EA" stroke={ink} strokeWidth="3" />
          <circle cx="27" cy="38" r="1.5" fill={ink} />
          <circle cx="37" cy="38" r="1.5" fill={ink} />
        </>
      );
    case 'chair':
      return (
        <>
          <rect x="16" y="16" width="32" height="22" rx="3" fill="#C47A32" stroke={ink} strokeWidth="3" />
          <path d="M20 38 v12 M44 38 v12 M18 28 h28" stroke={ink} strokeWidth="3" />
        </>
      );
    case 'bee':
      return (
        <>
          <ellipse cx="32" cy="36" rx="14" ry="10" fill="#F6C445" stroke={ink} strokeWidth="3" />
          <path d="M26 28 v16 M32 26 v20 M38 28 v16" stroke={ink} strokeWidth="2" />
          <ellipse cx="22" cy="24" rx="8" ry="5" fill="#D7E4F5" stroke={ink} strokeWidth="2" />
          <ellipse cx="42" cy="24" rx="8" ry="5" fill="#D7E4F5" stroke={ink} strokeWidth="2" />
        </>
      );
    case 'bed':
      return (
        <>
          <rect x="8" y="28" width="48" height="16" rx="3" fill="#7EB6E8" stroke={ink} strokeWidth="3" />
          <rect x="12" y="20" width="14" height="10" rx="2" fill="#fff" stroke={ink} strokeWidth="2" />
        </>
      );
    case 'sock':
      return <path d="M24 8 h16 v28 l12 10 a10 10 0 0 1-14 8 l-14-12 z" fill="#E23B3B" stroke={ink} strokeWidth="3" strokeLinejoin="round" />;
    case 'seed':
      return <ellipse cx="32" cy="34" rx="12" ry="16" fill="#C47A32" stroke={ink} strokeWidth="3" />;
    case 'sprout':
      return (
        <>
          <path d="M32 58 v-24" stroke="#7FB509" strokeWidth="3" />
          <ellipse cx="24" cy="28" rx="10" ry="6" fill="#7FB509" stroke={ink} strokeWidth="2" />
          <ellipse cx="40" cy="24" rx="10" ry="6" fill="#7FB509" stroke={ink} strokeWidth="2" />
        </>
      );
    case 'boot':
      return <path d="M18 8 h18 v28 h16 v12 h-40 z" fill="#3D7EE8" stroke={ink} strokeWidth="3" strokeLinejoin="round" />;
    default:
      return <circle cx="32" cy="32" r="16" fill="#D7E4F5" stroke={ink} strokeWidth="3" />;
  }
}
