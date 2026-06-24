// ═══════════════════════════════════════════════════════════════
// DYSLEXIA QUEST - Application complete
// ═══════════════════════════════════════════════════════════════

// [Le début du fichier est déjà dans /mnt/agents/output/app.js]

// Continuation des fonctions de rendu...

function renderModule() {
  const mod = MODULES[AppState.currentModule];
  const progress = Storage.getModuleProgress(AppState.currentModule);
  const currentLevel = progress.level || 1;
  
  let gridHtml = '';
  for (let tier = 0; tier < 11; tier++) {
    const start = tier * 9 + 1;
    const end = Math.min(start + 8, 99);
    for (let level = start; level <= end; level++) {
      let cls = 'level-btn';
      if (level < currentLevel) cls += ' completed';
      else if (level === currentLevel) cls += ' current';
      else if (level === currentLevel + 1) cls += ' available';
      else cls += ' locked';
      if (level >= 91) cls += ' legend';
      
      const disabled = level > currentLevel + 1 ? 'disabled' : '';
      gridHtml += `<button class="${cls}" data-level="${level}" ${disabled}>${level}</button>`;
    }
  }
  
  return '<div class="app-container">' +
    '<header class="app-header">' +
    '<div style="display:flex;align-items:center;gap:12px;">' +
    '<button class="btn btn-secondary" id="back-btn" style="min-height:40px;padding:0 16px;">← Retour</button>' +
    '<div><h1 style="margin:0;">' + mod.icon + ' ' + mod.name + '</h1>' +
    '<p style="margin:0;color:var(--text-muted);font-size:14px;">' + mod.desc + '</p></div></div>' +
    '<div class="tier-badge tier-' + (getTierIndex(currentLevel) + 1) + '">' + getTitle(currentLevel) + '</div></header>' +
    '<div class="card"><h3 style="margin-bottom:16px;">Niveau ' + currentLevel + '/99</h3>' +
    '<div class="progress-bar"><div class="progress-fill" style="width:' + ((currentLevel / 99) * 100) + '%;background:' + mod.color + '"></div></div>' +
    '<p style="margin-top:12px;color:var(--text-muted);">XP: ' + progress.xp + '/' + getLevelXP(currentLevel) + '</p></div>' +
    '<div class="levels-grid">' + gridHtml + '</div></div>';
}

function attachModuleEvents() {
  document.getElementById('back-btn')?.addEventListener('click', () => {
    AppState.currentPage = 'dashboard';
    renderApp();
  });
  
  document.querySelectorAll('.level-btn:not(.locked)').forEach(btn => {
    btn.addEventListener('click', () => {
      AppState.currentLevel = parseInt(btn.dataset.level);
      AppState.currentPage = 'game';
      renderApp();
    });
  });
}

function renderGame() {
  const mod = MODULES[AppState.currentModule];
  return '<div class="app-container">' +
    '<header class="app-header" style="padding:8px 0;">' +
    '<div style="display:flex;align-items:center;gap:10px;">' +
    '<button class="btn btn-secondary" id="quit-btn" style="min-height:36px;padding:0 12px;">✕</button>' +
    '<div><div style="font-weight:600;">' + mod.icon + ' ' + mod.name + '</div>' +
    '<div style="font-size:13px;color:var(--text-muted);">Niveau ' + AppState.currentLevel + '</div></div></div>' +
    '<div style="display:flex;align-items:center;gap:16px;">' +
    '<div class="lives-container" id="lives-display"><span class="life">❤️</span><span class="life">❤️</span><span class="life">❤️</span></div>' +
    '<div style="font-weight:700;color:var(--accent-primary);">Score: <span id="score-display">0</span></div></div></header>' +
    '<div id="game-content" style="flex:1;display:flex;flex-direction:column;"></div></div>';
}

function initGame() {
  AppState.lives = 3;
  AppState.score = 0;
  AppState.combo = 0;
  
  const level = AppState.currentLevel;
  const tier = getTierIndex(level) + 1;
  const module = AppState.currentModule;
  
  switch (module) {
    case 'decodeur': initDecodeur(tier); break;
    case 'syllabator': initSyllabator(tier); break;
    case 'memory': initMemory(tier); break;
    case 'clavier': initClavier(tier); break;
    case 'syntaxe': initSyntaxe(tier); break;
    case 'boss': initBoss(tier); break;
  }
}

function attachGameEvents() {
  document.getElementById('quit-btn')?.addEventListener('click', () => {
    if (confirm('Quitter la partie ?')) {
      AppState.currentPage = 'module';
      renderApp();
    }
  });
}

