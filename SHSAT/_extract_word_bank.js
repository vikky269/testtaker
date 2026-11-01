/**
 * Extract SHSAT math questions from Aliyah SHSAT Mock.docx (unzipped)
 * into app/data/shsatMathPool.word.json + public/shsat/math/word images.
 *
 * Structure: stems mostly use numId=1; each question's 4 choices share a
 * unique numId (>=2). Bold (w:b / pPr rPr / OMML bi / bold image run)
 * marks the correct choice.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const UNZIP = path.join(ROOT, '_docx_unzip');
const MEDIA = path.join(UNZIP, 'word', 'media');
const OUT_IMG = path.join(ROOT, '..', 'public', 'shsat', 'math', 'word');
const OUT_JSON = path.join(ROOT, '..', 'app', 'data', 'shsatMathPool.word.json');
const OUT_REPORT = path.join(ROOT, '_word_extract_report.txt');
const IMG_CLASS = 'w-full max-w-xl mx-auto mb-3 rounded-lg';

function decodeXml(t) {
  return t
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    );
}

function loadRels() {
  const relsXml = fs.readFileSync(
    path.join(UNZIP, 'word', '_rels', 'document.xml.rels'),
    'utf8'
  );
  const map = {};
  for (const m of relsXml.matchAll(
    /<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"[^>]*\/?>/g
  )) {
    map[m[1]] = m[2].replace(/^\/?media\//, '').replace(/^media\//, '');
  }
  return map;
}

function extractParagraphs(body) {
  const paras = [];
  const re = /<w:p[\s>][\s\S]*?<\/w:p>/g;
  let m;
  while ((m = re.exec(body))) paras.push(m[0]);
  return paras;
}

function findClosing(s, start, tag) {
  const openRe = new RegExp(`<${tag}(?:\\s[^>]*)?>`);
  const closeTag = `</${tag}>`;
  let depth = 0;
  let i = start;
  while (i < s.length) {
    if (s.startsWith(closeTag, i)) {
      depth--;
      i += closeTag.length;
      if (depth === 0) return i;
      continue;
    }
    const rest = s.slice(i);
    const om = rest.match(openRe);
    if (om && om.index === 0) {
      depth++;
      i += om[0].length;
      continue;
    }
    if (s[i] === '<') {
      const gt = s.indexOf('>', i);
      i = gt === -1 ? s.length : gt + 1;
    } else i++;
  }
  return s.length;
}

function extractChild(parentXml, tag) {
  const openRe = new RegExp(`<${tag}(?:\\s[^>]*)?>`);
  const m = parentXml.match(openRe);
  if (!m) return '';
  const start = m.index;
  const end = findClosing(parentXml, start, tag);
  return parentXml.slice(start + m[0].length, end - `</${tag}>`.length);
}

function renderOmml(xml) {
  function walk(fragment) {
    let out = '';
    let i = 0;
    while (i < fragment.length) {
      if (fragment.startsWith('<m:f>', i) || fragment.startsWith('<m:f ', i)) {
        const end = findClosing(fragment, i, 'm:f');
        const inner = fragment.slice(i, end);
        const num = walk(extractChild(inner, 'm:num')).trim();
        const den = walk(extractChild(inner, 'm:den')).trim();
        // Mixed number: digit immediately before fraction → "3 1/4"
        const bareNum = /^-?\d+$/.test(num);
        const bareDen = /^-?\d+$/.test(den);
        const needsParen = /[+\-*/=]/.test(num.replace(/^-/, '')) || /[+\-*/=]/.test(den.replace(/^-/, ''));
        if (/\d$/.test(out) && bareNum && bareDen) {
          out += ` ${num}/${den}`;
        } else if (bareNum && bareDen) {
          out += `${num}/${den}`;
        } else if (!needsParen && /^[A-Za-z0-9.]+$/.test(num) && /^[A-Za-z0-9.]+$/.test(den)) {
          out += `${num}/${den}`;
        } else if (bareDen) {
          out += `(${num})/${den}`;
        } else if (bareNum) {
          out += `${num}/(${den})`;
        } else {
          out += `(${num})/(${den})`;
        }
        i = end;
        continue;
      }
      if (fragment.startsWith('<m:sSup>', i) || fragment.startsWith('<m:sSup ', i)) {
        const end = findClosing(fragment, i, 'm:sSup');
        const inner = fragment.slice(i, end);
        out += `${walk(extractChild(inner, 'm:e'))}^(${walk(extractChild(inner, 'm:sup'))})`;
        i = end;
        continue;
      }
      if (fragment.startsWith('<m:sSub>', i) || fragment.startsWith('<m:sSub ', i)) {
        const end = findClosing(fragment, i, 'm:sSub');
        const inner = fragment.slice(i, end);
        out += `${walk(extractChild(inner, 'm:e'))}_${walk(extractChild(inner, 'm:sub'))}`;
        i = end;
        continue;
      }
      if (fragment.startsWith('<m:rad>', i) || fragment.startsWith('<m:rad ', i)) {
        const end = findClosing(fragment, i, 'm:rad');
        const inner = fragment.slice(i, end);
        out += `√(${walk(extractChild(inner, 'm:e'))})`;
        i = end;
        continue;
      }
      if (fragment.startsWith('<m:d>', i) || fragment.startsWith('<m:d ', i)) {
        const end = findClosing(fragment, i, 'm:d');
        const inner = fragment.slice(i, end);
        out += `(${walk(extractChild(inner, 'm:e'))})`;
        i = end;
        continue;
      }
      const tMatch = fragment.slice(i).match(/^<m:t[^>]*>([\s\S]*?)<\/m:t>/);
      if (tMatch) {
        out += decodeXml(tMatch[1]);
        i += tMatch[0].length;
        continue;
      }
      if (fragment[i] === '<') {
        const gt = fragment.indexOf('>', i);
        if (gt === -1) break;
        i = gt + 1;
        continue;
      }
      out += fragment[i];
      i++;
    }
    return out;
  }

  const blocks = xml.match(/<m:oMath[\s>][\s\S]*?<\/m:oMath>/g) || [];
  return blocks
    .map((b) => walk(b))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isBoldFlag(valAttr) {
  if (valAttr == null) return true;
  return !['0', 'false', 'False'].includes(valAttr);
}

