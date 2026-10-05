import test from 'node:test';
import assert from 'node:assert/strict';
import {validateEvidence,metadataViolations,publicText} from './content-guards.mjs';
const evidence=[{id:'service-source',kind:'scope',body:'구현 근거',refs:['/local/source.py']}];
const projects=[{id:'service',evidenceIds:['service-source'],cases:[]}];
test('internal provenance can retain dates without depending on another machine',()=>{
  assert.deepEqual(validateEvidence([{...evidence[0],body:'2026-09-20 파일 대조'}],projects,[]),[]);
});
test('unknown, unused and duplicate evidence cannot silently pass',()=>{
  assert.match(validateEvidence(evidence,[{...projects[0],evidenceIds:['missing']}],[]).join(' '),/unknown evidence missing/);
  assert.match(validateEvidence(evidence,[],[]).join(' '),/unused evidence/);
  assert.match(validateEvidence([...evidence,...evidence],projects,[]).join(' '),/duplicate id/);
});
test('measurement conditions and source links stay mandatory',()=>{
  assert.match(validateEvidence([{...evidence[0],kind:'measurement'}],projects,[]).join(' '),/requires a condition/);
  assert.match(validateEvidence([{...evidence[0],kind:'source'}],projects,[]).join(' '),/requires a URL/);
});
test('STAR cases must independently reference existing evidence',()=>{
  assert.match(validateEvidence(evidence,[{...projects[0],cases:[{id:'failure',evidenceIds:['missing']}]}],[]).join(' '),/service\/failure: unknown evidence/);
});
test('public metadata is caught in body, image alternative and share description',()=>{
  for(const html of ['<p>2026-09-20</p>','<img alt="검증 완료" src="/real.png">','<meta name="description" content="테스트 93개 통과">','<svg><text>319</text></svg>']){
    assert.ok(metadataViolations(publicText(html)).length,html);
  }
});
test('source URLs, IDs and actual screenshot pixels are not public copy',()=>{
  const html='<a href="/research/ask-2026/" id="paper-2026">논문 보기</a><img src="/screen-20260920.png" alt="MAP 일정 화면"><script>const date="2026-09-20"</script>';
  assert.deepEqual(metadataViolations(publicText(html)),[]);
});
test('visible year and private contact are rejected but analytical units remain',()=>{
  assert.ok(metadataViolations('ASK 2026').length);
  assert.ok(metadataViolations('010-1234-5678').length);
  assert.deepEqual(metadataViolations('25개 자치구 · 빈도 43회 · 4 / 7저자'),[]);
});
