import React from "react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";

import "../css/Stats.css";

export default function Stats({ manifestData }) {
  return (
    <div className="stats__container" id="scroll__stop">
      <h1>MISSION STATS</h1>
      <AnimatePresence>
        <div className="stats__card">
          <motion.div
            className="card__content"
            transition={{ ease: "easeInOut", damping: 100, duration: 1 }}
            initial={{ x: "-7vw", opacity: 0 }}
            animate={{ x: "0", opacity: 1 }}
            exit={{ x: "-50vh", opacity: 0 }}
          >
            <motion.h3
              transition={{
                ease: "easeIn",
                damping: 100,
                duration: 0.5,
                delay: 0.4,
              }}
              initial={{ y: "-1vw", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ x: "50vh", opacity: 0 }}
            >
              Images
            </motion.h3>
            <hr />
            <motion.p
              className="card__text"
              transition={{
                ease: "easeIn",
                damping: 100,
                duration: 0.5,
                delay: 0.4,
              }}
              initial={{ y: "1vw", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ x: "50vh", opacity: 0 }}
            >
              To date, the mission has returned{" "}
              <span className="mission__stat">{manifestData.total_photos}</span>{" "}
              photos from Mars. The most recent photos were collected on Sol{" "}
              {manifestData.max_sol} or approximately{" "}
              {moment(manifestData.max_date).format("MMMM Do, YYYY")}.
            </motion.p>
          </motion.div>
          <motion.div
            className="card__content"
            transition={{ ease: "easeInOut", damping: 100, duration: 1 }}
            initial={{ x: "7vw", opacity: 0 }}
            animate={{ x: "0", opacity: 1 }}
            exit={{ x: "50vh", opacity: 0 }}
          >
            <motion.h3
              transition={{
                ease: "easeIn",
                damping: 100,
                duration: 0.5,
                delay: 0.4,
              }}
              initial={{ y: "-1vw", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ x: "50vh", opacity: 0 }}
            >
              Perseverance
            </motion.h3>
            <hr />
            <motion.p
              className="card__text line__height__sm"
              transition={{
                ease: "easeIn",
                damping: 100,
                duration: 0.5,
                delay: 0.3,
              }}
              initial={{ y: "1vw", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ x: "50vh", opacity: 0 }}
            >
              LAUNCH DATE: <span className="mission__stat">July 30, 2020</span>
            </motion.p>
            <motion.p
              className="card__text line__height__sm"
              transition={{
                ease: "easeIn",
                damping: 100,
                duration: 0.5,
                delay: 0.4,
              }}
              initial={{ y: "1vw", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ x: "50vh", opacity: 0 }}
            >
              LANDING DATE:{" "}
              <span className="mission__stat">February 18, 2021 - (Sol 0)</span>
            </motion.p>
            <motion.p
              className="card__text line__height__sm"
              transition={{
                ease: "easeIn",
                damping: 100,
                duration: 0.5,
                delay: 0.5,
              }}
              initial={{ y: "1vw", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              exit={{ x: "50vh", opacity: 0 }}
            >
              CURRENT STATUS:{" "}
              <span className="mission__stat">{manifestData.status}</span>
            </motion.p>
          </motion.div>
        </div>
      </AnimatePresence>
      <span className="credits">ALL Images Credited to NASA/JPL-Caltech</span>
    </div>
  );
}
