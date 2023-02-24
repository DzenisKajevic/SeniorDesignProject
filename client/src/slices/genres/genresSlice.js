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
            state.currentlyPlayingGenreSongs = state.songs;
        },
        setGenres: (state, action) => {
            state.genres = action.payload.genres;
            state.genresPageCount = Number(action.payload.pageCount);
        },
        setGenreSongs: (state, action) => {
            state.songs = action.payload.searchResults;
            state.songsPageCount = action.payload.pageCount;
            state.currentGenre = action.payload.currentGenre;
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