function paraHasBold(pXml) {
  const pPr = (pXml.match(/<w:pPr>([\s\S]*?)<\/w:pPr>/) || [])[1] || '';
  const pPrRPr = (pPr.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/) || [])[1] || '';
  if (/<w:b\b/.test(pPrRPr)) {
    const m = pPrRPr.match(/<w:b\b([^>]*)\/?>/);
    const val = m && (m[1].match(/w:val="([^"]*)"/) || [])[1];
    if (isBoldFlag(val)) return true;
  }

  const runRe = /<w:r[\s>][\s\S]*?<\/w:r>/g;
  let rm;
  while ((rm = runRe.exec(pXml))) {
    const run = rm[0];
    const rPr = (run.match(/<w:rPr>([\s\S]*?)<\/w:rPr>/) || [])[1] || '';
    if (/<w:b\b/.test(rPr)) {
      const m = rPr.match(/<w:b\b([^>]*)\/?>/);
      const val = m && (m[1].match(/w:val="([^"]*)"/) || [])[1];
      if (isBoldFlag(val) && (/<w:t[\s>]/.test(run) || /a:blip/.test(run))) {
        return true;
      }
    }
  }

  if (/m:sty m:val="bi"/.test(pXml)) return true;
  return false;
}

function renderRunText(runXml) {
  const t = [...runXml.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>/g)]
    .map((x) => decodeXml(x[1]))
    .join('');
  if (!t) return '';
  const vert = (runXml.match(/w:val="(superscript|subscript)"/) || [])[1];
  if (vert === 'superscript' && t === '0') return '°';
  if (vert === 'superscript') return `^${t}`;
  if (vert === 'subscript') return `_${t}`;
  return t;
}

/** Walk paragraph in document order so OMML sits between surrounding text runs. */
function extractParaTextInOrder(pXml) {
  let out = '';
  // Top-level-ish tokens: w:r, m:oMath, m:oMathPara (and w:hyperlink wrapping w:r)
  const tokenRe =
    /<w:hyperlink[\s>][\s\S]*?<\/w:hyperlink>|<w:r[\s>][\s\S]*?<\/w:r>|<m:oMathPara[\s>][\s\S]*?<\/m:oMathPara>|<m:oMath[\s>][\s\S]*?<\/m:oMath>/g;
  let m;
  while ((m = tokenRe.exec(pXml))) {
    const tok = m[0];
    if (tok.startsWith('<m:oMath')) {
      out += renderOmml(tok);
    } else if (tok.startsWith('<w:hyperlink')) {
      const runRe = /<w:r[\s>][\s\S]*?<\/w:r>/g;
      let rm;
      while ((rm = runRe.exec(tok))) out += renderRunText(rm[0]);
    } else {
      // skip runs that only host drawings (images handled separately)
      if (/a:blip/.test(tok) && !/<w:t[\s>]/.test(tok)) continue;
      out += renderRunText(tok);
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}

function parsePara(pXml, i) {
  const images = [];
  const blipRe = /<a:blip[^>]*r:embed="([^"]+)"[^>]*\/?>/g;
  let bm;
  while ((bm = blipRe.exec(pXml))) images.push(bm[1]);

  const text = extractParaTextInOrder(pXml);
  const omml = renderOmml(pXml);
  const bold = paraHasBold(pXml);
  const numId = (pXml.match(/<w:numId w:val="(\d+)"/) || [])[1] || null;

  return {
    i,
    text,
    plain: text,
    omml,
    images,
    bold,
    numId,
    isEmpty: !text && images.length === 0,
  };
}

