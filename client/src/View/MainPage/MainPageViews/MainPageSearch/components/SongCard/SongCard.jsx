import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./songCard.css";
import { setReloadFavouriteSongs } from "../../../../../../slices/favourites/favouriteSongsSlice";
import {
  setSongInfo,
} from "../../../../../../slices/audioVisualiser/songInfoSlice";
import {
  setCurrentlyPlayingGenreSongs,
} from "../../../../../../slices/genres/genresSlice";
import { cleanup, source } from "../../../MainPagePlayer/AudioVisualiser";
import { setSeekBytes } from "../../../../../../slices/audioVisualiser/seekBytesSlice";
import * as mainAxios from "../../../../mainAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faXmark, faPlay, faPlus, faMusic, faHeart, faList } from "@fortawesome/free-solid-svg-icons";
import { setCurrentlyPlayingPlaylistSongs, setReloadPlaylistSongs } from "../../../../../../slices/playlists/playlistsSlice";
import { toast } from 'react-toastify';

let playSong = null;

const SongCard = (source, style) => {
  const genres = useSelector((state) => state.genres);
  const searchResults = useSelector((state) => state.searchResults);
  const favouriteSongs = useSelector((state) => state.favouriteSongs);
  const playlists = useSelector((state) => state.playlists);
  const recentSongs = useSelector((state) => state.recentSongs);
  const songInfo = useSelector((state) => state.songInfo.song);
  const dispatch = useDispatch();

  const [menuVisibility, setMenuVisibility] = useState(false);
  const [songToBeAddedToPlaylist, setSongToBeAddedToPlaylist] = useState(null);
  const [divId, setDivId] = useState(null);

  const toggleMenuVisibility = (song) => {
    console.log(song);
    setSongToBeAddedToPlaylist(song);
    console.log(songToBeAddedToPlaylist);
    setMenuVisibility((prevState) => !prevState);

    if (divId && song._id !== divId) {
      let checkIfOldMenuIsOpen = document.getElementById('dropdown-playlist-menu-' + divId);
      if (checkIfOldMenuIsOpen) {
        let oldMenu = document.getElementById('dropdown-playlist-menu-' + divId),
          //let menu = document.getElementsByClassName('dropdown-playlist-menu-hidden');
          //modern browsers IE >= 10
          classList = 'classList' in oldMenu;
        for (var i = 0; i < oldMenu.children.length; i++) {
          var child = oldMenu.children[i];
          if (classList && child.classList.contains('d-none')) {
            child.classList.remove('d-none');
          } else if (classList && !child.classList.contains('d-none')) {
            child.classList.add('d-none');
          }
        }
        //let menu = document.getElementsByClassName('dropdown-playlist-menu-hidden');
        oldMenu.classList.toggle('dropdown-playlist-menu');
        oldMenu.classList.toggle('dropdown-playlist-menu-hidden');
      }
    }

    setDivId(song._id);
    let menu = document.getElementById('dropdown-playlist-menu-' + song._id),
      //let menu = document.getElementsByClassName('dropdown-playlist-menu-hidden');
      //modern browsers IE >= 10
      classList = 'classList' in menu;
    for (var i = 0; i < menu.children.length; i++) {
      var child = menu.children[i];
      if (classList && child.classList.contains('d-none')) {
        child.classList.remove('d-none');
      } else if (classList && !child.classList.contains('d-none')) {
        child.classList.add('d-none');
      }
    }
    //let menu = document.getElementsByClassName('dropdown-playlist-menu-hidden');
    menu.classList.toggle('dropdown-playlist-menu');
    menu.classList.toggle('dropdown-playlist-menu-hidden');


  };

  playSong = async function (song, index) {
    cleanup();
    /*     console.log("song", song);
        console.log("index", index); */
    let tempSongInfo = structuredClone(song);
    tempSongInfo["songIndex"] = index;
    if (!song["playedFrom"]) tempSongInfo["playedFrom"] = source.source;
    dispatch(setSongInfo(tempSongInfo));
    dispatch(setSeekBytes(0));
    //if (source.source === "SEARCH" || source.source === "GENRES" || source.source === "PLAYLISTS" || source.source === "FAVOURITES") {
    if (!song.fileId) {
      let result = await mainAxios.addToRecentlyPlayedSongs(song._id);
      if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
    }
    else {
      let result = await mainAxios.addToRecentlyPlayedSongs(song.fileId._id);
      if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
    }
  };

  if (source.source === "SEARCH") {
    return (
      <div className="song-cards">
        { searchResults.songs.length ? searchResults.songs.map((song, index) => {
          return (
            <div key={ song["_id"] } >
              <div className="song-card" >
                <button
                  className="song-card-play-button"
                  onClick={ async () => {
                    playSong(song, index);
                  } }
                >
                  <FontAwesomeIcon icon={ faPlay } className="play-icon" />
                </button>
                <div className="song-card-text">
                  <p className="author-name-p">{ song.metadata.author }</p>
                  <p className="song-name-p">{ song.metadata.songName }</p>
                  {/* <p className="genre-p">{ song.metadata.genre }</p> */ }
                </div>
                <img
                  src="http://placekitten.com/60"
                  alt="author"
                  className="author-image"
                />
                <button
                  className="addToPlaylist"
                  onClick={ () => { console.log(song); toggleMenuVisibility(song); } }>
                  <FontAwesomeIcon
                    icon={ faList }
                    className="bookmark-icon"
                    title="Add song to a playlist"
                  />
                </button>
                <button
                  className="addToFavourites"
                  onClick={ async () => {
                    const result = await mainAxios.addFileToFavourites(
                      song["_id"]
                    );
                    if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                    if (result.data) dispatch(setReloadFavouriteSongs(true));
                  } }
                >
                  <FontAwesomeIcon
                    icon={ faHeart }
                    className="bookmark-icon"
                    title="Add song to favourites"
                  />
                </button>
              </div>
              <div id={ "dropdown-playlist-menu-" + song["_id"] } className="dropdown-playlist-menu-hidden" >
                <h2 className="dropdown-playlist-menu-h2 d-none" >Add to playlist</h2>
                <hr className="dropdown-playlist-menu-hr d-none" ></hr>
                <div className="dropdown-playlist-overflow-container d-none" >
                  { playlists.playlists.map((playlist) => {
                    return (
                      <div
                        className="dropdown-playlist-menu-item"
                        /* id={ playlist["_id"] } */
                        key={ playlist["_id"] }
                        onClick={ async () => {
                          console.log(playlist);
                          console.log(songToBeAddedToPlaylist);
                          const result = await mainAxios.addFilesToPlaylist({
                            playlistId: playlist["_id"],
                            fileIDs: [songToBeAddedToPlaylist["_id"]],
                          }
                          );
                          if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                          if (result.data) {
                            dispatch(setReloadPlaylistSongs(true));
                            toast.success("Song added to playlist", { className: "toast-message", style: { backgroundColor: "#000000", color: "green" } });
                          }
                          /* toggleMenuVisibility(songToBeAddedToPlaylist); */
                        } }
                      > <p className="dropdown-playlist-menu-item-p">{ playlist["playlistName"] }</p></div>
                    );
                  }) }
                </div>
              </div>
            </div>
          );
        }) : <p>{/* Songs not found */ }</p> }
      </div>
    );
  } else if (source.source === "FAVOURITES") {
    return (
      <div className="song-cards">
        { favouriteSongs.songs ? favouriteSongs.songs.map((song, index) => {
          return (
            <div key={ song.fileId["_id"] } >
              <div className="song-card">
                <button
                  className="song-card-play-button"
                  onClick={ async () => {
                    playSong(song, index);
                  } }
                >
                  <FontAwesomeIcon icon={ faPlay } className="play-icon" />
                </button>
                <div className="song-card-text">
                  <p className="author-name-p">{ song.fileId.metadata.author }</p>
                  <p className="song-name-p">{ song.fileId.metadata.songName }</p>
                  {/* <p className="genre-p">{ song.fileId.metadata.genre }</p> */ }
                </div>
                <img
                  // src={null}
                  src="http://placekitten.com/60"
                  alt="album"
                  className="album-image"
                />
                <button
                  className="addToPlaylist"
                  onClick={ () => { console.log(song.fileId); toggleMenuVisibility(song.fileId); } }>
                  <FontAwesomeIcon
                    icon={ faList }
                    className="bookmark-icon"
                    title="Add song to a playlist"
                  />
                </button>
                <button
                  className="removeFromFavourites"
                  onClick={ async () => {
                    const result = await mainAxios.deleteFavouriteFile(
                      song.fileId["_id"]
                    );
                    if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                    if (result.data) dispatch(setReloadFavouriteSongs(true));
                  } }
                >
                  <FontAwesomeIcon
                    icon={ faXmark }
                    className="bookmark-icon-remove"
                    title="Remove song from favourites"
                  />
                </button>
              </div>
              <div id={ "dropdown-playlist-menu-" + song.fileId["_id"] } className="dropdown-playlist-menu-hidden" >
                <h2 className="dropdown-playlist-menu-h2 d-none" >Add to playlist</h2>
                <hr className="dropdown-playlist-menu-hr d-none" ></hr>
                <div className="dropdown-playlist-overflow-container d-none" >
                  { playlists.playlists.map((playlist) => {
                    return (
                      <div
                        className="dropdown-playlist-menu-item"
                        /* id={ playlist["_id"] } */
                        key={ playlist["_id"] }
                        onClick={ async () => {
                          console.log(playlist);
                          console.log(songToBeAddedToPlaylist);
                          const result = await mainAxios.addFilesToPlaylist({
                            playlistId: playlist["_id"],
                            fileIDs: [songToBeAddedToPlaylist["_id"]],
                          }
                          );
                          if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                          if (result.data) {
                            dispatch(setReloadPlaylistSongs(true));
                            toast.success("Song added to playlist", { className: "toast-message-success", style: { backgroundColor: "#000000", color: "green" } });
                          }
                          /* toggleMenuVisibility(songToBeAddedToPlaylist); */
                        } }
                      > <p className="dropdown-playlist-menu-item-p">{ playlist["playlistName"] }</p></div>
                    );
                  }) }
                </div>
              </div>
            </div>
          );
        }) : <p>{/* No favourites found */ }</p>
        }
      </div >
    );
  }
  else if (source.source === "PLAYLISTS") {
    return (
      <div className="song-cards" style={ { display: playlists.songsHidden ? "none" : null } }>
        { playlists.currentlyViewingPlaylistSongs ? playlists.currentlyViewingPlaylistSongs.map((song, index) => {
          return (
            <div className="song-card" key={ song["_id"] } style={ { marginTop: "1.5rem" } }>
              <button
                className="song-card-play-button"
                onClick={ async () => {
                  dispatch(setCurrentlyPlayingPlaylistSongs({ calledFrom: "playButton" }));
                  playSong(song, index);
                } }
              >
                <FontAwesomeIcon icon={ faPlay } className="play-icon" />
              </button>
              <div className="song-card-text">
                <p className="author-name-p">{ song.metadata.author }</p>
                <p className="song-name-p">{ song.metadata.songName }</p>
                {/* <p className="genre-p">{ song.fileId.metadata.genre }</p> */ }
              </div>
              <img
                // src={null}
                src="http://placekitten.com/60"
                alt="album"
                className="album-image"
              />
              <button
                className="addToFavourites"
                style={ { marginLeft: "1rem" } }
                onClick={ async () => {
                  const result = await mainAxios.addFileToFavourites(
                    song["_id"]
                  );
                  if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                  if (result.data) {
                    toast.success("Song added to favourites", { className: "toast-message", style: { backgroundColor: "#000000", color: "green" } });
                    dispatch(setReloadFavouriteSongs(true));
                  }
                } }
              >
                <FontAwesomeIcon
                  icon={ faHeart }
                  className="bookmark-icon"
                  title="Add song to favourites"
                />
              </button>
              <button
                className="removeFromFavourites"
                onClick={ async () => {
                  dispatch(setReloadPlaylistSongs(true));
                  console.log(song["_id"]);
                  console.log(playlists.currentPlaylistId);
                  const result = await mainAxios.removeFilesFromPlaylist({
                    fileIDs: [song["_id"]],
                    playlistId: playlists.currentPlaylistId
                  });
                  console.log(result);
                  if (result.data) {
                    dispatch(setReloadPlaylistSongs(true));

                    //const index = playlists.songs.indexOf(song);
                    //dispatch(deletePlaylistSong(index));
                  }
                } }
              >
                <FontAwesomeIcon
                  icon={ faXmark }
                  className="bookmark-icon-remove"
                  title="Remove song from the playlist"
                />
              </button>
            </div>
          );
        }) : <p>{/* No favourites found */ }</p>
        }
      </div >
    );
  } else if (source.source === "GENRES") {
    return (
      <div
        className="song-cards"
        style={ { display: genres.songsHidden ? "none" : null } }
      >
        { genres.songs.length ? genres.songs.map((song, index) => {
          return (
            <div key={ song["_id"] }>
              <div className="song-card" key={ song["_id"] }>
                <button
                  className="song-card-play-button"
                  onClick={ async () => {
                    dispatch(setCurrentlyPlayingGenreSongs({ calledFrom: "playButton" }));
                    playSong(song, index);
                  } }
                >
                  <FontAwesomeIcon icon={ faPlay } className="play-icon" />
                </button>
                <div className="song-card-text">
                  <p className="author-name-p">{ song.metadata.author }</p>
                  <p className="song-name-p">{ song.metadata.songName }</p>
                  {/* <p className="genre-p">{ song.metadata.genre }</p> */ }
                </div>
                <img
                  // src={null}
                  src="http://placekitten.com/60"
                  alt="album"
                  className="album-image"
                />
                <button
                  className="addToPlaylist"
                  onClick={ () => { console.log(song['_id']); toggleMenuVisibility(song); } }>
                  <FontAwesomeIcon
                    icon={ faList }
                    className="bookmark-icon"
                    title="Add song to a playlist"
                  />
                </button>
                <button
                  className="addToFavourites"
                  onClick={ async () => {
                    const result = await mainAxios.addFileToFavourites(
                      song["_id"]
                    );
                    if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                    if (result.data) dispatch(setReloadFavouriteSongs(true));
                  } }
                >
                  <FontAwesomeIcon
                    icon={ faHeart }
                    className="bookmark-icon"
                    title="Add song to favourites"
                  />
                </button>
              </div>
              <div id={ "dropdown-playlist-menu-" + song["_id"] } className="dropdown-playlist-menu-hidden" >
                <h2 className="dropdown-playlist-menu-h2 d-none" >Add to playlist</h2>
                <hr className="dropdown-playlist-menu-hr d-none" ></hr>
                <div className="dropdown-playlist-overflow-container d-none" >
                  { playlists.playlists.map((playlist) => {
                    return (
                      <div
                        className="dropdown-playlist-menu-item"
                        /* id={ playlist["_id"] } */
                        key={ playlist["_id"] }
                        onClick={ async () => {
                          console.log(playlist);
                          console.log(songToBeAddedToPlaylist);
                          const result = await mainAxios.addFilesToPlaylist({
                            playlistId: playlist["_id"],
                            fileIDs: [songToBeAddedToPlaylist["_id"]],
                          }
                          );
                          if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                          if (result.data) {
                            dispatch(setReloadPlaylistSongs(true));
                            toast.success("Song added to playlist", { className: "toast-message-success", style: { backgroundColor: "#000000", color: "green" } });
                          }
                          /* toggleMenuVisibility(songToBeAddedToPlaylist); */
                        } }
                      > <p className="dropdown-playlist-menu-item-p">{ playlist["playlistName"] }</p></div>
                    );
                  }) }
                </div>
              </div>
            </div>
          );
        }) : <p>No songs found</p> }
      </div>
    );
  }
  else if (source.source === "RECENTS") {
    return (
      <div className="song-cards">
        { recentSongs.currentlyViewingRecentSongs ? recentSongs.currentlyViewingRecentSongs.map((song, index) => {
          return (
            <div key={ song["_id"] }>
              <div className="song-card" key={ song.fileId["_id"] }>
                <button
                  className="song-card-play-button"
                  onClick={ async () => {
                    playSong(song, index);
                  } }
                >
                  <FontAwesomeIcon icon={ faPlay } className="play-icon" />
                </button>
                <div className="song-card-text">
                  <p className="author-name-p">{ song.fileId.metadata.author }</p>
                  <p className="song-name-p">{ song.fileId.metadata.songName }</p>
                  {/* <p className="genre-p">{ song.fileId.metadata.genre }</p> */ }
                </div>
                <img
                  // src={null}
                  src="http://placekitten.com/60"
                  alt="album"
                  className="album-image"
                />
                <button
                  className="addToPlaylist"
                  onClick={ () => { console.log(song.fileId); toggleMenuVisibility(song.fileId); } }>
                  <FontAwesomeIcon
                    icon={ faList }
                    className="bookmark-icon"
                    title="Add song to a playlist"
                  />
                </button>
                <button
                  className="addToFavourites"
                  onClick={ async () => {

                    console.log(song);
                    const result = await mainAxios.addFileToFavourites(
                      song["fileId"]["_id"]
                    );
                    if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                    if (result.data) dispatch(setReloadFavouriteSongs(true));
                  } }
                >
                  <FontAwesomeIcon
                    icon={ faHeart }
                    className="bookmark-icon"
                    title="Add song to favourites"
                  />
                </button>
              </div>
              <div id={ "dropdown-playlist-menu-" + song.fileId["_id"] } className="dropdown-playlist-menu-hidden" >
                <h2 className="dropdown-playlist-menu-h2 d-none" >Add to playlist</h2>
                <hr className="dropdown-playlist-menu-hr d-none" ></hr>
                <div className="dropdown-playlist-overflow-container d-none" >
                  { playlists.playlists.map((playlist) => {
                    return (
                      <div
                        className="dropdown-playlist-menu-item"
                        /* id={ playlist["_id"] } */
                        key={ playlist["_id"] }
                        onClick={ async () => {
                          console.log(playlist);
                          console.log(songToBeAddedToPlaylist);
                          const result = await mainAxios.addFilesToPlaylist({
                            playlistId: playlist["_id"],
                            fileIDs: [songToBeAddedToPlaylist["_id"]],
                          }
                          );
                          if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                          if (result.data) {
                            dispatch(setReloadPlaylistSongs(true));
                            toast.success("Song added to playlist", { className: "toast-message-success", style: { backgroundColor: "#000000", color: "green" } });
                          }
                          /* toggleMenuVisibility(songToBeAddedToPlaylist); */
                        } }
                      > <p className="dropdown-playlist-menu-item-p">{ playlist["playlistName"] }</p></div>
                    );
                  }) }
                </div>
              </div>
            </div>
          );
        }) : <p>{/* No favourites found */ }</p> }
      </div>
    );
  }
};

export { SongCard, playSong };
