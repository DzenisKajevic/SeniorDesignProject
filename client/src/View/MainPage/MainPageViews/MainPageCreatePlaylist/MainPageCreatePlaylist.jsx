import React, { useEffect, useRef, useState } from "react";
import "./mainPageCreatePlaylist.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquarePlus,
  faPen,
  faTrash,
  faCircleArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import CreatedPlaylist from "./components/CreatedPlaylist";
import * as mainAxios from "../../mainAxios";
import { useDispatch, useSelector } from "react-redux";
import { setPlaylists, setReloadPlaylists, addPlaylistToArray, unhidePlaylists, setCurrentlyPlayingPlaylistSongs, setPlaylistSongs, setCurrentlyViewingPlaylistSongs, setReloadPlaylistSongs } from "../../../../slices/playlists/playlistsSlice";
import { SongCard } from "../MainPageSearch/components/SongCard/SongCard";
import { toast } from 'react-toastify';

const MainPageCreatePlaylist = () => {

  const [playlistNameInput, setPlaylistNameInput] = useState("");
  const reloadPlaylists = useSelector((state) => state.playlists.reloadPlaylists);
  const reloadPlaylistSongs = useSelector((state) => state.playlists.reloadPlaylistSongs);
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlists);
  const pagination = useRef({
    page: "1",
    pageSize: "4",
  });
  const songPagination = useRef({
    page: "1",
    pageSize: "4",
  });


  useEffect(() => {
    console.log("resfreshed");
    console.log(reloadPlaylists, reloadPlaylistSongs);
    if (reloadPlaylists) {
      pagination.current.page = "1";
      const fetchPlaylists = async function () {
        let result = await mainAxios.getPlaylists(pagination.current);
        if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
        let currentUserFullPlaylists = await mainAxios.getPlaylists();
        if (currentUserFullPlaylists.error) toast.error(currentUserFullPlaylists.error.response.data);
        let playlistCount = currentUserFullPlaylists.data.data.length;

        result.data.data.pagination = pagination.current;
        result.data.data.playlistCount = playlistCount;
        dispatch(setPlaylists(result.data.data));
        dispatch(setReloadPlaylists(false));
      }
      fetchPlaylists()
        .catch(console.error);
    }
    if (reloadPlaylistSongs) {
      console.log("refreshed playlist songs");
      songPagination.current.page = "1";
      const fetchPlaylistSongs = async function () {
        let result = await mainAxios.getPlaylistById({ playlistId: playlists.currentPlaylistId });
        if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
        console.log(result);
        result.data.data.pagination = songPagination.current;

        dispatch(setPlaylistSongs(result.data));
        dispatch(setCurrentlyViewingPlaylistSongs(songPagination.current));
        dispatch(setReloadPlaylistSongs(false));
        window.location.hash = "nonExistantHashUsedForRefreshing";
        window.location.hash = "#card-container";
      }
      fetchPlaylistSongs()
        .catch(console.error);
    }
  }, [reloadPlaylists, reloadPlaylistSongs]);

  return (

    <section>
      <h1 className="main-page-create-playlist-title">{ playlists.currentPlaylist ? playlists.currentPlaylist : "Create your own playlists" } </h1>
      <button
        className="back-button"
        style={ { display: playlists.songsHidden ? "none" : null } }
        onClick={ () => {
          dispatch(unhidePlaylists());
        } }
      >
        <FontAwesomeIcon icon={ faCircleArrowLeft } className="back-icon" />
      </button>
      <div className="create-playlist-form"
        style={ { display: playlists.playlistsHidden ? "none" : null } }>
        <FontAwesomeIcon
          icon={ faSquarePlus }
          className="add-playlist-icon"
          title="create playlist"
          onClick={ async () => { // set song list under the search bar and edit the redux state
            let result = await mainAxios.createEmptyPlaylist(playlistNameInput, "private");
            if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
            if (result.data) {
              dispatch(addPlaylistToArray(result.data.data));
              dispatch(setReloadPlaylists(true));
            }
          } }
        />
        <form style={ { width: "100%" } } onSubmit={ (e) => {
          e.preventDefault();
        } }>
          <input
            type="text"
            className="create-playlist-input"
            autoComplete="off"
            placeholder="Give your playlist a name"
            value={ playlistNameInput }
            onChange={ (event) => { setPlaylistNameInput(event.target.value); } }
          />
        </form>
      </div>
      <CreatedPlaylist />
      <SongCard source="PLAYLISTS" />{/* POPRAVITI GETPLAYLISTSBYUSER */ }

      {/* EXTERNAL BUTTONS FOR PLAYLISTS */ }
      { <div className="mainPage-button-container">
        <button
          id="previousPage"
          className="previousPage"
          style={ {
            display: pagination.current.page - 1 <= 0 || !playlists.songsHidden
              ? "none"
              : null,
          } }
          onClick={ async () => {
            pagination.current.page--;
            let result = await mainAxios.getPlaylists({
              page: pagination.current.page,
              pageSize: pagination.current.pageSize,
            });
            if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
            result.data.data.pagination = pagination.current;
            dispatch(setPlaylists(result.data.data));
            //dispatch(setReloadPlaylists(true));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(pagination.current.page) - 1 }
        </button>

        <button id="currentPage" className="currentPage" style={ { display: !playlists.songsHidden ? "none" : null } }>
          { pagination.current.page }
        </button>
        <button
          id="nextPage"
          className="nextPage"
          style={ {
            display:
              Number(pagination.current.page) + 1 > playlists.playlistsPageCount || !playlists.songsHidden
                ? "none"
                : null,
          } }
          onClick={ async () => {
            pagination.current.page++;
            let result = await mainAxios.getPlaylists({
              page: pagination.current.page,
              pageSize: pagination.current.pageSize,
            });
            if (result.error) toast.error(result.error.response.data)
            result.data.data.pagination = pagination.current;
            dispatch(setPlaylists(result.data.data));
            //dispatch(setReloadPlaylists(true));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(pagination.current.page) + 1 }
        </button>
      </div> }

      {/* 
         INTERNAL BUTTONS FOR SONGS WITHIN THOSE GENRES
       */}
      <div className="mainPage-button-container">
        <button
          id="previousSongPage"
          className="previousPage"
          style={ {
            display:
              songPagination.current.page - 1 <= 0 || playlists.songsHidden
                ? "none"
                : null,
          } }
          onClick={ async () => {
            songPagination.current.page--;

            let result = await mainAxios.getPlaylistById({ playlistId: playlists.currentPlaylistId });
            if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
            console.log(result);
            result.data.data.pagination = songPagination.current;
            dispatch(setPlaylistSongs(result.data));
            dispatch(setCurrentlyViewingPlaylistSongs(songPagination.current));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";

          } }
        >
          { Number(songPagination.current.page) - 1 }
        </button>

        <button
          id="currentSongPage"
          className="currentPage"
          style={ { display: playlists.songsHidden ? "none" : null } }
        >
          { songPagination.current.page }
        </button>

        <button
          id="nextSongPage"
          className="nextPage"
          style={ {
            display:
              Number(songPagination.current.page) + 1 >
                Number(playlists.songsPageCount) || playlists.songsHidden
                ? "none"
                : null,
          } }
          onClick={ async () => {
            songPagination.current.page++;
            let result = await mainAxios.getPlaylistById({ playlistId: playlists.currentPlaylistId });
            if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
            console.log(result);
            result.data.data.pagination = songPagination.current;
            dispatch(setPlaylistSongs(result.data));
            dispatch(setCurrentlyViewingPlaylistSongs(songPagination.current));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(songPagination.current.page) + 1 }
        </button>
      </div>
    </section>
  );
};

export default MainPageCreatePlaylist;
