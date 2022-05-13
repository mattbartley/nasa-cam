import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Lightbox({ selectedImage }) {
  console.log(selectedImage);
  const transition = {
    type: "spring",
    damping: 25,
    stiffness: 120,
  };
  const [isOpen, setOpen] = useState(true);

  useEffect(() => {
    const lightBoxElement = document.getElementById("lightbox");
    if (isOpen === true && lightBoxElement) {
      lightBoxElement.style.display = "inline-block";
      console.log(lightBoxElement);
    }
    if (isOpen === false && lightBoxElement) {
      lightBoxElement.style.display = "none";
      console.log(lightBoxElement);
    }
  }, [isOpen, selectedImage]);
  console.log(isOpen);

  return (
    <div id="lightbox">
      <div className={`image__container ${isOpen ? "open" : ""}`}>
        <motion.div
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={transition}
          className="shade"
          onClick={() => setOpen(!isOpen)}
        />
        <motion.img
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
          layout
          transition={transition}
          onClick={() => setOpen(!isOpen)}
        />
      </div>
    </div>
  );
}
