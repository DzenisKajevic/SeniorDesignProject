import React from "react";
import "./mainContent.css";
import "../../../../variables.css";
import { Outlet } from "react-router-dom";
import MainPageHome from "../../MainPageViews/MainPageHome/MainPageHome";
import { playPause } from "../../MainPageViews/MainPagePlayer/AudioVisualiser";
import visualiserHiddenSlice from "../../../../slices/audioVisualiser/visualiserHiddenSlice";
import songInfoSlice from "../../../../slices/audioVisualiser/songInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import { playSong } from "../../MainPageViews/MainPageSearch/components/SongCard/SongCard";
import UploadImgPopup from "../MainNavbar/components/UploadImgPopup";
import { addToRecentlyPlayedSongs } from "../../mainAxios";

let preparePlayNext;
let preparePlayPrevious;

const MainContent = () => {
  const visualiserHidden = useSelector((state) => state.visualiserHidden.hidden);
  const songInfo = useSelector((state) => state.songInfo.song);
  const playlists = useSelector((state) => state.playlists);
  const genres = useSelector((state) => state.genres);
  const searchResults = useSelector((state) => state.searchResults);
  const favouriteSongs = useSelector((state) => state.favouriteSongs);
  const recentSongs = useSelector((state) => state.recentSongs);
  const dispatch = useDispatch();
  const map1 = new Map();

  preparePlayPrevious = async function () {

    // check where the song is located (search / playlists / favourites / genres)

    let song = {};
    if (songInfo.playedFrom === "SEARCH") {
      if (Number(songInfo.songIndex - 1) >= 0) {
        song = {
          ...searchResults.songs[Number(songInfo.songIndex) - 1],
          playedFrom: "SEARCH",
        };
        map1.set("searchResultsPrevious", song);
      } else {
        song = {
          ...searchResults.songs[Number(searchResults.songs.length) - 1],
          playedFrom: "SEARCH",
        };
        map1.set("searchResultsPreviousFinal", song);
      }
      await playPrevious(
        "searchResultsPrevious",
        Number(searchResults.songs.length) - 1
      );
    } else if (songInfo.playedFrom === "FAVOURITES") {
      if (Number(songInfo.songIndex - 1) >= 0) {
        song = {
          ...favouriteSongs.songs[Number(songInfo.songIndex) - 1].fileId,
          playedFrom: "FAVOURITES",
        };
        map1.set("favouriteSongsPrevious", song);
      } else {
        song = {
          ...favouriteSongs.songs[favouriteSongs.songs.length - 1].fileId,
          playedFrom: "FAVOURITES",
        };
        map1.set("favouriteSongsPreviousFinal", song);
      }
      await playPrevious(
        "favouriteSongsPrevious",
        Number(favouriteSongs.songs.length) - 1
      );
    } else if (songInfo.playedFrom === "RECENTS") {
      if (Number(songInfo.songIndex - 1) >= 0) {
        song = {
          ...recentSongs.songs[Number(songInfo.songIndex) - 1],
          playedFrom: "RECENTS",
        };
        map1.set("recentSongsPrevious", song);
      } else {
        song = {
          ...recentSongs.songs[recentSongs.songs.length - 1],
          playedFrom: "RECENTS",
        };
        map1.set("recentSongsPreviousFinal", song);
      }
      await playPrevious(
        "recentSongsPrevious",
        Number(recentSongs.songs.length) - 1
      );
    }
    else if (songInfo.playedFrom === "PLAYLISTS") {
      if (Number(songInfo.songIndex - 1) >= 0) {
        console.log("PRVI");
        song = {
          ...playlists.currentlyPlayingPlaylistSongs[Number(songInfo.songIndex) - 1],
          playedFrom: "PLAYLISTS",
        };
        map1.set("playlistSongsPrevious", song);
      } else {
        song = {
          ...playlists.currentlyPlayingPlaylistSongs[playlists.currentlyPlayingPlaylistSongs.length - 1],
          playedFrom: "PLAYLISTS",
        };
        //console.log(song);
        map1.set("playlistSongsPreviousFinal", song);
      }
      await playPrevious(
        "playlistSongsPrevious",
        Number(playlists.currentlyPlayingPlaylistSongs.length) - 1
      );
    }
    else if (songInfo.playedFrom === "GENRES") {
      map1.set("genresPreviousFinal", genres.currentlyPlayingGenreSongs[genres.currentlyPlayingGenreSongs.length - 1]);
      if (Number(songInfo.songIndex - 1) >= 0 && Number(songInfo.songIndex - 1) < genres.currentlyPlayingGenreSongs.length) {
        song = {
          ...genres.songs[Number(songInfo.songIndex) - 1],
          playedFrom: "GENRES",
        };
        map1.set("genresPrevious", song);
      } else {
        song = {
          ...genres.currentlyPlayingGenreSongs[genres.currentlyPlayingGenreSongs.length - 1],
          playedFrom: "GENRES",
        };
        map1.set("genresPreviousFinal", song);
      }
      if (Number(genres.currentlyPlayingGenreSongs.length) === 1) {
        map1.set("genresPreviousFinal", song);
        await playPrevious("genresPrevious", 0);
      }
      else
        await playPrevious("genresPrevious", Number(genres.currentlyPlayingGenreSongs.length) - 1);
    }
  };

  preparePlayNext = async function () {
    let song = {};
    if (songInfo.playedFrom === "SEARCH") {
      if (songInfo.songIndex < searchResults.songs.length - 1) {
        song = {
          ...searchResults.songs[Number(songInfo.songIndex) + 1],
          playedFrom: "SEARCH",
        };
        map1.set("searchResultsNext", song);
      } else {
        song = { ...searchResults.songs[0], playedFrom: "SEARCH" };
        map1.set("searchResultsNextFirst", song);
      }
      await playNext("searchResultsNext", searchResults.songs.length - 1);
    }

    else if (songInfo.playedFrom === "FAVOURITES") {
      if (songInfo.songIndex < favouriteSongs.songs.length - 1) {
        song = {
          ...favouriteSongs.songs[Number(songInfo.songIndex) + 1].fileId,
          playedFrom: "FAVOURITES",
        };
        map1.set("favouriteSongsNext", song);
      } else {
        song = { ...favouriteSongs.songs[0].fileId, playedFrom: "FAVOURITES" };
        map1.set("favouriteSongsNextFirst", song);
      }
      await playNext("favouriteSongsNext", favouriteSongs.songs.length - 1);
    }

    else if (songInfo.playedFrom === "RECENTS") {
      if (Number(songInfo.songIndex) < recentSongs.songs.length - 1) {
        song = {
          ...recentSongs.songs[Number(songInfo.songIndex) + 1],
          playedFrom: "RECENTS",
        };
        map1.set("recentSongsNext", song);
      } else {
        song = {
          ...recentSongs.songs[0],
          playedFrom: "RECENTS",
        };
        map1.set("recentSongsNextFirst", song);
      }
      await playNext(
        "recentSongsNext",
        Number(recentSongs.songs.length) - 1
      );
    }

    else if (songInfo.playedFrom === "PLAYLISTS") {
      if (Number(songInfo.songIndex + 1) < playlists.currentlyPlayingPlaylistSongs.length) {
        song = {
          ...playlists.currentlyPlayingPlaylistSongs[Number(songInfo.songIndex) + 1],
          playedFrom: "PLAYLISTS",
        };
        map1.set("playlistSongsNext", song);
      } else {
        song = {
          ...playlists.currentlyPlayingPlaylistSongs[0],
          playedFrom: "PLAYLISTS",
        };
        map1.set("playlistSongsNextFirst", song);
      }
      await playNext(
        "playlistSongsNext",
        Number(playlists.currentlyPlayingPlaylistSongs.length) - 1
      );
    }

    else if (songInfo.playedFrom === "GENRES") {
      //map1.set("genresPreviousFinal", genres.currentlyPlayingGenreSongs[genres.currentlyPlayingGenreSongs.length - 1]);
      if (songInfo.songIndex < genres.currentlyPlayingGenreSongs.length - 1) {
        song = {
          ...genres.currentlyPlayingGenreSongs[Number(songInfo.songIndex) + 1],
          playedFrom: "GENRES",
        };
        map1.set("genresNext", song);
      } else {
        song = { ...genres.currentlyPlayingGenreSongs[0], playedFrom: "GENRES" };
        map1.set("genresNextFirst", song);
      }
      await playNext("genresNext", genres.currentlyPlayingGenreSongs.length - 1);
    }
  };

  const playPrevious = async function (source, sourceMaxIndex) {
    if (Number(songInfo.songIndex) > 0 && Number(songInfo.songIndex) <= Number(sourceMaxIndex)) {
      await playSong(map1.get(source), Number(songInfo.songIndex) - 1);
    } else {
      await playSong(map1.get(source + "Final"), sourceMaxIndex);
    }
  };

  const playNext = async function (source, sourceMaxIndex) {
    if (songInfo.songIndex < sourceMaxIndex) {
      await playSong(map1.get(source), Number(songInfo.songIndex) + 1);
    } else {
      await playSong(map1.get(source + "First"), 0);
    }
  };

  if (visualiserHidden)
    return (
      <>
        <section className="main-content">
          <Outlet />
        </section>
      </>
    );
};

export { MainContent, preparePlayNext, preparePlayPrevious };
