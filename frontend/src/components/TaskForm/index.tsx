import { useState } from "react";
import { Button } from "../../components/Button";
import type { TaskCreate } from "../../types/tasks";
import styles from "./index.module.css";

interface TaskFormProps {
  initial?: Partial<TaskCreate>;
  submitLabel: string;
  onSubmit: (data: TaskCreate) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TaskForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [priority, setPriority] = useState(initial?.priority ?? 3);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("Название не может быть пустым");
      return;
    }
    if (trimmed.length > 200) {
      setError("Максимум 200 символов");
      return;
    }
    setError(null);
    onSubmit({ title: trimmed, priority });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.label}>Название</span>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Что нужно сделать?"
          maxLength={200}
          autoFocus
        />
        {error && <span className={styles.error}>{error}</span>}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>Приоритет</span>
        <select
          className={styles.select}
          value={priority}
          onChange={(e) => setPriority(Number(e.target.value))}
        >
          <option value={1}>1 — низкий</option>
          <option value={2}>2</option>
          <option value={3}>3 — средний</option>
          <option value={4}>4</option>
          <option value={5}>5 — высокий</option>
        </select>
      </label>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}