function loseLife() {
  AppState.lives--;
  const lives = document.querySelectorAll('.life');
  if (lives[AppState.lives]) lives[AppState.lives].classList.add('lost');
  if (AppState.lives <= 0) {
    endGame(false);
  }
}

function addScore(points) {
  AppState.combo++;
  const multiplier = 1 + (AppState.combo * 0.1);
  const earned = Math.round(points * multiplier);
  AppState.score += earned;
  const display = document.getElementById('score-display');
  if (display) display.textContent = AppState.score;
}

function endGame(success) {
  const mod = AppState.currentModule;
  const level = AppState.currentLevel;
  const progress = Storage.getModuleProgress(mod);
  
  const earnedXP = success ? Math.round(AppState.score / 10) + 20 : 5;
  const newXP = (progress.xp || 0) + earnedXP;
  const xpNeeded = getLevelXP(level);
  
  let leveledUp = false;
  let newLevel = progress.level || 1;
  
  if (success && newXP >= xpNeeded && level === (progress.level || 1)) {
    newLevel = Math.min(99, level + 1);
    progress.level = newLevel;
    progress.xp = newXP - xpNeeded;
    leveledUp = true;
    
    // Badges
    if (newLevel === 10) addBadge('Apprenti');
    if (newLevel === 19) addBadge('Etudiant');
    if (newLevel === 37) addBadge('Adepte');
    if (newLevel === 55) addBadge('Expert');
    if (newLevel === 73) addBadge('Maitre');
    if (newLevel === 91) addBadge('Legende');
    if (newLevel === 99) addBadge('Boss Ultime ' + MODULES[mod].name);
  } else {
    progress.xp = newXP;
  }
  
  if (!progress.completed) progress.completed = [];
  if (success && !progress.completed.includes(level)) {
    progress.completed.push(level);
  }
  
  Storage.saveModuleProgress(mod, progress);
  
  // Update stats
  const stats = Storage.getStats();
  stats.totalGames = (stats.totalGames || 0) + 1;
  if (success) stats.totalCorrect = (stats.totalCorrect || 0) + 1;
  else stats.totalErrors = (stats.totalErrors || 0) + 1;
  Storage.saveStats(stats);
  
  // Update streak
  const streak = Storage.getStreak();
  const today = new Date().toDateString();
  const lastDate = streak.lastDate ? new Date(streak.lastDate).toDateString() : null;
  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate === yesterday.toDateString()) streak.current++;
    else streak.current = 1;
    streak.lastDate = Date.now();
    Storage.saveStreak(streak);
  }
  
  AppState.gameResult = {
    success, score: AppState.score, lives: AppState.lives,
    combo: AppState.combo, earnedXP, leveledUp, newLevel
  };
  
  AppState.currentPage = 'results';
  renderApp();
}

function addBadge(badge) {
  const badges = Storage.getBadges();
  if (!badges.includes(badge)) {
    badges.push(badge);
    Storage.saveBadges(badges);
  }
}

// ═══════════════════════════════════════════════════════════════
// MODULES DE JEU
// ═══════════════════════════════════════════════════════════════

function initDecodeur(tier) {
  const content = document.getElementById('game-content');
  const texts = GAME_DATA.decodeur.texts[Math.min(tier, 5)] || GAME_DATA.decodeur.texts[1];
  const data = texts[Math.floor(Math.random() * texts.length)];
  
  AppState.gameState = { currentText: data, currentQuestion: 0, correctAnswers: 0 };
  
  content.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;gap:20px;">' +
    '<div class="audio-controls"><button class="audio-btn" id="read-text-btn">🔊</button>' +
    '<span style="color:var(--text-secondary);">Ecoute le texte</span></div>' +
    '<div class="reading-text" id="reading-text">' + data.text + '</div>' +
    '<div class="card" style="margin-top:auto;"><div id="question-container"></div></div></div>';
  
  renderQuestion();
  
  document.getElementById('read-text-btn')?.addEventListener('click', () => {
    Speech.speak(data.text, 0.8);
  });
}

function renderQuestion() {
  const state = AppState.gameState;
  const questions = state.currentText.questions;
  
  if (state.currentQuestion >= questions.length) {
    const score = Math.round((state.correctAnswers / questions.length) * 100);
    if (score >= 50) { addScore(50); endGame(true); }
    else endGame(false);
    return;
  }
  
  const q = questions[state.currentQuestion];
  const container = document.getElementById('question-container');
  
  container.innerHTML = '<div style="margin-bottom:12px;color:var(--text-muted);font-size:14px;">' +
    'Question ' + (state.currentQuestion + 1) + '/' + questions.length + '</div>' +
    '<div class="question-text" style="margin-bottom:16px;">' + q.q + '</div>' +
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
    q.options.map((opt, i) => '<button class="qcm-option" data-index="' + i + '">' + opt + '</button>').join('') +
    '</div>';
  
  container.querySelectorAll('.qcm-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const correct = idx === q.correct;
      btn.classList.add(correct ? 'correct' : 'incorrect');
      container.querySelectorAll('.qcm-option').forEach(b => b.disabled = true);
      
      if (correct) {
        state.correctAnswers++;
        addScore(25);
        Speech.speak('Bonne reponse!');
      } else {
        loseLife();
        Speech.speak('Ce n est pas la bonne reponse.');
      }
      
      state.currentQuestion++;
      setTimeout(() => renderQuestion(), 1500);
    });
  });
}

