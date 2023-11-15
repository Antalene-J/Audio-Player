const songListElement = document.getElementById("song-list");
    let songs = [];
    for (let i = 1; i <= 48; i++) {
        songs.push(`Songs/Audio-${i}.mp3`);
    }

    let currentSongIndex = 0;
    const audioPlayer = document.getElementById("audioPlayer");
    const songItems = document.getElementsByClassName("songItem");
    const currentSongNameElement = document.getElementById("currentSongName");
    let ctrlIcon = document.getElementById("ctrlIcon");
    const progress = document.querySelector(".progress");
    const currentTime = document.querySelector(".current-time");
    const totalTime = document.querySelector(".total-time");

    

    function seekTo() {
        const seekToTime = audioPlayer.duration * (progress.value / 100);
        audioPlayer.currentTime = seekToTime;
        audioPlayer.play();
        if(ctrlIcon.classList.contains("fa-play")){
            ctrlIcon.classList.add("fa-pause");
            ctrlIcon.classList.remove("fa-play");
        }
    }

    

    function playSong() {
        const currentSongName = songs[currentSongIndex];
        currentSongNameElement.textContent = `${currentSongName.slice(6)}`;
        audioPlayer.src = songs[currentSongIndex];
        audioPlayer.load();
        audioPlayer.play();
        highlightCurrentSong();
        updateDisplayedSongs()
    }

    function playpause(){
        if(ctrlIcon.classList.contains("fa-pause")){
            audioPlayer.pause();
            ctrlIcon.classList.remove("fa-pause");
            ctrlIcon.classList.add("fa-play");
        }
        else{
            audioPlayer.play();
            ctrlIcon.classList.add("fa-pause");
            ctrlIcon.classList.remove("fa-play");
        }
    }

    function playPreviousSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playSong();
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playSong();
    }
    function highlightCurrentSong() {
    for (let i = 0; i < songItems.length; i++) {
        if (i === currentSongIndex) {
            songItems[i].classList.add("currentSong");
        } else {
            songItems[i].classList.remove("currentSong");
        }
    }
    }
        function fetchRandomIndices() {
    return fetch('http://localhost:8000/generate_random_indices')
        .then(response => response.json())
        .then(indices => {
            return indices;
        })
        .catch(error => console.error('Error fetching random indices:', error));
}

function shuffleSongs() {
    // Call the server to get random indices
    fetchRandomIndices().then(indices => {
        // Use the obtained indices to shuffle songs
        for (let i = songs.length - 1; i > 0; i--) {
            const j = indices[i];
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        currentSongIndex = 0;
        playSong();
        updateDisplayedSongs();
        highlightCurrentSong();
        if (ctrlIcon.classList.contains("fa-play")) {
            ctrlIcon.classList.add("fa-pause");
            ctrlIcon.classList.remove("fa-play");
        }
    
}



    function updateDisplayedSongs() {
        const promises = [];
    
        for (let i = 0; i < songItems.length; i++) {
            const songIndex = i;
            const songName = songs[songIndex].slice(6);
            const promise = getSongDuration(songs[songIndex]).then((duration) => {
                const formattedTime = formatTime(duration);
                songItems[i].innerHTML = `<span class="song-name">${songName}</span><span class="time">${formattedTime}</span>`;
            });
            promises.push(promise);
        }
    
        // Wait for all promises to resolve before continuing
        Promise.all(promises).then(() => {
            // Additional logic if needed after all durations are fetched
        });
    }
    
    
    function getSongDuration(songUrl) {
        return new Promise((resolve) => {
            const audio = new Audio(songUrl);
            audio.addEventListener("loadedmetadata", function () {
                resolve(audio.duration);
            });
    
            // Load the audio to get the metadata
            audio.src = songUrl;
            audio.load();
        });
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds - minutes * 60);
        return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }
    

   function restoreOriginalList() {
            songs = [];
            for (let i = 1; i <= 48; i++) {
                songs.push(`Songs/Audio-${i}.mp3`);
            }
            currentSongIndex = 0;
            playSong();
            updateDisplayedSongs();
            highlightCurrentSong();
            if(ctrlIcon.classList.contains("fa-play")){
                ctrlIcon.classList.add("fa-pause");
                ctrlIcon.classList.remove("fa-play");
            }
        }

    document.addEventListener("DOMContentLoaded", function () {
        playSong();

        for (let i = 0; i < songItems.length; i++) {
            songItems[i].addEventListener("click", function () {
                currentSongIndex = i;
                playSong();
            });
        }
        audioPlayer.addEventListener("ended", function () {
            playNextSong();
        });
        if (progressValue >= 100) {
            progress.classList.add("crossed-thumb");
        } else {
            progress.classList.remove("crossed-thumb");
        }
    });
    
    audioPlayer.addEventListener("loadedmetadata", function () {
        progress.value = "0";
        const totalTimeMinutes = Math.floor(audioPlayer.duration / 60);
        const totalTimeSeconds = Math.floor(audioPlayer.duration - totalTimeMinutes * 60);

        let formattedTotalTime = totalTimeMinutes + ":" + (totalTimeSeconds < 10 ? "0" : "") + totalTimeSeconds;
        totalTime.textContent = formattedTotalTime;
    });

    audioPlayer.addEventListener("timeupdate", function () {
        const currentTimeMinutes = Math.floor(audioPlayer.currentTime / 60);
        const currentTimeSeconds = Math.floor(audioPlayer.currentTime - currentTimeMinutes * 60);

        let formattedCurrentTime = currentTimeMinutes + ":" + (currentTimeSeconds < 10 ? "0" : "") + currentTimeSeconds;
        currentTime.textContent = formattedCurrentTime;

        const progressValue = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.value = progressValue;
        
        if (progressValue >= 99.5) {
            progress.classList.add("crossed-thumb");
        } else {
            progress.classList.remove("crossed-thumb");
        }
    });

