export function caseRecord(c,data,answers = {}) {
  const sourceIds = new Set([...c.questions,...c.concerns,...data.common.baseline].flatMap(r=>r.sourceIds));
  return {schemaVersion:data.common.schemaVersion,provenance:data.common.provenance,...c,baseline:data.common.baseline,sources:data.sources.filter(s=>sourceIds.has(s.id)),practiceAnswers:answers,answerStatus:'Unverified user-entered practice notes; not original case facts'};
}
export function datasetJsonl(data) {return data.cases.map(c=>JSON.stringify(caseRecord(c,data))).join('\n')+'\n';}
export function markdownBrief(record) {
  const lines = [`# ${record.title}`,'','Synthetic scenario. Proposed questions; not a real client conversation. Not expert validated.','','## Initial prompt',record.prompt,'','## Initially provided',...record.provided.map(v=>`- ${v}`),'','## Missing information',...record.missing.map(v=>`- ${v}`),'','## Proposed questions'];
  for(const q of record.questions) lines.push(`### ${q.question}`,`Why: ${q.why}`,`Practice answer (unverified): ${record.practiceAnswers[q.id] || 'Not recorded'}`,`Sources: ${q.sourceIds.join(', ') || 'Intake rationale; no legal conclusion'}`,'');
  lines.push('## Concerns');
  for(const c of [...record.concerns,...record.baseline]) lines.push(`### ${c.title}`,c.detail,`Sources: ${c.sourceIds.join(', ') || 'Evidence gap / specialist analysis required'}`,'');
  lines.push('## Specialist judgment');
  for(const s of record.specialists) lines.push(`### ${s.role}`,s.decision,`Needs: ${s.needs}`,'');
  lines.push('## Sources');
  for(const s of record.sources) lines.push(`- ${s.id}: [${s.publisher}: ${s.title}](${s.url}) — checked ${s.checkedAt}; ${s.status}`);
  return lines.join('\n')+'\n';
}
export function download(name,content,type='application/json') {
  const url=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
