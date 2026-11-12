import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { STORAGE_KEY, initialState, preset, saveVersion, restoreVersion, exportPlan } from '../dist/model.js';
const state = initialState();
assert.match(STORAGE_KEY, /^cuju_portfolio_demo_/);
assert.equal(state.current, null);
assert.equal(state.insight.status, 'pending_confirmation');
for (const minutes of [60, 45]) {
  const plan = preset(minutes);
  assert.equal(plan.activities.reduce((sum, activity) => sum + activity.duration, 0), minutes);
  assert.equal(plan.players, 16);
}
saveVersion(state, preset(), '生成示例');
const firstSnapshot = JSON.stringify(state.versions[0]);
const firstContext = JSON.stringify(state.versions[0].content.contextSnapshot);
state.team.name = '修改后的球队名';
state.cycle.name = '修改后的周期名';
assert.notEqual(state.current.contextSnapshot.team.name, state.team.name);
state.current.notes = '手工修改仅自动保存当前内容';
assert.equal(JSON.stringify(state.versions[0]), firstSnapshot);
saveVersion(state, preset(45), '修改示例');
restoreVersion(state, 1);
assert.equal(state.current.minutes, 60);
assert.equal(state.versions.length, 3);
assert.equal(state.versions[2].baseId, 1);
assert.equal(JSON.stringify(state.versions[0]), firstSnapshot);
assert.equal(JSON.stringify(state.current.contextSnapshot), firstContext);
assert.equal(state.versions[1].content.contextSnapshot.team.name, state.team.name);
state.current.activities[0].duration = 9;
assert.equal(state.versions[2].content.activities[0].duration, 10);
const text = exportPlan(state);
assert.match(text, /预设交互演示/);
assert.match(text, /虚构样例/);
assert.match(text, /60分钟/);
assert.match(text, /不提供自动脱敏/);
const appSource = await readFile(new URL('../dist/app.js', import.meta.url), 'utf8');
const buttonSource = appSource.match(/const btn = (.+);\n/)[1];
const renderButton = new Function(`return (${buttonSource})`)();
assert.match(renderButton('拒绝', 'reject-insight'), /type="button"/);
assert.match(renderButton('提交', 'submit-insight', 'primary', 'type="submit"'), /type="submit"/);
assert.doesNotMatch(renderButton('提交', 'submit-insight', 'primary', 'type="submit"'), /type="button"/);
for (const file of ['app.js', 'model.js', 'styles.css', 'index.html']) {
  const source = await readFile(new URL(`../dist/${file}`, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /fetch\s*\(|XMLHttpRequest|WebSocket|https?:\/\//, `${file}: must remain offline`);
}
console.log('PASS: preset totals, isolated storage, immutable content/context snapshots, restore-as-new, honest export, non-submit action buttons, static offline boundary.');
