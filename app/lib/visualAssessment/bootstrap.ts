/**
 * Side-effect import of the standalone visual-assessment SVG runtime.
 * Safe to call from client components; no-ops on the server until first client render.
 */
'use client';

import './vendor/core.js';
import './vendor/animals.js';
import './vendor/food-nature.js';
import './vendor/objects.js';
import './vendor/people.js';
import './vendor/visuals-core.js';
import './vendor/visuals-math.js';
import './vendor/visuals-scenes.js';

export type VisualSpec = {
  type: string;
  [key: string]: unknown;
};

type VaRuntime = {
  visuals?: { render: (v: VisualSpec | null | undefined) => string };
};

function getVa(): VaRuntime {
  return (globalThis as unknown as { VA?: VaRuntime }).VA || {};
}

/** Render a declarative visual spec to an HTML string (SVG / markup). */
export function renderVisual(visual: VisualSpec | null | undefined): string {
  if (!visual || visual.type === 'none') return '';
  const fn = getVa().visuals?.render;
  if (!fn) return '';
  try {
    return fn(visual);
  } catch (err) {
    console.error('visual render failed', visual, err);
    return '';
  }
}
