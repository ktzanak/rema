import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bwLogo from "../assets/bw_remalogo.png";
import styles from "../css/home.module.css";

export default function Home({ onIntroEnd }) {
  const [showIntro, setShowIntro] = useState(() => {
    const alreadyShown = sessionStorage.getItem("introShown");
    return !alreadyShown;
  });
  const [quotesAvailable, setQuotesAvailable] = useState(false);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quotesAvailable || showIntro) return;

      try {
        const res = await fetch("http://localhost:8000/api/foodQuote");
        const data = await res.json();
        setQuote(data.quote);
      } catch (err) {
        console.error("Failed to fetch quote:", err);
      }
    };

    fetchQuote();
  }, [quotesAvailable, showIntro]);

  useEffect(() => {
    const checkAvailability = async () => {
      try {
        if (!navigator.onLine) {
          setQuotesAvailable(false);
          return;
        }

        const res = await fetch("http://localhost:8000/api/hasFoodQuotesKey");
        const data = await res.json();
        setQuotesAvailable(data.ok);
      } catch (error) {
        console.error("Error checking quotes availability:", error);
        setQuotesAvailable(false);
      }
    };

    checkAvailability();
  }, []);

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
          <div className={styles.coloredSection}>
            <div className={styles.fullWidthTextFrame}>
              <h1>Welcome to ReMa!</h1>
              <h4>
                A simple application for creating recipes. <br />
                It can be used for any type of recipe, main courses, cocktails,
                desserts and many more!
              </h4>

              {quote && (
                <blockquote>
                  <em>"{quote}"</em>
                </blockquote>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
