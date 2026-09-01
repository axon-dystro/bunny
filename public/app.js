const q=s=>document.querySelector(s),rules=q("#rules");let S={};
const digs=n=>String(Math.max(0,Math.min(999,n))).padStart(3,"0").slice(-3).split("");
function render(){
  for(const f of ["points","strikes"]){
    q("#"+f).innerHTML=digs(S[f]).map(x=>`<div class="digit">${x}</div>`).join("");
    document.querySelectorAll(`[data-f="${f}"]`).forEach(r=>{
      const up=r.classList.contains("top");
      r.innerHTML=[100,10,1].map(v=>`<button data-f="${f}" data-n="${up?v:-v}">⌃</button>`).join("");
      r.classList.toggle("on",Boolean(S.adminSite));
    });
  }
}
async function refresh(){S=await fetch("/api/state").then(r=>r.json());render()}
document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-n]");
  if(!b)return;
  const r=await fetch("/api/change",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({field:b.dataset.f,amount:+b.dataset.n})});
  if(r.ok){Object.assign(S,await r.json());render()}
});
q("#info").onclick=()=>rules.showModal();
document.querySelectorAll(".x").forEach(x=>x.onclick=()=>x.closest("dialog").close());
if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js");
refresh();setInterval(refresh,5000);