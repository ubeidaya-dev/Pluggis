(function () {
  const raw = localStorage.getItem('pluggis_quiz');
  if (!raw) {
    location.href = 'upload.html';
    return;
  }

  let quiz;
  try {
    quiz = JSON.parse(raw);
  } catch {
    location.href = 'upload.html';
    return;
  }

  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];
  if (!questions.length) {
    location.href = 'upload.html';
    return;
  }

  const quizMeta = document.getElementById('quizMeta');
  const qTitle = document.getElementById('qTitle');
  const qText = document.getElementById('qText');
  const optionsEl = document.getElementById('options');
  const feedback = document.getElementById('feedback');
  const nextBtn = document.getElementById('nextBtn');
  const backBtn = document.getElementById('backBtn');
  const resultCard = document.getElementById('resultCard');
  const finalScore = document.getElementById('finalScore');
  const restartBtn = document.getElementById('restartBtn');

  let idx = 0;
  let score = 0;
  let locked = false;

  function render() {
    locked = false;
    feedback.style.display = 'none';
    nextBtn.style.display = 'none';
    optionsEl.innerHTML = '';

    const q = questions[idx];
    quizMeta.textContent = `Fråga ${idx + 1} av ${questions.length}`;
    qTitle.textContent = `Fråga ${idx + 1}`;
    qText.textContent = q.question || '';

    const opts = Array.isArray(q.options) ? q.options : [];
    opts.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'btn btn-outline';
      b.type = 'button';
      b.style.justifyContent = 'flex-start';
      b.textContent = opt;
      b.addEventListener('click', () => choose(i));
      optionsEl.appendChild(b);
    });
  }

  function choose(i) {
    if (locked) return;
    locked = true;

    const q = questions[idx];
    const correctIndex = Number.isInteger(q.correctIndex) ? q.correctIndex : -1;

    const isCorrect = i === correctIndex;
    if (isCorrect) score += 1;

    feedback.style.display = 'inline-flex';
    feedback.textContent = isCorrect
      ? 'Rätt ✅'
      : `Fel ❌ Rätt svar: ${q.options?.[correctIndex] ?? '(saknas)'}`;

    nextBtn.style.display = 'inline-flex';
  }

  function finish() {
    qTitle.textContent = 'Klart!';
    qText.textContent = '';
    optionsEl.innerHTML = '';
    feedback.style.display = 'none';
    nextBtn.style.display = 'none';

    resultCard.style.display = 'block';
    finalScore.textContent = `Du fick ${score} rätt av ${questions.length}.`;

    localStorage.setItem('pluggis_quiz_score', JSON.stringify({ score, total: questions.length }));
  }

  nextBtn.addEventListener('click', () => {
    idx += 1;
    if (idx >= questions.length) finish();
    else render();
  });

  backBtn.addEventListener('click', () => {
    location.href = 'upload.html';
  });

  restartBtn.addEventListener('click', () => {
    idx = 0;
    score = 0;
    resultCard.style.display = 'none';
    render();
  });

  render();
})();