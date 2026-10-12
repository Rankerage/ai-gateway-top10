async function j(p){const r=await fetch(p);if(!r.ok)throw new Error(p);return r.json();}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
function detailHTML(g){
  const li=a=>a.map(x=>`<li>${esc(x)}</li>`).join('');
  return `<h4><span class="pro">▲ Strengths</span></h4><ul>${li(g.pros)}</ul>
  <h4><span class="con">▼ Weaknesses</span></h4><ul>${li(g.cons)}</ul>
  <div class="save"><strong>💰 Token saving:</strong> ${esc(g.token_saving)}</div>
  <p class="fine">Scores — saving ${g.scores.tokenSaving} · reliability ${g.scores.reliability} · coverage ${g.scores.coverage} · devEx ${g.scores.devEx} · governance ${g.scores.governance} · transparency ${g.scores.priceTransparency} · <a href="${g.url}" target="_blank" rel="noopener">site ↗</a></p>`;
}
let rows=[],sortK='rank',asc=true;
function render(){
  const tb=document.querySelector('#board tbody');
  const data=[...rows].sort((a,b)=>asc?a[sortK]-b[sortK]||0:b[sortK]-a[sortK]||0);
  tb.innerHTML=data.map(g=>`<tr data-r="${g.rank}"><td><strong>#${g.rank}</strong></td>
    <td><strong>${esc(g.name)}</strong><br><span class="fine">${esc(g.tagline)}</span></td>
    <td class="score">${g.total.toFixed(2)}</td><td>${esc(g.pricing)}</td>
    <td>${g.self_host?'<span class="pill">self-host ✓</span>':'<span class="pill">managed</span>'}</td>
    <td>${esc(g.best_for)}</td></tr>`).join('');
  tb.querySelectorAll('tr').forEach(tr=>tr.addEventListener('click',()=>{
    const g=rows.find(x=>x.rank==tr.dataset.r);
    const nx=tr.nextSibling;
    if(nx&&nx.classList&&nx.classList.contains('detail')){nx.remove();return;}
    tb.querySelectorAll('.detail').forEach(d=>d.remove());
    const d=document.createElement('tr');d.className='detail';
    d.innerHTML=`<td colspan="6">${detailHTML(g)}</td>`;tr.after(d);
  }));
  document.getElementById('cards').innerHTML=data.map(g=>`<div class="card">
    <h3>#${g.rank} ${esc(g.name)} <span class="score">${g.total.toFixed(2)}</span></h3>
    <p class="fine">${esc(g.tagline)}</p>
    <div class="row"><span>${esc(g.pricing)}</span><span>${g.self_host?'self-host ✓':'managed'}</span></div>
    <p><strong>Best for:</strong> ${esc(g.best_for)}</p>${detailHTML(g)}</div>`).join('');
}
(async()=>{
  try{
    const d=await j('data/rankings.json');
    document.getElementById('week').textContent='Week '+d.week;
    document.getElementById('updated').textContent='Updated '+d.updated;
    rows=d.rankings;render();
    document.querySelectorAll('#board th[data-k]').forEach(th=>th.addEventListener('click',()=>{
      const k=th.dataset.k;asc=(sortK===k)?!asc:(k==='rank');sortK=k;render();
    }));
    const c=await j('data/criteria.json');
    document.getElementById('weights').innerHTML=Object.entries(c.dimensions)
      .map(([k,v])=>`<li><strong>${k} ×${v.weight}</strong><br><span class="fine">${esc(v.description)}</span></li>`).join('');
  }catch(e){document.querySelector('#ranking').insertAdjacentHTML('beforeend','<p>Could not load data.</p>');}
  try{
    const t=await (await fetch('lecture/token-saving-masterclass.md')).text();
    const lessons=t.split(/^## /m).slice(1,4).map(s=>s.trim().split('\n')[0]);
    document.getElementById('lecture').innerHTML='<ol>'+lessons.map(l=>`<li>${esc(l.replace(/^Lesson \d+:\s*/,''))}</li>`).join('')+'</ol>';
  }catch(e){document.getElementById('lecture').innerHTML='<p>See the lecture file in /lecture.</p>';}
  try{
    const h=await j('data/history/index.json');
    document.getElementById('hist').innerHTML=h.weeks.map(w=>`<li><strong>${w.week}</strong> — top 3: ${w.top3.map(esc).join(', ')} <span class="fine">(${esc(w.note)})</span></li>`).join('');
  }catch(e){document.getElementById('hist').innerHTML='<li>History starts with this week.</li>';}
})();
