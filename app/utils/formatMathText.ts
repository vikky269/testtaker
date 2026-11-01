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
  /\d\s+\d\s*\/\s*\d|\(\s*-?\d+\s*\/\s*-?\d+\s*\)|(?:^|[\s([])-?\d+\s*\/\s*-?\d+(?=[\s)\],.?!;:]|$)|\[[^\]]*\]\s*\/\s*\[|(?:^|[^A-Za-z])[A-Za-z]\s*\/\s*-?\d+|-?\d+\s*\/\s*[A-Za-z](?![A-Za-z])|\([^)]{1,80}\)\s*\/\s*(?:\([^)]{1,40}\)|-?\d+|[A-Za-z])/;
const HAS_EXPONENT = /\^/;
const HAS_ROOT = /√|sqrt\s*\(/i;
const HAS_TIMES_OP = /\)\s*[xX]\s*\(|(?<=\d|\))\s+[xX]\s+(?=\d|\()/;

const RICH_HTML_RE =
  /<\s*\/?\s*(?:p|div|span|br|em|strong|b|i|u|blockquote|h[1-6]|ul|ol|li|table|tr|td|th|sup|sub|hr|img)\b/i;

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
  return RICH_HTML_RE.test(text) || /<blockquote\b/i.test(text) || /<img\b/i.test(text);
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
  // Stack slash fractions inside HTML text nodes (e.g. "1/4 pages").
  out = out.replace(/(^|>)([^<]+)/g, (_, edge: string, text: string) => {
    if (!/[\/¼½¾⅓⅔]/.test(text)) return edge + text;
    return edge + formatProseLineWithMathIslands(text);
  });
  return `<div class="quiz-question-html">${out}</div>`;
}

