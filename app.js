const workbookWords = window.VOCABULARY_WORDS.map((word) => ({ source: "HSPT", ...word }));
const pdfWords = window.HSPT_PDF_VOCABULARY_WORDS || [];
const allWords = shuffle([...(window.SIMPLE_VOCABULARY_WORDS || []), ...workbookWords, ...(window.EXAM_VOCABULARY_WORDS || []), ...pdfWords]);
const sets = [...new Set(allWords.map((word) => word.set))].sort((a, b) => a - b);

const antonymHints = {
  abundant: ["scarce", "limited", "lacking"],
  agree: ["disagree", "oppose", "argue"],
  alert: ["careless", "sleepy", "unaware"],
  angry: ["calm", "pleased", "happy"],
  anxious: ["calm", "confident", "relaxed"],
  attack: ["defend", "protect", "support"],
  beautiful: ["ugly", "plain", "unattractive"],
  believable: ["unlikely", "false", "doubtful"],
  bold: ["timid", "shy", "careful"],
  brief: ["long", "lengthy", "extended"],
  burdensome: ["easy", "light", "simple"],
  calm: ["upset", "nervous", "wild"],
  careful: ["careless", "reckless", "rushed"],
  cautious: ["careless", "reckless", "bold"],
  clear: ["unclear", "confusing", "vague"],
  clever: ["foolish", "dull", "unwise"],
  close: ["distant", "far", "separate"],
  clumsy: ["skillful", "graceful", "capable"],
  common: ["rare", "unusual", "special"],
  complex: ["simple", "easy", "plain"],
  confirm: ["deny", "disprove", "reject"],
  confuse: ["clarify", "explain", "simplify"],
  constant: ["rare", "occasional", "sporadic"],
  criticize: ["praise", "compliment", "approve"],
  curious: ["uninterested", "bored", "indifferent"],
  decrease: ["increase", "grow", "expand"],
  deep: ["shallow", "minor", "surface"],
  different: ["same", "similar", "alike"],
  difficult: ["easy", "simple", "effortless"],
  dishonest: ["honest", "truthful", "fair"],
  distant: ["near", "friendly", "close"],
  dull: ["bright", "sharp", "exciting"],
  eager: ["reluctant", "unwilling", "bored"],
  easy: ["difficult", "hard", "challenging"],
  empty: ["full", "filled", "crowded"],
  enormous: ["tiny", "small", "minor"],
  essential: ["unneeded", "extra", "optional"],
  excellent: ["poor", "bad", "weak"],
  fake: ["real", "genuine", "true"],
  fair: ["unfair", "biased", "unequal"],
  false: ["true", "real", "genuine"],
  fast: ["slow", "late", "sluggish"],
  fearful: ["brave", "bold", "confident"],
  flexible: ["stiff", "rigid", "fixed"],
  foolish: ["wise", "sensible", "smart"],
  force: ["allow", "free", "release"],
  friendly: ["unfriendly", "mean", "hostile"],
  generous: ["selfish", "stingy", "greedy"],
  gloomy: ["cheerful", "bright", "happy"],
  hardworking: ["lazy", "idle", "sluggish"],
  harmful: ["helpful", "safe", "healthy"],
  harsh: ["gentle", "kind", "mild"],
  honest: ["dishonest", "false", "unfair"],
  hostile: ["friendly", "kind", "peaceful"],
  improve: ["worsen", "damage", "weaken"],
  inactive: ["active", "busy", "moving"],
  joyful: ["sad", "gloomy", "upset"],
  kind: ["mean", "cruel", "unkind"],
  lazy: ["active", "busy", "hardworking"],
  loud: ["quiet", "silent", "soft"],
  minor: ["major", "important", "serious"],
  mystery: ["answer", "solution", "explanation"],
  nearby: ["far", "distant", "remote"],
  new: ["old", "used", "familiar"],
  noisy: ["quiet", "silent", "calm"],
  old: ["new", "modern", "fresh"],
  plain: ["fancy", "decorated", "ornate"],
  praise: ["criticize", "blame", "scold"],
  practical: ["unrealistic", "impractical", "foolish"],
  quick: ["slow", "late", "delayed"],
  quiet: ["loud", "noisy", "talkative"],
  real: ["fake", "false", "imaginary"],
  respectful: ["rude", "disrespectful", "impolite"],
  risky: ["safe", "secure", "certain"],
  rude: ["polite", "respectful", "kind"],
  sad: ["happy", "cheerful", "joyful"],
  scarce: ["abundant", "plentiful", "ample"],
  secret: ["open", "public", "known"],
  serious: ["silly", "playful", "frivolous"],
  short: ["long", "lengthy", "tall"],
  simple: ["difficult", "complex", "complicated"],
  skilled: ["unskilled", "inept", "clumsy"],
  slow: ["quick", "fast", "rapid"],
  smart: ["foolish", "unwise", "dull"],
  strong: ["weak", "fragile", "feeble"],
  sure: ["uncertain", "doubtful", "unsure"],
  tough: ["weak", "easy", "fragile"],
  true: ["false", "fake", "untrue"],
  unclear: ["clear", "plain", "obvious"],
  unusual: ["common", "normal", "ordinary"],
  weak: ["strong", "powerful", "sturdy"],
  wise: ["foolish", "careless", "unwise"],
};

