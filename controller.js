const selector = document.getElementById('soundSelector');
const openPlayBtn = document.getElementById('openPlayBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const focusBtn = document.getElementById('focusBtn');

const nowPlayingEl = document.getElementById('nowPlaying');
const nextPlayingEl = document.getElementById('nextPlaying');
const prevPlayingEl = document.getElementById('prevPlaying');

const GENERATORS = [
  { title: "Thunderstorm", url: "https://mynoise.net/NoiseMachines/thunderNoiseGenerator.php" },
  { title: "Irish Coast", url: "https://mynoise.net/NoiseMachines/irishCoastNoiseGenerator.php" },
  { title: "Medieval Library", url: "https://mynoise.net/NoiseMachines/customMedievalLibrary.php" },
  { title: "Spaceship", url: "https://mynoise.net/NoiseMachines/spaceshipNoiseGenerator.php" },
  { title: "Intergalactic Soundscape", url: "https://mynoise.net/NoiseMachines/intergalacticSoundscapeGenerator.php" },
  { title: "Bell Sound Journey", url: "https://mynoise.net/NoiseMachines/bellSoundJourneyGenerator.php" },
  { title: "Rain (on a tent)", url: "https://mynoise.net/NoiseMachines/rainNoiseGenerator.php" },
  { title: "Café Restaurant", url: "https://mynoise.net/NoiseMachines/cafeRestaurantNoiseGenerator.php" },
  { title: "Japanese Garden", url: "https://mynoise.net/NoiseMachines/japaneseGardenNoiseGenerator.php" },
  { title: "Gregorian Chant", url: "https://mynoise.net/NoiseMachines/gregorianChantNoiseGenerator.php" },
  { title: "Ocean Waves", url: "https://mynoise.net/NoiseMachines/oceanNoiseGenerator.php" },
  { title: "Temple Bells", url: "https://mynoise.net/NoiseMachines/templeBellsNoiseGenerator.php" },
  { title: "Desert Wind", url: "https://mynoise.net/NoiseMachines/desertWindNoiseGenerator.php" },
  { title: "Forest Birds", url: "https://mynoise.net/NoiseMachines/forestBirdsNoiseGenerator.php" },
  { title: "Cat Purr", url: "https://mynoise.net/NoiseMachines/catPurrNoiseGenerator.php" },
  { title: "Waterfall", url: "https://mynoise.net/NoiseMachines/waterfallNoiseGenerator.php" },
  { title: "Zen Garden", url: "https://mynoise.net/NoiseMachines/zenGardenNoiseGenerator.php" },
  { title: "Tibetan Choir", url: "https://mynoise.net/NoiseMachines/tibetanChoirNoiseGenerator.php" },
  { title: "Wind Chimes", url: "https://mynoise.net/NoiseMachines/windChimesNoiseGenerator.php" },
  { title: "Fireplace", url: "https://mynoise.net/NoiseMachines/fireplaceNoiseGenerator.php" }
];

let currentIndex = 0;

function populateSelector() {
  selector.innerHTML = '';
  GENERATORS.forEach((g, idx) => {
    const opt = document.createElement('option');
    opt.value = String(idx);
    opt.textContent = g.title;
    selector.appendChild(opt);
  });
}

function updateLabels() {
  const now = GENERATORS[currentIndex];
  const next = GENERATORS[(currentIndex + 1) % GENERATORS.length];
  const prev = GENERATORS[(currentIndex - 1 + GENERATORS.length) % GENERATORS.length];
  nowPlayingEl.textContent = now.title;
  nextPlayingEl.textContent = next.title;
  prevPlayingEl.textContent = prev.title;
}

function openSelected() {
  const url = GENERATORS[currentIndex].url;
  chrome.runtime.sendMessage({ cmd: "open-generator", url }, (res) => {
    // The content script (autoplay.js) will click Play once the page loads
  });
}

selector.addEventListener('change', () => {
  const idx = parseInt(selector.value, 10);
  if (!Number.isNaN(idx)) {
    currentIndex = idx;
    updateLabels();
  }
});

openPlayBtn.addEventListener('click', () => {
  openSelected();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % GENERATORS.length;
  selector.value = String(currentIndex);
  updateLabels();
  openSelected();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + GENERATORS.length) % GENERATORS.length;
  selector.value = String(currentIndex);
  updateLabels();
  openSelected();
});

focusBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ cmd: "focus-player" });
});

(function init() {
  populateSelector();
  selector.value = String(currentIndex);
  updateLabels();
})();
