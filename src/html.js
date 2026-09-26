export const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
export const chip = (label, style = '') => `<span class="chip ${escape(style)}">${escape(label)}</span>`;
export const sourceLinks = (ids, sources) => ids.length ? `<div class="source-links">${ids.map(id => {
  const source = sources.find(s => s.id === id);
  return source ? `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.publisher)} · ${escape(source.title)} ↗</a>` : '<span>Source unavailable</span>';
}).join('')}</div>` : '<p class="evidence-gap">Intake rationale / specialist issue. No legal conclusion asserted.</p>';