function initSyllabator(tier) {
  const content = document.getElementById('game-content');
  const words = GAME_DATA.syllabator.words[Math.min(tier, 5)] || GAME_DATA.syllabator.words[1];
  const target = words[Math.floor(Math.random() * words.length)];
  const syllables = target.split('-');
  const shuffled = [...syllables].sort(() => Math.random() - 0.5);
  
  AppState.gameState = {
    targetSyllables: syllables,
    userSyllables: [],
    targetWord: target.replace(/-/g, '')
  };
  
  content.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;gap:24px;">' +
    '<div class="audio-controls"><button class="audio-btn" id="listen-btn">🔊</button>' +
    '<span style="color:var(--text-secondary);">Ecoute le mot</span></div>' +
    '<div style="text-align:center;"><div style="font-size:14px;color:var(--text-muted);margin-bottom:16px;">' +
    'Reconstitue le mot en cliquant sur les syllabes :</div>' +
    '<div id="result-zone" style="min-height:60px;padding:16px;background:var(--bg-card);border-radius:12px;' +
    'border:2px dashed var(--border-color);margin-bottom:16px;font-size:24px;font-weight:600;">?</div></div>' +
    '<div id="choices" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:20px;' +
    'background:var(--bg-secondary);border-radius:12px;">' +
    shuffled.map(s => '<button class="syllable" data-syl="' + s + '">' + s + '</button>').join('') +
    '</div><div style="display:flex;gap:12px;margin-top:auto;">' +
    '<button class="btn" id="validate-btn" disabled>Valider</button>' +
    '<button class="btn btn-secondary" id="reset-btn">Reinitialiser</button></div></div>';
  
  document.getElementById('listen-btn')?.addEventListener('click', () => {
    Speech.speak(AppState.gameState.targetWord, 0.7);
  });
  
  document.querySelectorAll('.syllable').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('selected')) return;
      const syl = btn.dataset.syl;
      AppState.gameState.userSyllables.push(syl);
      btn.classList.add('selected');
      btn.disabled = true;
      
      const zone = document.getElementById('result-zone');
      if (AppState.gameState.userSyllables.length === 1) zone.innerHTML = '';
      zone.innerHTML += '<span style="color:var(--accent-primary);margin:0 4px;">' + syl + '</span>';
      
      document.getElementById('validate-btn').disabled =
        AppState.gameState.userSyllables.length !== AppState.gameState.targetSyllables.length;
    });
  });
  
  document.getElementById('validate-btn')?.addEventListener('click', () => {
    const user = AppState.gameState.userSyllables;
    const target = AppState.gameState.targetSyllables;
    const correct = user.length === target.length && user.every((s, i) => s === target[i]);
    
    if (correct) {
      addScore(30);
      Speech.speak('Bravo! Le mot est ' + AppState.gameState.targetWord);
      endGame(true);
    } else {
      loseLife();
      Speech.speak('L ordre n est pas correct.');
      document.getElementById('result-zone').classList.add('shake');
      setTimeout(() => document.getElementById('result-zone').classList.remove('shake'), 500);
    }
  });
  
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    AppState.gameState.userSyllables = [];
    document.getElementById('result-zone').innerHTML = '?';
    document.querySelectorAll('.syllable').forEach(b => {
      b.classList.remove('selected');
      b.disabled = false;
    });
    document.getElementById('validate-btn').disabled = true;
  });
}

