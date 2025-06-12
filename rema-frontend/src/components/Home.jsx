import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bwLogo from "../assets/bw_remalogo.png";
import styles from "../css/home.module.css";

export default function Home({ onIntroEnd }) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      onIntroEnd?.(); // notify parent to show header
    }, 3000);
    return () => clearTimeout(timer);
  }, [onIntroEnd]);

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.introOverlay}
          >
            <motion.img
              src={bwLogo}
              alt="Logo"
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 1.5 }}
              className={styles.logoSmall}
            />
            <motion.h1
              className={styles.animatedTitle}
              initial={{ width: 0 }}
              animate={{ width: " 16ch" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              Welcome to ReMa!
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={styles.homeContent}
        >
          <div className={styles.homeContent}>
            <h4>
              A simple application for creating recipes. It can be used for any
              type of recipe, main courses, cocktails, desserts and many more!
            </h4>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/*import { Container } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import bwLogo from "../assets/bw_remalogo.png";
import styles from "../css/home.module.css";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000); 
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {showIntro ? (
        <div className={styles.introContainer}>
          <img src={bwLogo} alt="Logo" className={styles.introLogo} />
          <h1 className={styles.introTitle}>Welcome to ReMa!</h1>
        </div>
      ) : (
        <div className={styles.homeContent}>
          <h3>
            A simple application for creating recipes. It can be used for any
            type of recipe, main courses, cocktails, desserts and many more!
          </h3>
        </div>
      )}
    </>
  );
}*/
