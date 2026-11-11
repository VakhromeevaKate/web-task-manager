import styles from "./index.module.css";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className={styles.banner} role="alert">
      <div className={styles.content}>
        <strong>Что-то пошло не так</strong>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button className={styles.retry} onClick={onRetry}>
          Повторить
        </button>
      )}
    </div>
  );
}