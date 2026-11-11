import { type Task } from "../../types/tasks";
import styles from './index.module.css'

interface TaskCardProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const PRIORITY_LABELS: Record<number, string> = {
  1: "Низкий",
  2: "Ниже среднего",
  3: "Средний",
  4: "Высокий",
  5: "Критичный",
};

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <article className={`${styles.card} ${task.done ? styles.done : ""}`}>
      <button
        className={styles.checkbox}
        onClick={() => onToggle(task)}
        aria-label={task.done ? "Отметить как невыполненную" : "Отметить как выполненную"}
        aria-pressed={task.done}
      >
        {task.done && (
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className={styles.content}>
        <h3 className={styles.title}>{task.title}</h3>
        <div className={styles.meta}>
          <span className={`${styles.priority} ${styles[`priority${task.priority}`]}`}>
            {PRIORITY_LABELS[task.priority] ?? task.priority}
          </span>
          <span className={styles.date}>
            {new Date(task.created_at).toLocaleDateString("ru-RU")}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionButton}
          onClick={() => onEdit(task)}
          aria-label="Редактировать"
          title="Редактировать"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>
        <button
          className={`${styles.actionButton} ${styles.danger}`}
          onClick={() => onDelete(task)}
          aria-label="Удалить"
          title="Удалить"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18" />
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
          </svg>
        </button>
      </div>
    </article>
  );
}