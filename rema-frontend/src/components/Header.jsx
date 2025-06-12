import styles from "../css/header.module.css";
import { Link } from "react-router-dom";
import bwLogo from "../assets/bw_remalogo.png";

export default function Header({ hidden }) {
  if (hidden) return null;

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <img className={styles.logo} src={bwLogo} alt="ReMa logo" />
        <span className={styles.title}>ReMa</span>
      </div>
      <nav className={styles.navLinks}>
        <Link to="/home" className={styles.navLink}>
          Home
        </Link>
        <Link to="/add" className={styles.navLink}>
          New recipe
        </Link>
        <Link to="/list" className={styles.navLink}>
          My recipes
        </Link>
        <Link to="/planshop" className={styles.navLink}>
          Plan & Shop
        </Link>
      </nav>
    </header>
  );
}
