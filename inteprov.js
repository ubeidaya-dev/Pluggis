const statusEl=document.getElementById('npStatus');
const subj=document.getElementById('npSubject');
const diff=document.getElementById('npDifficulty');
const grade=document.getElementById('npGrade');
const inputEl=document.getElementById('npInput');
const outExplain=document.getElementById('npExplainOut');
const outExercises=document.getElementById('npExercisesOut');
function readPrefs(){ try{return JSON.parse(localStorage.getItem('pluggis_prefs')||'{}')}catch(e){return{}} }
function baseProfile(){
  const p=readPrefs();
  const level=p.level||'högstadiet';
  let d=diff.value==='super'?'jättelätt':(diff.value==='easy'?'lätt':'avancerad');
  const g=grade.value || p.grade || 'C';
  return `Skolnivå: ${level}. Ämne: ${subj.value}. Svårighetsnivå: ${d}. Målbetyg: ${g}.`;
}
async function callFn(path, body){
  statusEl.textContent='Bearbetar…';
  try{
    const res=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const data=await res.json().catch(()=>null);
    statusEl.textContent='';
    if(typeof data==='string') return data;
    if(data && data.choices) return data.choices[0]?.message?.content || JSON.stringify(data);
    return JSON.stringify(data||{});
  }catch(e){ statusEl.textContent='Tekniskt fel.'; return 'Tekniskt fel.'; }
}
document.getElementById('btnExplain').addEventListener('click', async ()=>{
  outExplain.textContent='';
  const text=inputEl.value||'';
  const base=baseProfile();
  const out=await callFn('/.netlify/functions/explain',{ text, base });
  outExplain.textContent=out;
});
document.getElementById('btnMakeExercises').addEventListener('click', async ()=>{
  outExercises.textContent='';
  const text=inputEl.value||'';
  const base=baseProfile();
  const p=readPrefs();
  const g=grade.value || p.grade || 'C';
  const out=await callFn('/.netlify/functions/exercises',{ text, base, targetGrade: g });
  outExercises.textContent=out;
});