function initMemory(tier) {
  const content = document.getElementById('game-content');
  const sizes = { 1: [3, 4], 2: [4, 4], 3: [4, 5], 4: [5, 5], 5: [6, 5] };
  const size = sizes[Math.min(tier, 5)] || [3, 4];
  const allPairs = GAME_DATA.memory.pairs[Math.min(tier, 5)] || GAME_DATA.memory.pairs[1];
  const numPairs = Math.floor((size[0] * size[1]) / 2);
  
  const selected = [];
  for (let i = 0; i < numPairs && i < allPairs.length; i++) selected.push(allPairs[i]);
  while (selected.length < numPairs) selected.push(allPairs[Math.floor(Math.random() * allPairs.length)]);
  
  const cards = [];
  selected.forEach((pair, idx) => {
    cards.push({ text: pair[0], pairId: idx });
    cards.push({ text: pair[1], pairId: idx });
  });
  cards.sort(() => Math.random() - 0.5);
  
  AppState.gameState = { cards, flipped: [], matched: [], canFlip: true, moves: 0 };
  
  content.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;gap:16px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
    '<div style="color:var(--text-muted);">Coups: <span id="moves">0</span></div>' +
    '<button class="audio-btn" id="hint-btn">💡 Indice</button></div>' +
    '<div class="memory-grid" id="memory-grid" style="grid-template-columns:repeat(' + size[1] + ',1fr);"></div></div>';
  
  renderMemoryGrid();
  
  document.getElementById('hint-btn')?.addEventListener('click', () => {
    document.querySelectorAll('.memory-card.hidden').forEach(el => {
      el.classList.remove('hidden');
      el.classList.add('flipped');
      el.textContent = AppState.gameState.cards[parseInt(el.dataset.index)].text;
    });
    setTimeout(() => {
      document.querySelectorAll('.memory-card.flipped').forEach(el => {
        if (!el.classList.contains('matched')) {
          el.classList.remove('flipped');
          el.classList.add('hidden');
          el.textContent = '';
        }
      });
    }, 2000);
  });
}

function renderMemoryGrid() {
  const grid = document.getElementById('memory-grid');
  if (!grid) return;
  const { cards, flipped, matched } = AppState.gameState;
  
  grid.innerHTML = cards.map((card, i) => {
    let cls = 'memory-card';
    let text = '';
    if (flipped.includes(i) || matched.includes(i)) {
      cls += matched.includes(i) ? ' matched' : ' flipped';
      text = card.text;
    } else {
      cls += ' hidden';
    }
    return '<div class="' + cls + '" data-index="' + i + '">' + text + '</div>';
  }).join('');
  
  if (!AppState.gameState.canFlip) return;
  grid.querySelectorAll('.memory-card.hidden').forEach(card => {
    card.addEventListener('click', () => flipMemoryCard(parseInt(card.dataset.index)));
  });
}

function flipMemoryCard(index) {
  const state = AppState.gameState;
  if (!state.canFlip || state.flipped.includes(index) || state.matched.includes(index)) return;
  if (state.flipped.length >= 2) return;
  
  state.flipped.push(index);
  const card = document.querySelector('.memory-card[data-index="' + index + '"]');
  card.classList.remove('hidden');
  card.classList.add('flipped');
  card.textContent = state.cards[index].text;
  
  if (state.flipped.length === 2) {
    state.canFlip = false;
    state.moves++;
    document.getElementById('moves').textContent = state.moves;
    
    const [i1, i2] = state.flipped;
    if (state.cards[i1].pairId === state.cards[i2].pairId) {
      setTimeout(() => {
        document.querySelectorAll('.memory-card.flipped').forEach(c => {
          c.classList.remove('flipped');
          c.classList.add('matched');
        });
        state.matched.push(i1, i2);
        state.flipped = [];
        state.canFlip = true;
        addScore(25);
        if (state.matched.length >= state.cards.length) setTimeout(() => endGame(true), 500);
      }, 500);
    } else {
      setTimeout(() => {
        document.querySelectorAll('.memory-card.flipped').forEach(c => {
          c.classList.remove('flipped');
          c.classList.add('hidden');
          c.textContent = '';
        });
        state.flipped = [];
        state.canFlip = true;
        AppState.combo = 0;
      }, 1000);
    }
  }
}

