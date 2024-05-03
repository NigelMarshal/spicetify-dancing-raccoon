let audioData = null;

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
// Keep searching for DOM El for video injection
async function findEl(
  query,
  maxAttempts = 40,
  pauseDuration = 80,
  onSuccess,
  onFailure
) {
  for (let count = 0; count < maxAttempts; count++) {
    const element = document.querySelector(query);
    if (element) {
      onSuccess(element);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, pauseDuration));
  }
  onFailure(
    `Failed to locate element '${query}' after ${maxAttempts} attempts`
  );
}

// Inject video element into the SpotifyUI
async function initializeVideoInjection() {
  const handleSuccess = (element) => {
    console.info("Element found, proceeding with video injection.");
    pedroPedro(element);
  };

  const handleFailure = (errorMessage) => {
    console.error(errorMessage);
  };

  // Video will be inserted into the right side of the now playing widget
  await findEl(
    ".main-nowPlayingWidget-nowPlaying",
    50,
    100,
    handleSuccess,
    handleFailure
  );
}

// Dance lil raccoon, dance!
function pedroPedro(targetElement) {
  const videoURL =
    "https://github.com/NigelMarshal/temp-host/raw/main/pedro-raccoon.webm";
  const videoElement = document.createElement("video");
  videoElement.id = "dancing-raccoon";
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.style.cssText = "width: 80px; height: 80px;";
  videoElement.src = videoURL;

  targetElement.appendChild(videoElement);
}

// Main function to execute when script is loaded
async function main() {
  console.log("Video loaded");
  await initializeVideoInjection();
}

export default main;
