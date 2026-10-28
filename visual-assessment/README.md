# Picture Quiz: Pre-K, Kindergarten and Grade 1 check-in

A standalone, image-based assessment for early learners. Open `index.html` in a browser. There is no build step, no server and no network use.

* 3 grades x 2 subjects x 50 questions = **300 unique questions**
* Each session: **10 math + 10 ELA** from the chosen grade only, balanced across domains and skills, shuffled, no repeats
* Pre-K aligns to Head Start **ELOF**; Kindergarten and Grade 1 align to **CCSS** (Math and ELA)
* Every picture is an original SVG drawn in code. No emoji, no remote images, no external fonts or scripts

## Screens
1. **Welcome**: three illustrated grade cards, what to expect (20 questions), Start button. Offers to resume an unfinished session.
2. **Question**: one at a time, number and progress bar, large illustration, 3 to 4 tappable options, Previous/Next, optional "Listen" button. No right/wrong feedback.
3. **Review**: every question shown as answered/open, tap to revisit, Submit (asks for confirmation if any are blank). Submit locks the session.
4. **Results**: total /20, math /10, ELA /10, percentages, per-domain performance, "Try Another Assessment".

## Run
```
open index.html            # or double-click it; works from file://
npm install                # only needed for the browser tests (Playwright)
npm test                   # content + engine tests (Node only, no dependencies)
npm run test:browser       # headless Chromium: full run-through and feature checks
npm run gallery            # contact sheets of all 300 questions in tests/shots/ (correct answer outlined)
npm run docs               # regenerates docs/curriculum-coverage.md
```

## Structure
```
index.html                  five screens, script tags in dependency order
css/styles.css              responsive, reduced-motion, high-contrast friendly
questions/                  six banks (50 each) + helpers.js (authoring helpers, not used at runtime by the engine)
js/curriculum.js            grades, subjects, standard codes with text (VA.STANDARDS)
js/question-data.js         QuestionBank: getBank/getAll/getById/toPublic (strips the answer key)
js/question-selector.js     generateAssessment(grade, {rng}) - Fisher-Yates, domain/skill balanced, seedable
js/scoring.js               score(questions, answers) - pure function
js/assessment-engine.js     session state, navigation, answers, review, submit lock. No DOM.
js/persistence.js           localStorage adapter { load, save, clear } with in-memory fallback. Replaceable.
js/art/*.js                 illustration registry (animals, food/nature, objects, people)
js/visuals-*.js             renders a question's `visual` spec (counting, clocks, charts, scenes, shapes...) to SVG/HTML
js/lexicon.js               phonics facts for picture words, used only by tests
js/question-renderer.js     question -> HTML
js/app.js                   the only file that wires engine to DOM
tests/                      validate.js, engine.test.js, browser-smoke.js, browser-features.js, gallery.js, gen-docs.js
docs/curriculum-coverage.md generated coverage matrix
```
Separation: the question bank has no UI code; selection, navigation, scoring and rendering are separate modules; the engine never touches the DOM or `localStorage` directly.

## Question data model
```js
{ id:'K-MATH-010', grade:'kindergarten', subject:'math', framework:'CCSS', standard:'K.CC.B.4.c',
  domain:'Counting and Cardinality', skill:'One more', difficulty:'medium',
  instruction:'Which number is ONE MORE than 6?',
  visual:{ type:'objects', art:'cube', count:6, layout:'row' },   // declarative picture spec
  options:[{id:'a',label:'5'},{id:'b',label:'7'},{id:'c',label:'8'}],
  correctOptionId:'b', explanation:'...', shuffleOptions:false,
  speech?, story?, passage?, alt?, optionLayout?, check? }
```
The student-facing copy comes from `QuestionBank.toPublic(q)`, which removes `correctOptionId`, `explanation` and `check`. Stored sessions hold only question ids, option order and chosen option ids.

## Replacing storage or the question source
* Storage: pass any `{load, save, clear}` object to `VA.createEngine({persistence})`.
* Questions: replace `js/question-data.js` with an implementation of the same four methods (for example one that calls an API).

## Accessibility
Keyboard: Tab/Shift+Tab, arrow keys move between and select options, keys 1 to 4 select an option, Enter/Space activate buttons. Options are a `radiogroup` with `aria-checked`; screen changes move focus to the new heading and are announced in a live region; focus rings are always visible; `prefers-reduced-motion` turns off transitions. Option images carry text labels for screen readers. The "Listen" button uses the browser's speech synthesis and is hidden when unavailable.

## What has been verified (and what has not)
Run and passing at time of writing:
* `npm test`: 3,207 checks. 6 banks x 50, unique ids, 3 to 4 options, exactly one correct option, every standard code exists in `curriculum.js`, every illustration used exists, all 778 pictures render, counted/derived answers match the picture (counts, dots, sums, ten frames, cubes, number comparison, base-ten, pictograph totals, size comparisons), phonics/rhyme/syllable keys checked against the lexicon (55 questions), no emoji and no remote URLs in source.
* `engine.test.js`: 600 generated sessions (200 per grade) are 10+10, same grade, no repeats; 600 more checked for domain balance; Fisher-Yates uniformity; stable option order; answer key not exposed; navigation, review, submit lock; scoring for all-correct/all-wrong/partial; save and restore; corrupt save ignored.
* Headless Chromium (file://): full run-through at 900px and 390px with no console errors; keyboard and number-key selection; resume after reload; review and confirm-submit; locked after submit; no remote requests; reduced-motion; no horizontal scroll at 320/375/768px. I looked at contact sheets of all 300 questions and fixed the layout problems I found.

Not verified or known limits:
* Only Chromium was tested. Safari, Firefox and real touch devices were not.
* Speech output was not listened to. Voices differ by device. Phonics prompts use a `speech` respelling (for example "buh") for better pronunciation.
* The questions are not psychometrically validated: no pilot data, difficulty labels are the author's judgement, and 3 options means 33% chance guessing. Results are a quick check-in, not a diagnostic or placement tool.
* Pre-K items are mapped to ELOF goals (paraphrased from the Head Start framework); ELOF is not a standards list with numbered sub-items like CCSS. The mapping choices are documented below.
* 16 of 300 items are text-reading items (sight words, sentence mechanics, word choice) where the words themselves are the content; they are shown as large word cards instead of pictures.
* Some scene pictures (for example "behind", "inside") are small in option tiles on narrow phones.

## Mapping notes
* Syllable counting in Pre-K is mapped to ELOF P-LIT 1 (phonological awareness: sound segments).
* Grade 1 `RF.1.1.a` (features of a sentence) is grouped under the domain label "Conventions of Language" so Grade 1 reading and language items balance cleanly.
* Math standards use CCSS sub-codes (for example `K.CC.B.4.b`, `1.NBT.B.2.a`) from the supplied CCSS pages; ELA codes (for example `RF.K.3`, `L.1.1.b`) were checked against thecorestandards.org.
* Full matrix: `docs/curriculum-coverage.md`.
