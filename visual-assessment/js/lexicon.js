/* Phonics lexicon for the picture words used in ELA questions.
 * Used by tests to verify sound-based questions (beginning sounds, rhymes, syllables, blends...).
 * Phones are simple readable symbols, not IPA: short vowels a e i o u, long vowels ay ee eye oh yoo,
 * others aw ow ar oo er ae(=uh). Digraph sounds sh ch are single phones.
 */
(function (root) {
  const VA = (root.VA = root.VA || {});
  const w = (spell, phones, syl) => ({ spell, phones: phones.split(' '), syl });
  VA.lexicon = {
    apple: w('apple', 'a p l', 2), ball: w('ball', 'b aw l', 1), banana: w('banana', 'b uh n a n uh', 3), bed: w('bed', 'b e d', 1),
    bee: w('bee', 'b ee', 1), bell: w('bell', 'b e l', 1), boat: w('boat', 'b oh t', 1), box: w('box', 'b o k s', 1), bug: w('bug', 'b u g', 1),
    bus: w('bus', 'b u s', 1), cake: w('cake', 'k ay k', 1), car: w('car', 'k ar', 1), cat: w('cat', 'k a t', 1), chair: w('chair', 'ch air', 1),
    clock: w('clock', 'k l o k', 1), coat: w('coat', 'k oh t', 1), cup: w('cup', 'k u p', 1), dog: w('dog', 'd o g', 1), drum: w('drum', 'd r u m', 1),
    duck: w('duck', 'd u k', 1), elephant: w('elephant', 'e l uh f uh n t', 3), fish: w('fish', 'f i sh', 1), fox: w('fox', 'f o k s', 1),
    frog: w('frog', 'f r o g', 1), hat: w('hat', 'h a t', 1), hen: w('hen', 'h e n', 1), house: w('house', 'h ow s', 1), key: w('key', 'k ee', 1),
    kite: w('kite', 'k eye t', 1), log: w('log', 'l o g', 1), monkey: w('monkey', 'm u ng k ee', 2), moon: w('moon', 'm oo n', 1),
    mouse: w('mouse', 'm ow s', 1), pen: w('pen', 'p e n', 1), pig: w('pig', 'p i g', 1), rabbit: w('rabbit', 'r a b i t', 2),
    ship: w('ship', 'sh i p', 1), snake: w('snake', 's n ay k', 1), sock: w('sock', 's o k', 1), star: w('star', 's t ar', 1),
    sun: w('sun', 's u n', 1), table: w('table', 't ay b l', 2), tree: w('tree', 't r ee', 1),
  };
  const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ay', 'ee', 'eye', 'oh', 'yoo', 'aw', 'ow', 'ar', 'oo', 'er', 'uh', 'air'];
  const LONG = ['ay', 'ee', 'eye', 'oh', 'yoo'];

  VA.phonics = {
    VOWELS, LONG,
    get(word) { const e = VA.lexicon[word]; if (!e) throw new Error('Not in lexicon: ' + word); return e; },
    initial(word) { return VA.phonics.get(word).phones[0]; },
    final(word) { const p = VA.phonics.get(word).phones; return p[p.length - 1]; },
    /** phones from the first vowel to the end */
    rime(word) {
      const p = VA.phonics.get(word).phones;
      const i = p.findIndex((x) => VOWELS.indexOf(x) >= 0);
      return p.slice(i).join(' ');
    },
    /** the (first) vowel phone */
    vowel(word) { return VA.phonics.get(word).phones.find((x) => VOWELS.indexOf(x) >= 0); },
    isLong(word) { return LONG.indexOf(VA.phonics.vowel(word)) >= 0; },
    onset(word) {
      const p = VA.phonics.get(word).phones;
      const i = p.findIndex((x) => VOWELS.indexOf(x) >= 0);
      return p.slice(0, i);
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
