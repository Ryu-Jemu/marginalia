import {existsSync,readdirSync,readFileSync,statSync} from 'node:fs';
import {join,resolve,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
export const ROOT=fileURLToPath(new URL('..',import.meta.url));
export const readJSON=name=>JSON.parse(readFileSync(join(ROOT,'src/content',`${name}.json`),'utf8'));
export function filesBelow(dir,extensions){
  if(!existsSync(dir)) return [];
  return readdirSync(dir).flatMap(name=>{const path=join(dir,name);return statSync(path).isDirectory()?filesBelow(path,extensions):(!extensions||extensions.includes(extname(path)))?[path]:[];});
}
export function duplicateIds(rows,label){
  const errors=[],ids=new Set();
  for(const row of rows){if(typeof row.id!=='string'||!row.id.trim()) errors.push(`${label}: missing id`);else if(ids.has(row.id)) errors.push(`${label}: duplicate id ${row.id}`);ids.add(row.id);}
  return errors;
}
export function validateEvidence(evidence,projects,research,{local=false}={}){
  const errors=duplicateIds(evidence,'evidence'),ids=new Set(evidence.map(v=>v.id)),used=new Set();
  for(const note of evidence){
    if(!['scope','source','measurement'].includes(note.kind)) errors.push(`${note.id}: invalid evidence kind`);
    if(!note.body?.trim()) errors.push(`${note.id}: empty evidence description`);
    if(note.kind==='measurement'&&!note.condition?.trim()) errors.push(`${note.id}: measurement requires a condition`);
    if(note.kind==='source'&&!/^https?:\/\//.test(note.href??'')) errors.push(`${note.id}: source requires a URL`);
    if(!Array.isArray(note.refs)||!note.refs.length) errors.push(`${note.id}: missing internal source reference`);
    for(const ref of note.refs??[]){
      if(typeof ref!=='string'||!ref.trim()){errors.push(`${note.id}: empty source reference`);continue;}
      if(/^https?:\/\//.test(ref)){try{new URL(ref);}catch{errors.push(`${note.id}: invalid source URL ${ref}`);}continue;}
      if(!ref.includes('/')||/[\r\n]/.test(ref)) errors.push(`${note.id}: invalid file reference ${ref}`);
      const path=ref.replace(/#.*$/,'').replace(/:\d+(?:-\d+)?$/,'');
      if(local&&!existsSync(resolve(ROOT,path))) errors.push(`${note.id}: local source unavailable ${ref}`);
    }
  }
  const check=(owner)=>{
    if(!Array.isArray(owner.evidenceIds)||!owner.evidenceIds.length) errors.push(`${owner.id}: evidence required`);
    for(const id of owner.evidenceIds??[]){used.add(id);if(!ids.has(id)) errors.push(`${owner.id}: unknown evidence ${id}`);}
  };
  for(const project of projects){check(project);for(const item of project.cases??[])check({...item,id:`${project.id}/${item.id}`});}
  for(const paper of research)check(paper);
  for(const id of ids)if(!used.has(id))errors.push(`${id}: unused evidence; connect it or remove it`);
  return errors;
}
export function stringLeaves(value,path=''){
  if(typeof value==='string')return [{path,value}];
  if(Array.isArray(value))return value.flatMap((item,i)=>stringLeaves(item,`${path}[${i}]`));
  if(value&&typeof value==='object')return Object.entries(value).flatMap(([key,item])=>stringLeaves(item,path?`${path}.${key}`:key));
  return [];
}
export const placeholderPattern=/\{\{[^}]+\}\}|\{(?:name|title|label|index|of|count|value|year|date|TODO)\}|\b(?:TODO|TBD|FIXME|Lorem ipsum)\b|여기에\s*(?:입력|작성)|준비\s*중인\s*내용/i;
export function decodeHTML(value){return value.replace(/&#(x[\da-f]+|\d+);/gi,(_,n)=>String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g,s=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&nbsp;':' '})[s]);}
export function publicText(html){
  const cleaned=html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<!--[\s\S]*?-->/g,'');
  const attrs=[...cleaned.matchAll(/\b(?:alt|title|aria-label|aria-description)="([^"]*)"/gi)].map(m=>decodeHTML(m[1]));
  for(const match of cleaned.matchAll(/<meta\b[^>]*>/gi)){
    if(/\b(?:name|property)="(?:description|og:title|og:description|og:image:alt|twitter:title|twitter:description)"/i.test(match[0]))attrs.push(decodeHTML(match[0].match(/\bcontent="([^"]*)"/i)?.[1]??''));
  }
  return decodeHTML(cleaned.replace(/<[^>]*>/g,' '))+' '+attrs.join(' ');
}
export function metadataViolations(text){
  const rules=[
    ['calendar metadata',/\b(?:19|20)\d{2}(?:[-./]\d{1,2}){1,2}\b|\b(?:19|20)\d{2}\s*년|\b(?:19|20)\d{2}\s*[–—~]\s*(?:(?:19|20)\d{2}|현재)/],
    ['published year',/\b20\d{2}\b/],
    ['audit metadata',/검증일|검증\s*완료|검사\s*통과|감사\s*기록|확인\s*기준일|최종\s*수정|커밋|commit\s*(?:hash|id)|\b[0-9a-f]{40}\b/i],
    ['test totals',/(?:테스트|회귀\s*검사|검증|read-only\s*probes)[^.!?]{0,28}\b\d[\d,]*\s*(?:개|건|회|통과)|\b\d[\d,]*\s*(?:개|건|회)[^.!?]{0,15}(?:테스트|검사\s*통과)/i],
    ['retired measurement',/\b(?:3,?948|2,?067|1,?962|319)\b/],
    ['private contact',/\b01[016789]-?\d{3,4}-?\d{4}\b|생년월일|주민등록|자택\s*주소/],
    ['unresolved placeholder',placeholderPattern],
  ];
  return rules.filter(([,pattern])=>pattern.test(text)).map(([label,pattern])=>`${label}: ${text.match(pattern)?.[0]}`);
}
export function report(name,errors,message){if(errors.length){console.error(`${name}: ${errors.length} problem(s)\n${errors.map(v=>'  '+v).join('\n')}`);process.exitCode=1;}else console.log(`${name}: ${message}`);}
