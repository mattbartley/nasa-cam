import { motion, AnimatePresence } from "framer-motion";
import "../css/ImageModal.css";

export default function ImageModal({
  selectedImage,
  setSelectedImage,
  currentFilteredImages,
  totalImages,
  imageSize,
  setCurrentIndex,
  currentIndex,
}) {
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setSelectedImage(null);
    }
  };

  const handleNextImage = () => {
    if (currentIndex + 1 >= totalImages) {
      setCurrentIndex(0);
      const newSrc = currentFilteredImages[0];
      setSelectedImage(newSrc);
      return;
    }
    const newIndex = currentIndex + 1;
    const newImage = currentFilteredImages[newIndex];
    setSelectedImage(newImage);
    setCurrentIndex(newIndex);
  };
  const handlePreviousImage = () => {
    const totalImages = currentFilteredImages.length;
    if (currentIndex === 0) {
      setCurrentIndex(totalImages - 1);
      const newSrc = currentFilteredImages[totalImages - 1];
      setSelectedImage(newSrc);
      return;
    }
    const newIndex = currentIndex - 1;
    const newImage = currentFilteredImages[newIndex];
    setSelectedImage(newImage);
    setCurrentIndex(newIndex);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="backdrop"
        onClick={handleBackdropClick}
        transition={{ ease: "easeOut", duration: 0.3 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.img
          initial={{ y: "10vh", scale: 0.85, opacity: 0 }}
          transition={{ ease: "easeIn", damping: 300 }}
          animate={{ y: "0", scale: 1, opacity: 1 }}
          exit={{ y: "10vh", scale: 0.85, opacity: 0 }}
          key={selectedImage.id}
          src={selectedImage.img_src}
          alt={
            "Nasa Mars Photo id: " +
            selectedImage.id +
            " using camera: " +
            selectedImage.camera.full_name +
            ". Taken on " +
            selectedImage.earth_date +
            " - sol: " +
            selectedImage.sol
          }
        />
        <div className="button__holder">
          <div
            className="modal__button prev__btn"
            onClick={handlePreviousImage}
          >
            <span className="material-icons md-48 nav__icon">west</span>
          </div>
          {currentIndex + 1 + " / " + currentFilteredImages.length}
          <div className="modal__button next__btn" onClick={handleNextImage}>
            <span className="material-icons md-48 nav__icon">east</span>
          </div>
        </div>
        <motion.div
          className="modal__details"
          transition={{ ease: "easeIn", damping: 300 }}
          initial={{ y: "20vh", opacity: 0 }}
          animate={{ y: "0", opacity: 1 }}
          exit={{ y: "50vh", opacity: 0 }}
        >
          <div className="details__card">
            <motion.div className="detail__item">
              <span className="detail__description">
                <span className="detail__title">
                  <span className="material-icons md-light detail__icon">
                    photo_camera
                  </span>
                  Camera Info
                </span>
              </span>
              <p className="detail__text">
                <span className="description__title">Camera ID: </span>
                {selectedImage.camera.id}
              </p>
              <p className="detail__text">
                <span className="description__title">Tech Name: </span>
                {selectedImage.camera.name}
              </p>
              <p className="detail__text">
                <span className="description__title">Name: </span>
                {selectedImage.camera.full_name}
              </p>
            </motion.div>
            <motion.div className="detail__item">
              <span className="detail__description">
                <span className="detail__title">
                  <span className="material-icons md-light detail__icon">
                    calendar_today
                  </span>
                  Capture Date
                </span>
              </span>
              <p className="detail__text">
                <span className="description__title">Sol: </span>
                {selectedImage.sol}
              </p>
              <p className="detail__text">
                <span className="description__title">Earth Date: </span>
                {selectedImage.earth_date}
              </p>
            </motion.div>
            <motion.div className="detail__item">
              <span className="detail__description">
                <span className="detail__title">
                  <span className="material-icons md-light detail__icon">
                    info
                  </span>
                  Image Details
                </span>
              </span>
              <p className="detail__text">
                <span className="description__title">Image ID: </span>
                {selectedImage.id}
              </p>

              <p className="detail__text">
                <span className="description__title">Captured by: </span>
                {selectedImage.rover.name}
              </p>
            </motion.div>
            <motion.div className="detail__item">
              <span className="detail__description">
                <span className="detail__title">
                  <span className="material-icons md-light detail__icon">
                    description
                  </span>
                  File Info
                </span>
              </span>

              <p className="detail__text">
                <span className="description__title">Dimensions: </span>
                {imageSize?.[0] + "px x " + imageSize?.[1] + "px"}
              </p>
              <p className="detail__text">
                <span className="description__title">Direct Link: </span>
                <a
                  href={`${
                    selectedImage.img_src.substring(
                      0,
                      selectedImage.img_src.length - 9
                    ) + ".png"
                  }`}
                  target="_blank"
                >
                  Full-size .PNG{" "}
                  <span className="modal__open_icon material-icons md-light md-16">
                    open_in_new
                  </span>
                </a>
              </p>
              <p className="detail__text">
                <span className="description__title">Credit: </span>
                NASA/JPL-CALTECH
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
