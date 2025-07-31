import styles from "../css/header.module.css";
import { Link, useLocation } from "react-router-dom";
import bwLogo from "../assets/bw_remalogo.png";

export default function Header({ hidden }) {
  const location = useLocation();

  if (hidden) return null;

  const isActive = (path) => location.pathname === path;

  return (
    <header className={styles.header}>
      <Link to="/home" className={styles.logoLink}>
        <img className={styles.logo} src={bwLogo} alt="ReMa logo" />
        <span className={styles.title}>ReMa</span>
      </Link>
      <nav className={styles.navLinks}>
        <Link
          to="/home"
          className={`${styles.navLink} ${
            isActive("/home") ? styles.activeNavLink : ""
          }`}
        >
          Home
        </Link>
        <Link
          to="/add"
          className={`${styles.navLink} ${
            isActive("/add") ? styles.activeNavLink : ""
          }`}
        >
          New recipe
        </Link>
        <Link
          to="/list"
          className={`${styles.navLink} ${
            isActive("/list") ? styles.activeNavLink : ""
          }`}
        >
          My recipes
        </Link>
        <Link
          to="/planshop"
          className={`${styles.navLink} ${
            isActive("/planshop") ? styles.activeNavLink : ""
          }`}
        >
          Plan & Shop
        </Link>
      </nav>
    </header>
  );
}
