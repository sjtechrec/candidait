import test from 'node:test';
import assert from 'node:assert/strict';
import {validTopic, buildDraft} from '../../assets/help-request.mjs';
const sample={topic:'appeal', summary:' Example ', reference:'', details:' Fictional decision ', access:''};
test('unknown and inherited topic names cannot select an unsupported route',()=>{
  for(const value of [null,'unknown','__proto__','constructor']) assert.equal(validTopic(value),'technical');
  assert.equal(validTopic('recovery'),'recovery');
});
test('empty required information never produces a draft that resembles a request',()=>{
  assert.equal(buildDraft({...sample,summary:' '}),null);
  assert.equal(buildDraft({...sample,details:'\n'}),null);
});
test('draft clearly says unsent and preserves text without interpreting markup',()=>{
  const draft=buildDraft({...sample,details:'<script>fictional</script>'});
  assert.match(draft,/^PREVIEW ONLY: NOT SUBMITTED/);
  assert.ok(draft.includes('<script>fictional</script>'));
  assert.ok(!draft.includes('Reference:'));
});