function initClavier(tier) {
  const content = document.getElementById('game-content');
  const words = GAME_DATA.clavier.words[Math.min(tier, 6)] || GAME_DATA.clavier.words[1];
  let targetText = Array.isArray(words) ? words[Math.floor(Math.random() * words.length)] : words;
  
  if (tier >= 3) {
    targetText = shuffleLetters(targetText, tier >= 7 ? 3 : tier >= 5 ? 2 : 1);
  }
  
  AppState.gameState = { targetText, userInput: '', startTime: null };
  
  content.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;gap:20px;">' +
    '<div class="audio-controls"><button class="audio-btn" id="dictate-btn">🔊</button>' +
    '<span style="color:var(--text-secondary);">Ecoute et recopie</span></div>' +
    '<div class="typing-target" id="typing-target"></div>' +
    '<input type="text" id="typing-input" class="typing-input" autocomplete="off" autocorrect="off" spellcheck="false">' +
    '<div style="display:flex;justify-content:space-between;">' +
    '<div style="color:var(--text-muted);">Vitesse: <span id="wpm">0</span> mots/min</div>' +
    '<div style="color:var(--text-muted);">Fautes: <span id="errors">0</span></div></div>' +
    '<button class="btn" id="validate-typing" style="margin-top:auto;">Valider</button></div>';
  
  updateTypingDisplay();
  
  const input = document.getElementById('typing-input');
  input.focus();
  input.addEventListener('input', (e) => {
    if (!AppState.gameState.startTime) AppState.gameState.startTime = Date.now();
    AppState.gameState.userInput = e.target.value;
    updateTypingDisplay();
    
    const elapsed = (Date.now() - AppState.gameState.startTime) / 60000;
    if (elapsed > 0.01) {
      const words = e.target.value.trim().split(/\s+/).length;
      const wpm = Math.round(words / elapsed);
      document.getElementById('wpm').textContent = wpm;
    }
  });
  
  document.getElementById('dictate-btn')?.addEventListener('click', () => {
    Speech.speak(targetText, 0.8);
  });
  
  document.getElementById('validate-typing')?.addEventListener('click', () => {
    const input = AppState.gameState.userInput.trim().toLowerCase().replace(/\s+/g, ' ');
    const target = AppState.gameState.targetText.toLowerCase().replace(/\s+/g, ' ');
    if (input === target) {
      addScore(50);
      Speech.speak('Parfait!');
      endGame(true);
    } else {
      loseLife();
      Speech.speak('Il y a des erreurs.');
      document.getElementById('typing-target').classList.add('shake');
      setTimeout(() => document.getElementById('typing-target').classList.remove('shake'), 500);
    }
  });
  
  document.getElementById('typing-target')?.addEventListener('click', () => input.focus());
}

function shuffleLetters(text, numSwaps) {
  return text.split(' ').map(word => {
    if (word.length < 3) return word;
    const chars = word.split('');
    for (let i = 0; i < numSwaps; i++) {
      const idx1 = Math.floor(Math.random() * (chars.length - 2)) + 1;
      const idx2 = Math.floor(Math.random() * (chars.length - 2)) + 1;
      [chars[idx1], chars[idx2]] = [chars[idx2], chars[idx1]];
    }
    return chars.join('');
  }).join(' ');
}

function updateTypingDisplay() {
  const target = document.getElementById('typing-target');
  if (!target) return;
  const { targetText, userInput } = AppState.gameState;
  let html = '';
  for (let i = 0; i < targetText.length; i++) {
    const char = targetText[i];
    const userChar = userInput[i];
    let cls = 'typing-char';
    if (i < userInput.length) {
      cls += userChar === char ? ' correct' : ' incorrect';
    } else if (i === userInput.length) {
      cls += ' current';
    }
    html += '<span class="' + cls + '">' + char + '</span>';
  }
  target.innerHTML = html;
}

