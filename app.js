const workbookWords = window.VOCABULARY_WORDS.map((word) => ({ source: "HSPT", ...word }));
const allWords = shuffle([...workbookWords, ...(window.EXAM_VOCABULARY_WORDS || [])]);
const vaultPdfWords = (window.HSPT_PDF_VOCABULARY_WORDS || []).map((word) => ({ ...word, source: "HSPT" }));
const vaultWords = [...allWords, ...vaultPdfWords];
const categories = ["HSPT", "ISEE", "SSAT"];
const wordPartEntries = [
  ["prefix", "anti", "against", ["antiperspirant", "antibody", "antithesis"]],
  ["prefix", "bi", "two", ["bicycle", "binary", "bilingual"]],
  ["prefix", "circum", "around", ["circumference", "circumnavigate", "circumspect"]],
  ["prefix", "inter", "between", ["interview", "interstellar", "international"]],
  ["prefix", "mis", "bad or wrong", ["mistake", "misfire", "misguided"]],
  ["prefix", "mono", "one", ["monogram", "monotone", "monologue"]],
  ["prefix", "non", "not", ["nonfiction", "nonprofit", "nonstop"]],
  ["prefix", "post", "after", ["posttest", "postscript", "postgraduate"]],
  ["prefix", "pre", "before", ["pretest", "preview", "predict"]],
  ["prefix", "re", "again", ["review", "return", "rewrite"]],
  ["prefix", "sub", "under", ["submarine", "subway", "subterranean"]],
  ["prefix", "un", "not", ["unpleasant", "unequal", "unfit"]],
  ["suffix", "-able", "able to be", ["readable", "portable", "teachable"]],
  ["suffix", "-er", "one who", ["teacher", "runner", "writer"]],
  ["suffix", "-ful", "full of", ["hopeful", "careful", "joyful"]],
  ["suffix", "-ian", "specialist or related to", ["musician", "historian", "magician"]],
  ["suffix", "-ible", "able to be", ["audible", "visible", "flexible"]],
  ["suffix", "-ist", "one who practices", ["artist", "scientist", "pianist"]],
  ["suffix", "-less", "without", ["careless", "fearless", "hopeless"]],
  ["suffix", "-logy", "study or science of", ["biology", "geology", "mythology"]],
  ["suffix", "-ment", "act or result", ["movement", "payment", "argument"]],
  ["suffix", "-ness", "state of being", ["kindness", "fairness", "darkness"]],
  ["suffix", "-ous", "full of", ["joyous", "famous", "dangerous"]],
  ["suffix", "-tion", "act or state", ["creation", "reaction", "transition"]],
  ["root", "aqua", "water", ["aquarium", "aquatic", "aqueduct"]],
  ["root", "aud/audi", "hear", ["audible", "audience", "audition"]],
  ["root", "bene", "good", ["benefit", "benevolent", "beneficial"]],
  ["root", "bio", "life", ["biology", "biography", "biome"]],
  ["root", "chron", "time", ["chronological", "chronic", "chronicle"]],
  ["root", "geo", "earth", ["geography", "geology", "geothermal"]],
  ["root", "hydr/hydro", "water", ["hydroelectric", "hydrate", "hydrogen"]],
  ["root", "magn", "great", ["magnificent", "magnify", "magnitude"]],
  ["root", "mal", "bad", ["malnourished", "malicious", "malfunction"]],
  ["root", "micro", "small", ["microscopic", "microphone", "microbe"]],
  ["root", "phon", "sound", ["microphone", "symphony", "phonics"]],
  ["root", "photo", "light", ["photograph", "photosynthesis", "photon"]],
  ["root", "tele", "far", ["telescope", "telephone", "television"]],
  ["root", "therm", "heat", ["thermometer", "thermostat", "thermal"]],
  ["stem", "duct", "to lead", ["conduct", "induct", "deduction"]],
  ["stem", "fer", "to carry", ["transfer", "ferry", "refer"]],
  ["stem", "pend", "to hang", ["depend", "pending", "pendulum"]],
  ["stem", "spec", "to look or see", ["spectator", "spectacle", "inspect"]],
  ["stem", "port", "to carry", ["transport", "portable", "import"]],
  ["stem", "scribe", "to write", ["scribble", "describe", "transcribe"]],
  ["stem", "vid", "to see", ["video", "evidence", "provide"]],
  ["stem", "ject", "to throw", ["eject", "reject", "project"]],
  ["stem", "rupt", "to break", ["erupt", "rupture", "interrupt"]],
  ["stem", "struct", "to build", ["construct", "structure", "instruct"]],
].map(([type, part, meaning, examples]) => ({ type, part, meaning, examples }));

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
  category: "HSPT",
  mode: "flashcards",
  theme: loadTheme(),
  order: [],
  index: 0,
  revealed: false,
  flashcardClickTimer: null,
  partFilter: "prefix",
  sortMode: "synonym",
  currentQuiz: null,
  currentMatch: null,
  currentSort: null,
  currentScramble: null,
  currentSpeed: null,
  currentPop: null,
  progress: loadProgress(),
};

