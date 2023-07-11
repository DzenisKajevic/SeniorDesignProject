import React from "react";
import "./info.css";
import "../../../../variables.css";

const Info = () => {
  return (
    <section className="info-container">
      <h2 className="info-title">Out of ideas of what you want to listen?</h2>
      <p className="info-p">
        Enjoy <span className="highlighted-text">recommended</span> music based on your recent listening history.
        <br />
      </p>
      {/* <button className="subscribe-button shine">Subscribe Now</button> */ }
    </section>
  );
};

export default Info;
