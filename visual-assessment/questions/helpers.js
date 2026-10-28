/* Question-authoring helpers.
 * These only BUILD plain question objects that follow the data model in README.md;
 * the engine and renderer never depend on this file.
 *
 *   const b = VA.makeBank({ prefix:'K-MATH', grade:'kindergarten', subject:'math' });
 *   b.q(standard, skill, difficulty, instruction, visual, options, answerLabel, explanation, extra)
 *   VA.register('kindergarten', 'math', b.list);
 */
(function (root) {
  const VA = (root.VA = root.VA || {});
  VA.banks = VA.banks || {};

  const IDS = ['a', 'b', 'c', 'd', 'e'];
  const IRREGULAR = { fish: 'fish', sheep: 'sheep', mouse: 'mice', leaf: 'leaves', foot: 'feet', child: 'children' };
  const pluralWord = (w) => {
    if (IRREGULAR[w]) return IRREGULAR[w];
    if (/(s|x|z|ch|sh)$/.test(w)) return w + 'es';
    if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + 'ies';
    return w + 's';
  };
  const plural = (art, n) => (n === 1 ? art : pluralWord(art));

  const O = {
    /** numeric options, kept in ascending order */
    N(...nums) {
      const sorted = nums.slice().sort((x, y) => x - y);
      return { ordered: true, list: sorted.map((n) => ({ label: String(n) })) };
    },
    /** numeric options drawn as large number cards (ascending) */
    NV(...nums) {
      const sorted = nums.slice().sort((x, y) => x - y);
      return { ordered: true, list: sorted.map((n) => ({ label: String(n), visual: { type: 'text', text: String(n), big: true } })) };
    },
    /** numeric options drawn as a ten frame plus the numeral (ascending) */
    NF(...nums) {
      const sorted = nums.slice().sort((x, y) => x - y);
      return { ordered: true, list: sorted.map((n) => ({ label: String(n), showLabel: true, visual: { type: 'tenframe', filled: n, small: true } })) };
    },
    /** words / equations drawn as large text cards */
    WV(...words) {
      return { list: words.map((w) => ({ label: w, visual: { type: 'text', text: w, big: true } })) };
    },
    /** word / phrase options shown as large text */
    W(...words) {
      return { list: words.map((w) => ({ label: w })) };
    },
    /** letter cards */
    L(...letters) {
      return { list: letters.map((l) => ({ label: l, visual: { type: 'letter', text: l } })) };
    },
    /** picture options: art names, or [artName, label] */
    A(...names) {
      return {
        list: names.map((n) => {
          const name = Array.isArray(n) ? n[0] : n;
          const label = Array.isArray(n) ? n[1] : n;
          return { label, visual: { type: 'art', name } };
        }),
      };
    },
    /** shape options: 'circle' | {shape,color,rot,label} */
    SH(...shapes) {
      return {
        list: shapes.map((s) => {
          const o = typeof s === 'string' ? { shape: s } : s;
          const label = o.label || o.shape;
          const v = Object.assign({ type: 'shape' }, o);
          delete v.label;
          return { label, visual: v };
        }),
      };
    },
    /** groups of objects as options: [art,count,layout?] */
    G(...groups) {
      return {
        list: groups.map(([art, count, layout, extra]) => ({
          label: count + ' ' + plural(art, count),
          visual: Object.assign({ type: 'objects', art, count, layout: layout || 'scatter' }, extra || {}),
        })),
      };
    },
    /** fully custom options: [label, visual, showLabel?] */
    V(...items) {
      return {
        list: items.map(([label, visual, showLabel]) => {
          const o = { label, visual };
          if (showLabel) o.showLabel = true;
          return o;
        }),
      };
    },
  };

  function makeBank(cfg) {
    const list = [];
    let n = 0;
    function q(std, skill, difficulty, instruction, visual, optSpec, answer, explanation, extra) {
      extra = extra || {};
      const std0 = VA.STANDARDS[std];
      if (!std0) throw new Error('Unknown standard: ' + std + ' in ' + cfg.prefix);
      n += 1;
      const id = cfg.prefix + '-' + String(n).padStart(3, '0');
      const options = optSpec.list.map((o, i) => Object.assign({ id: IDS[i] }, o));
      const hit = options.filter((o) => o.label === String(answer));
      if (hit.length !== 1) {
        throw new Error(id + ': answer "' + answer + '" matches ' + hit.length + ' options');
      }
      const question = {
        id,
        grade: cfg.grade,
        subject: cfg.subject,
        framework: std0.fw,
        standard: std,
        domain: std0.domain,
        skill,
        difficulty,
        instruction,
        visual: visual || { type: 'none' },
        options,
        correctOptionId: hit[0].id,
        explanation,
        shuffleOptions: !optSpec.ordered && extra.shuffle !== false,
      };
      ['speech', 'story', 'alt', 'optionLayout', 'check', 'passage', 'readAloud'].forEach((k) => {
        if (extra[k] !== undefined) question[k] = extra[k];
      });
      list.push(question);
      return question;
    }
    return { q, list };
  }

  VA.O = O;
  VA.makeBank = makeBank;
  VA.register = function (grade, subject, list) {
    VA.banks[grade + ':' + subject] = list;
  };
})(typeof window !== 'undefined' ? window : globalThis);
