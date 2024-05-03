// Fetch audio data from Spotify
async function getSpotifyAudioData(
  delayBetweenRetries = 200,
  retryAttempts = 5
) {
  while (retryAttempts > 0) {
    try {
      return await Spicetify.getAudioData();
    } catch (error) {
      retryAttempts--;
      console.error("Failed to fetch audio data. Retrying...", error);
      await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
    }
  }
  console.error("Data fetching failed after multiple attempts.");
  return null;
}

// Calculate playback rate for the video
async function calcPlaybackRate(trackData) {
  const baseBPM = 151; // Base BPM for Jaxomy - Pedro
  if (trackData && trackData.track && trackData.track.tempo) {
    const actualBPM = trackData.track.tempo;
    console.info("Current track BPM:", actualBPM);
    const playbackRate = actualBPM / baseBPM;
    return playbackRate;
  } else {
    console.error(
      "Could not calculate playback rate. Using default playback rate."
    );
    return 1;
  }
}

// Find and replace the album art with a video
async function setupVideoInjection() {
  const albumArtContainerQuery = ".main-nowPlayingWidget-coverArt";
  const videoURL =
    "https://github.com/NigelMarshal/spicetify-dancing-raccoon/raw/main/src/video/pedro-raccoon.webm";

  try {
    const albumArtContainer = await findEl(albumArtContainerQuery, 50, 100);
    replaceWithVideo(albumArtContainer, videoURL);
  } catch (error) {
    console.error("Video injection failed:", error);
  }
}

// Replace the album art element with a video element
function replaceWithVideo(container, videoSrc) {
  container.innerHTML = "";
  container.style.backgroundColor = "black";
  container.style.width = "100px";
  container.style.height = "80px";

  const videoElement = document.createElement("video");
  videoElement.id = "dancing-raccoon";
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.style.cssText = "width: 100%; height: 85px;";
  videoElement.src = videoSrc;

  container.appendChild(videoElement);
  handleVideoPlayback(videoElement);
}

// Locate an element with retries
async function findEl(selector, maxAttempts, pauseDuration) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const element = document.querySelector(selector);
    if (element) return element;
    await new Promise((resolve) => setTimeout(resolve, pauseDuration));
  }
  throw new Error(
    `Element ${selector} not found after ${maxAttempts} attempts.`
  );
}

// Handle playback based on player state
function handleVideoPlayback(videoElement) {
  function togglePlayPause() {
    Spicetify.Player.isPlaying() ? videoElement.play() : videoElement.pause();
  }

  // Handle playback rate adjustment
  async function adjustPlaybackRate() {
    const audioData = await getSpotifyAudioData();
    videoElement.playbackRate = await calcPlaybackRate(audioData);
    togglePlayPause();
  }

  togglePlayPause();

  // Setup event listeners for play/pause and song changes
  Spicetify.Player.removeEventListener("onplaypause", togglePlayPause);
  Spicetify.Player.addEventListener("onplaypause", togglePlayPause);
  Spicetify.Player.removeEventListener("songchange", adjustPlaybackRate);
  Spicetify.Player.addEventListener("songchange", adjustPlaybackRate);
}

// Main function to execute when script is loaded
async function main() {
  await setupVideoInjection();
}

export default main;
