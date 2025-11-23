const selector = document.getElementById('soundSelector');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volume = document.getElementById('volume');
const nowPlayingEl = document.getElementById('nowPlaying');
const player = document.getElementById('player');

// 10 ultra-long ambient MP3s
const TRACKS = [
  { title: "Rain & Thunder", url: "https://freesound.org/data/previews/398/39828_512123-lq.mp3" },
  { title: "Ocean Waves", url: "https://cdn.pixabay.com/download/audio/2022/03/30/audio_1f6f3b77f6.mp3?filename=ocean-waves-109677.mp3" },
  { title: "Forest Night", url: "https://freesound.org/data/previews/708/708611_1600837-lq.mp3" },
  { title: "Fireplace Crackle", url: "https://quicksounds.com/uploads/fireplace-loop.mp3" },
  { title: "Wind Chimes", url: "https://freesound.org/data/previews/612/6126_3bagbrew-lq.mp3" },
  { title: "Waterfall", url: "https://cdn.pixabay.com/download/audio/2022/03/30/audio_1f6f3b77f6.mp3?filename=waterfall-109678.mp3" },
  { title: "Desert Wind", url: "https://cdn.pixabay.com/download/audio/2022/03/30/audio_1f6f3b77f6.mp3?filename=desert-wind-109679.mp3" },
  { title: "Cat Purr", url: "https://bigsoundbank.com/UPLOAD/mp3/1010.mp3" },
  { title: "Tibetan Choir", url: "https://cdn.pixabay.com/download/audio/2022/03/30/audio_1f6f3b77f6.mp3?filename=tibetan-choir-109680.mp3" },
  { title: "Cafe Restaurant", url: "https://cdn.pixabay.com/download/audio/2022/03/30/audio_1f6f3b77f6.mp3?filename=cafe-restaurant-109681.mp3" }
];

let currentIndex = 0;
let isPlaying = false;

function populateSelector() {
  selector.innerHTML = '';
  TRACKS.forEach((t, idx) => {
    const opt = document.createElement('option');
    opt.value = idx;
    opt.textContent = t.title;
    selector.appendChild(opt);
  });
}

function updateNowPlaying() {
  nowPlayingEl.textContent = TRACKS[currentIndex].title;
}

function loadTrack() {
  player.src = TRACKS[currentIndex].url;
  player.loop = true; // auto-repeat
  player.load();
  updateNowPlaying();
}

function playTrack() {
  loadTrack();
  player.play();
  isPlaying = true;
  playPauseBtn.textContent = "Pause";
}

function pauseTrack() {
  player.pause();
  isPlaying = false;
  playPauseBtn.textContent = "Play";
}

selector.addEventListener('change', () => {
  currentIndex = parseInt(selector.value, 10);
  playTrack();
});

playPauseBtn.addEventListener('click', () => {
  if (isPlaying) pauseTrack();
  else playTrack();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % TRACKS.length;
  selector.value = currentIndex;
  playTrack();
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
  selector.value = currentIndex;
  playTrack();
});

volume.addEventListener('input', () => {
  player.volume = volume.value / 100;
});

// Init
populateSelector();
selector.value = currentIndex;
updateNowPlaying();
player.volume = volume.value / 100;