const state = {
  set: "all",
  mode: "flashcards",
  order: [],
  index: 0,
  revealed: false,
  currentQuiz: null,
  currentMatch: null,
  currentSort: null,
  currentScramble: null,
  progress: loadProgress(),
};

const els = {
  setButtons: document.querySelector("#setButtons"),
  modeButtons: document.querySelectorAll(".mode-button"),
  masteredCount: document.querySelector("#masteredCount"),
  streakCount: document.querySelector("#streakCount"),
  scopeLabel: document.querySelector("#scopeLabel"),
  scopeCount: document.querySelector("#scopeCount"),
  rankLabel: document.querySelector("#rankLabel"),
  progressBar: document.querySelector("#progressBar"),
  missedOnly: document.querySelector("#missedOnly"),
  shuffleCards: document.querySelector("#shuffleCards"),
  panels: {
    flashcards: document.querySelector("#flashcardsPanel"),
    quiz: document.querySelector("#quizPanel"),
    match: document.querySelector("#matchPanel"),
    sort: document.querySelector("#sortPanel"),
    scramble: document.querySelector("#scramblePanel"),
    list: document.querySelector("#listPanel"),
  },
  flashcard: document.querySelector("#flashcard"),
  cardSet: document.querySelector("#cardSet"),
  cardWord: document.querySelector("#cardWord"),
  cardPrompt: document.querySelector("#cardPrompt"),
  cardAnswer: document.querySelector("#cardAnswer"),
  prevCard: document.querySelector("#prevCard"),
  flipCard: document.querySelector("#flipCard"),
  nextCard: document.querySelector("#nextCard"),
  markMissed: document.querySelector("#markMissed"),
  markMastered: document.querySelector("#markMastered"),
  quizMeta: document.querySelector("#quizMeta"),
  quizQuestion: document.querySelector("#quizQuestion"),
  quizOptions: document.querySelector("#quizOptions"),
  quizFeedback: document.querySelector("#quizFeedback"),
  nextQuiz: document.querySelector("#nextQuiz"),
  matchMeta: document.querySelector("#matchMeta"),
  matchWord: document.querySelector("#matchWord"),
  matchPrompt: document.querySelector("#matchPrompt"),
  matchOptions: document.querySelector("#matchOptions"),
  matchFeedback: document.querySelector("#matchFeedback"),
  nextMatch: document.querySelector("#nextMatch"),
  sortMeta: document.querySelector("#sortMeta"),
  sortWord: document.querySelector("#sortWord"),
  sortClue: document.querySelector("#sortClue"),
  sortSynonym: document.querySelector("#sortSynonym"),
  sortAntonym: document.querySelector("#sortAntonym"),
  sortFeedback: document.querySelector("#sortFeedback"),
  nextSort: document.querySelector("#nextSort"),
  scrambleMeta: document.querySelector("#scrambleMeta"),
  scrambleClue: document.querySelector("#scrambleClue"),
  scrambleAnswer: document.querySelector("#scrambleAnswer"),
  scrambleLetters: document.querySelector("#scrambleLetters"),
  scrambleFeedback: document.querySelector("#scrambleFeedback"),
  clearScramble: document.querySelector("#clearScramble"),
  nextScramble: document.querySelector("#nextScramble"),
  searchWords: document.querySelector("#searchWords"),
  listCount: document.querySelector("#listCount"),
  wordList: document.querySelector("#wordList"),
  resetProgress: document.querySelector("#resetProgress"),
  exportProgress: document.querySelector("#exportProgress"),
};

function loadProgress() {
  const fallback = { mastered: [], missed: [], streak: 0 };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem("vocab-progress")) };
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem("vocab-progress", JSON.stringify(state.progress));
}