function imgHtml(publicName, alt) {
  return `<img src="/shsat/math/word/${publicName}" alt="${alt}" class="${IMG_CLASS}" />`;
}

function escapeMinimal(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Find contiguous option groups: same numId (!=1), length 4.
 */
function findOptionGroups(paras) {
  const groups = [];
  let i = 0;
  while (i < paras.length) {
    const id = paras[i].numId;
    if (!id || id === '1') {
      i++;
      continue;
    }
    const start = i;
    while (i < paras.length && paras[i].numId === id) i++;
    const idxs = [];
    for (let k = start; k < i; k++) {
      if (!paras[k].isEmpty || paras[k].images.length) idxs.push(k);
    }
    // Also include empty? no
    const allIdx = [];
    for (let k = start; k < i; k++) allIdx.push(k);
    if (allIdx.length === 4) {
      groups.push({ numId: id, optIdxs: allIdx });
    } else {
      console.warn(
        `Skipping numId=${id} group len=${allIdx.length} at paras ${start}-${i - 1}`
      );
    }
  }
  return groups;
}

function buildQuestionHtml(stemParas, qNum, imagePlan) {
  const hasImg = stemParas.some((p) => p.images.length);
  if (!hasImg) {
    return stemParas
      .map((p) => p.text)
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  const htmlParts = [];
  for (const p of stemParas) {
    for (const rid of p.images) {
      const name = imagePlan.allocate(rid, qNum, 'stem');
      htmlParts.push(imgHtml(name, `Question ${qNum} figure`));
    }
    if (p.text) htmlParts.push(`<p>${escapeMinimal(p.text)}</p>`);
  }
  return `<div>${htmlParts.join('')}</div>`;
}

function buildOption(p, qNum, optLetter, imagePlan) {
  // Wrap img HTML in <div> so formatMathHtml treats it as rich HTML (not escaped).
  if (p.images.length && !p.text) {
    const name = imagePlan.allocate(p.images[0], qNum, `opt-${optLetter}`);
    return `<div>${imgHtml(name, `Question ${qNum} option ${optLetter.toUpperCase()}`)}</div>`;
  }
  if (p.images.length && p.text) {
    const name = imagePlan.allocate(p.images[0], qNum, `opt-${optLetter}`);
    return `<div>${imgHtml(name, `Question ${qNum} option ${optLetter.toUpperCase()}`)}<p>${escapeMinimal(p.text)}</p></div>`;
  }
  return (p.text || '').trim();
}

function main() {
  const rels = loadRels();
  const xml = fs.readFileSync(path.join(UNZIP, 'word', 'document.xml'), 'utf8');
  const body = xml.match(/<w:body>([\s\S]*)<\/w:body>/)[1];
  const paras = extractParagraphs(body).map((p, i) => parsePara(p, i));

  const groups = findOptionGroups(paras);
  console.log('Option groups:', groups.length);

  const imagePlan = {
    counters: {},
    allocate(rid, qNum, role) {
      const key = `${qNum}:${role}:${rid}`;
      if (this.counters[key]) return this.counters[key];
      const qPad = String(qNum).padStart(2, '0');
      const mediaFile = rels[rid];
      if (!mediaFile) throw new Error('Missing rel ' + rid);
      const ext = path.extname(mediaFile) || '.png';
      let dest;
      if (role === 'stem') {
        const stemKey = `stemCount:${qNum}`;
        this.counters[stemKey] = (this.counters[stemKey] || 0) + 1;
        const n = this.counters[stemKey];
        dest = n === 1 ? `q${qPad}-stem${ext}` : `q${qPad}-stem-${n}${ext}`;
      } else {
        dest = `q${qPad}-${role}${ext}`;
      }
      this.counters[key] = dest;
      if (!this.copies) this.copies = [];
      this.copies.push({ src: path.join(MEDIA, mediaFile), dest });
      return dest;
    },
  };
  imagePlan.copies = [];

  fs.mkdirSync(OUT_IMG, { recursive: true });
  for (const f of fs.readdirSync(OUT_IMG)) {
    fs.unlinkSync(path.join(OUT_IMG, f));
  }

  const bank = [];
  let cursor = 0;

  groups.forEach((g, idx) => {
    const qNum = idx + 1;
    const firstOpt = g.optIdxs[0];
    const stemIdxs = [];
    for (let k = cursor; k < firstOpt; k++) {
      if (!paras[k].isEmpty) stemIdxs.push(k);
    }
    cursor = g.optIdxs[g.optIdxs.length - 1] + 1;

    const stemParas = stemIdxs.map((i) => paras[i]);
    const optParas = g.optIdxs.map((i) => paras[i]);
    const letters = ['a', 'b', 'c', 'd'];

    const question = buildQuestionHtml(stemParas, qNum, imagePlan);
    const options = optParas.map((p, oi) =>
      buildOption(p, qNum, letters[oi], imagePlan)
    );

    const boldIdxs = optParas
      .map((p, oi) => (p.bold ? oi : -1))
      .filter((x) => x >= 0);

    let correctAnswer = '';
    let needsReview = false;
    if (boldIdxs.length === 1) {
      correctAnswer = options[boldIdxs[0]];
    } else {
      needsReview = true;
      correctAnswer = '';
    }

    const stemPreview = question
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 70);
    console.log(
      `Q${qNum}: numId=${g.numId} bold=${boldIdxs.length === 1 ? letters[boldIdxs[0]] : 'NONE'} | ${stemPreview}`
    );

    const item = {
      id: `shsatm_w_${String(qNum).padStart(2, '0')}`,
      question,
      options,
      correctAnswer,
      solution: '',
      domain: 'Math',
      subtopic: 'General',
      difficulty: 'medium',
      source: 'aliyah-word',
      sourceNumber: qNum,
    };
    if (needsReview) item.needsReview = true;
    bank.push(item);
  });

  const seenDest = new Set();
  let imageCount = 0;
  for (const c of imagePlan.copies) {
    if (seenDest.has(c.dest)) continue;
    seenDest.add(c.dest);
    fs.copyFileSync(c.src, path.join(OUT_IMG, c.dest));
    imageCount++;
  }

  fs.writeFileSync(OUT_JSON, JSON.stringify(bank, null, 2), 'utf8');

  const reviewIds = bank.filter((q) => q.needsReview).map((q) => q.id);
  const report = [
    'SHSAT Word → JSON extract report',
    'Source: Aliyah SHSAT Mock.docx',
    `JSON: ${OUT_JSON}`,
    `Questions extracted: ${bank.length}`,
    `Images saved to public/shsat/math/word: ${imageCount}`,
    `needsReview: ${reviewIds.length}`,
    reviewIds.length
      ? `needsReview ids: ${reviewIds.join(', ')}`
      : 'All questions have bold-marked answers.',
    '',
    'Method:',
    '- Parsed word/document.xml; option sets = contiguous paras sharing numId (>=2), length 4.',
    '- Correct answer = sole bold option (w:b, paragraph rPr bold, OMML m:sty bi, or bold image run).',
    '- No invented answers; missing/ambiguous bold → needsReview: true, correctAnswer: "".',
    '- OMML → plain fraction text; superscript 0 → degree symbol; images → /shsat/math/word/.',
    '',
    'Content caveats (source doc):',
    '- Some stems lost inline fractions (em dashes / broken runs), e.g. James pages, colored-pencils probability.',
    '- Box-plot image choices have no bold mark → needsReview.',
    '',
    'Per-question:',
    ...bank.map((q) => {
      const stem = q.question
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80);
      const ans = q.needsReview
        ? 'NEEDS_REVIEW'
        : String(q.correctAnswer).replace(/<[^>]+>/g, '[img]').slice(0, 40);
      return `${q.id}: ${ans} | ${stem}`;
    }),
  ].join('\n');

  fs.writeFileSync(OUT_REPORT, report, 'utf8');
  console.log('\n' + report.split('\n').slice(0, 15).join('\n'));
  console.log('\nWrote', OUT_JSON);
  console.log('Images', imageCount);
}

main();
