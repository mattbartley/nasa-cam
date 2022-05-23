import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import "../css/Lightbox.css";
function Lightbox({
  clickedImage,
  handlePrevious,
  handleNext,
  setClickedImage,
  imageSize,
}) {
  const handleClick = (e) => {
    console.log(clickedImage);
    if (e.target.classList.contains("dismiss")) {
      setClickedImage(null);
    }
  };

  return (
    <motion.div>
      <div className="lightbox__overlay dismiss" onClick={handleClick}>
        <button className="lightbox__dismiss dismiss" onClick={handleClick}>
          Close
        </button>
        <img
          className="lightbox__image"
          src={
            clickedImage.img_src.substring(0, clickedImage.img_src.length - 9) +
            ".png"
          }
          alt={
            "Nasa Mars Photo id: " +
            clickedImage.id +
            " using camera: " +
            clickedImage.camera.full_name +
            ". Taken on " +
            clickedImage.earth_date +
            " - sol: " +
            clickedImage.sol
          }
        />
        <span>
          <button className="lightbox__previous" onClick={handlePrevious}>
            {" "}
            Previous{" "}
          </button>
          <button className="lightbox__next" onClick={handleNext}>
            {" "}
            NEXT{" "}
          </button>
        </span>
        <div className="lightbox__card">
          <div className="lightbox__id">
            <span className="detail__title">Image ID: </span>
            <span className="detail__text">{clickedImage.id}</span>
          </div>
          <h2>Details</h2>
          <p className="detail__item">
            <span className="detail__title">Date Captured: </span>
            <span className="detail__text">
              {clickedImage.earth_date} - (Sol: {clickedImage.sol})
              <a href=""> &#x1F6C8;</a>
            </span>
          </p>

          <p className="detail__item">
            <span className="detail__title">Camera: </span>
            <span className="detail__text">
              {clickedImage.camera.name} - {clickedImage.camera.full_name}{" "}
              <a className="lightbox__tooltip" href="">
                &#x1F6C8;
                <span className="lightbox__tooltiptext">
                  Info about this camera
                </span>
              </a>
            </span>
          </p>
          <p className="detail__item">
            <span className="detail__title">Largest Image File: </span>
            <span className="detail__text">
              W: {imageSize?.[1]} x H: {imageSize?.[0]} - Filetype: .PNG
            </span>
          </p>
          <a
            className="lightbox__link"
            href={
              clickedImage.img_src.substring(
                0,
                clickedImage.img_src.length - 9
              ) + ".png"
            }
            target="_blank"
          >
            {" "}
            OPEN FULL SIZE &#8599;
          </a>
        </div>
      </div>
    </motion.div>
  );
}
export default Lightbox;
