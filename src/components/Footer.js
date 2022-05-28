import { requirePropFactory } from "@mui/material";
import React from "react";
import "../css/Footer.css";

export default function Footer() {
  const githubLink = "https://github.com/mattbartley/nasa-cam";
  const personalLink = "https://github.com/mattbartley/";
  const perseveranceLink = "https://mars.nasa.gov/mars2020/";
  const nasaLink = "https://api.nasa.gov/#MarsPhotos";
  const creditText = "ALL IMAGES CREDITED TO NASA/JPL-CALTECH";

  const githubImage = "require(../assets/images/github-logo.png)";
  const personalImage = "../assets/images/matt.png";
  const nasaImage = "../assets/images/nasa-logo.png";
  const perseveranceLogo = "../assets/images/nasa-perseverance-logo.png";

  return (
    <footer className="footer__container">
      <div className="footer__credits">
        <div className="footer__item">
          <a href={githubLink} target="_blank">
            <img src={require("../assets/images/github-logo.png")} alt="" />
          </a>
          <span className="footer__text">
            This project is open source.{" "}
            <a href={githubLink} target="_blank">
              Check it out.
            </a>
          </span>
        </div>
        <div className="footer__item">
          <a href={personalLink} target="_blank">
            <img src={require("../assets/images/matt.png")} alt="" />
          </a>
          <span className="footer__text">
            Built by{" "}
            <a href={personalLink} target="_blank">
              Matt Bartley
            </a>
          </span>
        </div>
        <div className="footer__item">
          <a href={nasaLink} target="_blank">
            <img src={require("../assets/images/nasa-logo.png")} alt="" />
          </a>
          <span className="footer__text">
            All data provided by{" "}
            <a href={nasaLink} target="_blank">
              NASA
            </a>
          </span>
        </div>
        <div className="footer__item">
          <a href={perseveranceLink} target="_blank">
            <img
              src={require("../assets/images/nasa-perseverance-logo.png")}
              alt=""
            />
          </a>
          <span className="footer__text">
            More about the{" "}
            <a href={perseveranceLink} target="_blank">
              Perseverance Mission
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
