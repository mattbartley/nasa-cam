import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageModal from "./ImageModal";
import "../css/PhotoGallery.css";

export default function PhotoGallery({
  filteredPhotos,
  selectedImage,
  setSelectedImage,
  currentFilteredImages,
}) {
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

  const handleClickedImage = (image, index) => {
    setCurrentIndex(index);
    setClickedImage(image);
    setSelectedImage(image);
    getImageSize(image.img_src);
    console.log(index);
  };

  const handleNextImage = () => {
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
  const handlePreviousImage = () => {
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
    <AnimatePresence>
      <div className="photo__gallery__container">
        {currentFilteredImages &&
          currentFilteredImages.map((image, index) => {
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
            return (
              <motion.div
                layout
                whileHover={{ scale: 0.98 }}
                className="image__wrap"
                key={image.id}
                onClick={() => handleClickedImage(image, index)}
              >
                <motion.img
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="gallery__image"
                  id={image.id}
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
                  loading={"lazy"}
                />
              </motion.div>
            );
          })}
        <AnimatePresence>
          {selectedImage && (
            <ImageModal
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
