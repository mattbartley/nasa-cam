import React from "react";
import "../css/Footer.css";

export default function Footer() {
  const githubLink = "https://github.com/mattbartley/nasa-cam";
  const personalLink = "https://github.com/mattbartley/";
  const perseveranceLink = "https://mars.nasa.gov/mars2020/";
  const nasaLink = "https://api.nasa.gov/#MarsPhotos";

  const githubImage = "require(../assets/images/github-logo.png)";
  const personalImage = "../assets/images/matt.png";
  const nasaImage = "../assets/images/nasa-logo.png";
  const perseveranceLogo = "../assets/images/nasa-perseverance-logo.png";

  return (
    <footer className="footer__container">
      <div className="footer__credits">
        <div className="footer__item">
          <a href={githubLink} target="_blank" rel="noreferrer">
            <img src={githubImage} alt="github logo" />
          </a>
          <span className="footer__text">
            This project is open source.{" "}
            <a href={githubLink} target="_blank" rel="noreferrer">
              Check it out.
            </a>
          </span>
        </div>
        <div className="footer__item">
          <a href={personalLink} target="_blank" rel="noreferrer">
            <img src={personalImage} alt="matt bartley profile" />
          </a>
          <span className="footer__text">
            Built by{" "}
            <a href={personalLink} target="_blank" rel="noreferrer">
              Matt Bartley
            </a>
          </span>
        </div>
        <div className="footer__item">
          <a href={nasaLink} target="_blank" rel="noreferrer">
            <img src={nasaImage} alt="nasa logo" />
          </a>
          <span className="footer__text">
            All data provided by{" "}
            <a href={nasaLink} target="_blank" rel="noreferrer">
              NASA
            </a>
          </span>
        </div>
        <div className="footer__item">
          <a href={perseveranceLink} target="_blank" rel="noreferrer">
            <img src={perseveranceLogo} alt="perseverance mission logo" />
          </a>
          <span className="footer__text">
            More about the{" "}
            <a href={perseveranceLink} target="_blank" rel="noreferrer">
              Perseverance Mission
            </a>
          </span>
        </div>
      </div>
      <p className="copy__year">
        &copy; {new Date().getFullYear()} Nasa.cam | Matt Bartley
      </p>
      <p className="copy__nasa">
        This site is not affiliated with or endoursed by NASA. All images are
        credited to NASA/JPL-CALTECH. To use any of the images found on this
        site, please see NASA's{" "}
        <a
          href="https://www.nasa.gov/multimedia/guidelines/index.html"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          Media Usage Guidelines.
        </a>
      </p>
    </footer>
  );
}
