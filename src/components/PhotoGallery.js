import { motion } from "framer-motion";
import "../css/PhotoGallery.css";
export default function PhotoGallery({ image, setSelectedImage }) {
  return (
    <motion.div
      layout
      transition={{ type: "spring", mass: 0.25 }}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
    >
      <img
        className="gallery__image"
        id={image.id}
        onClick={() => setSelectedImage(image)}
        src={image.img_src}
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
      ></img>
    </motion.div>
  );
}
