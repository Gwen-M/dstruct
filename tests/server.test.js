import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAppServer} from '../server.mjs';
test('HTTP server serves app assets while protecting repository and local files',async()=>{
  const server=createAppServer();
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base=`http://127.0.0.1:${server.address().port}`;
  try{
    for(const path of ['/','/src/app.js','/pitch/','/pitch/player.js','/pitch/prototype.png','/data/cases/01-solo-consultant.json'])assert.equal((await fetch(base+path)).status,200);
    for(const path of ['/.git/config','/.env','/server.mjs','/src/../server.mjs','/data/cases/../../package.json','/pitch/../../.local/submission/public-copy.md','/pitch/private.txt','/missing'])assert.equal((await fetch(base+path)).status,404);
    assert.equal((await fetch(base+'/%ZZ')).status,400);
    assert.equal((await fetch(base+'/',{method:'POST',body:'demo'})).status,405);
    const response=await fetch(base+'/data/sources.json');assert.match(response.headers.get('content-type'),/application\/json/);assert.match(response.headers.get('content-security-policy'),/connect-src 'self'/);
    const video=await fetch(base+'/pitch/dstruct-vision.mp4',{method:'HEAD'});assert.equal(video.status,200);assert.equal(video.headers.get('content-type'),'video/mp4');
    assert.equal(await (await fetch(base+'/',{method:'HEAD'})).text(),'');
  }finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
});
