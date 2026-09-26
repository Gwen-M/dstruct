import {createServer} from 'node:http';
import {readFile,realpath} from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {resolve,extname,sep} from 'node:path';

const root=fileURLToPath(new URL('.',import.meta.url));
const mime={'.png':'image/png','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
export function createAppServer(){
  return createServer(async(req,res)=>{
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Cache-Control','no-store');
    res.setHeader('Referrer-Policy','no-referrer');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD'});res.end('Method not allowed');return;}
    try{
      const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
      const allowed=path==='/'||path==='/index.html'||path==='/pitch/'||/^\/pitch\/(index\.html|player\.css|player\.js|story\.js|render\.js|prototype\.png)$/.test(path)||/^\/src\/[a-z-]+\.(js|css)$/.test(path)||path==='/data/sources.json'||path==='/data/common.json'||/^\/data\/cases\/[a-z0-9-]+\.json$/.test(path);
      if(!allowed){res.writeHead(404);res.end('Not found');return;}
      const target=await realpath(resolve(root,'.'+(path==='/'?'/index.html':path==='/pitch/'?'/pitch/index.html':path)));
      if(!target.startsWith(root.endsWith(sep)?root:root+sep)){res.writeHead(404);res.end('Not found');return;}
      const contents=await readFile(target);
      res.writeHead(200,{'Content-Type':mime[extname(target)]||'application/octet-stream'});
      res.end(req.method==='HEAD'?undefined:contents);
    }catch(error){res.writeHead(error instanceof URIError?400:404);res.end(error instanceof URIError?'Bad request':'Not found');}
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const port=Number(process.env.PORT||4173);
  if(!Number.isInteger(port)||port<1||port>65535)throw new Error('PORT must be an integer from 1 to 65535');
  const server=createAppServer();
  server.on('error',error=>{console.error(`Unable to start local server: ${error.message}`);process.exitCode=1;});
  server.listen(port,'127.0.0.1',()=>console.log(`Dstruct is running at http://127.0.0.1:${port}`));
}
