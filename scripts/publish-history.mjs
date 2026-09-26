import {spawnSync} from 'node:child_process';
import {mkdirSync,appendFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

process.chdir(fileURLToPath(new URL('..',import.meta.url)));
const target='git@github.com:Gwen-M/dstruct.git';
const git=(args)=>{
  const r=spawnSync('git',args,{encoding:'utf8',env:{...process.env,GIT_SSH_COMMAND:'ssh -o BatchMode=yes -o ConnectTimeout=15'},timeout:60000});
  if(r.status!==0)throw new Error(`git ${args[0]} failed: ${r.stderr || r.error || 'unknown error'}`);
  return r.stdout.trim();
};
if(git(['status','--porcelain']))throw new Error('Commit all intended changes before publishing. Working tree must be clean.');
if(git(['branch','--show-current'])!=='main')throw new Error('Run from main.');
if(git(['remote','get-url','origin'])!==target)throw new Error(`Expected origin ${target}`);
const commits=git(['rev-list','--reverse','main']).split('\n');
const remote=git(['ls-remote','origin','refs/heads/main']).split(/\s/)[0];
if(remote&&!commits.includes(remote))throw new Error('Remote history diverged. Resolve it manually; this script never force-pushes.');
const pending=remote?commits.slice(commits.indexOf(remote)+1):commits;
mkdirSync('.local',{recursive:true});
let pushed=0;
for(const sha of pending){
  git(['push','origin',`${sha}:refs/heads/main`]);
  const actual=git(['ls-remote','origin','refs/heads/main']).split(/\s/)[0];
  if(actual!==sha)throw new Error('Remote head changed unexpectedly; stopped.');
  appendFileSync('.local/push-log.jsonl',JSON.stringify({pushedAt:new Date().toISOString(),sha,remote:target,verified:true})+'\n');
  console.log(`Verified push ${++pushed}/${pending.length}: ${sha.slice(0,7)}`);
}
git(['fetch','origin','main']);
git(['branch','--set-upstream-to=origin/main','main']);
console.log(`Complete: ${pushed} separate verified pushes this run. Repository: https://github.com/Gwen-M/dstruct`);
