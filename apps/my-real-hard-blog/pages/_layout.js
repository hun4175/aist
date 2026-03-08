import { PageLayout } from '../components/index.js'

const NIGHT_SKY_STYLE = `
  html, body { min-height: 100vh; width: 100%; margin: 0; overflow: hidden; }
  .home-bg-base { background: #0a0e1a; }
  #stars-canvas { position: fixed; inset: 0; z-index: -20; pointer-events: none; }
`

/** 실제 별 색상 팔레트: M(적색)~O(청색) 분광형 */
const STAR_COLORS = [
  [255,154,139],[255,138,122],[255,122,107],
  [255,200,154],[255,212,163],[255,184,138],
  [255,228,176],[255,245,224],
  [255,254,248],[255,248,240],
  [212,224,255],[197,212,255],
  [170,191,255],[155,180,255]
];

const STARS_SCRIPT = `
(function(){
  const c=document.getElementById('stars-canvas');
  if(!c)return;
  const ctx=c.getContext('2d',{alpha:false});
  const N=10000,P=${JSON.stringify(STAR_COLORS)};
  const stars=new Float32Array(N*6);
  for(let i=0;i<N;i++){
    stars[i*6]=Math.random();
    stars[i*6+1]=Math.random();
    stars[i*6+2]=Math.random()<0.3?2:1;
    stars[i*6+3]=Math.random();
    stars[i*6+4]=3+Math.random()*3;
    stars[i*6+5]=Math.floor(Math.random()*P.length);
  }
  const resize=()=>{c.width=innerWidth;c.height=innerHeight};
  resize();addEventListener('resize',resize);
  const twinkle=(t,p,d)=>{const c=(t/1e3/d+p)%1;let o=c<0.25?1-c/0.25*0.8:c<0.5?0.2+(c-0.25)/0.25*0.7:c<0.75?0.9-(c-0.5)/0.25*0.6:0.3+(c-0.75)/0.25*0.7;return Math.min(1,o*2)};
  const cache={};
  const getColor=(idx,o)=>{const q=Math.round(o*20)/20,k=idx+'_'+q;return cache[k]||(cache[k]='rgba('+P[idx][0]+','+P[idx][1]+','+P[idx][2]+','+q+')')};
  const draw=()=>{
    const t=performance.now(),w=c.width,h=c.height;
    ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,w,h);
    for(let i=0;i<N;i++){
      const x=stars[i*6]*w,y=stars[i*6+1]*h,s=stars[i*6+2],p=stars[i*6+3],d=stars[i*6+4],ci=stars[i*6+5]|0;
      ctx.fillStyle=getColor(ci,twinkle(t,p,d));
      ctx.fillRect(x,y,s,s);
    }
    requestAnimationFrame(draw);
  };
  draw();
})();
`

const renderNightSkyBg = () => `
  <div class="home-bg-base fixed inset-0 -z-20" aria-hidden="true"></div>
  <canvas id="stars-canvas" width="1" height="1" aria-hidden="true"></canvas>
  <div class="bg-black/30 fixed inset-0 -z-20" aria-hidden="true"></div>
  <script>${STARS_SCRIPT}<\/script>
`

/** Root layout. ctx.path for meta, ctx.csrfToken for forms. */
export default (content, ctx = {}) => {
  const path = (ctx.path || '/').replace(/\/$/, '') || '/'
  const isHome = path === '/'
  const title = isHome ? 'my-real-hard-blog' : `my-real-hard-blog - ${path}`
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  ${isHome ? `<style>${NIGHT_SKY_STYLE}</style>` : ''}
</head>
<body class="bg-[#0a0e1a] min-h-screen w-full overflow-x-hidden">
  ${isHome ? renderNightSkyBg() : ''}
  ${PageLayout(content, path)}
</body>
</html>`
}
