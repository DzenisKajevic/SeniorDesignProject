import { createSlice, current } from '@reduxjs/toolkit'

export const recentSongsSlice = createSlice({
    name: 'recentSongs',
    initialState: {
        songs: [],
        reloadRecentSongs: true,
        currentlyViewingRecentSongs: [],
        pageCount: null,
    },
    reducers: {
        setRecentSongs: (state, action) => {
            state.songs = action.payload.recents;
        },
        setReloadRecentSongs: (state, action) => {
            state.reloadRecentSongs = action.payload;
        },
        setCurrentlyViewingRecentSongs: (state, action) => {
            let currentPage = Number(action.payload.currentPage);
            let pageSize = Number(action.payload.pageSize);
            state.pageCount = Math.ceil(current(state.songs).length / action.payload.pageSize);
            console.log(pageSize, currentPage, state.pageCount);

            if (currentPage * pageSize + pageSize > current(state.songs).length) {

                state.currentlyViewingRecentSongs = current(state.songs).slice(currentPage * pageSize, current(state.songs).length);
            }
            else {
                state.currentlyViewingRecentSongs = current(state.songs).slice(currentPage * action.payload.pageSize, currentPage * pageSize + pageSize);
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setRecentSongs, setReloadRecentSongs, setCurrentlyViewingRecentSongs } = recentSongsSlice.actions

export default recentSongsSlice.reducer