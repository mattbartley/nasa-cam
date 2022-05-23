import { useState } from "react";
import { motion } from "framer-motion";
import "../css/PhotoGallery.css";
import Lightbox from "./Lightbox";
import { Skeleton } from "@mui/material/";

export default function PhotoGallery({ image, index, filteredPhotos }) {
  const smallExt = "_320.jpg";
  const mediumExt = "_800.jpg";
  const largeExt = "_1200.jpg";
  const fullExt = ".png";

  let imgSrc = image.img_src;
  let imgSrcBase = imgSrc.substring(0, imgSrc.length - 9);

  let smallSrc = imgSrcBase + smallExt;
  let mediumSrc = imgSrcBase + mediumExt;
  let largeSrc = imgSrcBase + largeExt;
  let fullSrc = imgSrcBase + fullExt;

  const [clickedImage, setClickedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [imageSize, setImageSize] = useState();

  const getImageSize = (url) => {
    let img = new Image();
    img.src = url;
    img.onload = () => {
      setImageSize([img.width, img.height]);
    };
  };

  const handleClick = (image, index) => {
    setCurrentIndex(index);
    setClickedImage(image);
    getImageSize(image.img_src);
    console.log(imageSize);
  };

  const handleNext = () => {
    const totalImages = filteredPhotos.length;
    if (currentIndex + 1 >= totalImages) {
      setCurrentIndex(0);
      const newSrc = filteredPhotos[0];
      setClickedImage(newSrc);
      return;
    }
    const newIndex = currentIndex + 1;
    const newImage = filteredPhotos[newIndex];
    setClickedImage(newImage);
    setCurrentIndex(newIndex);
  };
  const handlePrevious = () => {
    const totalImages = filteredPhotos.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalImages - 1);
      const newSrc = filteredPhotos[totalImages - 1];
      setClickedImage(newSrc);
      return;
    }
    const newIndex = currentIndex - 1;
    const newImage = filteredPhotos[newIndex];
    setClickedImage(newImage);
    setCurrentIndex(newIndex);
  };

  return (
    <motion.div
      layout
      transition={{ type: "spring", mass: 0.25 }}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      key={index}
    >
      {!image ? (
        <Skeleton variant="rectangular" width={210} height={118} />
      ) : (
        <img
          className="gallery__image"
          id={image.id}
          onClick={() => handleClick(image, index)}
          sizes={
            "(max-width: 600px) 50vw, (min-width: 601px) 50vw,(min-width: 1200px) 50vw, 1200px"
          }
          srcSet={`${smallSrc} 320w, ${mediumSrc} 800w, ${largeSrc} 1200w`}
          alt={
            "Nasa Mars Photo id: " +
            image.id +
            " using camera: " +
            image.camera.full_name +
            ". Taken on " +
            image.earth_date +
            " - sol: " +
            image.sol
          }
        />
      )}
      {clickedImage && (
        <Lightbox
          clickedImage={clickedImage}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          setClickedImage={setClickedImage}
          imageSize={imageSize}
        />
      )}
    </motion.div>
  );
}