const els = {
  setButtons: document.querySelector("#setButtons"),
  modeButtons: document.querySelectorAll(".mode-button"),
  themeButtons: document.querySelectorAll(".theme-button"),
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
    speed: document.querySelector("#speedPanel"),
    pop: document.querySelector("#popPanel"),
    list: document.querySelector("#listPanel"),
    roots: document.querySelector("#rootsPanel"),
  },
  flashcard: document.querySelector("#flashcard"),
  quizCard: document.querySelector("#quizPanel .question-card"),
  matchCard: document.querySelector("#matchPanel .game-card"),
  sortCard: document.querySelector("#sortPanel .game-card"),
  scrambleCard: document.querySelector("#scramblePanel .game-card"),
  speedCard: document.querySelector("#speedPanel .game-card"),
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
  sortModeButtons: document.querySelectorAll(".sort-toggle-button"),
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
  hintScramble: document.querySelector("#hintScramble"),
  nextScramble: document.querySelector("#nextScramble"),
  speedMeta: document.querySelector("#speedMeta"),
  speedScore: document.querySelector("#speedScore"),
  speedTimer: document.querySelector("#speedTimer"),
  speedLength: document.querySelector("#speedLength"),
  speedQuestion: document.querySelector("#speedQuestion"),
  speedOptions: document.querySelector("#speedOptions"),
  speedFeedback: document.querySelector("#speedFeedback"),
  restartSpeed: document.querySelector("#restartSpeed"),
  popMeta: document.querySelector("#popMeta"),
  popScore: document.querySelector("#popScore"),
  popClue: document.querySelector("#popClue"),
  popOptions: document.querySelector("#popOptions"),
  popFeedback: document.querySelector("#popFeedback"),
  nextPop: document.querySelector("#nextPop"),
  vaultCategory: document.querySelector("#vaultCategory"),
  partMeta: document.querySelector("#partMeta"),
  rootsGrid: document.querySelector("#rootsGrid"),
  partButtons: document.querySelectorAll(".part-mode-button"),
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

function loadTheme() {
  return localStorage.getItem("vocab-theme") || "dark";
}

function setTheme(theme) {
  state.theme = theme;
  document.body.dataset.theme = theme;
  localStorage.setItem("vocab-theme", theme);
  els.themeButtons.forEach((button) => button.classList.toggle("active", button.dataset.theme === theme));
}

function saveProgress() {
  localStorage.setItem("vocab-progress", JSON.stringify(state.progress));
}

function wordId(word) {
  return `${word.source}-${word.set}-${word.number}-${word.word.toLowerCase()}`;
}

function scopedWords() {
  let words = allWords.filter((word) => word.source === state.category);
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
  const lower = word.word.toLowerCase();
  if (word.partOfSpeech === "v") {
    return `During class, the group tried to ${lower} the problem before the bell rang.`;
  }
  if (word.partOfSpeech === "n") {
    return `At lunch, Maya heard a simple example of ${lower}.`;
  }
  return `In middle school, Jordan noticed something ${lower} during the project.`;
}

