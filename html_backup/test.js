
// ═══════════════════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════════════════
let activeSection = 'dashboard';
let chartsInit = {};

function switchSection(id, el) {
  try {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
    
    const sec = document.getElementById('sec-' + id);
    if (sec) sec.classList.add('active');
    
    if (el) el.classList.add('active');
    
    activeSection = id;
    if (!chartsInit[id]) {
      chartsInit[id] = true;
      setTimeout(() => initChartsFor(id), 60);
    }
  } catch (err) {
    console.error('Error switching section:', err);
  }
}

function switchTab(group, tabId, el) {
  try {
    const parent = el.closest('.section') || document;
    parent.querySelectorAll(`[id^="st-"]`).forEach(p => p.classList.remove('active'));
    parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
    
    if (el) el.classList.add('active');
  } catch (err) {
    console.error('Error switching tab:', err);
  }
}

function selectExport(el) {
  if (!el) return;
  const siblings = el.parentElement.querySelectorAll('.export-btn');
  siblings.forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

// ═══════════════════════════════════════════════════════
//  CHARTS INIT
// ═══════════════════════════════════════════════════════
const BLUE   = '#2563EB';
const PURPLE = '#7C3AED';
const GREEN  = '#10B981';
const AMBER  = '#F59E0B';
const RED    = '#EF4444';
const TEAL   = '#0D9488';

const months  = ['Oct 1','Oct 8','Oct 15','Oct 22','Nov 1','Nov 8','Nov 15','Nov 22','Dec 1','Dec 8','Dec 15','Dec 22','Dec 31'];
const months3 = ['October','November','December'];

if (typeof Chart !== 'undefined') {
  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.size   = 12;
  Chart.defaults.color       = '#64748B';
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle    = 'circle';
  Chart.defaults.plugins.legend.labels.padding       = 16;
}

function mkChart(id, type, data, opts = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  
  if (typeof Chart === 'undefined') {
    el.parentElement.innerHTML = `<div style="padding:20px;text-align:center;color:var(--red);font-size:12px;border:1px dashed var(--red-light);border-radius:8px">Chart.js failed to load. Please check your internet connection.</div>`;
    return;
  }

  if (el._chartInst) el._chartInst.destroy();
  el._chartInst = new Chart(el, {
    type, data,
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { tooltip: { mode: 'index', intersect: false }, ...opts.plugins },
      scales: opts.scales || {},
      ...opts
    }
  });
}

const baseScales = {
  x: { grid: { color: '#F1F5F9', drawBorder: false }, ticks: { maxTicksLimit: 7 } },
  y: { grid: { color: '#F1F5F9', drawBorder: false }, border: { dash: [4,4] } }
};

function initChartsFor(id) {
  if (id === 'dashboard') initDashboard();
  if (id === 'trend')     initTrend();
  if (id === 'distribution') initDist();
  if (id === 'region')    initRegion();
  if (id === 'usertype')  initUser();
  if (id === 'category')  initCategory();
}

// ─── DASHBOARD ───────────────────────────────────────
function initDashboard() {
  const revenue = [28000,31000,27000,34000,38000,36000,42000,45000,48000,52000,61000,58000,72000];
  const users   = [420,480,390,520,580,560,640,700,720,800,920,880,1100];

  mkChart('ch-overview','line',{
    labels: months,
    datasets:[
      { label:'Revenue ($)', data: revenue, borderColor: BLUE, backgroundColor: 'rgba(37,99,235,.08)', fill:true, tension:.4, pointRadius:3, pointBackgroundColor: BLUE },
      { label:'Users',       data: users,   borderColor: PURPLE, backgroundColor:'rgba(124,58,237,.06)', fill:true, tension:.4, pointRadius:3, pointBackgroundColor: PURPLE, yAxisID:'y2' }
    ]
  },{ scales:{ ...baseScales, y2:{ position:'right', grid:{ display:false } } } });

  mkChart('ch-pie-dash','doughnut',{
    labels:['North America','Europe','Asia Pacific'],
    datasets:[{ data:[45,30,25], backgroundColor:[BLUE,PURPLE,GREEN], borderWidth:3, borderColor:'white', hoverOffset:8 }]
  },{ scales:{}, cutout:'72%', plugins:{ legend:{ display:false } } });

  mkChart('ch-cat-bar','bar',{
    labels:['Software','Consulting','Hardware','Support','Other'],
    datasets:[{ label:'Revenue ($K)', data:[511,365,341,148,98], backgroundColor:[BLUE,PURPLE,GREEN,AMBER,RED], borderRadius:6, barThickness:32 }]
  },{ scales: baseScales, plugins:{ legend:{ display:false } } });

  // Heatmap
  const hm = document.getElementById('heatmap-dash');
  if (hm) {
    const opacities = [.1,.3,.5,.2,.8,.4,.7,.9,.25,.55,.15,.45,.6,.35,.85,.2,.5,.1,.7,.3,.9,.4,.6,.8,.3];
    hm.innerHTML = '';
    opacities.forEach(o => {
      const d = document.createElement('div');
      d.className='heat-cell';
      d.style.cssText=`background:rgba(37,99,235,${o});aspect-ratio:1`;
      d.title = `r = ${o.toFixed(2)}`;
      hm.appendChild(d);
    });
  }
}

