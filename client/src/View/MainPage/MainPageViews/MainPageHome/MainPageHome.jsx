import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GenreCard from "./components/GenreCard";
import * as mainAxios from "../../mainAxios";
import "./mainPageHome.css";
import {
  setGenres,
  setReloadGenres,
  unhideGenres,
  reloadGenres,
  setGenreSongs,
  setCurrentlyPlayingGenreSongs,
} from "../../../../slices/genres/genresSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { SongCard } from "../MainPageSearch/components/SongCard/SongCard";
import { toast } from 'react-toastify';

const MainPageHome = () => {
  useEffect(() => {
    if (reloadGenres) {
      const fetchPlaylists = async function () {
        let result = await mainAxios.getAllGenres(pagination.current);
        if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
        dispatch(setGenres(result.data.data));
        dispatch(setReloadGenres(false)); // never returned to true since multiple API calls would yield the same result
      };
      fetchPlaylists().catch(console.error);
    }
  }, []);

  const genres = useSelector((state) => state.genres);
  const reloadGenres = useSelector((state) => state.genres.reloadGenres);
  const dispatch = useDispatch();
  const pagination = useRef({
    page: "1",
    pageSize: "8",
  });

  const songPagination = useRef({
    page: "1",
    pageSize: "4",
  });

  return (
    <section>
      <h1 className="main-page-home-title">{ genres.currentGenre ? genres.currentGenre : "Browse genres" } </h1>
      {/* old cards */ }
      <div
        className="card-container"
        id="card-container"
        style={ { display: genres.genresHidden ? "none" : null } }
      >
        <GenreCard />
      </div>
      <button
        className="back-button"
        style={ { display: genres.songsHidden ? "none" : null } }
        onClick={ () => {
          dispatch(unhideGenres());
        } }
      >
        <FontAwesomeIcon icon={ faCircleArrowLeft } className="back-icon" />
      </button>
      <SongCard source="GENRES" />

      {/* EXTERNAL BUTTONS FOR GENRES */ }
      <div className="mainPage-button-container">
        <button
          id="previousPage"
          className="previousPage"
          style={ {
            display:
              pagination.current.page - 1 <= 0 || !genres.songsHidden
                ? "none"
                : null,
          } }
          onClick={ async () => {
            pagination.current.page--;
            let result = await mainAxios.getAllGenres(pagination.current);
            if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
            dispatch(setGenres(result.data.data));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(pagination.current.page) - 1 }
        </button>

        <button
          id="currentPage"
          className="currentPage"
          style={ { display: !genres.songsHidden ? "none" : null } }
        >
          { pagination.current.page }
        </button>

        <button
          id="nextPage"
          className="nextPage"
          style={ {
            display:
              Number(pagination.current.page) + 1 > genres.genresPageCount ||
                !genres.songsHidden
                ? "none"
                : null,
          } }
          onClick={ async () => {
            pagination.current.page++;
            let result = await mainAxios.getAllGenres(pagination.current);
            if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
            dispatch(setGenres(result.data.data));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(pagination.current.page) + 1 }
        </button>
      </div>

      {/* 
         INTERNAL BUTTONS FOR SONGS WITHIN THOSE GENRES
       */}
      <div className="mainPage-button-container button-container-genre">
        <button
          id="previousSongPage"
          className="previousPage"
          style={ {
            display:
              songPagination.current.page - 1 <= 0 || genres.songsHidden
                ? "none"
                : null,
          } }
          onClick={ async () => {
            songPagination.current.page--;
            const filters = {
              page: songPagination.current.page,
              pageSize: songPagination.current.pageSize,
              genre: genres.currentGenre,
            };
            let result = await mainAxios.getAllFiles(filters);
            if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });

            dispatch(setGenreSongs(result.data.data));
            dispatch(setCurrentlyPlayingGenreSongs({ newGenre: filters.genre }));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(songPagination.current.page) - 1 }
        </button>

        <button
          id="currentSongPage"
          className="currentPage"
          style={ { display: genres.songsHidden ? "none" : null } }
        >
          { songPagination.current.page }
        </button>

        <button
          id="nextSongPage"
          className="nextPage"
          style={ {
            display:
              Number(songPagination.current.page) + 1 >
                Number(genres.songsPageCount) || genres.songsHidden
                ? "none"
                : null,
          } }
          onClick={ async () => {
            songPagination.current.page++;
            const filters = {
              page: songPagination.current.page,
              pageSize: songPagination.current.pageSize,
              genre: genres.currentGenre,
            };
            let result = await mainAxios.getAllFiles(filters);
            if (result.error) toast.error(result.error.response.data, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });

            dispatch(setGenreSongs(result.data.data));
            dispatch(setCurrentlyPlayingGenreSongs({ newGenre: filters.genre }));
            window.location.hash = "nonExistantHashUsedForRefreshing";
            window.location.hash = "#card-container";
          } }
        >
          { Number(songPagination.current.page) + 1 }
        </button>
      </div>

      {/* new cards  */ }
      {/* <div class="container">
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card one</h2>
          </div>
        </div>
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card two</h2>
          </div>
        </div>
        <div class="box">
          <span></span>
          <div class="content">
            <h2>Card Three</h2>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default MainPageHome;
