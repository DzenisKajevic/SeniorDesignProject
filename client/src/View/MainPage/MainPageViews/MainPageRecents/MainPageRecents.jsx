import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as mainAxios from "../../mainAxios";
import "./MainPageRecents.css";
import { SongCard } from "../MainPageSearch/components/SongCard/SongCard";
import { setCurrentlyViewingRecentSongs, setRecentSongs, setReloadRecentSongs } from "../../../../slices/recents/recentSongsSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faMicrochip } from "@fortawesome/free-solid-svg-icons";
import { setReloadPlaylists } from "../../../../slices/playlists/playlistsSlice";
import { toast } from 'react-toastify';

const MainPageRecents = () => {
    const dispatch = useDispatch();
    const reloadRecentSongs = useSelector(
        (state) => state.recentSongs.reloadRecentSongs
    );
    const recentSongs = useSelector((state) => state.recentSongs);
    const pagination = useRef({
        page: "1",
        pageSize: "4",
    });

    useEffect(() => {
        if (reloadRecentSongs) {
            const fetchFavourites = async function () {
                let result = await mainAxios.getRecentlyPlayedSongs();
                if (result.error) {
                    toast.error(result.error.response.data);
                    let emptyArray = [];
                    dispatch(setRecentSongs(emptyArray));
                    dispatch(setCurrentlyViewingRecentSongs(0));
                    dispatch(setReloadRecentSongs(false));
                }
                else {
                    dispatch(setRecentSongs(result.data.data));
                    dispatch(setCurrentlyViewingRecentSongs({ 'currentPage': pagination.current.page - 1, 'pageSize': pagination.current.pageSize }));
                    dispatch(setReloadRecentSongs(false));
                }
            };
            fetchFavourites();
        }
    }, [reloadRecentSongs]);

    return (
        <section>
            <h1 className="main-page-search-title">Recent songs</h1>
            <div className="flex-container"  >
                <p className="linear-p">Refresh</p>
                <button className="interactive-button" onClick={ () => { dispatch(setReloadRecentSongs(true)); } }>
                    <FontAwesomeIcon
                        icon={ faArrowsRotate }
                        className="interactive-icon"
                    />
                </button>
                <p className="linear-p">Generate Playlists</p>
                <button className="interactive-button" onClick={ async () => {
                    let response = await mainAxios.generateRecommendedPlaylists();
                    if (response.error) {
                        toast.error(response.error.response.data);
                    }
                    else
                        dispatch(setReloadPlaylists(true));
                } }>
                    <FontAwesomeIcon
                        icon={ faMicrochip }
                        className="interactive-icon"
                    />
                </button>
            </div>
            <SongCard source="RECENTS" />
            <div className="mainPage-button-container">
                <button
                    id="previousPage"
                    className="previousPage"
                    style={ {
                        display: pagination.current.page - 1 <= 0 ? "none" : null,
                    } }
                    onClick={ async () => {
                        pagination.current.page--;
                        dispatch(setCurrentlyViewingRecentSongs({ 'currentPage': pagination.current.page - 1, 'pageSize': pagination.current.pageSize }));
                        /* dispatch(setReloadRecentSongs(true)); */
                        window.location.hash = "nonExistantHashUsedForRefreshing";
                        window.location.hash = "#card-container";
                    } }
                >
                    { Number(pagination.current.page) - 1 }
                </button>

                <button id="currentPage" className="currentPage" style={ { display: recentSongs.pageCount ? null : "none" } }>
                    { pagination.current.page }
                </button>
                <button
                    id="nextPage"
                    className="nextPage"
                    style={ {
                        display:
                            Number(pagination.current.page) + 1 > recentSongs.pageCount || !recentSongs.pageCount
                                ? "none"
                                : null,
                    } }
                    onClick={ async () => {
                        pagination.current.page++;
                        dispatch(setCurrentlyViewingRecentSongs({ 'currentPage': pagination.current.page - 1, 'pageSize': pagination.current.pageSize }));
                        /* dispatch(setReloadRecentSongs(true)); */
                        window.location.hash = "nonExistantHashUsedForRefreshing";
                        window.location.hash = "#card-container";
                    } }
                >
                    { Number(pagination.current.page) + 1 }
                </button>
            </div>
        </section >
    );
};

export default MainPageRecents;