// ─── TREND ───────────────────────────────────────────
function initTrend() {
  const r=[28,31,27,34,38,36,42,45,48,52,61,58,72];
  const u=[420,480,390,520,580,560,640,700,720,800,920,880,1100];
  const ret=[61,63,60,65,67,68,70,72,71,74,78,76,80];

  mkChart('ch-multiline','line',{
    labels: months,
    datasets:[
      { label:'Revenue ($K)', data:r, borderColor:BLUE, tension:.4, pointRadius:3, fill:false, borderWidth:2 },
      { label:'Users',        data:u, borderColor:PURPLE, tension:.4, pointRadius:3, fill:false, borderWidth:2, yAxisID:'y2' },
      { label:'Retention %',  data:ret, borderColor:GREEN, tension:.4, pointRadius:3, fill:false, borderWidth:2, yAxisID:'y3' }
    ]
  },{ scales:{ ...baseScales, y2:{ position:'right', grid:{display:false} }, y3:{ position:'right', grid:{display:false}, display:false } } });

  mkChart('ch-area','line',{
    labels: months,
    datasets:[
      { label:'Cumulative Revenue', data:r.map((v,i,a)=>a.slice(0,i+1).reduce((s,x)=>s+x,0)), borderColor:BLUE, backgroundColor:'rgba(37,99,235,.1)', fill:true, tension:.4, borderWidth:2 },
      { label:'Cumulative Users',   data:u.map((v,i,a)=>a.slice(0,i+1).reduce((s,x)=>s+x,0)/10), borderColor:PURPLE, backgroundColor:'rgba(124,58,237,.07)', fill:true, tension:.4, borderWidth:2 }
    ]
  },{ scales: baseScales });

  // Forecast
  const hist=[28,31,27,34,38,36,42,45,48,52,61,58,72];
  const fore=[null,null,null,null,null,null,null,null,null,null,null,null,72,78,85,91,98,106,112];
  const foreLabels=[...months,'Jan W1','Jan W2','Jan W3','Jan W4','Feb W1','Feb W2'];
  mkChart('ch-forecast','line',{
    labels: foreLabels,
    datasets:[
      { label:'Historical', data:[...hist,...new Array(6).fill(null)], borderColor:BLUE, tension:.4, fill:false, borderWidth:2 },
      { label:'AI Forecast', data:fore, borderColor:PURPLE, tension:.4, fill:false, borderWidth:2, borderDash:[6,3] },
      { label:'Upper Bound', data:[...new Array(12).fill(null),74,82,89,97,105,114], borderColor:'rgba(124,58,237,.2)', tension:.4, fill:'+1', borderWidth:1 },
      { label:'Lower Bound', data:[...new Array(12).fill(null),70,74,81,85,91,98], borderColor:'rgba(124,58,237,.2)', tension:.4, fill:false, borderWidth:1 }
    ]
  },{ scales: baseScales });

  mkChart('ch-seasonal','line',{
    labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets:[
      { label:'2024', data:[58,52,61,67,72,68,75,80,71,84,92,88], borderColor:BLUE, tension:.4, fill:false, borderWidth:2 },
      { label:'2023', data:[48,44,51,55,60,57,62,66,59,70,78,74], borderColor:PURPLE, tension:.4, fill:false, borderWidth:2, borderDash:[4,3] }
    ]
  },{ scales: baseScales });

  mkChart('ch-ma','line',{
    labels: months,
    datasets:[
      { label:'Daily',   data:r.map(v=>v+Math.random()*6-3), borderColor:'rgba(37,99,235,.3)', tension:.3, fill:false, borderWidth:1, pointRadius:2 },
      { label:'7-Day MA', data:r, borderColor:BLUE, tension:.4, fill:false, borderWidth:2.5 },
      { label:'30-Day MA',data:r.map((v,i,a)=>{const s=a.slice(Math.max(0,i-2),i+1);return s.reduce((x,y)=>x+y,0)/s.length-2;}), borderColor:PURPLE, tension:.4, fill:false, borderWidth:2.5 }
    ]
  },{ scales: baseScales });
}

