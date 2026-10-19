/**
 * Diagrams for a small set of Grade 1 questions.
 * A picture is included only when the drawing matches the wording
 * and does not print the answer.
 */
import type { ReactNode } from 'react';
import ClockDiagram from '@/app/components/ClockDiagram';

type ShapeName =
  | 'triangle'
  | 'square'
  | 'rectangle'
  | 'circle'
  | 'pentagon'
  | 'hexagon'
  | 'octagon';

export type DiagramSpec =
  | { type: 'clock'; hour: number; minute: number; caption: string }
  | { type: 'shapes'; shapes: { shape: ShapeName; label: string }[]; caption?: string }
  | { type: 'lengths'; items: { label: string; amount: number; unit: string }[]; caption: string }
  | { type: 'ruler'; from: number; to: number; caption: string }
  | { type: 'bars'; items: { label: string; value: number }[]; caption: string }
  | { type: 'tally'; count: number; caption: string };

const READ = 'Read the clock';
const NOW = 'The clock right now';

const DIAGRAMS: Record<string, DiagramSpec> = {
  // Clocks whose hands are stated in the question
  'math-1-measurement-data-easy-1': { type: 'clock', hour: 3, minute: 0, caption: READ },
  'math-1-measurement-data-easy-5': { type: 'clock', hour: 8, minute: 0, caption: READ },
  'math-1-measurement-data-easy-14': { type: 'clock', hour: 12, minute: 0, caption: READ },
  'math-1-measurement-data-easy-30': { type: 'clock', hour: 11, minute: 0, caption: READ },
  'math-1-measurement-data-easy-45': { type: 'clock', hour: 6, minute: 0, caption: READ },
  'math-1-measurement-data-easy-50': { type: 'clock', hour: 1, minute: 0, caption: READ },
  'math-1-measurement-data-medium-51': { type: 'clock', hour: 4, minute: 30, caption: READ },
  'math-1-measurement-data-medium-59': { type: 'clock', hour: 8, minute: 30, caption: READ },
  'math-1-measurement-data-medium-70': { type: 'clock', hour: 11, minute: 30, caption: READ },
  'math-1-measurement-data-medium-82': { type: 'clock', hour: 12, minute: 30, caption: READ },
  'math-1-measurement-data-medium-89': { type: 'clock', hour: 2, minute: 30, caption: READ },
  'math-1-measurement-data-hard-120': { type: 'clock', hour: 6, minute: 30, caption: NOW },
  'math-1-measurement-data-hard-135': { type: 'clock', hour: 10, minute: 30, caption: NOW },
  'math-1-measurement-data-hard-142': { type: 'clock', hour: 5, minute: 30, caption: READ },

  // Named shapes where the question asks for a count, not the shape's name
  'math-1-geometry-easy-2': { type: 'shapes', shapes: [{ shape: 'rectangle', label: 'Rectangle' }] },
  'math-1-geometry-easy-6': { type: 'shapes', shapes: [{ shape: 'triangle', label: 'Triangle' }] },
  'math-1-geometry-easy-10': { type: 'shapes', shapes: [{ shape: 'hexagon', label: 'Hexagon' }] },
  'math-1-geometry-easy-13': { type: 'shapes', shapes: [{ shape: 'circle', label: 'Circle' }] },
  'math-1-geometry-easy-29': { type: 'shapes', shapes: [{ shape: 'square', label: 'Square' }] },
  'math-1-geometry-medium-75': { type: 'shapes', shapes: [{ shape: 'hexagon', label: 'Hexagon' }] },
  'math-1-geometry-medium-79': { type: 'shapes', shapes: [{ shape: 'pentagon', label: 'Pentagon' }] },
  'math-1-geometry-medium-88': {
    type: 'shapes',
    shapes: [
      { shape: 'square', label: 'Square' },
      { shape: 'square', label: 'Square' },
      { shape: 'square', label: 'Square' },
    ],
  },
  'math-1-geometry-medium-98': { type: 'shapes', shapes: [{ shape: 'pentagon', label: 'Pentagon' }] },
  'math-1-geometry-hard-114': {
    type: 'shapes',
    shapes: [
      { shape: 'pentagon', label: 'Pentagon' },
      { shape: 'hexagon', label: 'Hexagon' },
    ],
  },
  'math-1-geometry-hard-127': {
    type: 'shapes',
    shapes: [
      { shape: 'hexagon', label: 'Hexagon' },
      { shape: 'hexagon', label: 'Hexagon' },
    ],
  },
  'math-1-geometry-hard-132': {
    type: 'shapes',
    shapes: [
      { shape: 'octagon', label: 'Octagon' },
      { shape: 'pentagon', label: 'Pentagon' },
    ],
  },

  // Lengths given in the question. The result is not labeled.
  'math-1-measurement-data-easy-18': {
    type: 'lengths',
    caption: 'The objects',
    items: [
      { label: 'Crayon', amount: 3, unit: 'paperclips' },
      { label: 'Eraser', amount: 1, unit: 'paperclip' },
    ],
  },
  'math-1-measurement-data-easy-39': {
    type: 'lengths',
    caption: 'The objects',
    items: [
      { label: 'Straw', amount: 9, unit: 'cm' },
      { label: 'Toothpick', amount: 4, unit: 'cm' },
    ],
  },
  'math-1-measurement-data-medium-52': {
    type: 'lengths',
    caption: 'The objects',
    items: [
      { label: 'Bookmark', amount: 6, unit: 'paperclips' },
      { label: 'Eraser', amount: 2, unit: 'paperclips' },
    ],
  },
  'math-1-measurement-data-medium-68': {
    type: 'lengths',
    caption: 'The string and the piece cut off',
    items: [
      { label: 'Whole string', amount: 14, unit: 'inches' },
      { label: 'Piece cut off', amount: 6, unit: 'inches' },
    ],
  },
  'math-1-measurement-data-hard-108': {
    type: 'lengths',
    caption: 'The yarn',
    items: [
      { label: 'Green', amount: 16, unit: 'inches' },
      { label: 'Purple', amount: 9, unit: 'inches' },
    ],
  },
  'math-1-measurement-data-hard-148': {
    type: 'lengths',
    caption: 'The flowers',
    items: [
      { label: 'Sunflower', amount: 14, unit: 'inches' },
      { label: 'Tulip', amount: 6, unit: 'inches' },
    ],
  },

  // The paperclip starts at 2 inches and ends at 6. The length is not labeled.
  'math-1-measurement-data-hard-134': {
    type: 'ruler',
    from: 2,
    to: 6,
    caption: 'The paperclip on the ruler',
  },

  // Bar graphs whose numbers are already in the question
  'math-1-measurement-data-medium-61': {
    type: 'bars',
    caption: 'Favorite pets',
    items: [
      { label: 'Cats', value: 4 },
      { label: 'Dogs', value: 7 },
      { label: 'Birds', value: 2 },
    ],
  },
  'math-1-measurement-data-medium-97': {
    type: 'bars',
    caption: 'Apples',
    items: [
      { label: 'Red', value: 5 },
      { label: 'Yellow', value: 3 },
      { label: 'Green', value: 6 },
    ],
  },

  // Four tally marks, matching the written marks
  'math-1-measurement-data-easy-22': { type: 'tally', count: 4, caption: 'The tally marks' },
};

