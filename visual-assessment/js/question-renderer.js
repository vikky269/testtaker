/* Question rendering: turns a (public) question into HTML. No engine or storage knowledge. */
(function (root) {
  const VA = (root.VA = root.VA || {});
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const SPEAKER = '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 9v6h4l5 4V5L7 9H3z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function speakButton(id, label) {
    return '<button type="button" class="speak" data-speak="' + id + '" aria-label="' + esc(label) + '">' + SPEAKER + '<span>Listen</span></button>';
  }

  function optionHtml(opt, qi, selected, count) {
    const hasVisual = !!opt.visual;
    const showLabel = !hasVisual || opt.showLabel || false;
    const visual = hasVisual ? '<span class="opt-visual">' + VA.visuals.render(opt.visual) + '</span>' : '';
    const textual = !hasVisual;
    const long = textual && opt.label.length > 14;
    const label = showLabel ? '<span class="opt-label' + (long ? ' is-long' : '') + '">' + esc(opt.label) + '</span>' : '';
    const isSel = selected === opt.id;
    return '<button type="button" role="radio" class="option' + (isSel ? ' is-selected' : '') + (textual ? ' is-text' : '') + '" data-option="' + opt.id + '" aria-checked="' + isSel + '" aria-label="' + esc(opt.label) + '" tabindex="' + (isSel ? 0 : -1) + '">' +
      '<span class="opt-key" aria-hidden="true">' + (qi + 1) + '</span>' + visual + label + '</button>';
  }

  /** @returns {string} HTML for the question body (prompt, picture, options). */
  function renderQuestion(q, selected) {
    const mainVisual = q.visual && q.visual.type !== 'none' ? VA.visuals.render(q.visual) : '';
    const read = q.story || q.passage;
    const stack = q.optionLayout === 'stack' || (q.options.every((o) => !o.visual) && q.options.some((o) => o.label.length > 14)) || q.options.every((o) => o.visual && o.visual.type === 'text' && o.visual.text.length > 8);
    const wide = q.options.some((o) => o.visual && ['join', 'measure', 'sequence', 'shape-row'].indexOf(o.visual.type) >= 0);
    const alt = q.alt ? '<span class="sr-only">' + esc(q.alt) + '</span>' : '';
    return '' +
      '<div class="prompt-card">' +
        '<div class="prompt-row"><h2 class="instruction" id="q-instruction" tabindex="-1">' + esc(q.instruction) + '</h2>' + speakButton('q', 'Read the question aloud') + '</div>' +
        (read ? '<div class="story-card"><p class="story-text" id="q-story">' + esc(read) + '</p>' + speakButton('story', 'Read the story aloud') + '</div>' : '') +
        (mainVisual ? '<div class="main-visual" role="img" aria-label="' + esc(q.alt || 'Picture for this question') + '">' + mainVisual + alt + '</div>' : '') +
      '</div>' +
      '<div class="options n' + q.options.length + (stack ? ' is-stack' : '') + (wide ? ' is-wide' : '') + '" role="radiogroup" aria-labelledby="q-instruction">' +
        q.options.map((o, i) => optionHtml(o, i, selected, q.options.length)).join('') +
      '</div>';
  }

  /** Text spoken by the Listen buttons. */
  function speechText(q, which) {
    if (which === 'story') return q.story || q.passage || '';
    return q.speech || q.instruction;
  }

  VA.QuestionRenderer = { renderQuestion, speechText, SPEAKER, esc };
})(typeof window !== 'undefined' ? window : globalThis);