function categoryLabel(category) {
  return `${category} Words`;
}

function setMeta(word) {
  return `${categoryLabel(word.source)} ${word.set} - ${word.partOfSpeech}`;
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
  els.scopeLabel.textContent = categoryLabel(state.category);
  els.scopeCount.textContent = `${scoped.length} word${scoped.length === 1 ? "" : "s"}`;
  els.rankLabel.textContent = rankName(state.progress.mastered.length);
  els.progressBar.style.width = scoped.length ? `${Math.round((mastered / scoped.length) * 100)}%` : "0%";
}

function vaultCategoryWords(category) {
  return vaultWords.filter((word) => word.source === category);
}

function renderVaultStats(category, shownCount) {
  const total = vaultCategoryWords(category).length;
  els.scopeLabel.textContent = `${category} Vault`;
  els.scopeCount.textContent = `${total} word${total === 1 ? "" : "s"}`;
  els.rankLabel.textContent = `${shownCount} shown`;
  els.progressBar.style.width = total ? `${Math.round((shownCount / total) * 100)}%` : "0%";
}

function currentWordParts() {
  return wordPartEntries.filter((entry) => entry.type === state.partFilter);
}

function partFilterLabel(filter) {
  if (filter === "prefix") return "Prefixes";
  if (filter === "suffix") return "Suffixes";
  if (filter === "root") return "Roots";
  if (filter === "stem") return "Stems";
  return "Word Parts";
}

function renderRootStats() {
  const entries = currentWordParts();
  els.scopeLabel.textContent = partFilterLabel(state.partFilter);
  els.scopeCount.textContent = `${entries.length} card${entries.length === 1 ? "" : "s"}`;
  els.rankLabel.textContent = "Flip Study";
  els.progressBar.style.width = "100%";
}

function flashRefresh(element) {
  element.classList.remove("refresh-flash");
  void element.offsetWidth;
  element.classList.add("refresh-flash");
}

function renderFlashcard(animate = false) {
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
  if (animate) flashRefresh(els.flashcard);
}

function flipFlashcard() {
  state.revealed = !state.revealed;
  renderFlashcard();
}

function nextFlashcard() {
  state.index = (state.index + 1) % state.order.length;
  state.revealed = false;
  renderFlashcard(true);
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
  flashRefresh(els.quizCard);
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
  els.matchMeta.textContent = `${categoryLabel(round.answer.source)} ${round.answer.set}`;
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
  flashRefresh(els.matchCard);
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
  const kind = state.sortMode;
  const clue = randomItem(kind === "antonym" ? antonymsFor(answer) : answer.synonyms);
  state.currentSort = { answer, kind, clue, answered: false };
  renderSort();
}

function updateSortKind(kind) {
  if (!state.currentSort) {
    makeSortRound();
    return;
  }
  state.currentSort.kind = kind;
  state.currentSort.clue = randomItem(kind === "antonym" ? antonymsFor(state.currentSort.answer) : state.currentSort.answer.synonyms);
  state.currentSort.answered = false;
  renderSort();
}

function renderSort() {
  const round = state.currentSort;
  els.sortMeta.textContent = `${categoryLabel(round.answer.source)} ${round.answer.set}`;
  els.sortWord.textContent = round.answer.word;
  els.sortClue.textContent = round.clue;
  els.sortFeedback.textContent = "";
  [els.sortSynonym, els.sortAntonym].forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong");
  });
  flashRefresh(els.sortCard);
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

function cleanScrambleAnswer(word) {
  return word.toUpperCase().replace(/[^A-Z]/g, "");
}

