/**
 * Turns plain-text math from the Word question banks into KaTeX HTML.
 * Word problems / prose stay as normal text; only real expressions go through KaTeX.
 * Rich HTML passages (ELA) are left as HTML.
 */
import katexImport from 'katex';

const katex: typeof katexImport =
  typeof (katexImport as { renderToString?: unknown }).renderToString === 'function'
    ? katexImport
    : ((katexImport as unknown as { default: typeof katexImport }).default ?? katexImport);

const HAS_FRACTION =
  /\d\s+\d\s*\/\s*\d|\(\s*-?\d+\s*\/\s*-?\d+\s*\)|(?:^|[\s([])-?\d+\s*\/\s*-?\d+(?=[\s)\],.?!;:]|$)|\[[^\]]*\]\s*\/\s*\[/;
const HAS_EXPONENT = /\^/;
const HAS_ROOT = /√|sqrt\s*\(/i;
const HAS_TIMES_OP = /\)\s*[xX]\s*\(|(?<=\d|\))\s+[xX]\s+(?=\d|\()/;

const RICH_HTML_RE =
  /<\s*\/?\s*(?:p|div|span|br|em|strong|b|i|u|blockquote|h[1-6]|ul|ol|li|table|tr|td|th|sup|sub|hr)\b/i;

/** Labels that introduce a pure math expression after the colon. */
const LABEL_RE =
  /^((?:Evaluate|Simplify|Solve|Factor|Calculate|Compute|Expand|Reduce|Convert)[^:\n]{0,80}:\s*)([\s\S]+)$/i;

const PROSE_START =
  /^(What|Which|Who|Where|When|How|Why|Whose|Whom|Is |Are |Do |Does |Did |Can |Could |Would |Should |A |An |The |If |Given |Read |True or False|Select |Choose |Identify |Describe |Explain |According|Look |Use |Write a|Find the|Find how|Determine the|Name |Circle |Match )/i;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function looksLikeRichHtml(text: string): boolean {
  return RICH_HTML_RE.test(text) || /<blockquote\b/i.test(text);
}

/** True for word problems / sentences — must NOT send whole string to KaTeX. */
function isMostlyProse(text: string): boolean {
  const trimmed = text.trim();
  if (PROSE_START.test(trimmed)) return true;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const letters = (trimmed.match(/[A-Za-z]/g) || []).length;
  // Several real words → prose (e.g. diameter / circumference questions)
  if (words.length >= 5 && letters >= 18) return true;
  // Ends with ? and has letters → question sentence
  if (/\?\s*$/.test(trimmed) && letters >= 12) return true;
  return false;
}

/** Short answer choices / pure expressions. */
function isPureMathExpression(text: string): boolean {
  const t = text.trim();
  if (!t || isMostlyProse(t)) return false;
  if (/^-?\d+(\.\d+)?$/.test(t)) return false; // plain number — leave as text
  if (/^-?\d+\s*\/\s*\d+$/.test(t)) return true;
  if (/^-?\d+\s+\d+\/\d+$/.test(t)) return true;
  if (HAS_EXPONENT.test(t) || HAS_FRACTION.test(t) || HAS_ROOT.test(t) || HAS_TIMES_OP.test(t)) {
    // Few letters relative to symbols/digits
    const letters = (t.match(/[A-Za-z]/g) || []).length;
    const words = t.split(/\s+/).filter((w) => /[A-Za-z]{3,}/.test(w));
    return words.length <= 2 && letters < 24;
  }
  // Algebraic: 8x + 3, x = 12, etc.
  if (/^[\d\s+\-*/^()\\.=<>≤≥≠xXyYzZa-zπ]+$/.test(t) && /[=+\-*/^]/.test(t) && t.length < 60) {
    const words = t.split(/\s+/).filter((w) => /^[A-Za-z]{4,}$/.test(w));
    return words.length === 0;
  }
  return false;
}

function enhancePassageHtml(html: string): string {
  let out = html;
  out = out.replace(/<blockquote(\s[^>]*)?>/gi, '<blockquote class="quiz-passage"$1>');
  out = out.replace(/<h2>([\s\S]*?)<h2>/gi, '<h2>$1</h2>');
  return `<div class="quiz-question-html">${out}</div>`;
}

export function plainMathToLatex(input: string): string {
  let s = input.trim();

  s = s.replace(/×/g, ' \\times ');
  s = s.replace(/÷/g, ' \\div ');
  s = s.replace(/·/g, ' \\cdot ');
  s = s.replace(/≤/g, ' \\leq ');
  s = s.replace(/≥/g, ' \\geq ');
  s = s.replace(/≠/g, ' \\neq ');
  s = s.replace(/\bpi\b/gi, '\\pi');
  s = s.replace(/π/g, '\\pi');

  s = s.replace(/\)\s*[xX]\s*\(/g, ') \\times (');
  s = s.replace(/\)\s*[xX]\s+(?=\d|\{)/g, ') \\times ');
  s = s.replace(/(?<=\d|\})\s+[xX]\s+(?=\d|\(|\{)/g, ' \\times ');
  s = s.replace(/\s+[xX]\s+/g, ' \\times ');

  const curls: string[] = [];
  s = s.replace(/\{([^{}]*)\}/g, (_m, inner) => {
    curls.push(inner);
    return `<<CURL${curls.length - 1}>>`;
  });

  s = s.replace(
    /(^|[^0-9.\\])(-?\d+)\s+(\d+)\s*\/\s*(\d+)(?![0-9])/g,
    (_, pre, whole, num, den) => `${pre}${whole}\\tfrac{${num}}{${den}}`
  );

  s = s.replace(
    /\(\s*(-?)(\d+)\s*\/\s*(-?)(\d+)\s*\)/g,
    (_m, s1, a, s2, b) => `\\left(${s1}\\frac{${a}}{${s2}${b}}\\right)`
  );

  s = s.replace(
    /(?<!\\(?:t)?frac\{[^}]{0,40})(?<![\w}])(-?\d+)\s*\/\s*(-?\d+)(?![0-9])/g,
    (_, a, b) => `\\frac{${a}}{${b}}`
  );

  s = s.replace(/\^\((-?\d+)\)/g, '^{($1)}');
  s = s.replace(/\^(-?\d+)/g, '^{$1}');
  s = s.replace(/\^([A-Za-z])/g, '^{$1}');

  s = s.replace(/sqrt\(([^)]+)\)/gi, (_m, inner) => `\\sqrt{${inner}}`);
  s = s.replace(/√\s*\(([^)]+)\)/g, (_m, inner) => `\\sqrt{${inner}}`);
  s = s.replace(/√\s*([0-9A-Za-z]+)/g, (_m, inner) => `\\sqrt{${inner}}`);

  s = s.replace(
    /\[\s*([^\]]+?)\s*\]\s*\/\s*\[\s*([^\]]+?)\s*\]/g,
    (_m, num, den) => `\\dfrac{${num.trim()}}{${den.trim()}}`
  );

  s = s.replace(/\[/g, '\\left[').replace(/\]/g, '\\right]');
  s = s.replace(/<<CURL(\d+)>>/g, (_m, i) => `\\left\\{${curls[Number(i)]}\\right\\}`);

  return s.replace(/\s+/g, ' ').trim();
}