function wordId(word) {
  return `${word.set}-${word.number}-${word.word.toLowerCase()}`;
}

function scopedWords() {
  let words = state.set === "all" ? allWords : allWords.filter((word) => word.set === Number(state.set));
  if (els.missedOnly.checked) {
    words = words.filter((word) => {
      const id = wordId(word);
      return state.progress.missed.includes(id) || !state.progress.mastered.includes(id);
    });
  }
  return words;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function rebuildOrder() {
  const words = scopedWords();
  state.order = els.shuffleCards.checked ? shuffle(words) : words;
  state.index = 0;
  state.revealed = false;
  if (!state.order.length) {
    state.order = scopedWords();
  }
}

function currentWord() {
  return state.order[state.index] || scopedWords()[0] || allWords[0];
}

function cleanSynonyms(word) {
  return word.synonyms.join(", ");
}

function antonymsFor(word) {
  if (word.antonyms) return word.antonyms;
  const matches = word.synonyms.flatMap((synonym) => antonymHints[synonym.toLowerCase()] || []);
  const unique = [...new Set(matches)];
  if (unique.length >= 3) return unique.slice(0, 3);
  if (unique.length > 0) return unique;
  return [];
}

function cleanAntonyms(word) {
  const antonyms = antonymsFor(word);
  return antonyms.length ? antonyms.join(", ") : "No antonym clue yet";
}

function hasAntonymClue(word) {
  return antonymsFor(word).length > 0;
}

function gameWords(requireAntonym = false) {
  const words = requireAntonym ? scopedWords().filter(hasAntonymClue) : scopedWords();
  if (words.length) return words;
  return requireAntonym ? allWords.filter(hasAntonymClue) : allWords;
}

function simpleSentence(word) {
  if (word.example) return word.example;
  if (word.source === "STARTER") return word.example;
  const lower = word.word.toLowerCase();
  if (word.partOfSpeech === "v") {
    return `During class, the group tried to ${lower} the problem before the bell rang.`;
  }
  if (word.partOfSpeech === "n") {
    return `At lunch, Maya heard a simple example of ${lower}.`;
  }
  return `In middle school, Jordan noticed something ${lower} during the project.`;
}

function setSource(set) {
  return allWords.find((word) => word.set === Number(set))?.source || "HSPT";
}

function setLabel(set) {
  const source = setSource(set);
  if (source === "STARTER") return "Starter Words";
  if (source === "HSPT") return `HSPT Words ${set}`;
  if (source === "HSPT PDF") return `HSPT PDF ${set}`;
  return `${source} Words ${set}`;
}

function setMeta(word) {
  return `${setLabel(word.set)} - ${word.partOfSpeech}`;
}

function rankName(mastered) {
  if (mastered >= 360) return "Legend Rank";
  if (mastered >= 280) return "Elite Rank";
  if (mastered >= 200) return "Pro Rank";
  if (mastered >= 120) return "Challenger Rank";
  if (mastered >= 40) return "Rising Rank";
  return "Rookie Rank";
}

function setStatus(word, status) {
  const id = wordId(word);
  state.progress.mastered = state.progress.mastered.filter((item) => item !== id);
  state.progress.missed = state.progress.missed.filter((item) => item !== id);
  if (status === "mastered") {
    state.progress.mastered.push(id);
    state.progress.streak += 1;
  }
  if (status === "missed") {
    state.progress.missed.push(id);
    state.progress.streak = 0;
  }
  saveProgress();
  renderStats();
}

function renderStats() {
  const scoped = scopedWords();
  const mastered = scoped.filter((word) => state.progress.mastered.includes(wordId(word))).length;
  els.masteredCount.textContent = String(state.progress.mastered.length);
  els.streakCount.textContent = String(state.progress.streak);
  els.scopeLabel.textContent = state.set === "all" ? "All word categories" : setLabel(state.set);
  els.scopeCount.textContent = `${scoped.length} word${scoped.length === 1 ? "" : "s"}`;
  els.rankLabel.textContent = rankName(state.progress.mastered.length);
  els.progressBar.style.width = scoped.length ? `${Math.round((mastered / scoped.length) * 100)}%` : "0%";
}

function renderFlashcard() {
  const word = currentWord();
  els.cardSet.textContent = setMeta(word);
  els.cardWord.textContent = word.word;
  els.cardPrompt.textContent = state.revealed ? simpleSentence(word) : "Tap to reveal clues";
  els.cardAnswer.hidden = !state.revealed;
  els.cardAnswer.innerHTML = `
    <p><span>Synonyms</span><strong>${cleanSynonyms(word)}</strong></p>
    <p><span>Antonyms</span><strong>${cleanAntonyms(word)}</strong></p>
    <p>${simpleSentence(word)}</p>
  `;
  els.flipCard.textContent = state.revealed ? "Hide" : "Reveal";
  els.flashcard.classList.toggle("revealed", state.revealed);
}

function makeQuizQuestion(kind = state.mode === "opposites" ? "antonym" : "synonym") {
  const words = kind === "antonym" ? scopedWords().filter(hasAntonymClue) : scopedWords();
  const fallbackWords = kind === "antonym" ? allWords.filter(hasAntonymClue) : allWords;
  const questionWords = words.length ? words : fallbackWords;
  const answer = questionWords[Math.floor(Math.random() * questionWords.length)] || allWords[0];
  const pool = allWords.filter((word) => wordId(word) !== wordId(answer));
  const distractors = shuffle(pool).slice(0, 3);
  state.currentQuiz = {
    answer,
    options: shuffle([answer, ...distractors]),
    answered: false,
    kind,
  };
  renderQuiz();
}

function renderQuiz() {
  const quiz = state.currentQuiz;
  els.quizMeta.textContent = setMeta(quiz.answer);
  els.quizQuestion.textContent =
    quiz.kind === "antonym"
      ? `Which word is the opposite of "${antonymsFor(quiz.answer)[0]}"?`
      : `Which word means "${quiz.answer.synonyms[0]}"?`;
  els.quizOptions.innerHTML = "";
  quiz.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.word;
    button.addEventListener("click", () => answerQuiz(option, button));
    els.quizOptions.append(button);
  });
  els.quizFeedback.textContent = "";
}