// ─── DISTRIBUTION ────────────────────────────────────
function initDist() {
  mkChart('ch-histogram','bar',{
    labels:['$0–25','$26–50','$51–75','$76–100','$101–150','$151–200','$201–300','$301–500','$500+'],
    datasets:[{ label:'Transactions', data:[420,1420,1840,2280,2940,1242,862,842,556], backgroundColor:'rgba(37,99,235,.8)', borderRadius:4, barThickness:28 }]
  },{ scales: baseScales, plugins:{ legend:{display:false} } });

  mkChart('ch-density','line',{
    labels:['$0','$50','$100','$150','$200','$250','$300','$400','$500','$600'],
    datasets:[{
      label:'Density', fill:true, tension:.5, borderWidth:2.5, borderColor:PURPLE,
      backgroundColor:'rgba(124,58,237,.1)',
      data:[0.2,1.8,4.2,6.8,7.2,5.4,3.6,2.0,1.2,0.4]
    }]
  },{ scales: baseScales, plugins:{ legend:{display:false} } });

  mkChart('ch-dist-pie','pie',{
    labels:['Software','Hardware','Consulting','Support','Other'],
    datasets:[{ data:[42,28,30,12,8], backgroundColor:[BLUE,PURPLE,GREEN,AMBER,RED], borderWidth:3, borderColor:'white', hoverOffset:8 }]
  },{ scales:{}, plugins:{ legend:{ position:'bottom' } } });

  mkChart('ch-donut','doughnut',{
    labels:['Purchase','Login','Subscription','Refund','Support'],
    datasets:[{ data:[64,18,10,5,3], backgroundColor:[BLUE,PURPLE,GREEN,AMBER,RED], borderWidth:3, borderColor:'white', hoverOffset:8 }]
  },{ scales:{}, cutout:'68%', plugins:{ legend:{ position:'bottom' } } });

  mkChart('ch-boxplot','bar',{
    labels:['NA','EU','APAC'],
    datasets:[
      { label:'Q1', data:[89,102,114], backgroundColor:'rgba(37,99,235,.3)', borderRadius:4 },
      { label:'Q2', data:[95,110,122], backgroundColor:'rgba(37,99,235,.5)', borderRadius:4 },
      { label:'Q3', data:[98,118,130], backgroundColor:'rgba(37,99,235,.7)', borderRadius:4 },
      { label:'Q4', data:[108,128,145], backgroundColor:BLUE, borderRadius:4 }
    ]
  },{ scales: baseScales });
}

// ─── REGION ──────────────────────────────────────────
function initRegion() {
  mkChart('ch-region-bar','bar',{
    labels:['United States','Germany','Japan','United Kingdom','Canada','Australia','France','India','Singapore','Brazil'],
    datasets:[{ label:'Revenue ($K)', data:[380,180,142,130,120,95,84,72,62,42], backgroundColor:[BLUE,PURPLE,GREEN,BLUE,PURPLE,GREEN,AMBER,TEAL,RED,AMBER], borderRadius:6 }]
  },{ indexAxis:'y', scales:{ x:baseScales.x, y:{ grid:{display:false} } }, plugins:{ legend:{display:false} } });

  const rd = document.getElementById('region-density');
  if (rd) {
    const ops=[.1,.3,.8,.2,.9,.4,.7,.6,.3,.5,.2,.85,.45,.65,.1,.7,.4,.9,.3,.8,.15,.6,.35,.75,.55];
    rd.innerHTML='';
    ops.forEach(o=>{
      const d=document.createElement('div'); d.className='heat-cell';
      d.style.cssText=`background:rgba(37,99,235,${o});aspect-ratio:1`;
      rd.appendChild(d);
    });
  }

  mkChart('ch-pop','doughnut',{
    labels:['North America','Europe','Asia Pacific'],
    datasets:[{ data:[45,30,25], backgroundColor:[BLUE,PURPLE,GREEN], borderWidth:3, borderColor:'white', hoverOffset:8 }]
  },{ scales:{}, cutout:'65%', plugins:{ legend:{ position:'bottom' } } });
}

