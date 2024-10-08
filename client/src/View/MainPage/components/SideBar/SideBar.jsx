import React from "react";
import "./sideBar.css";
import "../../../../variables.css";
import {
  faClockRotateLeft,
  faHouse,
  faMagnifyingGlass,
  faPlayCircle,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setVisualiserHidden } from "../../../../slices/audioVisualiser/visualiserHiddenSlice";
import { playPause } from "../../MainPageViews/MainPagePlayer/AudioVisualiser";

const SideBar = () => {

  const checkVisualiserBeforeRedirect = function () {
    if (window.location.pathname === '/main-page/music-player' || window.location.pathname === '/main-page/music-player/') { if (isPlaying) playPause(); dispatch(setVisualiserHidden({ hidden: true, redirected: true })); }
  };

  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.songInfo.isPlaying);

  return (
    <aside className="sidebar">
      <nav className="sidebar-content">
        <NavLink
          onClick={ () => { checkVisualiserBeforeRedirect() } }
          to="/main-page/home"
          className={ ({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon icon={ faHouse } className="navigation-icons" />
            <h3 className="not-active-link">Home</h3>
          </span>
        </NavLink>
        <NavLink onClick={ () => { checkVisualiserBeforeRedirect() } }
          to="/main-page/search"
          className={ ({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon
              icon={ faMagnifyingGlass }
              className="navigation-icons"
            />
            <h3 className="not-active-link">Search</h3>
          </span>
        </NavLink>
        <div className="breakline"></div>
        <NavLink
          onClick={ () => { checkVisualiserBeforeRedirect() } }
          to="/main-page/playlists"
          className={ ({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon icon={ faPlayCircle } className="navigation-icons" />
            <h3 className="not-active-link">Playlists</h3>
          </span>
        </NavLink>
        {/* some of users playlists render if they exist */ }
        <NavLink
          onClick={ () => { checkVisualiserBeforeRedirect() } }
          to="/main-page/favorites"
          className={ ({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon icon={ faStar } className="navigation-icons" />
            <h3 className="not-active-link">Favourites</h3>
          </span>
        </NavLink>
        <NavLink
          onClick={ () => { checkVisualiserBeforeRedirect() } }
          to="/main-page/recently-played"
          className={ ({ isActive }) =>
            isActive ? "active-link" : "not-active-link"
          }
        >
          <span className="sidebar-navigation">
            <FontAwesomeIcon icon={ faClockRotateLeft } className="navigation-icons" />
            <h3 className="not-active-link">Recents</h3>
          </span>
        </NavLink>

        {/* after this maybe add some footer links or some other links */ }
        {/* this side bar will have sticky position  */ }
      </nav>
      <div className="animated-logo">
        <h1 className="animated-logo-title">Music App</h1>
      </div>
      {/*       <div>
        <a className="sidebar-links" href="#">
          About
        </a>
        <a className="sidebar-links" href="#">
          Contact
        </a>
        <a className="sidebar-links" href="#">
          Partners
        </a>
      </div> */}
    </aside>
  );
};

export default SideBar;