export function diagramForQuestion(question: { id?: string } | null | undefined): DiagramSpec | null {
  if (!question?.id) return null;
  return DIAGRAMS[question.id] ?? null;
}

function polygonPoints(sides: number, cx: number, cy: number, r: number) {
  return Array.from({ length: sides }, (_, i) => {
    const rad = ((i / sides) * Math.PI * 2) - Math.PI / 2;
    return `${cx + Math.cos(rad) * r},${cy + Math.sin(rad) * r}`;
  }).join(' ');
}

function ShapeGlyph({ shape }: { shape: ShapeName }) {
  const common = { fill: '#f7fde8', stroke: '#7FB509', strokeWidth: 4, strokeLinejoin: 'round' as const };
  if (shape === 'circle') return <circle cx="60" cy="60" r="42" {...common} />;
  if (shape === 'square') return <rect x="18" y="18" width="84" height="84" rx="4" {...common} />;
  if (shape === 'rectangle') return <rect x="10" y="32" width="100" height="56" rx="4" {...common} />;
  const sides = shape === 'triangle' ? 3 : shape === 'pentagon' ? 5 : shape === 'hexagon' ? 6 : 8;
  return <polygon points={polygonPoints(sides, 60, 62, 46)} {...common} />;
}

function Frame({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <figure className="mb-6 flex flex-col items-center">
      <div className="rounded-3xl border border-[#7FB509]/20 bg-[#f7fde8] px-5 py-4">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function LengthBars({ items, caption }: { items: { label: string; amount: number; unit: string }[]; caption: string }) {
  const max = Math.max(...items.map((item) => item.amount));
  return (
    <Frame caption={caption}>
      <div className="w-64 space-y-3 sm:w-80">
        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-1 flex justify-between text-xs font-semibold text-neutral-600">
              <span>{item.label}</span>
              <span>{item.amount} {item.unit}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-[#7FB509]"
                style={{ width: `${(item.amount / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function BarGraph({ items, caption }: { items: { label: string; value: number }[]; caption: string }) {
  const max = Math.max(...items.map((item) => item.value));
  return (
    <Frame caption={caption}>
      <div className="flex h-36 items-end gap-4">
        {items.map((item) => (
          <div key={item.label} className="flex w-14 flex-col items-center">
            <span className="mb-1 text-xs font-bold text-neutral-700">{item.value}</span>
            <div
              className="w-10 rounded-t-lg bg-[#7FB509]"
              style={{ height: `${(item.value / max) * 96}px` }}
            />
            <span className="mt-1 text-center text-[11px] font-semibold text-neutral-600">{item.label}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Ruler({ from, to, caption }: { from: number; to: number; caption: string }) {
  const inches = [0, 1, 2, 3, 4, 5, 6];
  const left = (from / 6) * 100;
  const width = ((to - from) / 6) * 100;
  return (
    <Frame caption={caption}>
      <div className="w-72 sm:w-80">
        <div className="relative mb-2 h-3">
          <div
            className="absolute top-0 h-3 rounded-full bg-[#7FB509]"
            style={{ left: `${left}%`, width: `${width}%` }}
          />
        </div>
        <div className="relative h-10 rounded-xl border-2 border-[#7FB509] bg-white">
          {inches.map((inch) => (
            <div
              key={inch}
              className="absolute top-0 flex h-full flex-col items-center"
              style={{ left: `${(inch / 6) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <span className="h-4 w-0.5 bg-neutral-800" />
              <span className="mt-0.5 text-[11px] font-bold text-neutral-700">{inch}</span>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function TallyMarks({ count, caption }: { count: number; caption: string }) {
  return (
    <Frame caption={caption}>
      <div className="flex items-end gap-1.5 px-2">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="block h-12 w-1 rounded-full bg-neutral-800" />
        ))}
      </div>
    </Frame>
  );
}

export default function QuestionDiagram({ spec }: { spec: DiagramSpec }) {
  if (spec.type === 'clock') {
    return <ClockDiagram hour={spec.hour} minute={spec.minute} caption={spec.caption} />;
  }
  if (spec.type === 'shapes') {
    return (
      <Frame caption={spec.caption}>
        <div className="flex flex-wrap items-end justify-center gap-4">
          {spec.shapes.map((item, i) => (
            <div key={`${item.shape}-${i}`} className="flex flex-col items-center">
              <svg viewBox="0 0 120 120" className="h-24 w-24">
                <ShapeGlyph shape={item.shape} />
              </svg>
              <span className="text-xs font-semibold text-neutral-600">{item.label}</span>
            </div>
          ))}
        </div>
      </Frame>
    );
  }
  if (spec.type === 'lengths') return <LengthBars items={spec.items} caption={spec.caption} />;
  if (spec.type === 'bars') return <BarGraph items={spec.items} caption={spec.caption} />;
  if (spec.type === 'ruler') return <Ruler from={spec.from} to={spec.to} caption={spec.caption} />;
  return <TallyMarks count={spec.count} caption={spec.caption} />;
}
