import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <img src="public/assets/icons/logo-light.svg" alt="" />
      <p>Kanban Board</p>
    </header>
  );
}

export default Header;