function renderLatex(latex: string, displayMode = false): string {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      strict: 'ignore',
      output: 'html',
      trust: false,
    });
  } catch {
    return `<span class="math-fallback">${escapeHtml(latex)}</span>`;
  }
}

/** Upgrade only math islands inside a prose sentence. */
function formatProseWithMathIslands(text: string): string {
  const island =
    /(\(?-?\d+\s+\d+\/\d+\)?(?:\^\d+)?|\(?-?\d+\/-?\d+\)?(?:\^\d+)?|-?\d+\^\d+|\[\s*[^\]]+\]\s*\/\s*\[[^\]]+\]|(?:π|pi)\s*=\s*-?\d+(?:\.\d+)?|-?\d+\s*\/\s*-?\d+(?![0-9]))/gi;

  let out = '';
  let last = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(island.source, 'gi');
  while ((match = re.exec(text)) !== null) {
    out += escapeHtml(text.slice(last, match.index));
    out += renderLatex(plainMathToLatex(match[0]), false);
    last = match.index + match[0].length;
  }
  out += escapeHtml(text.slice(last));
  return out.replace(/\n/g, '<br/>');
}

/**
 * Format bank question/option text for display.
 */
export function formatMathHtml(raw: string | null | undefined): string {
  if (!raw) return '';
  const text = String(raw);
  if (text.startsWith('http://') || text.startsWith('https://')) return escapeHtml(text);

  if (looksLikeRichHtml(text)) {
    return enhancePassageHtml(text);
  }

  // "Evaluate: <expression>" → label + KaTeX expression only
  const labelMatch = text.match(LABEL_RE);
  if (labelMatch) {
    const [, label, mathPart] = labelMatch;
    if (isPureMathExpression(mathPart) || HAS_FRACTION.test(mathPart) || HAS_EXPONENT.test(mathPart) || /[0-9(]/.test(mathPart)) {
      const display =
        mathPart.length > 40 ||
        HAS_FRACTION.test(mathPart) ||
        /\[\s*.+\]\s*\//.test(mathPart) ||
        /\{/.test(mathPart);
      return `${escapeHtml(label.trim())} ${renderLatex(plainMathToLatex(mathPart), display)}`;
    }
  }

  // Word problems — never KaTeX the whole sentence (that removes spaces)
  if (isMostlyProse(text)) {
    return formatProseWithMathIslands(text);
  }

  // Short options / pure expressions
  if (isPureMathExpression(text)) {
    const display = text.length > 48 || /\[\s*.+\s*\]\s*\//.test(text) || /\{/.test(text);
    return renderLatex(plainMathToLatex(text), display);
  }

  // Fallback: prose-safe with optional islands
  if (HAS_FRACTION.test(text) || HAS_EXPONENT.test(text) || HAS_ROOT.test(text)) {
    return formatProseWithMathIslands(text);
  }

  return escapeHtml(text).replace(/\n/g, '<br/>');
}