function makeScrambleRound() {
  const words = gameWords().filter((word) => word.word.replace(/[^a-z]/gi, "").length <= 12);
  const answer = randomItem(words.length ? words : allWords);
  const cleanAnswer = cleanScrambleAnswer(answer.word);
  state.currentScramble = {
    answer,
    letters: scrambleLetters(answer.word),
    picked: Array(cleanAnswer.length).fill(null),
    hintedSlots: [],
    triedAfterHint: false,
    answered: false,
  };
  els.scrambleFeedback.textContent = "";
  renderScramble(true);
}

function renderScramble(animate = false) {
  const round = state.currentScramble;
  els.scrambleMeta.textContent = `${categoryLabel(round.answer.source)} ${round.answer.set}`;
  els.scrambleClue.textContent = `Unscramble: ${round.answer.synonyms[0]}, ${round.answer.synonyms[1]}`;
  els.scrambleAnswer.innerHTML = "";
  const cleanAnswer = cleanScrambleAnswer(round.answer.word);
  cleanAnswer.split("").forEach((_, index) => {
    const slot = document.createElement("button");
    slot.type = "button";
    slot.className = `slot${round.hintedSlots.includes(index) ? " hint-slot" : ""}`;
    slot.textContent = round.picked[index]?.letter || "";
    slot.disabled = round.hintedSlots.includes(index);
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
  if (animate) flashRefresh(els.scrambleCard);
}

function pickScrambleLetter(index) {
  const round = state.currentScramble;
  const tile = round.letters.find((item) => item.index === index);
  if (!tile || tile.used || round.answered) return;
  const slotIndex = round.picked.findIndex((item) => !item);
  if (slotIndex === -1) return;
  tile.used = true;
  round.picked[slotIndex] = tile;
  renderScramble();
  checkScrambleIfComplete();
}

function removeScrambleLetter(slotIndex) {
  const round = state.currentScramble;
  if (round.answered || round.hintedSlots.includes(slotIndex) || !round.picked[slotIndex]) return;
  round.picked[slotIndex].used = false;
  round.picked[slotIndex] = null;
  renderScramble();
}

function clearScramble() {
  const round = state.currentScramble;
  round.letters.forEach((tile) => (tile.used = false));
  round.picked = Array(cleanScrambleAnswer(round.answer.word).length).fill(null);
  round.hintedSlots = [];
  round.triedAfterHint = false;
  round.answered = false;
  els.scrambleFeedback.textContent = "";
  renderScramble();
}

function hintScramble(message = "Hint added: two letters are in the right spots.") {
  const round = state.currentScramble;
  if (round.answered) return;
  const answer = cleanScrambleAnswer(round.answer.word);
  const openSlots = answer
    .split("")
    .map((_, index) => index)
    .filter((index) => !round.hintedSlots.includes(index));
  shuffle(openSlots)
    .slice(0, 2)
    .forEach((slotIndex) => {
      if (round.picked[slotIndex]) round.picked[slotIndex].used = false;
      const letter = answer[slotIndex];
      const tile = round.letters.find((item) => !item.used && item.letter === letter);
      if (!tile) return;
      tile.used = true;
      round.picked[slotIndex] = tile;
      round.hintedSlots.push(slotIndex);
    });
  els.scrambleFeedback.textContent = message;
  renderScramble();
  checkScrambleIfComplete();
}

function checkScrambleIfComplete() {
  const round = state.currentScramble;
  const answer = cleanScrambleAnswer(round.answer.word);
  if (round.picked.some((tile) => !tile)) return;
  const guess = round.picked.map((tile) => tile.letter).join("");
  const correct = guess === answer;
  if (!correct && round.hintedSlots.length < 2) {
    round.picked.forEach((tile, index) => {
      if (tile && !round.hintedSlots.includes(index)) tile.used = false;
    });
    round.picked = round.picked.map((tile, index) => (round.hintedSlots.includes(index) ? tile : null));
    hintScramble("Not quite. Two hint letters are now in the right spots.");
    return;
  }
  if (!correct && !round.triedAfterHint) {
    round.triedAfterHint = true;
    els.scrambleFeedback.textContent = "Close. Try once more with the hint letters.";
    return;
  }
  round.answered = true;
  setStatus(round.answer, correct ? "mastered" : "missed");
  els.scrambleFeedback.textContent = correct
    ? `✅ Solved. ${round.answer.word}: ${cleanSynonyms(round.answer)}.`
    : `❌ Answer: ${round.answer.word}. Tap New Scramble to try another.`;
  renderScramble();
}

function makeSpeedOptions(answer) {
  const pool = allWords.filter((word) => wordId(word) !== wordId(answer));
  return shuffle([answer, ...shuffle(pool).slice(0, 3)]);
}

function speedSeconds(round) {
  const end = round.finishedAt || Date.now();
  return Math.floor((end - round.startedAt) / 1000);
}

function updateSpeedTimer() {
  const round = state.currentSpeed;
  if (!round) return;
  els.speedTimer.textContent = `${speedSeconds(round)}s`;
}

function stopSpeedTimer() {
  if (!state.currentSpeed?.timerId) return;
  clearInterval(state.currentSpeed.timerId);
  state.currentSpeed.timerId = null;
}

function speedRoundLength() {
  const value = Number(els.speedLength.value);
  const max = Math.min(gameWords().length, 50);
  return Math.max(3, Math.min(Number.isFinite(value) ? value : 10, max));
}

function startSpeedRound() {
  stopSpeedTimer();
  const length = speedRoundLength();
  els.speedLength.value = String(length);
  const words = shuffle(gameWords()).slice(0, length);
  state.currentSpeed = {
    words,
    index: 0,
    score: 0,
    answered: false,
    startedAt: Date.now(),
    finishedAt: null,
    timerId: null,
    options: makeSpeedOptions(words[0]),
  };
  state.currentSpeed.timerId = setInterval(updateSpeedTimer, 1000);
  renderSpeed();
  updateSpeedTimer();
}

function renderSpeed() {
  const round = state.currentSpeed;
  if (!round) return;
  const total = round.words.length;
  if (round.index >= total) {
    stopSpeedTimer();
    const seconds = speedSeconds(round);
    els.speedMeta.textContent = `${categoryLabel(state.category)} complete`;
    els.speedScore.textContent = `${round.score}/${total}`;
    els.speedTimer.textContent = `${seconds}s`;
    els.speedQuestion.textContent = `Finished in ${seconds}s`;
    els.speedOptions.innerHTML = "";
    els.speedFeedback.textContent = `Score: ${round.score} correct out of ${total}.`;
    flashRefresh(els.speedCard);
    return;
  }

  const answer = round.words[round.index];
  els.speedMeta.textContent = `${categoryLabel(answer.source)} ${answer.set} - word ${round.index + 1} of ${total}`;
  els.speedScore.textContent = `${round.score}/${total}`;
  els.speedQuestion.textContent = `Which word means "${answer.synonyms[0]}"?`;
  els.speedFeedback.textContent = `Pick fast. Your round ends after ${total} words.`;
  els.speedOptions.innerHTML = "";
  round.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.word;
    button.addEventListener("click", () => answerSpeed(option, button));
    els.speedOptions.append(button);
  });
  flashRefresh(els.speedCard);
}

