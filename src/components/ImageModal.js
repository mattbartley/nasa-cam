import { React } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../css/ImageModal.css";

export default function ImageModal({ selectedImage, setSelectedImage }) {
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains("backdrop")) {
      setSelectedImage(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="backdrop"
        onClick={handleBackdropClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.img
          initial={{ y: "20vh", opacity: 0 }}
          animate={{ y: "0", opacity: 1 }}
          exit={{ y: "-20vh", opacity: 0 }}
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
      </motion.div>
    </AnimatePresence>
  );
}
