import { createSlice } from '@reduxjs/toolkit'

export const genresSlice = createSlice({
    name: 'genres',
    initialState: {
        genres: [],
        songs: [], // used for displaying songs inside of a genre which we are currently browsing
        currentlyPlayingGenreSongs: [], // used for playing songs from this genre, if we are browsing another
        currentGenre: null,
        genresPageCount: null,
        songsPageCount: null,
        reloadGenres: true,
        genresHidden: false,
        songsHidden: true
    },
    reducers: {
        setCurrentlyPlayingGenreSongs: (state, action) => {
            console.log(action.payload);
            console.log(state.currentGenre, action.payload.newGenre);
            if (action.payload.calledFrom === "playButton") {
                console.log("called");
                state.currentlyPlayingGenreSongs = state.songs;
                console.log(state.currentlyPlayingGenreSongs);
            }
            else if (action.payload.newGenre === state.currentGenre) {
                console.log("CALLED 2");
                console.log(state.currentlyPlayingGenreSongs);
                console.log(state.songs);

                console.log(JSON.parse(JSON.stringify(state.currentlyPlayingGenreSongs)));
                console.log(JSON.parse(JSON.stringify(state.songs)));
                state.currentlyPlayingGenreSongs = state.songs;
                console.log(state.currentlyPlayingGenreSongs);
            }
        },
        setGenres: (state, action) => {
            state.genres = action.payload.genres;
            state.genresPageCount = Number(action.payload.pageCount);
        },
        setGenreSongs: (state, action) => {
            let temp = state.currentGenre;
            if (action.payload.currentGenre !== undefined) {
                state.currentGenre = action.payload.currentGenre;
            }
            else state.currentGenre = temp;
            state.songs = action.payload.searchResults;
            state.songsPageCount = action.payload.pageCount;
            state.genresHidden = true;
            state.songsHidden = false;
        },
        unhideGenres: (state, action) => {
            state.genresHidden = false;
            state.songsHidden = true;
            state.currentGenre = null;
        },
        setReloadGenres: (state, action) => {
            state.reloadGenres = action.payload;
        }
    },
})

// Action creators are generated for each case reducer function
export const { setGenres, setReloadGenres, setGenreSongs, setCurrentlyPlayingGenreSongs, unhideGenres } = genresSlice.actions

export default genresSlice.reducer