function answerSpeed(selected, button) {
  const round = state.currentSpeed;
  if (!round || round.answered || round.index >= round.words.length) return;
  round.answered = true;
  const answer = round.words[round.index];
  const correct = wordId(selected) === wordId(answer);
  if (correct) round.score += 1;
  button.classList.add(correct ? "correct" : "wrong");
  [...els.speedOptions.children].forEach((optionButton) => {
    if (optionButton.textContent === answer.word) optionButton.classList.add("correct");
    optionButton.disabled = true;
  });
  setStatus(answer, correct ? "mastered" : "missed");
  els.speedScore.textContent = `${round.score}/${round.words.length}`;
  els.speedFeedback.textContent = correct ? `Correct: ${answer.word}.` : `Answer: ${answer.word}.`;
  setTimeout(() => {
    if (state.currentSpeed !== round || state.mode !== "speed") return;
    round.index += 1;
    round.answered = false;
    if (round.index >= round.words.length) {
      round.finishedAt = Date.now();
    } else {
      round.options = makeSpeedOptions(round.words[round.index]);
    }
    renderSpeed();
  }, 520);
}

function makePopRound() {
  const words = gameWords();
  const answer = randomItem(words);
  const pool = allWords.filter((word) => wordId(word) !== wordId(answer));
  state.currentPop = {
    answer,
    clue: randomItem(answer.synonyms),
    options: shuffle([answer, ...shuffle(pool).slice(0, 5)]),
    answered: false,
    score: state.currentPop?.score || 0,
  };
  renderPop();
}

