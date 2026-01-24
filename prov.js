const subject=document.getElementById('subject');
const difficulty=document.getElementById('difficulty');
const targetGrade=document.getElementById('targetGrade');
const underlag=document.getElementById('underlag');
const statusEl=document.getElementById('status');
const summaryEl=document.getElementById('summary');
const exercisesEl=document.getElementById('exercises');
const btnSummary=document.getElementById('btnSummary');
const btnExercises=document.getElementById('btnExercises');
function readPrefs(){ try{return JSON.parse(localStorage.getItem('pluggis_prefs')||'{}')}catch(e){return{}} }
function adaptPromptBase(){
  const p=readPrefs();
  const subj=subject.value, diff=difficulty.value, grade=targetGrade.value||p.grade||'C';
  let diffTxt= diff==='super'?'jättelätt':(diff==='easy'?'lätt':'avancerad');
  const levelTxt = p.level || 'högstadiet';
  return `Skolnivå: ${levelTxt}. Ämne: ${subj}. Svårighetsnivå: ${diffTxt}. Målbetyg: ${grade}.`;
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
  }catch(e){statusEl.textContent='Fel vid generering.'; return 'Tekniskt fel.';}
}
btnSummary.addEventListener('click', async ()=>{
  summaryEl.textContent='';
  const base=adaptPromptBase();
  const text=underlag.value||'';
  //const out=await callFn('/.netlify/functions/summarize',{text, length:'medium', base});
  summaryEl.textContent=out;
});
btnExercises.addEventListener('click', async ()=>{
  exercisesEl.textContent='';
  const base=adaptPromptBase();
  const text=underlag.value||'';
  //const out=await callFn('/.netlify/functions/exercises',{text, targetGrade: (readPrefs().grade||targetGrade.value||'C'), base});
  exercisesEl.textContent=out;
});
