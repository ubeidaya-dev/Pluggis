const logout=document.getElementById('logout');
logout&&logout.addEventListener('click',(e)=>{e.preventDefault();localStorage.removeItem('pluggis_user');localStorage.removeItem('pluggis_prefs');location.href='index.html';});
const levelSel=document.getElementById('levelSel');
const gradeGroup=document.getElementById('gradeGroup');
const prefsPreview=document.getElementById('prefsPreview');
function loadPrefs(){
  const p = JSON.parse(localStorage.getItem('pluggis_prefs')||'{}');
  if(!p.level) p.level='högstadiet';
  if(!p.grade) p.grade='C';
  levelSel.value = p.level;
  [...gradeGroup.querySelectorAll('.grade')].forEach(b=>{
    b.classList.toggle('selected', b.dataset.g===p.grade);
  });
  prefsPreview.textContent = `Valt: ${p.level}, mål-betyg ${p.grade}`;
  localStorage.setItem('pluggis_prefs', JSON.stringify(p));
}
function savePrefs(){
  const p = JSON.parse(localStorage.getItem('pluggis_prefs')||'{}');
  p.level = levelSel.value;
  const sel = gradeGroup.querySelector('.grade.selected');
  p.grade = sel ? sel.dataset.g : 'C';
  localStorage.setItem('pluggis_prefs', JSON.stringify(p));
  prefsPreview.textContent = `Valt: ${p.level}, mål-betyg ${p.grade}`;
}
levelSel.addEventListener('change', savePrefs);
gradeGroup.addEventListener('click', (e)=>{
  if(e.target.matches('.grade')){
    gradeGroup.querySelectorAll('.grade').forEach(b=>b.classList.remove('selected'));
    e.target.classList.add('selected');
    savePrefs();
  }
});
if(!localStorage.getItem('pluggis_prefs')){
  localStorage.setItem('pluggis_prefs', JSON.stringify({ level:'högstadiet', grade:'C' }));
}
loadPrefs();