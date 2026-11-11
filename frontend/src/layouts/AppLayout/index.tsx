import { type ReactNode } from "react";
import styles from "./index.module.css";

interface AppLayoutProps {
  children: ReactNode;
  actions?: ReactNode;
}

export function AppLayout({ children, actions }: AppLayoutProps) {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brand}>
            <div className={styles.logo}>✓</div>
            <div>
              <h1 className={styles.title}>Менеджер задач</h1>
              <p className={styles.subtitle}>Управляйте своими делами</p>
            </div>
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  );
}