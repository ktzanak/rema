import { motion } from "framer-motion";
import bwLogo from "../assets/bw_remalogo.png";
import styles from "../css/introoverlay.module.css";

export default function IntroOverlay({}) {
  return (
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
  );
}
