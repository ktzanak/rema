// src/components/IntroOverlay.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bwLogo from "../assets/bw_remalogo.png";
import styles from "../css/home.module.css";

export default function IntroOverlay({ onIntroEnd }) {
  const [showIntro, setShowIntro] = useState(() => {
    const alreadyShown = sessionStorage.getItem("introShown");
    return !alreadyShown;
  });

  useEffect(() => {
    if (!showIntro) return;

    const timer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("introShown", "true");
      onIntroEnd?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [showIntro, onIntroEnd]);

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("introShown");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
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
  );
}