function renderPop() {
  const round = state.currentPop;
  if (!round) return;
  els.popMeta.textContent = `${categoryLabel(round.answer.source)} ${round.answer.set}`;
  els.popScore.textContent = String(round.score);
  els.popClue.textContent = `Pop the word that means "${round.clue}"`;
  els.popFeedback.textContent = "Pick a bubble.";
  els.popOptions.innerHTML = "";
  round.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = option.word;
    button.addEventListener("click", () => answerPop(option, button));
    els.popOptions.append(button);
  });
  flashRefresh(els.popOptions.closest(".game-card"));
}

function answerPop(selected, button) {
  const round = state.currentPop;
  if (!round || round.answered) return;
  round.answered = true;
  const correct = wordId(selected) === wordId(round.answer);
  if (correct) round.score += 1;
  button.classList.add(correct ? "correct" : "wrong");
  [...els.popOptions.children].forEach((optionButton) => {
    if (optionButton.textContent === round.answer.word) optionButton.classList.add("correct");
    optionButton.disabled = true;
  });
  setStatus(round.answer, correct ? "mastered" : "missed");
  els.popScore.textContent = String(round.score);
  els.popFeedback.textContent = correct
    ? `Pop! ${round.answer.word} means ${cleanSynonyms(round.answer)}.`
    : `Not that bubble. Answer: ${round.answer.word}.`;
}

function renderList() {
  const term = els.searchWords.value.trim().toLowerCase();
  const category = els.vaultCategory.value;
  const words = vaultCategoryWords(category).filter((word) => {
    const haystack = `${word.word} ${word.synonyms.join(" ")} ${antonymsFor(word).join(" ")} ${simpleSentence(word)}`.toLowerCase();
    return haystack.includes(term);
  });
  renderVaultStats(category, words.length);
  els.listCount.textContent = `${words.length} ${category} shown`;
  els.wordList.innerHTML = "";
  words.forEach((word) => {
    const item = document.createElement("article");
    item.className = "vault2-card";
    const status = state.progress.mastered.includes(wordId(word)) ? "Mastered" : state.progress.missed.includes(wordId(word)) ? "Missed" : "New";
    item.innerHTML = `
      <div class="vault2-card-head">
        <span class="badge">${categoryLabel(word.source)} ${word.set}</span>
        <span class="vault2-status">${status}</span>
      </div>
      <h3>${word.word}</h3>
      <span class="vault2-part">${word.partOfSpeech}</span>
      <div class="vault2-clues">
        <p><span>Synonyms</span><strong>${cleanSynonyms(word)}</strong></p>
        <p><span>Antonyms</span><strong>${cleanAntonyms(word)}</strong></p>
      </div>
      <p class="vault2-example">${simpleSentence(word)}</p>
    `;
    els.wordList.append(item);
  });
}

function renderRoots() {
  const entries = currentWordParts();
  renderRootStats();
  els.partMeta.textContent = `${partFilterLabel(state.partFilter)} Flashcards`;
  els.rootsGrid.innerHTML = "";
  entries.forEach((entry) => {
    const item = document.createElement("article");
    item.className = "root-card";
    item.innerHTML = `
      <div class="root-face root-front">
        <span>${entry.type}</span>
        <h3>${entry.part}</h3>
        <p>Tap to reveal meaning</p>
      </div>
      <div class="root-face root-back">
        <span>Meaning</span>
        <h3>${entry.meaning}</h3>
        <p>Examples</p>
        <ul class="root-examples">
          ${entry.examples.map((example) => `<li>${example}</li>`).join("")}
        </ul>
      </div>
    `;
    item.addEventListener("click", () => item.classList.toggle("flipped"));
    els.rootsGrid.append(item);
  });
}

