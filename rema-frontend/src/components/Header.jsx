import styles from "../css/header.module.css";
import { Link } from "react-router-dom";
import bwLogo from "../assets/bw_remalogo.png";

export default function Header() {
  return (
    <div className={styles.wholeheaderdeco}>
      <div className={styles.parentdiv}>
        <img className={styles.imgpos} src={bwLogo} />
        <div className={styles.headerdeco}>
          <div className={styles.headersize}>Welcome to ReMa!</div>
          <hr className={styles.line} />
          <div className={styles.subheadersize}>
            A simple application for creating recipes. It can be used for any
            type of recipe, main courses, cocktails, desserts and many more!
          </div>
        </div>
      </div>
      <div className={styles.navLinks}>
        {/*<Link to="/home" className={styles.navLink}>
          Home
        </Link>*/}
        <Link to="/add" className={styles.navLink}>
          New recipe
        </Link>
        <Link to="/list" className={styles.navLink}>
          My recipes
        </Link>
      </div>
    </div>
  );
}
