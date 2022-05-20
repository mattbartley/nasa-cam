import { motion } from "framer-motion";
import "../css/PhotoGallery.css";
export default function PhotoGallery({ image, index, setSelectedImage }) {
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
      transition={{ type: "spring", mass: 0.25 }}
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
    >
      <img
        className="gallery__image"
        id={image.id}
        idx={index}
        onClick={() => setSelectedImage([image, index])}
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
      ></img>
    </motion.div>
  );
}
