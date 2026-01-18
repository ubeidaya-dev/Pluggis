document.addEventListener("DOMContentLoaded", () => {
  const goGameBtn = document.getElementById("go-game");
  const settings = document.getElementById("game-settings");
  const gameRoom = document.getElementById("game-room");

  const subject = document.getElementById("subject");
  const area = document.getElementById("area");

  const startGameBtn = document.getElementById("start-game");
  const gameFrame = document.getElementById("game-frame");

  const overlay = document.getElementById("study-overlay");
  const overlayContent = document.getElementById("overlay-content");
  const closeOverlayBtn = document.getElementById("close-overlay");
  const submitAnswerBtn = document.getElementById("submit-answer");

  let timerId = null;
  let session = null;

  const areasBySubject = {
    matte: ["Bråk", "Procent", "Algebra", "Geometri", "Ekvationer"],
    svenska: ["Läsförståelse", "Argumentation", "Grammatik", "Novellanalys"],
    no: ["Cellen", "Energi", "Krafter", "Ekosystem"]
  };

  goGameBtn.addEventListener("click", () => {
    settings.style.display = "block";
    gameRoom.style.display = "none";
    window.scrollTo(0, settings.offsetTop);
  });

  subject.addEventListener("change", () => {
    const s = subject.value;
    area.innerHTML = `<option value="">Välj område</option>`;
    if (!s || !areasBySubject[s]) return;

    areasBySubject[s].forEach((a) => {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      area.appendChild(opt);
    });
  });

  startGameBtn.addEventListener("click", () => {
    const gradeYear = document.getElementById("grade-year").value;
    const goalGrade = document.getElementById("goal-grade").value;
    const difficulty = document.getElementById("difficulty").value;
    const subjectVal = subject.value;
    const areaVal = area.value;
    const sourceText = document.getElementById("source-text").value;
    const mode = document.getElementById("mode").value;
    const hints = document.getElementById("hints").value;

    if (!subjectVal || !areaVal) {
      alert("Välj ämne och område först.");
      return;
    }

    session = {
      gradeYear,
      goalGrade,
      difficulty,
      subjectVal,
      areaVal,
      sourceText,
      mode,
      hints
    };

    settings.style.display = "none";
    gameRoom.style.display = "block";

    gameFrame.src = "about:blank"; // byt till Space Waves-länk senare

    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => showStudyPopup(session), 30000);
  });

  function showStudyPopup(s) {
    overlay.style.display = "block";

    const levelText =
      s.goalGrade === "A" ? "svårt (A-nivå)" :
      s.goalGrade === "C" ? "mellan (C-nivå)" :
      "lätt (E-nivå)";

    let text =
      `Ämne: ${s.subjectVal}\n` +
      `Område: ${s.areaVal}\n` +
      `Årskurs: Åk ${s.gradeYear}\n` +
      `Nivå: ${levelText}\n\n`;

    if (s.mode === "summary_and_questions") {
      text +=
        "Sammanfattning (test):\n" +
        "Det här är en kort sammanfattning som vi senare ersätter med AI.\n\n";
    }

    text +=
      "Fråga (test):\n" +
      "Förklara kort vad som menas med området du valde.\n";

    if (s.hints === "yes") {
      text += "\nLedtråd: Skriv med egna ord och ge ett exempel.";
    }

    overlayContent.textContent = text;
  }

  closeOverlayBtn.addEventListener("click", () => {
    overlay.style.display = "none";

    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => showStudyPopup(session), 30000);
  });

  submitAnswerBtn.addEventListener("click", () => {
    overlayContent.textContent +=
      "\n\n✅ Svar mottaget (test). Snart lägger vi rättning + XP.";
  });
});