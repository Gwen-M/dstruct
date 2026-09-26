import {scenes,duration,sceneAt,captionAt} from './story.js';
const C={ink:'#173D33',deep:'#102E28',cream:'#F5F3E9',lime:'#D8F29D',muted:'#92ADA1',line:'#36594C',white:'#FFFFFF',paper:'#E8EADD',orange:'#F3B68C'};
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>1-Math.pow(1-clamp(x),3);
export function render(ctx,time,{captions=false,prototypeImage=null}={}){
 const s=sceneAt(time), i=scenes.indexOf(s), t=time-s.start, dark=[0,1,4,7,10].includes(i);
 const bg=dark?C.deep:C.cream, fg=dark?C.cream:C.ink, soft=dark?C.muted:'#62786A';
 ctx.save();ctx.clearRect(0,0,1280,720);ctx.fillStyle=bg;ctx.fillRect(0,0,1280,720);
 const txt=(v,x,y,size=24,color=fg,weight=400,font='Arial')=>{ctx.fillStyle=color;ctx.font=`${weight} ${size}px ${font}`;ctx.textBaseline='top';ctx.fillText(v,x,y);};
 const lines=(v,x,y,size=24,color=fg,weight=400,gap=1.15,font='Arial')=>v.split('\n').forEach((l,k)=>txt(l,x,y+k*size*gap,size,color,weight,font));
 const box=(x,y,w,h,fill,r=16,stroke=null)=>{ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}};
 const line=(x,y,xx,yy,color=C.line,width=2)=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();};
 const dot=(x,y,r,color)=>{ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();};
 const appear=(at,fn)=>{const p=ease((t-at)/.9);ctx.save();ctx.globalAlpha=p;ctx.translate(0,(1-p)*22);fn();ctx.restore();};
 const tag=(v,x,y,fill=dark?C.line:'#E2E8D6',color=fg)=>{box(x,y,ctx.measureText(v).width+28,30,fill,15);txt(v,x+14,y+7,14,color,600);};
 const title=(size=58)=>appear(.12,()=>lines(s.title,64,142,size,fg,500,1.13,'Georgia'));
 // Shared frame: restrained typography and editorial progress marks.
 txt('d',64,35,42,dark?C.lime:C.ink,700,'Georgia');txt('dstruct',105,46,24,fg,600);
 txt(i===9?'WORKING PROTOTYPE':'PRODUCT VISION',991,48,13,soft,600);
 line(64,100,1216,100,dark?C.line:'#D5DCCE',1);
 txt(String(i+1).padStart(2,'0')+' / '+String(scenes.length).padStart(2,'0'),64,690,13,soft,500);
 txt(s.label.toUpperCase(),155,690,13,soft,600);
 scenes.forEach((a,n)=>{box(917+n*27,697,19,3,n<=i?(dark?C.lime:C.ink):(dark?C.line:'#D6DECE'),1);});
 if(i===0){
   appear(.2,()=>lines(s.title,64,178,76,fg,500,1.1,'Georgia'));
   appear(2,()=>txt('An AI workspace for web3 founders',68,398,27,C.muted));
   // An abstract document orbit resolves into a company file.
   ctx.save();ctx.translate(1030,340);ctx.rotate(Math.sin(time*.25)*.06);
   for(let n=3;n>=0;n--){box(-130+n*18,-125+n*15,210,260,n===0?C.lime:C.line,14);}
   txt('d',-98,-102,78,C.ink,700,'Georgia');line(-92,12,42,12,C.ink,3);line(-92,38,18,38,C.ink,3);txt('FOUNDER FILE',-92,90,13,C.ink,600);ctx.restore();
   appear(4,()=>txt('A clearer path from the first question to the next step.',68,532,20,C.cream));
 } else if(i===1){
   title(66);appear(1,()=>lines('Your team is already building.\nThe legal work is scattered.',66,341,25,C.muted));
   const cards=[['TEAM CHAT','Who owns the code?',735,153,-.06],['TREASURY','Who can sign?',845,290,.045],['INCORPORATION','Where do we start?',706,441,-.035]];
   cards.forEach(([a,b,x,y,r],n)=>appear(n*1.5+.4,()=>{ctx.save();ctx.translate(x,y+Math.sin(t*.6+n)*5);ctx.rotate(r);box(0,0,370,130,n===2?C.lime:'#244A3D',12);txt(a,24,22,12,n===2?C.ink:C.muted,600);txt(b,24,61,26,n===2?C.ink:C.cream,500);ctx.restore();}));
 } else if(i===2){
   title();appear(.6,()=>{
     box(64,260,1152,330,C.white,18,'#DCE3D4');txt('NEW FOUNDER INTAKE',94,290,13,'#6C8273',600);
     const prompt=['“We’re two founders in France and India.', 'We’re building on Ethereum with a shared treasury.', 'We want to raise funding.', 'Should we form a Delaware company?”'];
     prompt.forEach((v,n)=>appear(.9+n*1.1,()=>txt(v,94,333+n*45,29,C.ink,400,'Georgia')));
     txt('FICTIONAL FOUNDER SCENARIO',94,554,12,'#6C8273',600);
   });
 } else if(i===3){
   title(57);txt('A focused conversation, shaped by the founder’s facts.',66,291,22,soft);
   const qs=[['01','Team & location','Where do you live and work?'],['02','Ownership','Who owns the code today?'],['03','Business activity','What will the product do?'],['04','Token plans','What rights would a token give?']];
   qs.forEach(([n,a,b],k)=>appear(.6+k*1.4,()=>{const x=64+(k%2)*587,y=352+Math.floor(k/2)*125;box(x,y,565,106,C.white,12,'#DBE2D4');txt(n,x+24,y+24,16,'#80917F');txt(a,x+65,y+20,17,'#647A67',600);txt(b,x+65,y+50,24,C.ink);}));
 } else if(i===4){
   title(56);txt('A shared view for founders and their advisers',66,292,22,C.muted);
   const nodes=[{x:92,y:423,w:277,title:'Founders',sub:'Residence / ownership'},{x:499,y:423,w:277,title:'Company',sub:'Authority / obligations'},{x:906,y:423,w:277,title:'Multisig',sub:'Signers / treasury'}];
   appear(.8,()=>{line(340,479,955,479,C.muted);for(let j=0;j<5;j++){const p=((t*.13+j*.2)%1);dot(345+p*590,479,4,C.lime);}});
   nodes.forEach((n,k)=>appear(.4+k*.65,()=>{box(n.x,n.y,n.w,122,k===1?C.lime:'#21483B',16);txt(n.title,n.x+24,n.y+25,29,k===1?C.ink:C.cream,500,'Georgia');txt(n.sub,n.x+24,n.y+76,17,k===1?C.ink:C.muted);}));
   appear(5,()=>txt('Wallet control and legal authority need to be considered together.',92,584,20,C.cream));
 } else if(i===5){
   title(57);appear(.6,()=>lines('AI organizes the context.\nThe team works through the decisions.',66,326,24,soft));
   appear(.8,()=>{box(675,143,541,455,C.white,16,'#DCE3D4');txt('INCORPORATION BRIEF',705,174,13,'#6A7C65',600);txt('Orbit / Founder workspace',705,210,28,C.ink,500,'Georgia');line(705,257,1186,257,'#DCE3D4',1);});
   [['Known','Two founders / France + India'],['To clarify','IP ownership / token plans'],['For review','Entity choice / treasury structure'],['Next action','Prepare adviser handoff']].forEach(([a,b],k)=>appear(1.8+k*1.7,()=>{dot(717,299+k*77,5,k===1?'#C17D51':C.ink);txt(a,736,282+k*77,13,'#728068',600);txt(b,736,304+k*77,21,C.ink);}));
 } else if(i===6){
   title(57);txt('A brief with context, open questions, and references.',66,292,22,soft);
   const rows=[['Entity & governance','Company counsel','Structure / authority / ownership'],['Cross-border exposure','Tax adviser','Residence / activity / obligations'],['Token design','Specialist counsel','Rights / distribution / review']];
   rows.forEach(([a,b,c],n)=>appear(.6+n*1.7,()=>{const y=353+n*77;line(64,y+66,1216,y+66,'#D6DECD',1);txt(a,64,y+13,24,C.ink,500);txt(b,495,y+15,20,C.ink);txt(c,813,y+15,18,'#687F6E');}));
 } else if(i===7){
   title(60);appear(1,()=>lines('Legal documents belong\nin a private workspace.',66,325,26,C.muted));
   appear(.5,()=>{box(731,164,459,403,'#20473B',18,C.line);txt('SHARING SETTINGS',762,195,13,C.muted,600);txt('Founder brief',762,234,34,C.cream,500,'Georgia');});
   [['Company counsel','Selected documents'],['Tax adviser','Relevant facts'],['Public','No legal documents']].forEach(([a,b],n)=>appear(1.5+n*1.7,()=>{const y=312+n*72;txt(a,762,y,22,C.cream);txt(b,762,y+29,16,C.muted);dot(1148,y+16,8,n===2?'#73907E':C.lime);}));
   appear(6,()=>txt('Permissions shown as a proposed product experience.',66,570,17,C.muted));
 } else if(i===8){
   title(57);txt('The next step stays visible.',66,292,24,soft);
   const steps=[['Ownership documents','Founder','IN PROGRESS'],['Structure review','Adviser','TO REVIEW'],['Company setup','Founder + adviser','NEXT'],['Ongoing obligations','Team','PLANNED']];
   steps.forEach(([a,b,c],n)=>appear(.5+n*1.2,()=>{const y=343+n*64;dot(78,y+20,8,n===0?C.ink:'#BCCBAF');if(n<3)line(78,y+29,78,y+74,'#C9D5BC',2);txt(a,109,y+5,25,C.ink);txt(b,605,y+10,19,soft);box(977,y,231,39,n===0?C.ink:'#E2E9D9',20);txt(c,1001,y+12,13,n===0?C.lime:C.ink,600);}));
 } else if(i===9){
   title(54);appear(.8,()=>{txt('5',66,340,64,C.ink,400,'Georgia');txt('synthetic founder cases',66,414,20,soft);txt('14',66,469,64,C.ink,400,'Georgia');txt('official source records',66,543,20,soft);});
   appear(.4,()=>{box(524,143,692,445,'#DCE4D4',15);if(prototypeImage){ctx.save();ctx.beginPath();ctx.roundRect(534,153,672,425,8);ctx.clip();ctx.drawImage(prototypeImage,534,153,672,425);ctx.restore();}else{box(540,159,660,413,C.white,8);txt('dstruct / Founder casebook',568,187,24,C.ink,500);['Case library','Structured intake','Source register','Exportable brief'].forEach((x,n)=>{txt(String(n+1).padStart(2,'0'),569,258+n*68,15,soft);txt(x,612,252+n*68,26,C.ink);line(568,296+n*68,1166,296+n*68,'#E0E6D7',1);});}});
 } else {
   appear(.2,()=>txt('dstruct',64,158,102,C.lime,500,'Georgia'));appear(1,()=>lines(s.title,69,316,61,C.cream,500,1.15,'Georgia'));appear(3,()=>txt('An AI workspace for web3 founders',69,503,25,C.muted));appear(4,()=>txt('Explore the prototype  /  github.com/Gwen-M/dstruct',69,564,20,C.cream));
 }
 // Small, consistent concept label distinguishes the future experience.
 
 if(captions){const cap=captionAt(time);ctx.font='20px Arial';const words=cap.split(' '),out=[];let row='';for(const w of words){if(ctx.measureText(row+' '+w).width>1060){out.push(row);row=w;}else row+=(row?' ':'')+w;}if(row)out.push(row);const h=out.length*27+22;box(89,608,1102,h,'rgba(11,27,23,.93)',8);out.forEach((v,n)=>{ctx.textAlign='center';txt(v,640,620+n*27,20,'#FFFFFF');ctx.textAlign='left';});}
 ctx.fillStyle=dark?C.lime:C.ink;ctx.fillRect(0,716,1280*clamp(time/duration),4);
 // Soft dip to background at each editorial cut.
 const fade=1-Math.min(clamp(t/.35),clamp((s.duration-t)/.35));if(fade>0&&time<duration-.1){ctx.globalAlpha=fade;ctx.fillStyle=bg;ctx.fillRect(0,106,1280,532);}
 ctx.restore();
}
