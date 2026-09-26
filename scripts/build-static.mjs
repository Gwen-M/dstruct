import {cp,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('dist/',root),{recursive:true});
for(const entry of ['index.html','src','data'])await cp(new URL(entry,root),new URL(`dist/${entry}`,root),{recursive:true});
console.log('Static demo built in dist/ from application assets only.');