function initSyntaxe(tier) {
  const content = document.getElementById('game-content');
  const sentences = GAME_DATA.syntaxe.sentences[Math.min(tier, 5)] || GAME_DATA.syntaxe.sentences[1];
  const current = sentences[Math.floor(Math.random() * sentences.length)];
  const shuffled = [...current.words].sort(() => Math.random() - 0.5);
  
  AppState.gameState = { correctOrder: current.words, userOrder: [] };
  
  content.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;gap:24px;">' +
    '<div class="audio-controls"><button class="audio-btn" id="read-btn">🔊</button>' +
    '<span style="color:var(--text-secondary);">Ecoute la phrase</span></div>' +
    '<div style="text-align:center;"><div style="font-size:14px;color:var(--text-muted);margin-bottom:12px;">' +
    'Reconstitue la phrase :</div>' +
    '<div class="syntax-drop-zone" id="syntax-zone" style="min-height:60px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;">' +
    '<span style="color:var(--text-muted);">Clique les mots dans le bon ordre</span></div></div>' +
    '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;padding:16px;background:var(--bg-card);border-radius:12px;">' +
    shuffled.map(w => '<button class="syntax-word" data-word="' + w + '">' + w + '</button>').join('') +
    '</div><div style="display:flex;gap:12px;margin-top:auto;">' +
    '<button class="btn" id="validate-syntax" disabled>Valider</button>' +
    '<button class="btn btn-secondary" id="reset-syntax">Reinitialiser</button></div></div>';
  
  document.getElementById('read-btn')?.addEventListener('click', () => {
    Speech.speak(current.words.join(' '), 0.8);
  });
  
  document.querySelectorAll('.syntax-word').forEach(word => {
    word.addEventListener('click', () => {
      if (word.classList.contains('used')) return;
      const zone = document.getElementById('syntax-zone');
      if (AppState.gameState.userOrder.length === 0) zone.innerHTML = '';
      
      AppState.gameState.userOrder.push(word.dataset.word);
      word.classList.add('used');
      word.style.opacity = '0.3';
      word.disabled = true;
      
      const span = document.createElement('span');
      span.className = 'syntax-word';
      span.textContent = word.dataset.word;
      span.style.cursor = 'pointer';
      span.addEventListener('click', () => {
        const idx = AppState.gameState.userOrder.indexOf(word.dataset.word);
        if (idx > -1) {
          AppState.gameState.userOrder.splice(idx, 1);
          span.remove();
          word.classList.remove('used');
          word.style.opacity = '1';
          word.disabled = false;
          if (AppState.gameState.userOrder.length === 0) {
            zone.innerHTML = '<span style="color:var(--text-muted);">Clique les mots dans le bon ordre</span>';
          }
          document.getElementById('validate-syntax').disabled = true;
        }
      });
      zone.appendChild(span);
      
      document.getElementById('validate-syntax').disabled =
        AppState.gameState.userOrder.length !== AppState.gameState.correctOrder.length;
    });
  });
  
  document.getElementById('validate-syntax')?.addEventListener('click', () => {
    const user = AppState.gameState.userOrder;
    const correct = AppState.gameState.correctOrder;
    const isCorrect = user.length === correct.length && user.every((w, i) => w === correct[i]);
    
    if (isCorrect) {
      addScore(40);
      Speech.speak('Excellent!');
      endGame(true);
    } else {
      loseLife();
      Speech.speak('Ordre incorrect.');
      document.getElementById('syntax-zone').classList.add('shake');
      setTimeout(() => document.getElementById('syntax-zone').classList.remove('shake'), 500);
    }
  });
  
  document.getElementById('reset-syntax')?.addEventListener('click', () => {
    AppState.gameState.userOrder = [];
    document.getElementById('syntax-zone').innerHTML = '<span style="color:var(--text-muted);">Clique les mots dans le bon ordre</span>';
    document.querySelectorAll('.syntax-word').forEach(btn => {
      btn.classList.remove('used');
      btn.style.opacity = '1';
      btn.disabled = false;
    });
    document.getElementById('validate-syntax').disabled = true;
  });
}

function initBoss(tier) {
  const content = document.getElementById('game-content');
  const texts = GAME_DATA.boss.texts[Math.min(tier, 5)] || GAME_DATA.boss.texts[1];
  const data = texts[Math.floor(Math.random() * texts.length)];
  
  AppState.gameState = { textData: data, currentQuestion: 0, correct: 0 };
  
  content.innerHTML = '<div style="flex:1;display:flex;flex-direction:column;gap:20px;">' +
    '<div class="audio-controls"><button class="audio-btn" id="read-boss-btn">🔊</button>' +
    '<span style="color:var(--text-secondary);">Ecoute le texte</span></div>' +
    '<div class="reading-text" id="boss-text" style="font-size:16px;">' + data.text + '</div>' +
    '<div class="card" style="margin-top:auto;"><div id="question-container"></div></div></div>';
  
  renderBossQuestion();
  
  document.getElementById('read-boss-btn')?.addEventListener('click', () => {
    Speech.speak(data.text.replace(/<[^>]*>/g, ' '), 0.8);
  });
}

