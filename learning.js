/* Pure progress and scheduling rules shared by the app and its checks. */
(function (root) {
  const intervals = [1, 3, 7, 14, 30];
  const dayKey = (now = new Date()) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  function afterDays(now, days) {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    return dayKey(date);
  }
  function normalize(saved = {}, now = new Date()) {
    if (!saved || typeof saved !== 'object') saved = {};
    const ids = value => Array.isArray(value) ? [...new Set(value.filter(id => typeof id === 'string'))] : [];
    const mastered = ids(saved.mastered);
    const missed = ids(saved.missed).filter(id => !mastered.includes(id));
    const records = {};
    if (saved.records && typeof saved.records === 'object') {
      for (const [id, record] of Object.entries(saved.records)) {
        if (!record || typeof record !== 'object') continue;
        records[id] = {
          level: Math.max(0, Math.min(5, Math.floor(Number(record.level) || 0))),
          due: /^\d{4}-\d{2}-\d{2}$/.test(record.due) ? record.due : dayKey(now),
          lastSuccessDate: record.lastSuccessDate || null,
          lastXpDate: record.lastXpDate || null,
        };
      }
    }
    for (const id of mastered) records[id] ||= { level: 3, due: dayKey(now) };
    for (const id of missed) records[id] ||= { level: 0, due: dayKey(now) };
    return {
      version: 2, mastered, missed, records,
      xp: Math.max(0, Math.floor(Number(saved.xp) || 0)),
      streak: Math.max(0, Math.floor(Number(saved.streak) || 0)),
      sessions: Array.isArray(saved.sessions) ? saved.sessions.slice(-30) : [],
      activeSession: saved.activeSession || null,
    };
  }
  function recordAnswer(progress, id, correct, now = new Date()) {
    const today = dayKey(now);
    const record = progress.records[id] ||= { level: 0, due: today };
    let earned = 0;
    if (correct) {
      if (record.lastXpDate !== today) {
        earned = 10;
        progress.xp += earned;
        record.lastXpDate = today;
      }
      // A second encounter on the same day cannot advance the review schedule.
      if (record.lastSuccessDate !== today) {
        record.level = Math.min(5, record.level + 1);
        record.lastSuccessDate = today;
        record.due = afterDays(now, intervals[record.level - 1]);
      }
      progress.missed = progress.missed.filter(item => item !== id);
      if (record.level >= 3 && !progress.mastered.includes(id)) progress.mastered.push(id);
      progress.streak += 1;
    } else {
      record.level = 0;
      record.due = afterDays(now, 1);
      progress.mastered = progress.mastered.filter(item => item !== id);
      if (!progress.missed.includes(id)) progress.missed.push(id);
      progress.streak = 0;
    }
    return earned;
  }
  function selectSession(words, progress, idFor, now = new Date(), count = 10) {
    const today = dayKey(now);
    const due = words.filter(word => progress.records[idFor(word)]?.due <= today)
      .sort((a, b) => Number(progress.missed.includes(idFor(b))) - Number(progress.missed.includes(idFor(a)))
        || progress.records[idFor(a)].due.localeCompare(progress.records[idFor(b)].due));
    const fresh = words.filter(word => !progress.records[idFor(word)]);
    const selected = [];
    const selectedIds = new Set();
    const selectedNames = new Set();
    function take(pool, limit) {
      let added = 0;
      for (const word of pool) {
        if (added >= limit || selected.length >= count) break;
        const id = idFor(word);
        const name = (word.word || id).trim().toLowerCase();
        if (selectedIds.has(id) || selectedNames.has(name)) continue;
        selected.push(word);
        selectedIds.add(id);
        selectedNames.add(name);
        added += 1;
      }
    }
    take(due, 6);
    take(fresh, 4);
    take([...due, ...fresh], count);
    return selected.slice(0, count);
  }
  const api = { dayKey, normalize, recordAnswer, selectSession };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.WordQuestLearning = api;
})(globalThis);
