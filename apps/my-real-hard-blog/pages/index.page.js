import { Tilt3D } from '../components/index.js'

/** 자기소개 페이지 - 밤하늘 배경 + Tilt3D + 흐르는 텍스트 */
export default () => `
<style>
  .home-content h1 { color: #f8fafc; }
  .home-content p { color: #e2e8f0; }
  .home-content a.border-slate-200 {
    border-color: rgba(248,250,252,0.4);
    color: #f8fafc;
  }
  .home-content a.border-slate-200:hover {
    background: rgba(248,250,252,0.1);
  }
  .tilt-3d-wrapper { display: inline-block; }
  .home-content .tilt-3d-wrapper { width: max-content; min-width: 150vw; overflow: visible; }
  .home-content .tilt-3d-inner { width: 100%; min-width: 150vw; overflow: visible; }
  .home-content { width: 100%; height: 100%; min-height: 0; overflow: visible; }
  .flow-text-wrap { overflow: hidden; min-width: 150vw; width: max-content; padding: 3rem 0; }
  .flow-text { display: inline-block; font-size: clamp(4rem, 12vw, 20rem); font-weight: 700; color: #e2e8f0; white-space: nowrap; animation: flow 35s linear infinite; line-height: 1.2; }
  @keyframes flow { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
</style>
<div class="home-content relative flex flex-col items-center justify-center text-center w-full flex-1">
  ${Tilt3D({ rotateX: 0, rotateY: 45, rotateZ: -20, perspective: 400, children: `
  <div class="flow-text-wrap">
    <div class="flow-text">안녕하세요. 방문해 주셔서 감사합니다. AIST 기반으로 구축한 소개 사이트입니다. · 안녕하세요. 방문해 주셔서 감사합니다. AIST 기반으로 구축한 소개 사이트입니다. · </div>
  </div>
  ` })}
</div>
`
