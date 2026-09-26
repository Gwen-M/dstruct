import {scenes,duration,sceneAt} from './story.js';
import {render} from './render.js';
const canvas=document.querySelector('#film'),ctx=canvas.getContext('2d');
const play=document.querySelector('#play'),seek=document.querySelector('#seek'),output=document.querySelector('#time'),cc=document.querySelector('#captions');
let position=0,playing=false,last=null,captions=true;
const prototypeImage=new Image();prototypeImage.src='/pitch/prototype.png';prototypeImage.onload=()=>update();
const fmt=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
const chapters=document.querySelector('#chapters');
for(const s of scenes){const b=document.createElement('button');b.textContent=s.label;b.addEventListener('click',()=>{position=s.start+.5;update();});chapters.append(b);const h=document.createElement('h2');h.textContent=`${fmt(s.start)} / ${s.label}`;const p=document.createElement('p');p.textContent=s.voice;document.querySelector('#transcript').append(h,p);}
function update(){render(ctx,position,{captions,prototypeImage:prototypeImage.complete&&prototypeImage.naturalWidth?prototypeImage:null});seek.value=position;output.value=`${fmt(position)} / ${fmt(duration)}`;play.textContent=playing?'Pause':position>=duration?'Replay':'Play';play.setAttribute('aria-label',`${playing?'Pause':'Play'} presentation`);[...chapters.children].forEach((b,i)=>b.setAttribute('aria-current',String(scenes[i]===sceneAt(position))));}
function toggle(){if(position>=duration)position=0;playing=!playing;last=null;update();}
play.addEventListener('click',toggle);
document.querySelector('#restart').addEventListener('click',()=>{position=0;last=null;update();});
seek.addEventListener('input',()=>{position=Number(seek.value);last=null;update();});
cc.addEventListener('click',()=>{captions=!captions;cc.textContent=`Subtitles ${captions?'on':'off'}`;cc.setAttribute('aria-pressed',String(captions));update();});
document.querySelector('#fullscreen').addEventListener('click',()=>document.querySelector('#stage').requestFullscreen?.());
document.addEventListener('keydown',event=>{if(event.code==='Space'&&!['INPUT','BUTTON','SUMMARY'].includes(document.activeElement.tagName)){event.preventDefault();toggle();}});
document.addEventListener('visibilitychange',()=>{last=null;});
function tick(now){if(playing&&!document.hidden){if(last!==null)position=Math.min(duration,position+(now-last)/1000);if(position>=duration)playing=false;update();}last=now;requestAnimationFrame(tick);}
update();requestAnimationFrame(tick);
