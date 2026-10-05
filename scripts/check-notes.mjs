#!/usr/bin/env node
// Evidence is retained at build time, never rendered as public footnotes.
import {readJSON,validateEvidence,report} from './content-guards.mjs';
const evidence=readJSON('evidence'),projects=readJSON('projects'),research=readJSON('research');
const errors=validateEvidence(evidence,projects,research,{local:process.argv.includes('--local')});
report('check-notes',errors,`${evidence.length} internal sources, references and conditions intact`);
