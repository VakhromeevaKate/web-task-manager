import { useCallback, useEffect, useState } from "react";
import { tasksApi } from "../../api/tasks";
import type { Task, TaskCreate } from "../../types/tasks";
import { AppLayout } from "../../layouts/AppLayout";
import { Button } from "../../components/Button";
import { TaskList } from "../../components/TaskList";
import { Modal } from "../../components/Modal";
import { TaskForm } from "../../components/TaskForm";
import { Spinner } from "../../components/Spinner";
import { EmptyState } from "../../components/EmptyState";
import { ErrorBanner } from "../../components/ErrorBanner";
import styles from "./TasksPage.module.css";

type ModalState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; task: Task }
  | { type: "delete"; task: Task };

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.list();
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить задачи");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const closeModal = () => setModal({ type: "none" });

  const handleCreate = async (data: TaskCreate) => {
    setIsSubmitting(true);
    try {
      const created = await tasksApi.create(data);
      setTasks((prev) => [created, ...prev]);
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось создать задачу");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: number, data: TaskCreate) => {
    setIsSubmitting(true);
    try {
      const updated = await tasksApi.update(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить задачу");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (task: Task) => {
    const snapshot = tasks;
    setTasks((list) =>
      list.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t))
    );
    try {
      const updated = await tasksApi.update(task.id, { done: !task.done });
      setTasks((list) => list.map((t) => (t.id === task.id ? updated : t)));
    } catch (e) {
      setTasks(snapshot);
      setError(e instanceof Error ? e.message : "Не удалось изменить статус");
    }
  };

  const handleDelete = async (task: Task) => {
    setIsSubmitting(true);
    try {
      await tasksApi.remove(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось удалить задачу");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.done).length,
  };

  return (
    <AppLayout
      actions={
        <Button onClick={() => setModal({ type: "add" })}>
          + Новая задача
        </Button>
      }
    >
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total}</span>
          <span className={styles.statLabel}>всего</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.done}</span>
          <span className={styles.statLabel}>выполнено</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.total - stats.done}</span>
          <span className={styles.statLabel}>в работе</span>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadTasks} />}

      {loading ? (
        <Spinner />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          }
          title="Задач пока нет"
          description="Создайте первую задачу, чтобы начать планировать свои дела."
          action={
            <Button onClick={() => setModal({ type: "add" })}>
              Создать задачу
            </Button>
          }
        />
      ) : (
        <TaskList
          tasks={tasks}
          onToggle={handleToggle}
          onEdit={(task) => setModal({ type: "edit", task })}
          onDelete={(task) => setModal({ type: "delete", task })}
        />
      )}

      <Modal
        open={modal.type === "add"}
        title="Новая задача"
        onClose={closeModal}
      >
        <TaskForm
          submitLabel="Создать"
          onSubmit={handleCreate}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <Modal
        open={modal.type === "edit"}
        title="Редактировать задачу"
        onClose={closeModal}
      >
        {modal.type === "edit" && (
          <TaskForm
            initial={{
              title: modal.task.title,
              priority: modal.task.priority,
            }}
            submitLabel="Сохранить"
            onSubmit={(data) => handleUpdate(modal.task.id, data)}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      <Modal
        open={modal.type === "delete"}
        title="Удалить задачу?"
        onClose={closeModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeModal}>
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={() => modal.type === "delete" && handleDelete(modal.task)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Удаление..." : "Удалить"}
            </Button>
          </>
        }
      >
        {modal.type === "delete" && (
          <p className={styles.deleteText}>
            Задача <strong>«{modal.task.title}»</strong> будет удалена без
            возможности восстановления.
          </p>
        )}
      </Modal>
    </AppLayout>
  );
}