function renderBossQuestion() {
  const state = AppState.gameState;
  const questions = state.textData.questions;
  
  if (state.currentQuestion >= questions.length) {
    const score = Math.round((state.correct / questions.length) * 100);
    if (score >= 60) { addScore(100); endGame(true); }
    else endGame(false);
    return;
  }
  
  const q = questions[state.currentQuestion];
  const container = document.getElementById('question-container');
  
  container.innerHTML = '<div style="margin-bottom:12px;color:var(--text-muted);font-size:14px;">' +
    'Question ' + (state.currentQuestion + 1) + '/' + questions.length + '</div>' +
    '<div class="question-text" style="margin-bottom:16px;">' + q.q + '</div>' +
    '<div style="display:flex;flex-direction:column;gap:10px;">' +
    q.options.map((opt, i) => '<button class="qcm-option" data-index="' + i + '">' + opt + '</button>').join('') +
    '</div>';
  
  container.querySelectorAll('.qcm-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const correct = idx === q.correct;
      btn.classList.add(correct ? 'correct' : 'incorrect');
      container.querySelectorAll('.qcm-option').forEach(b => b.disabled = true);
      
      if (correct) {
        state.correct++;
        addScore(20);
        Speech.speak('Bonne reponse!');
      } else {
        loseLife();
        Speech.speak('Ce n est pas la bonne reponse.');
      }
      
      state.currentQuestion++;
      setTimeout(() => renderBossQuestion(), 1500);
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// RESULTATS, PARAMETRES, STATS
// ═══════════════════════════════════════════════════════════════

function renderResults() {
  const result = AppState.gameResult;
  const mod = MODULES[AppState.currentModule];
  const stars = result.success ? (result.lives === 3 ? '⭐⭐⭐' : result.lives === 2 ? '⭐⭐' : '⭐') : '💔';
  
  return '<div class="app-container" style="justify-content:center;"><div class="results-screen fade-in">' +
    '<div style="font-size:72px;margin-bottom:16px;">' + (result.success ? '🎉' : '😔') + '</div>' +
    '<h1 style="margin-bottom:8px;">' + (result.success ? 'Niveau reussi!' : 'Niveau echoue') + '</h1>' +
    '<div class="stars">' + stars + '</div>' +
    '<div class="score">' + result.score + '</div>' +
    '<div style="color:var(--text-muted);margin-bottom:24px;">points gagnes</div>' +
    '<div class="card" style="max-width:400px;margin:0 auto 24px;text-align:left;">' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color);">' +
    '<span>XP gagnes</span><span style="font-weight:600;color:var(--accent-success);">+' + result.earnedXP + ' XP</span></div>' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color);">' +
    '<span>Combo max</span><span style="font-weight:600;">×' + result.combo + '</span></div>' +
    '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color);">' +
    '<span>Vies restantes</span><span style="font-weight:600;color:' + (result.lives > 0 ? 'var(--accent-success)' : '#e74c3c') + ';">' + result.lives + '/3</span></div>' +
    (result.leveledUp ? '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color);">' +
    '<span>Niveau suivant debloque!</span><span style="font-weight:600;color:var(--accent-gold);">Niv ' + result.newLevel + '</span></div>' : '') +
    '</div>' +
    '<div class="btn-group" style="flex-direction:column;align-items:center;">' +
    '<button class="btn" id="next-btn" style="min-width:250px;">' + (result.success ? 'Niveau suivant →' : 'Reessayer 🔄') + '</button>' +
    '<button class="btn btn-secondary" id="back-module-btn" style="min-width:250px;">Retour au module</button>' +
    '<button class="btn btn-secondary" id="back-dash-btn" style="min-width:250px;">🏠 Tableau de bord</button></div></div></div>';
}

function attachResultsEvents() {
  document.getElementById('next-btn')?.addEventListener('click', () => {
    if (AppState.gameResult.success) AppState.currentLevel++;
    AppState.currentPage = 'game';
    renderApp();
  });
  document.getElementById('back-module-btn')?.addEventListener('click', () => {
    AppState.currentPage = 'module';
    renderApp();
  });
  document.getElementById('back-dash-btn')?.addEventListener('click', () => {
    AppState.currentPage = 'dashboard';
    renderApp();
  });
}

function renderSettings() {
  const profile = Storage.getProfile();
  return '<div class="app-container"><header class="app-header">' +
    '<div style="display:flex;align-items:center;gap:12px;">' +
    '<button class="btn btn-secondary" id="back-settings" style="min-height:40px;padding:0 16px;">← Retour</button>' +
    '<h1 style="margin:0;">⚙️ Parametres</h1></div></header>' +
    '<div class="card"><h3 style="margin-bottom:20px;">Apparence</h3>' +
    '<div class="settings-row"><span>Theme sombre</span>' +
    '<div class="toggle-switch ' + (profile.theme === 'dark' ? 'active' : '') + '" id="theme-toggle"></div></div>' +
    '<div class="settings-row"><span>Taille du texte</span>' +
    '<div class="btn-group"><button class="btn btn-secondary" id="font-small">A-</button>' +
    '<button class="btn btn-secondary" id="font-normal">A</button>' +
    '<button class="btn btn-secondary" id="font-large">A+</button></div></div></div>' +
    '<div class="card"><h3 style="margin-bottom:20px;">Audio</h3>' +
    '<div class="settings-row"><span>Voix feminine</span>' +
    '<div class="toggle-switch ' + (profile.voiceGender === 'female' ? 'active' : '') + '" id="voice-toggle"></div></div>' +
    '<div class="settings-row"><span>Sons du jeu</span>' +
    '<div class="toggle-switch ' + (profile.soundEnabled ? 'active' : '') + '" id="sound-toggle"></div></div></div>' +
    '<div class="card"><h3 style="margin-bottom:20px;">Donnees</h3>' +
    '<div class="settings-row"><span>Exporter les donnees</span>' +
    '<button class="btn btn-secondary" id="export-btn">💾 Exporter</button></div>' +
    '<div class="settings-row"><span style="color:#e74c3c;">Reinitialiser tout</span>' +
    '<button class="btn btn-secondary" id="reset-btn" style="border-color:#e74c3c;color:#e74c3c;">🗑️ Reinitialiser</button></div></div></div>';
}

