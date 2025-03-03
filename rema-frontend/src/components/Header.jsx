import styles from "../css/header.module.css";

export default function Header() {
  return (
    <div className={styles.headerdeco}>
      <div className={styles.parentdiv}>
        <img className={styles.imgpos} src="./images/bw_remalogo.png" />
        <div>
          <div className={styles.headersize}>Welcome to ReMa!</div>
          <hr className={styles.line} />
          <div className={styles.subheadersize}>
            A simple application for creating recipes. It can be used for any
            type of recipe, main courses, cocktails, desserts and many more!
          </div>
        </div>
      </div>
    </div>
  );
}
