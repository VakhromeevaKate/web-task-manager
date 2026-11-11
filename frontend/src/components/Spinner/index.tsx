import styles from "./index.module.css";

export function Spinner() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} aria-label="Загрузка..." />
    </div>
  );
}