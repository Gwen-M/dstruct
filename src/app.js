import {loadData} from './data.js';
import {library,caseView,sourceView,methodView} from './views.js';
import {intakeView,resultView} from './intake.js';
import {analyze} from './engine.js';
import {caseRecord,datasetJsonl,markdownBrief,download} from './export.js';
import {escape as e} from './html.js';

const main=document.querySelector('main');
document.querySelector('.skip').addEventListener('click',event=>{event.preventDefault();main.focus();});
let data,query='',draft={},submitted=null;
const notes={};
let toastTimer;
function notify(message){clearTimeout(toastTimer);document.querySelector('#toast').textContent=message;toastTimer=setTimeout(()=>document.querySelector('#toast').textContent='',3500);}
function route(){
  const path=location.hash.slice(1)||'cases';
  const section=path.startsWith('case/')?'cases':path;
  document.querySelectorAll('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===section);if(a.dataset.nav===section)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  if(path==='cases')main.innerHTML=library(data,query);
  else if(path==='sources')main.innerHTML=sourceView(data);
  else if(path==='method')main.innerHTML=methodView();
  else if(path==='intake'){main.innerHTML=intakeView(draft);if(submitted)document.querySelector('#intake-result').innerHTML=resultView(submitted,data);}
  else if(path.startsWith('case/')){const c=data.cases.find(c=>c.id===path.slice(5));main.innerHTML=c?caseView(c,data,notes[c.id]):'<h1>Case not found</h1><a href="#cases">Return to case library</a>';}
  else main.innerHTML='<h1>Page not found</h1><a href="#cases">Return to case library</a>';
}
main.addEventListener('input',event=>{
  const target=event.target;
  if(target.id==='search'){const start=target.selectionStart,end=target.selectionEnd;query=target.value;route();const input=document.querySelector('#search');input.focus();input.setSelectionRange(start,end);}
  if(target.dataset.question){(notes[target.dataset.case]??={})[target.dataset.question]=target.value;const c=data.cases.find(c=>c.id===target.dataset.case);document.querySelector('#progress').textContent=`${c.questions.filter(q=>notes[c.id][q.id]?.trim()).length} / ${c.questions.length} practice answers`;}
  if(target.closest('#intake-form')){draft=Object.fromEntries(new FormData(document.querySelector('#intake-form')));submitted=null;document.querySelector('#intake-result').innerHTML='<div class="panel"><h2>Draft updated.</h2><p class="muted">Build the review brief to reflect your latest answers.</p></div>';}
});
main.addEventListener('submit',event=>{
  if(event.target.id!=='intake-form')return;event.preventDefault();draft=Object.fromEntries(new FormData(event.target));
  if(draft.prompt.trim().length<15){notify('Add at least 15 non-whitespace characters to the request.');return;}
  submitted={...draft};document.querySelector('#intake-result').innerHTML=resultView(submitted,data);notify('Review brief built from your structured selections.');
});
main.addEventListener('click',event=>{
  const button=event.target.closest('[data-action]');if(!button)return;
  const c=data.cases.find(c=>c.id===button.dataset.id);
  switch(button.dataset.action){
    case 'export-all':download('dstruct-synthetic-cases.jsonl',datasetJsonl(data),'application/x-ndjson');notify('Dataset exported: 5 synthetic cases.');break;
    case 'export-case':download(`${c.id}.json`,JSON.stringify(caseRecord(c,data,notes[c.id]),null,2));notify('Case and practice notes exported.');break;
    case 'export-brief':download(`${c.id}-brief.md`,markdownBrief(caseRecord(c,data,notes[c.id])),'text/markdown');notify('Review brief exported.');break;
    case 'use-case':draft={prompt:c.prompt,...c.intake};submitted=null;location.hash='intake';break;
    case 'reset-intake':draft={};submitted=null;route();notify('Intake draft reset.');break;
    case 'export-intake':if(submitted){download('dstruct-intake.json',JSON.stringify({schemaVersion:data.common.schemaVersion,provenance:{kind:'user-entered-demo',expertReview:'Not reviewed'},input:submitted,result:analyze(submitted),baseline:data.common.baseline,sources:data.sources},null,2));notify('Intake brief exported.');}break;
  }
});
try{data=await loadData();route();window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);main.focus({preventScroll:true});});}
catch(error){main.innerHTML=`<div class="panel"><h1>Unable to open the casebook.</h1><p>${e(error.message)}</p><p>Run <code>npm start</code> and open the local server, then reload.</p><button data-action="reload">Reload</button></div>`;main.querySelector('button').addEventListener('click',()=>location.reload());}