// ─── USER TYPE ───────────────────────────────────────
function initUser() {
  mkChart('ch-user-pie','doughnut',{
    labels:['Returning','New','Premium','High-Value'],
    datasets:[{ data:[68,25,18,5], backgroundColor:[BLUE,PURPLE,GREEN,AMBER], borderWidth:3, borderColor:'white', hoverOffset:8 }]
  },{ scales:{}, cutout:'68%', plugins:{ legend:{ position:'bottom' } } });

  mkChart('ch-user-growth','bar',{
    labels: months,
    datasets:[
      { label:'New Users',     data:[240,280,210,310,340,320,380,410,430,470,540,510,640], backgroundColor:'rgba(37,99,235,.7)', borderRadius:4 },
      { label:'Returning',     data:[480,560,520,620,680,660,740,800,820,880,980,940,1080], backgroundColor:'rgba(124,58,237,.7)', borderRadius:4 },
      { label:'Premium',       data:[88,95,82,110,122,118,135,148,152,168,192,182,224], backgroundColor:'rgba(16,185,129,.7)', borderRadius:4 }
    ]
  },{ scales: baseScales });

  // Cohort table
  const cohortBody = document.getElementById('cohort-body');
  if (cohortBody) {
    const cohorts = [
      { name:'Oct W1', vals:[100,72,58,50,42,36] },
      { name:'Oct W2', vals:[100,68,54,46,38,32] },
      { name:'Nov W1', vals:[100,76,62,54,46,40] },
      { name:'Nov W2', vals:[100,74,60,52,44,38] },
      { name:'Dec W1', vals:[100,80,66,58,50,'-'] },
      { name:'Dec W2', vals:[100,78,64,'-','-','-'] },
    ];
    cohortBody.innerHTML = cohorts.map(c => `
      <tr>${['name',...Array(6).keys()].map((k,i)=>{
        if(k==='name') return `<td style="font-weight:600;font-size:11px">${c.name}</td>`;
        const v=c.vals[k-1];
        if(v==='-') return `<td style="color:var(--gray-300);font-size:11px">—</td>`;
        const pct=v/100;
        const bg=`rgba(37,99,235,${pct*.9})`;
        const col=pct>.5?'white':'var(--gray-700)';
        return `<td><div class="cohort-cell" style="background:${bg};color:${col}">${v}%</div></td>`;
      }).join('')}</tr>`
    ).join('');
  }
}

// ─── CATEGORY ────────────────────────────────────────
function initCategory() {
  mkChart('ch-cat-compare','bar',{
    labels:['Software','Consulting','Hardware','Support','Other'],
    datasets:[
      { label:'Q3 2024', data:[460,295,352,128,82], backgroundColor:'rgba(37,99,235,.3)', borderRadius:4 },
      { label:'Q4 2024', data:[511,365,341,148,98], backgroundColor:BLUE, borderRadius:4 }
    ]
  },{ scales: baseScales });

  mkChart('ch-stacked','bar',{
    labels: months3,
    datasets:[
      { label:'Software',    data:[160,172,179], backgroundColor:BLUE,   borderRadius:4, stack:'s' },
      { label:'Consulting',  data:[112,118,135], backgroundColor:PURPLE, borderRadius:4, stack:'s' },
      { label:'Hardware',    data:[118,112,111], backgroundColor:GREEN,  borderRadius:4, stack:'s' },
      { label:'Support',     data:[46,51,51],    backgroundColor:AMBER,  borderRadius:4, stack:'s' },
      { label:'Other',       data:[30,33,35],    backgroundColor:RED,    borderRadius:4, stack:'s' }
    ]
  },{ scales: baseScales });

  mkChart('ch-radar','radar',{
    labels:['Revenue','Growth','Users','Margin','Satisfaction','Retention'],
    datasets:[
      { label:'Software',   data:[92,78,88,85,90,87], borderColor:BLUE,   backgroundColor:'rgba(37,99,235,.12)', pointBackgroundColor:BLUE },
      { label:'Consulting', data:[72,95,68,78,85,80], borderColor:PURPLE, backgroundColor:'rgba(124,58,237,.1)', pointBackgroundColor:PURPLE },
      { label:'Hardware',   data:[65,42,72,60,70,68], borderColor:GREEN,  backgroundColor:'rgba(16,185,129,.1)', pointBackgroundColor:GREEN }
    ]
  },{ scales:{ r:{ grid:{ color:'#F1F5F9' }, ticks:{ display:false }, pointLabels:{ font:{ size:11 } } } } });
}

// ═══════════════════════════════════════════════════════
//  REPORT GENERATION SIMULATION
// ═══════════════════════════════════════════════════════
function generateReport() {
  const wrap = document.getElementById('report-progress');
  const fill  = document.getElementById('report-fill');
  const pct   = document.getElementById('report-pct');
  if (!wrap) return;
  wrap.style.display = 'block';
  let p = 0;
  const iv = setInterval(() => {
    p = Math.min(p + Math.random() * 12 + 4, 100);
    fill.style.width  = p + '%';
    pct.textContent   = Math.round(p) + '%';
    if (p >= 100) {
      clearInterval(iv);
      wrap.innerHTML = `<div class="notif-banner" style="background:var(--green-light);border-color:#A7F3D0;color:var(--green)"><span class="ms">check_circle</span> <span>Report generated successfully! <b>Q4_Intelligence_Report.pdf</b> is ready. <a href="#" style="color:var(--green);font-weight:700;text-decoration:underline">Download →</a></span></div>`;
    }
  }, 220);
}

// ═══════════════════════════════════════════════════════
//  INIT ON LOAD
// ═══════════════════════════════════════════════════════
window.addEventListener('load', () => {
  chartsInit['dashboard'] = true;
  setTimeout(initDashboard, 100);
});