function switchMode(mode) {
  if (mode !== "speed") stopSpeedTimer();
  state.mode = mode;
  els.modeButtons.forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
  Object.entries(els.panels).forEach(([name, panel]) => {
    panel.classList.toggle("active", name === mode || (name === "quiz" && mode === "opposites"));
  });
  if (mode === "flashcards") renderFlashcard(true);
  if (mode === "quiz") makeQuizQuestion("synonym");
  if (mode === "opposites") makeQuizQuestion("antonym");
  if (mode === "match") makeMatchRound();
  if (mode === "sort") makeSortRound();
  if (mode === "scramble") makeScrambleRound();
  if (mode === "speed") startSpeedRound();
  if (mode === "pop") makePopRound();
  if (mode === "list") {
    els.vaultCategory.value = state.category;
    renderList();
  }
  if (mode === "roots") renderRoots();
}

function refreshScope() {
  rebuildOrder();
  renderStats();
  switchMode(state.mode);
}

function setup() {
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = categoryLabel(category);
    button.title = categoryLabel(category);
    button.classList.toggle("active", category === state.category);
    button.addEventListener("click", () => {
      state.category = category;
      els.setButtons.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      refreshScope();
    });
    els.setButtons.append(button);
  });

  els.modeButtons.forEach((button) => button.addEventListener("click", () => switchMode(button.dataset.mode)));
  els.themeButtons.forEach((button) => button.addEventListener("click", () => setTheme(button.dataset.theme)));
  els.missedOnly.addEventListener("change", refreshScope);
  els.shuffleCards.addEventListener("change", refreshScope);
  els.flashcard.addEventListener("click", () => {
    clearTimeout(state.flashcardClickTimer);
    state.flashcardClickTimer = setTimeout(() => {
      flipFlashcard();
      state.flashcardClickTimer = null;
    }, 220);
  });
  els.flashcard.addEventListener("dblclick", () => {
    clearTimeout(state.flashcardClickTimer);
    state.flashcardClickTimer = null;
    nextFlashcard();
  });
  els.flipCard.addEventListener("click", () => {
    flipFlashcard();
  });
  els.prevCard.addEventListener("click", () => {
    state.index = (state.index - 1 + state.order.length) % state.order.length;
    state.revealed = false;
    renderFlashcard(true);
  });
  els.nextCard.addEventListener("click", () => {
    nextFlashcard();
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
  els.sortModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.sortMode = button.dataset.sortMode;
      els.sortModeButtons.forEach((item) => item.classList.toggle("active", item === button));
      updateSortKind(state.sortMode);
    });
  });
  els.sortSynonym.addEventListener("click", () => answerSort("synonym"));
  els.sortAntonym.addEventListener("click", () => answerSort("antonym"));
  els.nextSort.addEventListener("click", makeSortRound);
  els.sortCard.addEventListener("dblclick", (event) => {
    if (event.target.closest("button")) return;
    makeSortRound();
  });
  els.clearScramble.addEventListener("click", clearScramble);
  els.hintScramble.addEventListener("click", () => hintScramble());
  els.nextScramble.addEventListener("click", makeScrambleRound);
  els.restartSpeed.addEventListener("click", startSpeedRound);
  els.speedLength.addEventListener("change", () => {
    if (state.mode === "speed") startSpeedRound();
  });
  els.nextPop.addEventListener("click", makePopRound);
  els.vaultCategory.addEventListener("change", renderList);
  els.partButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.partFilter = button.dataset.partFilter;
      els.partButtons.forEach((item) => item.classList.toggle("active", item === button));
      switchMode("roots");
    });
  });
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
  setTheme(state.theme);
}

setup();
