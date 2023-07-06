import React, { useRef } from "react";
import "./createdPlaylist.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faLock,
  faLockOpen,
  faAnglesLeft,
  faAnglesRight,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import * as mainAxios from "../../../mainAxios";
import { setReloadPlaylists } from "../../../../../slices/audioVisualiser/songInfoSlice";
import { deletePlaylist, setCurrentlyViewingPlaylistSongs, setPlaylistSongs } from "../../../../../slices/playlists/playlistsSlice";

const CreatedPlaylist = () => {
  const playlists = useSelector((state) => state.playlists);
  const dispatch = useDispatch();
  // state for opening and closing the edit menu
  const [isOpen, setIsOpen] = useState([]);

  const pagination = useRef({
    page: "1",
    pageSize: "4",
  });

  const updatePlaylistSongs = function (result) {
    console.log("AAA", result.data);
    if (result.data) {
      console.log("BBB", pagination.current);
      result.data.pagination = pagination.current;
      dispatch(setPlaylistSongs(result.data));
      dispatch(setCurrentlyViewingPlaylistSongs(pagination.current));
    }
    else {
      pagination.current.page = 1;
      dispatch(setPlaylistSongs({ searchResults: [] }));
    }
    /*     window.location.hash = "nonExistantHashUsedForRefreshing";
        window.location.hash = "#card-container"; */
  };

  // let array = [];

  // playlists.map((item) => {
  //   array.push({
  //     item,
  //     value: false,
  //   });
  // });

  return (
    <div className="playlistContainer">
      { playlists.playlists.map((playlist, index) => {
        return (
          <div className="created-playlist-container" id={ playlist["_id"] } key={ playlist["_id"] } style={ { display: playlists.playlistsHidden ? "none" : null } }>
            {/* <img src={""} alt="user image" className="user-image" /> */ }
            <FontAwesomeIcon icon={ faDoorOpen } className="open-playlist" onClick={ async () => {
              console.log(playlist["_id"]);
              let result = await mainAxios.getPlaylistById({
                playlistId: playlist["_id"],
                //page: pagination.current.page,
                //pageSize: pagination.current.pageSize,
              });
              //console.log(playlist);
              //result.data.data.currentPlaylist = playlist["_id"];
              result.data.data.currentPlaylist = playlist["playlistName"];
              result.data.data.currentPlaylistId = playlist["_id"];
              result.data.data.pagination = pagination.current;
              updatePlaylistSongs(result);
            } } />
            <h1 className="playlist-name-title" id={ 'playlist ' + playlist["_id"] } contentEditable={ false }>{ playlist.playlistName }</h1>
            <button
              className="expand-shrink-button"
              type="button"
              id={ playlist["_id"] }
              onClick={ (event) => {
                //console.log(event.target);
                //console.log(event.target.parentElement.getAttribute('id'));
                let id = event.target.parentElement.parentElement.getAttribute('id');
                const id2 = event.target.parentElement.getAttribute('id');
                if (!id) id = id2;
                if (!isOpen.includes(id))
                  setIsOpen(oldArray => [...oldArray, id]);
                else
                  setIsOpen(oldArray => [...oldArray.filter(item => item !== id)]);
              } }
            >
              { isOpen.includes(playlist["_id"]) ? (
                <FontAwesomeIcon
                  icon={ faAnglesRight }
                  className="close-edit-menu"
                />
              ) : (
                <FontAwesomeIcon
                  icon={ faAnglesLeft }
                  className="open-edit-menu"
                />
              ) }
            </button>
            <div
              className={ isOpen.includes(playlist["_id"]) ? "edit-menu" : "edit-menu-closed" }
            //onClick={ () => setIsOpen(false) }
            >
              <FontAwesomeIcon icon={ faLock } className="lock-playlist" onClick={ () => { mainAxios.updatePlaylistVisibility(playlist['_id'], "private"); } } />
              <FontAwesomeIcon icon={ faLockOpen } className="unlock-playlist" onClick={ () => { mainAxios.updatePlaylistVisibility(playlist['_id'], "public"); } } />
              <FontAwesomeIcon icon={ faPen } className="edit-playlist" onClick={ () => {
                console.log(document.getElementById('playlist ' + playlist["_id"]).contentEditable);
                if (document.getElementById('playlist ' + playlist["_id"]).contentEditable === "false") {
                  document.getElementById('playlist ' + playlist["_id"]).contentEditable = true;
                  document.getElementById('playlist ' + playlist["_id"]).classList.add("editableH1");
                }
                else {
                  document.getElementById('playlist ' + playlist["_id"]).contentEditable = false;
                  // add border to element
                  document.getElementById('playlist ' + playlist["_id"]).classList.remove("editableH1");
                  mainAxios.updatePlaylistName(playlist['_id'], document.getElementById('playlist ' + playlist["_id"]).innerText);
                }
              } } />
              <FontAwesomeIcon
                icon={ faTrash }
                className="delete-playlist"
                onClick={ async () => {
                  const result = await mainAxios.deletePlaylist(
                    playlist["_id"]
                  );
                  if (result.data) {
                    const index = playlists.playlists.indexOf(playlist);
                    dispatch(deletePlaylist(index));
                    dispatch(setReloadPlaylists(true));
                  }
                } }
              />
            </div>
          </div>
        );
      }) }
    </div>
  );
};

{
  /*       <img src={userImage} alt="user image" className="user-image" />
      <h1 className="playlist-name-title">{playlistName}</h1>
      <div className="edit-delete-playlist">
        <FontAwesomeIcon icon={faPen} className="edit-playlist" />
        <FontAwesomeIcon icon={faTrash} className="delete-playlist" />
      </div> */
}

export default CreatedPlaylist;