function answerQuiz(selected, button) {
  const quiz = state.currentQuiz;
  if (quiz.answered) return;
  quiz.answered = true;
  const correct = wordId(selected) === wordId(quiz.answer);
  button.classList.add(correct ? "correct" : "wrong");
  if (!correct) button.textContent = `❌ ${selected.word}`;
  [...els.quizOptions.children].forEach((optionButton) => {
    if (optionButton.textContent === quiz.answer.word) {
      optionButton.classList.add("correct");
      optionButton.textContent = `✅ ${quiz.answer.word}`;
    }
    optionButton.disabled = true;
  });
  setStatus(quiz.answer, correct ? "mastered" : "missed");
  els.quizFeedback.textContent = correct
    ? `✅ Correct! Combo x${state.progress.streak}. ${quiz.answer.word}: ${cleanSynonyms(quiz.answer)}. Opposite: ${cleanAntonyms(quiz.answer)}.`
    : `❌ Not quite. Answer: ${quiz.answer.word}. Synonyms: ${cleanSynonyms(quiz.answer)}. Antonyms: ${cleanAntonyms(quiz.answer)}.`;
}

function makeMatchRound() {
  const words = gameWords();
  const answer = randomItem(words);
  const target = randomItem(answer.synonyms);
  const distractors = shuffle(
    allWords
      .filter((word) => wordId(word) !== wordId(answer))
      .flatMap((word) => word.synonyms)
      .filter((synonym) => synonym !== target)
  ).slice(0, 5);
  state.currentMatch = {
    answer,
    target,
    options: shuffle([target, ...distractors]),
    answered: false,
  };
  renderMatch();
}

function renderMatch() {
  const round = state.currentMatch;
  els.matchMeta.textContent = setLabel(round.answer.set);
  els.matchWord.textContent = round.answer.word;
  els.matchPrompt.textContent = "Pick the matching synonym.";
  els.matchFeedback.textContent = "";
  els.matchOptions.innerHTML = "";
  round.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => answerMatch(option, button));
    els.matchOptions.append(button);
  });
}

function answerMatch(choice, button) {
  const round = state.currentMatch;
  if (round.answered) return;
  round.answered = true;
  const correct = choice === round.target;
  button.classList.add(correct ? "correct" : "wrong");
  [...els.matchOptions.children].forEach((optionButton) => {
    if (optionButton.textContent === round.target) {
      optionButton.classList.add("correct");
      optionButton.textContent = `✅ ${round.target}`;
    }
    optionButton.disabled = true;
  });
  if (!correct) button.textContent = `❌ ${choice}`;
  setStatus(round.answer, correct ? "mastered" : "missed");
  els.matchFeedback.textContent = correct
    ? `✅ Match made. ${round.answer.word} means ${cleanSynonyms(round.answer)}.`
    : `❌ The best match was ${round.target}.`;
}

