// scoreManager.js
const KEY = 'vanilla_popit_highscores_v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { highest: 0, second: 0 };
    const parsed = JSON.parse(raw);
    return { highest: parsed.highest ?? 0, second: parsed.second ?? 0 };
  } catch { return { highest: 0, second: 0 }; }
}

function save(obj) {
  localStorage.setItem(KEY, JSON.stringify(obj));
}

export function updateHighscores(currentScore) {
  const s = load();
  let newRecord = false;

  if (currentScore > s.highest) {
    s.second = s.highest;
    s.highest = currentScore;
    newRecord = true;
  } else if (currentScore > s.second) {
    s.second = currentScore;
  }

  save(s);
  return { ...s, newRecord };
}

export function renderGameOverScores({ highest, second, current, newRecord }) {
  const highestEl = document.getElementById('highest-score');
  const secondEl  = document.getElementById('second-highest-score');
  const currentEl = document.getElementById('current-score');

  highestEl.textContent = highest;
  secondEl.textContent  = second;
  currentEl.textContent = current;

  if (newRecord) {
    highestEl.classList.add('new-record');
    highestEl.addEventListener('animationend', () => {
      highestEl.classList.remove('new-record');
    }, { once: true });
  }
}
