#!/usr/bin/env node
import {existsSync,readFileSync} from 'node:fs';
import {join,relative,resolve,sep} from 'node:path';
import {ROOT,filesBelow,publicText,metadataViolations,decodeHTML,readJSON,report} from './content-guards.mjs';
const dist=join(ROOT,'dist'),errors=[],files=filesBelow(dist,['.html']);
if(!files.length)errors.push('No generated HTML; run astro build first');
const site='https://ryu-jemu-marginalia.onrender.com';
const documents=new Map(files.map(file=>[file,readFileSync(file,'utf8')]));
const publicPath=file=>'/'+relative(dist,file).split(sep).join('/').replace(/index\.html$/,'');
const htmlFile=pathname=>join(dist,decodeURIComponent(pathname),pathname.endsWith('/')?'index.html':'');
for(const [file,html] of documents){
  const path=publicPath(file);
  if(!/<html\b[^>]*\blang="ko"/i.test(html))errors.push(`${path}: html must declare Korean`);
  for(const problem of metadataViolations(publicText(html)))errors.push(`${path}: ${problem}`);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>decodeHTML(m[1]));
  const idSet=new Set();
  for(const id of ids){if(idSet.has(id))errors.push(`${path}: duplicate id ${id}`);idSet.add(id);}
  if(path.startsWith('/ko/')){
    const target=path.replace(/^\/ko\//,'/');
    if(!html.includes(`data-redirect="${target}"`))errors.push(`${path}: unexpected legacy destination`);
    if(!/location\.replace/.test(html)||!html.includes('location.search')||!html.includes('location.hash'))errors.push(`${path}: redirect must retain search and hash`);
    if(!/<noscript>[\s\S]*?http-equiv="refresh"/i.test(html))errors.push(`${path}: missing no-script fallback`);
    if(!/<meta\b[^>]*name="robots"[^>]*content="noindex"/.test(html))errors.push(`${path}: legacy page should be noindex`);
  }
  for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
    const href=decodeHTML(match[1]);
    if(!href||/^(?:mailto:|tel:|data:|blob:|javascript:)/.test(href))continue;
    let url;try{url=new URL(href,new URL(path,site));}catch{errors.push(`${path}: invalid URL ${href}`);continue;}
    if(url.origin!==site)continue;
    let target;try{target=htmlFile(url.pathname);}catch{errors.push(`${path}: malformed URL encoding ${href}`);continue;}
    if(!resolve(target).startsWith(resolve(dist)+sep)){errors.push(`${path}: local URL escapes site ${href}`);continue;}
    if(!existsSync(target)){
      if(existsSync(join(target,'index.html')))target=join(target,'index.html');
      else{errors.push(`${path}: missing local target ${href}`);continue;}
    }
    if(url.hash&&target.endsWith('.html')){
      const targetHTML=documents.get(target)??readFileSync(target,'utf8');
      const targetIds=new Set([...targetHTML.matchAll(/\bid="([^"]+)"/g)].map(m=>decodeHTML(m[1])));
      let hash;try{hash=decodeURIComponent(url.hash.slice(1));}catch{hash=url.hash.slice(1);}
      if(!targetIds.has(hash))errors.push(`${path}: missing fragment ${href}`);
    }
  }
}
for(const id of ['pipelines','analysis','research','more','about']){
  const home=documents.get(join(dist,'index.html'))??'';
  if(!home.includes(`id="${id}"`))errors.push(`/: missing legacy section anchor #${id}`);
}
for(const slug of ['wealthy','invader-sdp','f1-kiosk','mobile-ar']){
  for(const prefix of ['work','ko/work'])if(existsSync(join(dist,prefix,slug)))errors.push(`Removed project route remains: ${prefix}/${slug}`);
}
for(const [collection,path,key] of [['projects','work','id'],['research','research','id']]){
  for(const row of readJSON(collection)){
    if(!existsSync(join(dist,path,row[key],'index.html')))errors.push(`Missing ${path}/${row[key]} route`);
    if(!existsSync(join(dist,'ko',path,row[key],'index.html')))errors.push(`Missing legacy ko/${path}/${row[key]} route`);
  }
}
for(const file of filesBelow(join(ROOT,'public'),['.svg'])){
  for(const problem of metadataViolations(publicText(readFileSync(file,'utf8'))))errors.push(`${relative(ROOT,file)}: ${problem}`);
}
report('check-public',errors,`${files.length} Korean pages; public copy, legacy routes, fragments and assets checked`);
