import { motion } from 'framer-motion';
import '../css/Banner.css';

export default function Banner() {
  const scrollToGallery = () => {
    document
      .getElementById('scroll__down')
      .scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="banner">
      <div className="banner_container">
        <div className="banner__card">
          <h1 className="banner__title">
            Explore Images From Mars collected by <span>NASA</span>
          </h1>
          <motion.div
            className="banner__content"
            transition={{ ease: 'easeIn', duration: 0.8 }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            exit={{ scaleY: 0, opacity: 0 }}
          >
            <motion.p
              className="banner__text"
              transition={{ ease: 'easeIn', delay: 0.8, duration: 0.5 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              A direct connection to official NASA mission images. Explore the
              images by camera, Rover, and by date.
            </motion.p>
            <motion.button
              className="banner__btn"
              onClick={scrollToGallery}
              transition={{ ease: 'easeIn', duration: 0.4, delay: 0.2 }}
              initial={{ scaleX: 0.4, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              exit={{ y: '-1vh', opacity: 0 }}
            >
              <motion.span
                transition={{ ease: 'easeIn', duration: 0.7, delay: 0.6 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                See Photos From Mars
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
