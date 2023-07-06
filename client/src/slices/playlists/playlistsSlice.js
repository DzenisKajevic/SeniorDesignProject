import { createSlice, current } from '@reduxjs/toolkit'

export const playlistsSlice = createSlice({
    name: 'playlists',
    initialState: {
        playlists: [],
        reloadPlaylists: true,
        playlistsHidden: false,
        songsHidden: true,
        currentlyPlayingPlaylistSongs: [],
        currentlyViewingPlaylistSongs: [],
        currentPlaylist: null,
        currentPlaylistId: null,
        playlistsPageCount: null,
        songsPageCount: null,
        songs: []
    },
    reducers: {
        setPlaylists: (state, action) => {
            state.playlists = action.payload;
            state.playlistsPageCount = Math.ceil(state.playlists.length / action.payload.pagination.pageSize);
        },
        addPlaylistToArray: (state, action) => {
            state.playlists.push(action.payload);
        },
        setReloadPlaylists: (state, action) => {
            state.reloadPlaylists = action.payload;
        },
        setCurrentlyPlayingPlaylistSongs: (state, action) => {
            if (action.payload.calledFrom === "playButton") {
                state.currentlyPlayingPlaylistSongs = state.songs;
            }
            else {
                state.currentlyPlayingPlaylistSongs = action.payload;
            }
            console.log(current(state.currentlyPlayingPlaylistSongs));
        },
        setCurrentlyViewingPlaylistSongs: (state, action) => {
            let currentPage = Number(action.payload.page) - 1;
            let pageSize = Number(action.payload.pageSize);
            state.pageCount = Math.ceil(current(state.songs).length / pageSize);

            if (currentPage * pageSize + pageSize > current(state.songs).length) {
                state.currentlyViewingPlaylistSongs = current(state.songs).slice(currentPage * pageSize, current(state.songs).length);
            }
            else {
                state.currentlyViewingPlaylistSongs = current(state.songs).slice(currentPage * pageSize, currentPage * pageSize + pageSize);
            }
        },
        setPlaylistSongs: (state, action) => {
            let tempName = state.currentPlaylist;
            let tempId = state.currentPlaylistId;
            if (action.payload.data.currentPlaylist !== undefined) {
                state.currentPlaylist = action.payload.data.currentPlaylist;
                state.currentPlaylistId = action.payload.data.currentPlaylistId;
            }
            else {
                state.currentPlaylist = tempName;
                state.currentPlaylistId = tempId;
            }
            state.songs = action.payload.data.files;
            //Math.ceil(current(state.songs).length / action.payload.pageSize);
            state.songsPageCount = Math.ceil((state.songs).length / action.payload.data.pagination.pageSize);
            //console.log(state.songsPageCount);
            state.playlistsHidden = true;
            state.songsHidden = false;
        },
        unhidePlaylists: (state, action) => {
            state.playlistsHidden = false;
            state.songsHidden = true;
            state.currentPlaylist = null;
            state.currentPlaylistId = null;
        },
        deletePlaylist: (state, action) => {
            if (action.payload > -1) { // only splice array when item is found
                state.playlists.splice(action.payload, 1); // 2nd parameter means remove one item only
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { setPlaylists, addPlaylistToArray, setPlaylistSongs, setCurrentlyPlayingPlaylistSongs, setCurrentlyViewingPlaylistSongs, setReloadPlaylists, unhidePlaylists, deletePlaylist } = playlistsSlice.actions

export default playlistsSlice.reducer