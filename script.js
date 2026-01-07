// script.js

const audio = new Audio();
let currentIndex = 0;
let isPlaying = false;

// DOM Elements
const songListEl = document.getElementById('song-list');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressContainer = document.getElementById('progress-container');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

const currentTitleEl = document.getElementById('current-title');
const currentArtistEl = document.getElementById('current-artist');
const currentCoverEl = document.getElementById('current-cover');

// Icons
const ICON_PLAY = '<path d="M3 2l10 6-10 6V2z"/>';
const ICON_PAUSE = '<path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"/>';

function init() {
    renderSongList();
    if (songs.length > 0) {
        loadSong(0);
    }
}

function renderSongList() {
    songListEl.innerHTML = '';
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.classList.add('song-item');
        item.dataset.index = index;

        // Simple album placeholder if none exists
        const albumName = song.album || "Unknown Album";

        item.innerHTML = `
            <div class="index">${index + 1}</div>
            <div class="title-col">
                <img src="${song.cover || 'https://placehold.co/40x40/333/FFF?text=♪'}" alt="cover">
                <div>
                    <span class="song-title">${song.title}</span>
                    <span class="song-artist">${song.artist}</span>
                </div>
            </div>
            <div class="album-col">${albumName}</div>
            <div class="duration-col">--:--</div> 
        `;

        item.addEventListener('click', () => {
            playSong(index);
        });

        songListEl.appendChild(item);
    });
}

function loadSong(index) {
    currentIndex = index;
    const song = songs[index];

    currentTitleEl.innerText = song.title;
    currentArtistEl.innerText = song.artist;
    currentCoverEl.style.backgroundImage = `url('${song.cover || 'https://placehold.co/100/333/FFF?text=♪'}')`;

    audio.src = song.file;

    updateActiveSongInList();
}

function playSong(index) {
    if (index !== currentIndex) {
        loadSong(index);
    }
    audio.play();
    isPlaying = true;
    updatePlayPauseIcon();
}

function togglePlay() {
    if (songs.length === 0) return;

    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play();
        isPlaying = true;
    }
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    if (isPlaying) {
        playIcon.innerHTML = ICON_PAUSE;
    } else {
        playIcon.innerHTML = ICON_PLAY;
    }
}

function updateActiveSongInList() {
    const items = document.querySelectorAll('.song-item');
    items.forEach(item => item.classList.remove('active'));
    if (items[currentIndex]) {
        items[currentIndex].classList.add('active');
    }
}

function nextSong() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= songs.length) {
        nextIndex = 0; // Loop info
    }
    playSong(nextIndex);
}

function prevSong() {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
        prevIndex = songs.length - 1;
    }
    playSong(prevIndex);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function updateProgress() {
    const { duration, currentTime } = audio;
    const percent = (currentTime / duration) * 100;
    progressFill.style.width = `${percent}%`;

    currentTimeEl.innerText = formatTime(currentTime);
    durationEl.innerText = formatTime(duration);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (duration) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Event Listeners
playPauseBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

progressContainer.addEventListener('click', setProgress);

// Init
init();
