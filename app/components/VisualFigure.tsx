'use client';

import { useMemo } from 'react';
import { renderVisual, type VisualSpec } from '@/app/lib/visualAssessment/bootstrap';

/** Renders a visual-assessment SVG/HTML figure inside the quiz chrome. */
export default function VisualFigure({
  visual,
  alt,
  className = '',
  compact = false,
}: {
  visual?: VisualSpec | null;
  alt?: string;
  className?: string;
  compact?: boolean;
}) {
  const html = useMemo(() => renderVisual(visual), [visual]);
  if (!html) return null;

  return (
    <div
      className={`va-figure overflow-hidden ${compact ? 'va-figure-compact' : ''} ${className}`}
      role="img"
      aria-label={alt || 'Picture for this question'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
