import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageModal from "./ImageModal";
import "../css/PhotoGallery.css";

export default function PhotoGallery({
  selectedImage,
  setSelectedImage,
  currentFilteredImages,
}) {
  //Get image dimensions from source
  const [imageSize, setImageSize] = useState();
  const [currentIndex, setCurrentIndex] = useState(null);
  const getImageSize = (url) => {
    let img = new Image();
    img.src = url.substring(0, url.length - 9).concat(".png");
    img.onload = () => {
      setImageSize([img.width, img.height]);
    };
  };

  const handleClickedImage = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    getImageSize(image.img_src);
    console.log(index);
  };
  console.log(currentFilteredImages);
  const totalImages = currentFilteredImages.length;

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
              currentFilteredImages={currentFilteredImages}
              totalImages={totalImages}
              setCurrentIndex={setCurrentIndex}
              currentIndex={currentIndex}
              imageSize={imageSize}
            />
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
