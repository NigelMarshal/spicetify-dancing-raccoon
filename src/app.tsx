let audioData = null;

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

async function testGetSpotifyAudioData() {
  const audioData = await getSpotifyAudioData();
  console.log("Retrieved Audio Data:", audioData);
}

async function main() {
  testGetSpotifyAudioData();
}

export default main;
