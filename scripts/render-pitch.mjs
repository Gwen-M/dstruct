// Optional offline MP4 export. Runtime app has no dependencies.
// CANVAS_MODULE points to @napi-rs/canvas; FFMPEG points to an ffmpeg binary.
import {spawn} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {once} from 'node:events';
import {pathToFileURL} from 'node:url';
import {render} from '../pitch/render.js';
import {scenes,duration,captionAt} from '../pitch/story.js';
const {createCanvas,loadImage}=await import(process.env.CANVAS_MODULE?pathToFileURL(process.env.CANVAS_MODULE).href:'@napi-rs/canvas');
const out=process.argv[2]||'.local/presentation';await mkdir(out,{recursive:true});
const prototypeImage=await loadImage(new URL('../pitch/prototype.png',import.meta.url).pathname);
const canvas=createCanvas(1280,720),ctx=canvas.getContext('2d');
for(const [i,s] of scenes.entries()){render(ctx,s.start+Math.min(8,s.duration-1),{captions:true,prototypeImage});await writeFile(`${out}/scene-${String(i+1).padStart(2,'0')}.png`,canvas.toBuffer('image/png'));}
const stamp=n=>`${String(Math.floor(n/3600)).padStart(2,'0')}:${String(Math.floor(n%3600/60)).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')},${String(Math.round(n%1*1000)).padStart(3,'0')}`;
let n=1;const subs=[];for(const s of scenes){const rows=s.voice.match(/[^.!?]+[.!?]+/g)||[s.voice];rows.forEach((row,j)=>subs.push(`${n++}\n${stamp(s.start+j*s.duration/rows.length)} --> ${stamp(s.start+(j+1)*s.duration/rows.length)}\n${row.trim()}\n`));}
await writeFile(`${out}/dstruct-subtitles.srt`,subs.join('\n'));
await writeFile(`${out}/presentation-script.md`,'# Dstruct / 2:16 product vision\n\nSilent animation with English subtitles. All scenario facts are fictional.\n\n'+scenes.map(s=>`## ${stamp(s.start).slice(3,8)} / ${s.label}\n\n${s.voice}`).join('\n\n'));
if(process.argv.includes('--stills'))process.exit(0);
const fps=24;
const ff=spawn(process.env.FFMPEG||'ffmpeg',['-y','-f','rawvideo','-pixel_format','rgba','-video_size','1280x720','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',`${out}/dstruct-vision.mp4`],{stdio:['pipe','ignore','inherit']});
let failed=null;ff.on('error',e=>failed=e);ff.stdin.on('error',e=>failed=e);const done=once(ff,'close');
for(let f=0;f<duration*fps;f++){if(failed)throw failed;render(ctx,f/fps,{captions:true,prototypeImage});if(!ff.stdin.write(Buffer.from(ctx.getImageData(0,0,1280,720).data)))await once(ff.stdin,'drain');if(f%(fps*10)===0)console.log(`Rendered ${f/fps}s / ${duration}s`);}
ff.stdin.end();const [code]=await done;if(code!==0)throw new Error(`ffmpeg failed: ${code}`);console.log(`Exported ${out}/dstruct-vision.mp4 (${duration}s, 1280×720, 24fps, subtitles burned in)`);
