import React, { useEffect, useState } from "react";
import "./mainNavbar.css";
import "../../../../variables.css";
import { Link } from "react-router-dom";
import logo from "./navbarImages/music-app-logo2.png";
import * as mainAxios from "../../mainAxios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as mainNavbarAxios from "./mainNavbarAxios";
import {
  faEllipsisVertical,
  faPlus,
  faRightFromBracket,
  faPen,
  faX,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import UploadImgPopup from "./components/UploadImgPopup";
import { toast } from "react-toastify";

const MainNavbar = () => {
  const [profilePic, setProfilePic] = useState(null);

  // opening and closing upload img popup
  const [visibility, setVisibility] = useState(false);
  const [nameChangeVisibility, setNameChangeVisibility] = useState(false);

  const [menuVisibility, setMenuVisibility] = useState(false);

  const toggleMenuVisibility = () => {
    setMenuVisibility((prevState) => !prevState);
  };

  const [reloadProfilePic, setReloadProfilePic] = useState(true);

  const closeDropdownMenu = (e) => { };
  // Converts any given blob into a base64 encoded string.
  function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
  useEffect(() => {
    if (!reloadProfilePic) return;
    const setProfilePicture = async function () {
      const response = await mainNavbarAxios.getFile({
        userId: JSON.parse(window.localStorage.user)["_id"],
      });
      const src = await convertBlobToBase64(response);
      setProfilePic(src);
    };
    setProfilePicture();
    setReloadProfilePic(false);
  }, [reloadProfilePic]);

  useEffect(() => {/* 
    console.log(visibility, "vidljivost"); */
  }, [visibility]);

  return (
    <>
      <nav className="mainNavbar">
        <Link to="/main-page/home">
          <img
            className="mainNavbar-app-logo"
            src={ logo }
            alt="application logo"
          />
        </Link>
        <div className="user-info-container">
          <p className="mainNavbar-username">
            { JSON.parse(window.localStorage.user).username }
          </p>
          <div className="username-img-container">
            <img src={ `${profilePic}` } width="50px" style={ { borderRadius: "50%" } } alt="" />
          </div>
          <div className="dropdown">
            <button className="dropdown-button" onClick={ toggleMenuVisibility }>
              <FontAwesomeIcon
                icon={ faEllipsisVertical }
                className="three-dots-icon"
              />
            </button>
            { menuVisibility && (
              <div className="dropdown-menu">
                <button
                  onClick={ (event) => {
                    /* event.stopPropagation(); */
                    setVisibility(!visibility);
                  } }
                >
                  Change picture{ " " }
                </button>
                <FontAwesomeIcon icon={ faPlus } className="dropdown-icons" />
                { visibility && (
                  <div style={ { display: "flex", alignItems: "center" } }>
                    <label htmlFor="profilePic" className={ "dropdown-menu-item-label" }>Upload</label>
                    <input id="profilePic" name="profilePic" type="file" style={ { display: "none" } } onChange={ async (e) => {
                      let response = await mainNavbarAxios.uploadProfilePicture({ profilePic: e.target.files[0] });
                      console.log(response);
                      if (response.error) {
                        console.log(response.error);
                        toast.error(response.error, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                      }
                      else {
                        console.log(response.data);
                        setReloadProfilePic(true);
                      }
                    } } />
                  </div>
                ) }
                <div className="dropdown-breakline" ></div>
                <button
                  onClick={ (event) => {
                    /* event.stopPropagation(); */
                    setNameChangeVisibility(!nameChangeVisibility);
                  } }
                >
                  Change name{ " " }
                </button>
                <FontAwesomeIcon icon={ faPen } className="dropdown-icons" />
                { nameChangeVisibility && (
                  <div style={ { display: "flex", justifyContent: "space-between", alignItems: "center" } }>
                    <input id="usernameChange" name="usernameChange" className={ "dropdown-menu-item-text-input" } style={ { width: "120px" } } type="text" />
                    <FontAwesomeIcon icon={ faCheck } className="dropdown-icons-clickable" onClick={ async () => {
                      let newName = document.getElementById("usernameChange").value;
                      let response = await mainNavbarAxios.renameUser(newName);
                      console.log(response);
                      if (response.error) {
                        console.log(response.error);
                        toast.error(response.error, { className: "toast-message", style: { backgroundColor: "#000000", color: "yellow" } });
                      }
                      else {
                        console.log(response.data);
                        let usernameParagraph = document.getElementsByClassName("mainNavbar-username")[0];
                        usernameParagraph.innerHTML = newName;
                      }
                    } } />
                  </div>
                ) }
                <div className="dropdown-breakline"></div>
                <button
                  onClick={ () => {
                    mainAxios.logout();
                  } }
                >
                  Log out{ " " }
                  <FontAwesomeIcon
                    icon={ faRightFromBracket }
                    className="dropdown-icons"
                  />
                </button>
              </div>
            ) }
          </div>
        </div >
        <div className="mainNavbar-button-container">
          {/* {<button className="sub-button shine">Subscribe</button>}
          <div className="v-breakline-main"></div> */}
          <button
            className="logout-button shine"
            onClick={ () => {
              mainAxios.logout();
            } }
          >
            Log out
          </button>
        </div>
      </nav >
    </>
  );
};

export default MainNavbar;
