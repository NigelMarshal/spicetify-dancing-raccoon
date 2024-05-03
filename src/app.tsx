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

async function main() {}

export default main;