/** Matching '(' index for a ')' at `closeIdx`, or -1. */
function matchingOpenParen(s: string, closeIdx: number): number {
  let depth = 0;
  for (let i = closeIdx; i >= 0; i--) {
    if (s[i] === ')') depth++;
    else if (s[i] === '(') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Matching ')' index for a '(' at `openIdx`, or -1. */
function matchingCloseParen(s: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < s.length; i++) {
    if (s[i] === '(') depth++;
    else if (s[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Convert slash fractions including nested parentheses:
 * (l+g)/2, ((21)(14)x)/((49)(48)), x/2
 */
function convertSlashFractions(s: string): string {
  let out = s;

  // Parenthetical numerators/denominators (handles nesting via scanners).
  for (let guard = 0; guard < 12; guard++) {
    let changed = false;
    for (let i = 0; i < out.length; i++) {
      if (out[i] !== '/') continue;
      // Skip already-converted \frac
      if (out.slice(Math.max(0, i - 5), i).includes('frac')) continue;

      let numStart = -1;
      let numEnd = -1;
      let denStart = -1;
      let denEnd = -1;

      // Numerator: )... group ending just before /
      let j = i - 1;
      while (j >= 0 && /\s/.test(out[j])) j--;
      if (j >= 0 && out[j] === ')') {
        const open = matchingOpenParen(out, j);
        if (open >= 0) {
          numStart = open;
          numEnd = j;
        }
      } else if (j >= 0 && /[A-Za-z0-9.]/.test(out[j])) {
        numEnd = j;
        while (j >= 0 && /[A-Za-z0-9.]/.test(out[j])) j--;
        numStart = j + 1;
        // Don't treat multi-letter words as numerators (and/or).
        const token = out.slice(numStart, numEnd + 1);
        if (/[A-Za-z]{2,}/.test(token) && !/^\d/.test(token)) {
          numStart = -1;
        }
      }

      // Denominator after /
      let k = i + 1;
      while (k < out.length && /\s/.test(out[k])) k++;
      if (k < out.length && out[k] === '(') {
        const close = matchingCloseParen(out, k);
        if (close >= 0) {
          denStart = k;
          denEnd = close;
        }
      } else if (k < out.length && /[A-Za-z0-9.]/.test(out[k])) {
        denStart = k;
        while (k < out.length && /[A-Za-z0-9.]/.test(out[k])) k++;
        denEnd = k - 1;
        const token = out.slice(denStart, denEnd + 1);
        if (/[A-Za-z]{2,}/.test(token) && !/^\d/.test(token)) {
          denStart = -1;
        }
      }

      if (numStart < 0 || denStart < 0) continue;

      let num = out.slice(numStart, numEnd + 1);
      let den = out.slice(denStart, denEnd + 1);
      if (num.startsWith('(') && num.endsWith(')')) num = num.slice(1, -1);
      if (den.startsWith('(') && den.endsWith(')')) den = den.slice(1, -1);

      const replacement = `\\frac{${num}}{${den}}`;
      out = out.slice(0, numStart) + replacement + out.slice(denEnd + 1);
      changed = true;
      break;
    }
    if (!changed) break;
  }

  out = out.replace(
    /(^|[^0-9.\\])(-?\d+)\s+(\d+)\s*\/\s*(\d+)(?![0-9])/g,
    (_, pre, whole, num, den) => `${pre}${whole}\\tfrac{${num}}{${den}}`
  );

  out = out.replace(
    /\(\s*(-?)(\d+)\s*\/\s*(-?)(\d+)\s*\)/g,
    (_m, s1, a, s2, b) => `\\left(${s1}\\frac{${a}}{${s2}${b}}\\right)`
  );

  out = out.replace(
    /(?<!\\(?:t)?frac\{[^}]{0,80})(?<![\w}])(-?\d+)\s*\/\s*(-?\d+)(?![0-9])/g,
    (_, a, b) => `\\frac{${a}}{${b}}`
  );

  // Algebra letter fractions: P/4, R/7, x/2 (not words like and/or)
  out = out.replace(/\b([A-Za-z])\s*\/\s*(-?\d+)\b/g, '\\frac{$1}{$2}');
  out = out.replace(/\b(-?\d+)\s*\/\s*([A-Za-z])\b/g, '\\frac{$1}{$2}');

  return out;
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
  s = s.replace(/\)\(/g, ') \\times ('); // (21)(14) → (21) \times (14)
  s = s.replace(/\)\s*[xX]\s+(?=\d|\{)/g, ') \\times ');
  s = s.replace(/(?<=\d|\})\s+[xX]\s+(?=\d|\(|\{)/g, ' \\times ');
  s = s.replace(/\s+[xX]\s+/g, ' \\times ');
  // (14)x → (14) x as multiplication when letter follows ) 
  s = s.replace(/\)([A-Za-z])\b/g, ') $1');

  const curls: string[] = [];
  s = s.replace(/\{([^{}]*)\}/g, (_m, inner) => {
    curls.push(inner);
    return `<<CURL${curls.length - 1}>>`;
  });

  s = convertSlashFractions(s);

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
function formatProseLineWithMathIslands(text: string): string {
  // Longer / more specific patterns first (parenthetical fractions, equations).
  const island =
    /(?:[A-Za-z]\s*=\s*)?\([^()\n]{1,80}(?:\([^()\n]{0,40}\)[^()\n]{0,40})*\)\s*\/\s*(?:\([^()\n]{1,40}(?:\([^()\n]{0,20}\)[^()\n]{0,20})*\)|-?\d+(?:\.\d+)?|[A-Za-z])(?:\s*=\s*-?\d+(?:\.\d+)?)?|\(?-?\d+\s+\d+\/\d+\)?(?:\^\d+)?|\(?-?\d+\/-?\d+\)?(?:\^\d+)?|-?\d+\^\d+|\[\s*[^\]]+\]\s*\/\s*\[[^\]]+\]|(?:π|pi)\s*=\s*-?\d+(?:\.\d+)?|-?\d+\s*\/\s*-?\d+(?![0-9])|\b[A-Za-z]\s*\/\s*-?\d+\b|-?\d+\s*\/\s*[A-Za-z]\b|[A-Za-z]\s*=\s*\([^()\n]+\)\s*\/\s*-?\d+/gi;

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
  return out;
}

/**
 * Multi-line stems (math statement + question sentence): KaTeX pure math lines,
 * keep prose readable, stack letter fractions like P/4.
 */
function formatProseWithMathIslands(text: string): string {
  const lines = text.split(/\n/);
  if (lines.length <= 1) {
    return formatProseLineWithMathIslands(text);
  }
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      if (isPureMathExpression(trimmed)) {
        const display =
          trimmed.length > 36 ||
          HAS_FRACTION.test(trimmed) ||
          /[=]/.test(trimmed);
        return renderLatex(plainMathToLatex(trimmed), display);
      }
      return formatProseLineWithMathIslands(trimmed);
    })
    .join('<br/>');
}

/**
 * Format bank question/option text for display.
 */
/** Word banks sometimes store units as \\text{ inches } and currency as \\10. */
const GLUED_UNITS =
  'thousands|thousand|hundreds|hundred|inches|inch|cents|cent|ones|one|tens|ten|feet|foot|dollars|dollar|yards|yard|miles|mile|minutes|minute|hours|hour|seconds|second|pounds|pound|ounces|ounce|grams|gram|liters|liter|cups|cup|quarts|quart|meters|meter|centimeters|centimeter';

/** Word/PDF often store ¼ ½ etc. — expand so KaTeX can stack them like 1/4. */
const VULGAR_FRACTIONS: Record<string, string> = {
  '¼': '1/4',
  '½': '1/2',
  '¾': '3/4',
  '⅓': '1/3',
  '⅔': '2/3',
  '⅕': '1/5',
  '⅖': '2/5',
  '⅗': '3/5',
  '⅘': '4/5',
  '⅙': '1/6',
  '⅚': '5/6',
  '⅐': '1/7',
  '⅛': '1/8',
  '⅜': '3/8',
  '⅝': '5/8',
  '⅞': '7/8',
  '⅑': '1/9',
  '⅒': '1/10',
};

export function expandVulgarFractions(text: string): string {
  return text.replace(
    /[¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅐⅛⅜⅝⅞⅑⅒]/g,
    (ch) => VULGAR_FRACTIONS[ch] ?? ch
  );
}

function normalizeBankArtifacts(text: string): string {
  return expandVulgarFractions(text)
    .replace(/\\text\{([^}]*)\}/g, '$1')
    .replace(/\\\$/g, '$')
    .replace(/\\(?=\d)/g, '$')
    .replace(new RegExp(`(\\d)(${GLUED_UNITS})\\b`, 'gi'), '$1 $2')
    .replace(/[ \t]{2,}/g, ' ');
}

export function formatMathHtml(raw: string | null | undefined): string {
  if (!raw) return '';
  const text = normalizeBankArtifacts(String(raw));
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