function makeSortRound() {
  const words = gameWords(true);
  const answer = randomItem(words);
  const kind = Math.random() > 0.5 ? "antonym" : "synonym";
  const clue = randomItem(kind === "antonym" ? antonymsFor(answer) : answer.synonyms);
  state.currentSort = { answer, kind, clue, answered: false };
  renderSort();
}

function renderSort() {
  const round = state.currentSort;
  els.sortMeta.textContent = setLabel(round.answer.set);
  els.sortWord.textContent = round.answer.word;
  els.sortClue.textContent = round.clue;
  els.sortFeedback.textContent = "";
  [els.sortSynonym, els.sortAntonym].forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });
}

function answerSort(choice) {
  const round = state.currentSort;
  if (round.answered) return;
  round.answered = true;
  const correct = choice === round.kind;
  const picked = choice === "synonym" ? els.sortSynonym : els.sortAntonym;
  const right = round.kind === "synonym" ? els.sortSynonym : els.sortAntonym;
  picked.classList.add(correct ? "correct" : "wrong");
  right.classList.add("correct");
  els.sortSynonym.disabled = true;
  els.sortAntonym.disabled = true;
  setStatus(round.answer, correct ? "mastered" : "missed");
  els.sortFeedback.textContent = correct
    ? `✅ Sorted. ${round.clue} is a ${round.kind} for ${round.answer.word}.`
    : `❌ ${round.clue} is a ${round.kind} for ${round.answer.word}.`;
}

function scrambleLetters(word) {
  const letters = word.toUpperCase().replace(/[^A-Z]/g, "").split("");
  let scrambled = shuffle(letters);
  if (scrambled.join("") === letters.join("") && letters.length > 1) {
    scrambled = [...scrambled.slice(1), scrambled[0]];
  }
  return scrambled.map((letter, index) => ({ letter, index, used: false }));
}

function makeScrambleRound() {
  const words = gameWords().filter((word) => word.word.replace(/[^a-z]/gi, "").length <= 12);
  const answer = randomItem(words.length ? words : allWords);
  state.currentScramble = {
    answer,
    letters: scrambleLetters(answer.word),
    picked: [],
    answered: false,
  };
  els.scrambleFeedback.textContent = "";
  renderScramble();
}

function renderScramble() {
  const round = state.currentScramble;
  els.scrambleMeta.textContent = setLabel(round.answer.set);
  els.scrambleClue.textContent = `Unscramble: ${round.answer.synonyms[0]}, ${round.answer.synonyms[1]}`;
  els.scrambleAnswer.innerHTML = "";
  const cleanAnswer = round.answer.word.toUpperCase().replace(/[^A-Z]/g, "");
  cleanAnswer.split("").forEach((_, index) => {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = "slot";
    slot.textContent = round.picked[index]?.letter || "";
    slot.addEventListener("click", () => removeScrambleLetter(index));
    els.scrambleAnswer.append(slot);
  });
  els.scrambleLetters.innerHTML = "";
  round.letters.forEach((tile) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = tile.letter;
    button.disabled = tile.used || round.answered;
    button.addEventListener("click", () => pickScrambleLetter(tile.index));
    els.scrambleLetters.append(button);
  });
}

function pickScrambleLetter(index) {
  const round = state.currentScramble;
  const tile = round.letters.find((item) => item.index === index);
  if (!tile || tile.used || round.answered) return;
  tile.used = true;
  round.picked.push(tile);
  renderScramble();
  checkScrambleIfComplete();
}

function removeScrambleLetter(slotIndex) {
  const round = state.currentScramble;
  if (round.answered || !round.picked[slotIndex]) return;
  round.picked[slotIndex].used = false;
  round.picked.splice(slotIndex, 1);
  renderScramble();
}

function clearScramble() {
  const round = state.currentScramble;
  round.letters.forEach((tile) => (tile.used = false));
  round.picked = [];
  round.answered = false;
  els.scrambleFeedback.textContent = "";
  renderScramble();
}

function checkScrambleIfComplete() {
  const round = state.currentScramble;
  const answer = round.answer.word.toUpperCase().replace(/[^A-Z]/g, "");
  const guess = round.picked.map((tile) => tile.letter).join("");
  if (guess.length !== answer.length) return;
  round.answered = true;
  const correct = guess === answer;
  setStatus(round.answer, correct ? "mastered" : "missed");
  els.scrambleFeedback.textContent = correct
    ? `✅ Solved. ${round.answer.word}: ${cleanSynonyms(round.answer)}.`
    : `❌ Answer: ${round.answer.word}. Tap New Scramble to try another.`;
  renderScramble();
}

