/** Molecule: 메트릭 카드 (다크 테마) */
export const MetricCard = (label, value, desc = '') =>
  `<div class="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm">
    <div class="text-sm font-medium text-slate-400">${label}</div>
    <div class="mt-1 text-2xl font-bold text-slate-100">${value}</div>
    ${desc ? `<div class="mt-1 text-sm text-slate-400">${desc}</div>` : ''}
  </div>`
