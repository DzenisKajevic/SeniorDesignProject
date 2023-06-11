const spotifyConfig = {
    SPOTIPY_CLIENT_ID: process.env.SPOTIPY_CLIENT_ID || "1463a2279ef14d6a8a1202d223e8ea2a",
    SPOTIPY_CLIENT_SECRET: process.env.SPOTIPY_CLIENT_SECRET || '20f5b7c93c05491292594e18337292c1',
    SPOTIPY_REDIRECT_URI: process.env.SPOTIPY_REDIRECT_URI || 'http://localhost:3001/callback',
}

module.exports = spotifyConfig;