// assets/ocr.js
document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photoInput");
  const ocrStatus = document.getElementById("ocrStatus");
  const ocrText = document.getElementById("ocrText");
  const action = document.getElementById("action");
  const goalGrade = document.getElementById("goal-grade");
  const numQuestions = document.getElementById("numQuestions");
  const nextStep = document.getElementById("nextStep");
  const aiResult = document.getElementById("aiResult");
  const quizUI = document.getElementById("quizUI");

  const missing = [];
  if (!photoInput) missing.push("photoInput");
  if (!ocrStatus) missing.push("ocrStatus");
  if (!ocrText) missing.push("ocrText");
  if (!action) missing.push("action");
  if (!goalGrade) missing.push("goal-grade");
  if (!numQuestions) missing.push("numQuestions");
  if (!nextStep) missing.push("nextStep");
  if (!aiResult) missing.push("aiResult");
  if (!quizUI) missing.push("quizUI");

  if (missing.length) {
    alert("Saknar element i upload.html. Kolla id: " + missing.join(", "));
    return;
  }

  const setStatus = (t) => (ocrStatus.textContent = t);
  const setResultText = (t) => {
    aiResult.textContent = t || "";
    quizUI.style.display = "none";
    quizUI.innerHTML = "";
  };

  const normalizeText = (t) =>
    (t || "")
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const splitSentences = (t) => {
    const s = normalizeText(t)
      .replace(/\n+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map(x => x.trim())
      .filter(x => x.length >= 30);
    return s.length ? s : normalizeText(t).split(/\n+/).map(x => x.trim()).filter(x => x.length >= 30);
  };

  const pickGradeTone = (g) => {
    if (g === "A") return { depth: "hög", tips: "fokusera på precision, begrepp och egna exempel" };
    if (g === "C") return { depth: "medel", tips: "fokusera på att förklara med egna ord och koppla till exempel" };
    if (g === "E") return { depth: "grund", tips: "fokusera på huvudidéerna och enkla definitioner" };
    return { depth: "medel", tips: "fokusera på tydlighet och exempel" };
  };

  const makeSummary = (text, grade) => {
    const s = splitSentences(text);
    const tone = pickGradeTone(grade);
    const count = tone.depth === "hög" ? 8 : tone.depth === "medel" ? 6 : 4;
    const chosen = s.slice(0, Math.min(count, s.length));
    const header = `SAMMANFATTNING (mål: ${grade})\nNivå: ${tone.depth}\nTips: ${tone.tips}\n\n`;
    const body = chosen.map((x, i) => `${i + 1}. ${x}`).join("\n");
    return header + (body || "Jag kunde inte hitta tydliga meningar i texten. Testa en tydligare bild eller mer text.");
  };

  const makeSimpleExplanation = (text, grade) => {
    const s = splitSentences(text);
    const tone = pickGradeTone(grade);
    const core = s.slice(0, 5).join(" ");
    const out =
      `ENKEL FÖRKLARING (mål: ${grade})\nNivå: ${tone.depth}\n\n` +
      `Kort sagt handlar texten om detta:\n${core || normalizeText(text).slice(0, 400)}\n\n` +
      `Så kan du tänka:\n` +
      `Förklara det som om du lär ut till en kompis, och använd minst ett exempel.\n\n` +
      `Tips för ${grade}:\n${tone.tips}\n`;
    return out;
  };

  const makeAdvancedExplanation = (text, grade) => {
    const s = splitSentences(text);
    const tone = pickGradeTone(grade);
    const core = s.slice(0, 10).join(" ");
    const out =
      `AVANCERAD FÖRKLARING (mål: ${grade})\nNivå: ${tone.depth}\n\n` +
      `Kärninnehåll:\n${core || normalizeText(text).slice(0, 700)}\n\n` +
      `Fördjupning:\n` +
      `Identifiera centrala begrepp, skriv egna definitioner och koppla till orsak-verkan (varför leder X till Y). ` +
      `Skriv sedan ett eget exempel och ett motexempel.\n\n` +
      `Tips för ${grade}:\n${tone.tips}\n`;
    return out;
  };

  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const pickWordToBlank = (sentence) => {
    const words = sentence
      .replace(/[“”"()]/g, "")
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length >= 5 && /^[A-Za-zÅÄÖåäöÉéÜü\-]+$/.test(w));
    if (!words.length) return null;
    return words[randomInt(0, words.length - 1)];
  };

  const makeQuizQuestions = (text, n) => {
    const s = splitSentences(text);
    const pool = s.slice(0, Math.min(40, s.length));
    if (!pool.length) return [];

    const questions = [];
    const used = new Set();

    while (questions.length < n && used.size < pool.length) {
      const idx = randomInt(0, pool.length - 1);
      if (used.has(idx)) continue;
      used.add(idx);

      const sent = pool[idx];
      const answer = pickWordToBlank(sent);
      if (!answer) continue;

      const q = sent.replace(new RegExp(`\\b${answer}\\b`), "_____");
      questions.push({ q, answer });
    }

    return questions;
  };

  const renderQuiz = (questions) => {
    quizUI.innerHTML = "";
    quizUI.style.display = "block";

    if (!questions.length) {
      quizUI.innerHTML = `<div style="padding:12px;">Kunde inte skapa quiz från texten. Testa tydligare text eller en annan bild.</div>`;
      return;
    }

    const wrap = document.createElement("div");
    wrap.style.display = "grid";
    wrap.style.gap = "12px";

    const header = document.createElement("div");
    header.style.fontWeight = "700";
    header.textContent = `Quiz: ${questions.length} frågor`;
    wrap.appendChild(header);

    questions.forEach((item, i) => {
      const card = document.createElement("div");
      card.style.border = "1px solid rgba(0,0,0,.12)";
      card.style.borderRadius = "12px";
      card.style.padding = "12px";
      card.style.background = "rgba(255,255,255,.7)";

      const q = document.createElement("div");
      q.style.marginBottom = "8px";
      q.textContent = `${i + 1}) ${item.q}`;
      card.appendChild(q);

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Skriv svaret här";
      input.style.width = "100%";
      input.style.padding = "10px";
      input.style.borderRadius = "10px";
      input.style.border = "1px solid rgba(0,0,0,.15)";
      card.appendChild(input);

      const feedback = document.createElement("div");
      feedback.style.marginTop = "8px";
      feedback.style.fontSize = "14px";
      card.appendChild(feedback);

      input.addEventListener("input", () => {
        const val = (input.value || "").trim();
        if (!val) {
          feedback.textContent = "";
          return;
        }
        const ok = val.toLowerCase() === item.answer.toLowerCase();
        feedback.textContent = ok ? "Rätt." : "Inte rätt ännu.";
      });

      wrap.appendChild(card);
    });

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "10px";
    btnRow.style.marginTop = "6px";

    const showAnswers = document.createElement("button");
    showAnswers.type = "button";
    showAnswers.className = "btn";
    showAnswers.textContent = "Visa facit";
    showAnswers.addEventListener("click", () => {
      const cards = wrap.querySelectorAll("div");
      let qi = 0;
      for (const el of cards) {
        // Card detection: has input
        const inp = el.querySelector && el.querySelector("input");
        if (!inp) continue;
        const fb = el.querySelectorAll("div")[1];
        fb.textContent = `Facit: ${questions[qi].answer}`;
        qi += 1;
      }
    });

    btnRow.appendChild(showAnswers);
    wrap.appendChild(btnRow);

    quizUI.appendChild(wrap);
  };

  const ensureTesseractLoaded = () => typeof window.Tesseract !== "undefined" && window.Tesseract && window.Tesseract.recognize;

  photoInput.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setResultText("");
    ocrText.value = "";
    setStatus("Läser text från bilden...");

    if (!ensureTesseractLoaded()) {
      setStatus("OCR misslyckades: tesseract.min.js laddades inte.");
      return;
    }

    try {
      const imageUrl = URL.createObjectURL(file);
      const { data } = await window.Tesseract.recognize(imageUrl, "swe", {
        logger: (m) => {
          if (m.status === "recognizing text") {
            const pct = Math.round((m.progress || 0) * 100);
            setStatus(`OCR pågår... ${pct}%`);
          }
        },
      });

      URL.revokeObjectURL(imageUrl);

      const text = normalizeText(data && data.text ? data.text : "");
      ocrText.value = text;

      if (!text) {
        setStatus("Klar men hittade ingen text. Testa bättre ljus och rakare bild.");
        return;
      }

      setStatus("OCR klar. Text hittad.");
    } catch (err) {
      console.error(err);
      setStatus("OCR misslyckades. Testa en tydligare bild.");
    }
  });

  nextStep.addEventListener("click", () => {
    const text = normalizeText(ocrText.value);
    if (!text) {
      setResultText("Ingen text att jobba med. Lägg in en bild först så OCR fyller textfältet.");
      setStatus("Välj en bild först.");
      return;
    }

    const chosenAction = (action.value || "").toLowerCase();
    const grade = (goalGrade.value || "C").toUpperCase();
    const n = parseInt(numQuestions.value || "10", 10);

    setStatus("Skapar resultat...");

    if (chosenAction === "summary" || chosenAction === "sammanfattning") {
      setResultText(makeSummary(text, grade));
      setStatus("Klar.");
      return;
    }

    if (chosenAction === "simple") {
      setResultText(makeSimpleExplanation(text, grade));
      setStatus("Klar.");
      return;
    }

    if (chosenAction === "advanced") {
      setResultText(makeAdvancedExplanation(text, grade));
      setStatus("Klar.");
      return;
    }

    if (chosenAction === "quiz") {
      setResultText("");
      const questions = makeQuizQuestions(text, isNaN(n) ? 10 : n);
      renderQuiz(questions);
      setStatus("Klar.");
      return;
    }

    setResultText("Okänd kategori vald. Välj Sammanfattning, Quiz, Enkel förklaring eller Avancerad förklaring.");
    setStatus("Välj kategori.");
  });
});