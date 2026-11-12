export const STORAGE_KEY = 'cuju_portfolio_demo_v1';
export const copy = value => JSON.parse(JSON.stringify(value));
export function preset(minutes = 60) {
  return { title: '向前传递，接应与创造空间', minutes, players: 16, goal: '识别向前传球机会，传球后主动移动接应。', notes: '在每轮间歇提问：持球队员还有哪些向前选择？', activities: minutes === 45 ? [
    { name: '带球与观察', duration: 8, detail: '16人分成4组，在四个小区内带球；观察空位，听提示变向。' },
    { name: '三人传跑接应', duration: 12, detail: '4组各4人，三角传递后移动接应；1人轮换观察，逐轮交换。' },
    { name: '4v4方向比赛', duration: 20, detail: '两片场地同时4v4，以端线接球得分；鼓励传后创造新线路。' },
    { name: '放松与回顾', duration: 5, detail: '低强度走动，分享一次有效接应的时机。' }
  ] : [
    { name: '带球与观察', duration: 10, detail: '16人分成4组，在四个小区内带球；观察空位，听提示变向。' },
    { name: '三人传跑接应', duration: 15, detail: '4组各4人，三角传递后移动接应；1人轮换观察，逐轮交换。' },
    { name: '4v4方向比赛', duration: 25, detail: '两片场地同时4v4，以端线接球得分；逐轮交流接应线路。' },
    { name: '放松与回顾', duration: 10, detail: '低强度走动、小组分享：什么时机移动能帮助同伴？' }
  ] };
}
export function initialState() {
  return { team: { name: '青禾 U12 蓝队', players: 18, minutes: 75, venue: '七人制人工草场', goal: '建立观察习惯与团队协作意识' }, cycle: { name: '秋季 · 接应与向前推进', players: 16, minutes: 60, venue: '半片七人制球场', goal: '持球前观察，传球后主动接应', start: '2026-10-19', end: '2026-11-15' }, current: null, versions: [], feedback: [], insight: { status: 'pending_confirmation', statement: '在小场方向比赛中，先观察再接应的提示可能帮助球队形成更多向前选择。', evidence: ['10月18日样例训练观察', '10月21日样例训练观察'] }, eventStatus: 'planned', invites: [] };
}
export function saveVersion(state, content, summary, baseId = null) {
  const savedContent = copy(content);
  savedContent.contextSnapshot ??= { team: copy(state.team), cycle: copy(state.cycle) };
  const version = { id: state.versions.length + 1, content: savedContent, summary, baseId, createdAt: new Date().toISOString() };
  state.current = copy(savedContent); state.versions.push(version); return version;
}
export function restoreVersion(state, id) {
  const version = state.versions.find(item => item.id === id);
  if (!version) throw new Error('Version unavailable');
  const content = copy(version.content);
  content.contextSnapshot ??= { team: null, cycle: null };
  return saveVersion(state, content, `恢复版本 v${id}`, id);
}
export function exportPlan(state) {
  const plan = state.current;
  return ['蹴鞠 · 虚构样例训练方案', '预设交互演示，不是实时 AI 生成；未经训练专业审核。', '自由备注原样导出，不提供自动脱敏；请仅填写虚构内容。', '', plan.title, `球队背景：${plan.contextSnapshot?.team?.name || '历史球队未记录'}`, `周期背景：${plan.contextSnapshot?.cycle?.name || '历史周期未记录'}`, `人数：${plan.players}人 · 时长：${plan.minutes}分钟`, `目标：${plan.goal}`, '', ...plan.activities.map((a, i) => `${i + 1}. ${a.name}（${a.duration}分钟）\n${a.detail}`), '', `教练备注：${plan.notes}`, '', '数据为虚构样例，导出不表示已采用或已执行。'].join('\n');
}