function attachSettingsEvents() {
  document.getElementById('back-settings')?.addEventListener('click', () => {
    AppState.currentPage = 'dashboard';
    renderApp();
  });
  
  const profile = Storage.getProfile();
  
  document.getElementById('theme-toggle')?.addEventListener('click', function() {
    this.classList.toggle('active');
    profile.theme = this.classList.contains('active') ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', profile.theme);
    Storage.saveProfile(profile);
  });
  
  document.getElementById('voice-toggle')?.addEventListener('click', function() {
    this.classList.toggle('active');
    profile.voiceGender = this.classList.contains('active') ? 'female' : 'male';
    Storage.saveProfile(profile);
  });
  
  document.getElementById('sound-toggle')?.addEventListener('click', function() {
    this.classList.toggle('active');
    profile.soundEnabled = this.classList.contains('active');
    Storage.saveProfile(profile);
  });
  
  document.getElementById('export-btn')?.addEventListener('click', () => {
    const data = Storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dyslexia-quest-' + data.profile.pseudo + '.json';
    a.click();
    URL.revokeObjectURL(url);
  });
  
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if (confirm('ATTENTION: Cette action effacera TOUTES tes donnees. Es-tu sur?')) {
      Storage.resetAll();
      location.reload();
    }
  });
  
  document.getElementById('font-small')?.addEventListener('click', () => {
    document.documentElement.style.setProperty('--font-size-base', '16px');
  });
  document.getElementById('font-normal')?.addEventListener('click', () => {
    document.documentElement.style.setProperty('--font-size-base', '18px');
  });
  document.getElementById('font-large')?.addEventListener('click', () => {
    document.documentElement.style.setProperty('--font-size-base', '22px');
  });
}

function renderStatsPage() {
  const stats = Storage.getStats();
  const progress = Storage.getProgress();
  const streak = Storage.getStreak();
  const badges = Storage.getBadges();
  
  let modulesHtml = '';
  Object.values(MODULES).forEach(mod => {
    const p = progress[mod.id] || { level: 1 };
    modulesHtml += '<div style="margin-bottom:16px;">' +
      '<div style="display:flex;justify-content:space-between;margin-bottom:6px;">' +
      '<span style="font-weight:600;">' + mod.name + '</span>' +
      '<span style="color:' + mod.color + ';font-weight:700;">Niv ' + p.level + '</span></div>' +
      '<div class="progress-bar"><div class="progress-fill" style="width:' + ((p.level / 99) * 100) + '%;background:' + mod.color + ';"></div></div></div>';
  });
  
  return '<div class="app-container"><header class="app-header">' +
    '<div style="display:flex;align-items:center;gap:12px;">' +
    '<button class="btn btn-secondary" id="back-stats" style="min-height:40px;padding:0 16px;">← Retour</button>' +
    '<h1 style="margin:0;">📊 Statistiques</h1></div></header>' +
    '<div class="stats-grid">' +
    '<div class="stat-card"><span class="stat-value">' + (stats.totalGames || 0) + '</span><span class="stat-label">Parties jouees</span></div>' +
    '<div class="stat-card"><span class="stat-value">' + (stats.totalCorrect || 0) + '</span><span class="stat-label">Bonnes reponses</span></div>' +
    '<div class="stat-card"><span class="stat-value">' + (streak.current || 0) + '</span><span class="stat-label">Jours de suite</span></div>' +
    '<div class="stat-card"><span class="stat-value">' + badges.length + '</span><span class="stat-label">Badges</span></div></div>' +
    '<div class="card"><h3 style="margin-bottom:20px;">Progression par module</h3>' + modulesHtml + '</div>' +
    '<div class="card"><h3 style="margin-bottom:20px;">Badges obtenus</h3>' +
    (badges.length > 0 ? badges.map(b => '<span class="badge unlocked" style="margin:4px;">' + b + '</span>').join('') :
    '<p style="color:var(--text-muted);">Aucun badge pour le moment. Continue a jouer!</p>') + '</div></div>';
}

function attachStatsEvents() {
  document.getElementById('back-stats')?.addEventListener('click', () => {
    AppState.currentPage = 'dashboard';
    renderApp();
  });
}

// ═══════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  const profile = Storage.getProfile();
  if (profile.pseudo) {
    AppState.currentPage = 'dashboard';
  } else {
    AppState.currentPage = 'login';
  }
  document.documentElement.setAttribute('data-theme', profile.theme || 'dark');
  renderApp();
  
  // Charger les voix
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
});