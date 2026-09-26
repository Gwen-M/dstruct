import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {fields} from '../src/engine.js';

export async function readDataset(){
  const base=new URL('../data/',import.meta.url);
  const json=async name=>JSON.parse(await readFile(new URL(name,base),'utf8'));
  const files=(await readdir(new URL('cases/',base))).filter(f=>f.endsWith('.json')).sort();
  return {sources:await json('sources.json'),common:await json('common.json'),cases:await Promise.all(files.map(f=>json(`cases/${f}`)))};
}
export function validate(data){
  assert.equal(data.cases.length,5,'Exactly five curated archetypes');
  assert.equal(data.common.provenance.kind,'synthetic');
  const ids=new Set(data.sources.map(s=>s.id));
  assert.equal(ids.size,data.sources.length,'Source IDs must be unique');
  assert.equal(new Set(data.cases.map(c=>c.id)).size,data.cases.length,'Case IDs must be unique');
  for(const source of data.sources){
    assert.match(source.url,/^https:\/\//);
    const host=new URL(source.url).hostname;
    assert.ok(host.endsWith('.gov'),'Use official government sources');
    assert.match(source.checkedAt,/^\d{4}-\d{2}-\d{2}$/);
    assert.ok(['checked','conflict'].includes(source.status));
  }
  for(const c of data.cases){
    for(const key of ['id','title','prompt','takeaway'])assert.ok(typeof c[key]==='string'&&c[key].trim(),`Missing ${key}`);
    for(const key of ['provided','missing','questions','concerns','specialists'])assert.ok(Array.isArray(c[key])&&c[key].length>0,`Missing ${key}`);
    assert.equal(new Set(c.questions.map(q=>q.id)).size,c.questions.length);
    for(const q of c.questions){assert.ok(q.question&&q.why);}
    for(const s of c.specialists){assert.ok(s.role&&s.decision&&s.needs);}
    for(const r of [...c.questions,...c.concerns,...data.common.baseline]){assert.ok(Array.isArray(r.sourceIds));for(const id of r.sourceIds)assert.ok(ids.has(id),`Unknown source ${id}`);}
    for(const field of fields)assert.ok(Object.hasOwn(field.options,c.intake[field.id]),`Invalid intake ${field.id}`);
  }
  return `${data.cases.length} cases, ${data.cases.reduce((n,c)=>n+c.questions.length,0)} questions, ${ids.size} sources validated.`;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)console.log(validate(await readDataset()));
