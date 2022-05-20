import React from "react";
import "../css/Stats.css";

export default function Stats() {
  return (
    <div className="stats__container">
      <h1>MISSION STATS</h1>
      <div className="stats__card">
        <div className="card__content">
          <h3>Images</h3>
          <hr />
          <p className="card__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam
          </p>
        </div>
        <div className="card__content">
          <h3>Perseverance</h3>
          <hr />
          <p className="card__text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam
          </p>
        </div>
      </div>
      <span className="credits">ALL Images Credited to NASA/JPL-Caltech</span>
    </div>
  );
}
