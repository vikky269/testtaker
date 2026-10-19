'use client';

import { useMemo } from 'react';
import 'katex/dist/katex.min.css';
import { formatMathHtml } from '@/app/utils/formatMathText';

interface MathHtmlProps {
  text: string | null | undefined;
  className?: string;
  as?: 'span' | 'p' | 'div';
}

/** Renders question/option text — KaTeX for equations, HTML for passages. */
export default function MathHtml({ text, className, as = 'span' }: MathHtmlProps) {
  const Tag = as;
  const html = useMemo(() => {
    try {
      return formatMathHtml(text);
    } catch (err) {
      console.error('MathHtml format failed:', err, text);
      return String(text ?? '');
    }
  }, [text]);

  return (
    <Tag
      className={`math-html-content break-words max-w-full overflow-x-auto ${className ?? ''}`}
      data-math-rendered={html.includes('katex') ? '1' : '0'}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