function renderList() {
  const term = els.searchWords.value.trim().toLowerCase();
  const words = scopedWords().filter((word) => {
    const haystack = `${word.word} ${word.synonyms.join(" ")} ${antonymsFor(word).join(" ")} ${simpleSentence(word)}`.toLowerCase();
    return haystack.includes(term);
  });
  els.listCount.textContent = `${words.length} shown`;
  els.wordList.innerHTML = "";
  words.forEach((word) => {
    const item = document.createElement("article");
    item.className = "word-item";
    const status = state.progress.mastered.includes(wordId(word)) ? "Mastered" : state.progress.missed.includes(wordId(word)) ? "Missed" : "New";
    item.innerHTML = `
      <span class="badge">${setLabel(word.set)} - ${status}</span>
      <h3>${word.word} <small>(${word.partOfSpeech})</small></h3>
      <p><span>Synonyms</span><strong>${cleanSynonyms(word)}</strong></p>
      <p><span>Antonyms</span><strong>${cleanAntonyms(word)}</strong></p>
      <p>${simpleSentence(word)}</p>
    `;
    els.wordList.append(item);
  });
}

function switchMode(mode) {
  state.mode = mode;
  els.modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  Object.entries(els.panels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === mode || (name === "quiz" && mode === "opposites"));
  });
  if (mode === "flashcards") renderFlashcard();
  if (mode === "quiz") makeQuizQuestion("synonym");
  if (mode === "opposites") makeQuizQuestion("antonym");
  if (mode === "match") makeMatchRound();
  if (mode === "sort") makeSortRound();
  if (mode === "scramble") makeScrambleRound();
  if (mode === "list") renderList();
}

function refreshScope() {
  rebuildOrder();
  renderStats();
  switchMode(state.mode);
}

function setup() {
  ["all", ...sets.map(String)].forEach((set) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = set === "all" ? "All Categories" : setLabel(set);
    if (set !== "all") button.title = setLabel(set);
    button.classList.toggle("active", set === state.set);
    button.addEventListener("click", () => {
      state.set = set;
      els.setButtons.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      refreshScope();
    });
    els.setButtons.append(button);
  });

  els.modeButtons.forEach((button) => button.addEventListener("click", () => switchMode(button.dataset.mode)));
  els.missedOnly.addEventListener("change", refreshScope);
  els.shuffleCards.addEventListener("change", refreshScope);
  els.flashcard.addEventListener("click", () => {
    state.revealed = !state.revealed;
    renderFlashcard();
  });
  els.flipCard.addEventListener("click", () => {
    state.revealed = !state.revealed;
    renderFlashcard();
  });
  els.prevCard.addEventListener("click", () => {
    state.index = (state.index - 1 + state.order.length) % state.order.length;
    state.revealed = false;
    renderFlashcard();
  });
  els.nextCard.addEventListener("click", () => {
    state.index = (state.index + 1) % state.order.length;
    state.revealed = false;
    renderFlashcard();
  });
  els.markMissed.addEventListener("click", () => {
    setStatus(currentWord(), "missed");
    els.nextCard.click();
  });
  els.markMastered.addEventListener("click", () => {
    setStatus(currentWord(), "mastered");
    els.nextCard.click();
  });
  els.nextQuiz.addEventListener("click", () => makeQuizQuestion());
  els.nextMatch.addEventListener("click", makeMatchRound);
  els.sortSynonym.addEventListener("click", () => answerSort("synonym"));
  els.sortAntonym.addEventListener("click", () => answerSort("antonym"));
  els.nextSort.addEventListener("click", makeSortRound);
  els.clearScramble.addEventListener("click", clearScramble);
  els.nextScramble.addEventListener("click", makeScrambleRound);
  els.searchWords.addEventListener("input", renderList);
  els.resetProgress.addEventListener("click", () => {
    state.progress = { mastered: [], missed: [], streak: 0 };
    saveProgress();
    refreshScope();
  });
  els.exportProgress.addEventListener("click", async () => {
    const payload = JSON.stringify(state.progress, null, 2);
    await navigator.clipboard.writeText(payload);
    els.exportProgress.textContent = "Copied";
    setTimeout(() => (els.exportProgress.textContent = "Copy"), 1200);
  });

  refreshScope();
}

setup();
