#!/usr/bin/env node
// The old mirror gate is now a single-language copy and content-reference gate.
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {ROOT,readJSON,duplicateIds,stringLeaves,placeholderPattern,report} from './content-guards.mjs';
const projects=readJSON('projects'),research=readJSON('research');
const errors=[...duplicateIds(projects,'projects'),...duplicateIds(research,'research')];
const knownProjects=new Set(projects.map(v=>v.id)),knownResearch=new Set(research.map(v=>v.id));
const requiredProjects=['map','dartoo','mini-project-glove','examiner','crime-analysis','cinema-dashboard','network-pricing','bp-llm','careerradar','starindex'];
for(const retired of ['wealthy','invader-sdp','f1-kiosk','mobile-ar'])if(knownProjects.has(retired))errors.push(`Removed project must not be published: ${retired}`);
for(const id of requiredProjects)if(!knownProjects.has(id))errors.push(`Missing project route: ${id}`);
for(const row of [...projects,...research]){
  for(const {path,value} of stringLeaves(row)){
    if(placeholderPattern.test(value))errors.push(`${row.id}.${path}: unresolved placeholder`);
    if(/^(?:tagline|question)$|^summary\[|^method\[|^role\[|^findings\[|^cases\[\d+\]\.(?:situation|task|cause)$/.test(path)&&!/[가-힣]/.test(value))errors.push(`${row.id}.${path}: Korean copy required`);
    if(path.endsWith('.href')){
      if(value.startsWith('/')){
        const pathname=value.split(/[?#]/)[0];
        const work=pathname.match(/^\/work\/([^/]+)\/?$/),paper=pathname.match(/^\/research\/([^/]+)\/?$/);
        if(work&&!knownProjects.has(work[1]))errors.push(`${row.id}: unknown work link ${value}`);
        else if(paper&&!knownResearch.has(paper[1]))errors.push(`${row.id}: unknown research link ${value}`);
        else if(!work&&!paper&&pathname!=='/'&&!existsSync(join(ROOT,'public',pathname)))errors.push(`${row.id}: missing public file ${value}`);
      }else if(!/^https:\/\//.test(value))errors.push(`${row.id}: unsupported public URL ${value}`);
    }
  }
}
for(const paper of research){
  if(!knownProjects.has(paper.project))errors.push(`${paper.id}: unknown implementation project ${paper.project}`);
  if(paper.authorPosition.index>paper.authorPosition.of)errors.push(`${paper.id}: invalid author position`);
}
const survey=research.find(v=>v.id==='ieee-tai-survey');
if(survey&&(survey.authorPosition.index!==4||survey.authorPosition.of!==7))errors.push('IEEE TAI author order must remain 4 of 7');
report('check-i18n',errors,`${projects.length} Korean projects and ${research.length} research entries; links and placeholders checked`);
