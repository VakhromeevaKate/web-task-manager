import { useState } from "react";
import { tasksApi } from "../../api/tasks";
import { useTasks } from "../../api/useTasks";
import type { Task, TaskCreate } from "../../types/tasks";
import { AppLayout } from "../../layouts/AppLayout";
import { Button } from "../../components/Button";
import { TaskList } from "../../components/TaskList";
import { Modal } from "../../components/Modal";
import { TaskForm } from "../../components/TaskForm";
import { Spinner } from "../../components/Spinner";
import { EmptyState } from "../../components/EmptyState";
import { ErrorBanner } from "../../components/ErrorBanner";
import styles from "./index.module.css";

type ModalState =
  | { type: "none" }
  | { type: "add" }
  | { type: "edit"; task: Task }
  | { type: "delete"; task: Task };

export function TasksPage() {
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: tasks = [],
    isLoading,
    // isError,
    refetch,
  } = useTasks();

  const closeModal = () => setModal({ type: "none" });

  const handleCreate = async (data: TaskCreate) => {
    setIsSubmitting(true);
    try {
      await tasksApi.create(data);
      refetch();
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
      await tasksApi.update(id, data);
      refetch();
      closeModal();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось обновить задачу");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await tasksApi.update(task.id, { done: !task.done });
      refetch();
    } catch (e) {
      refetch();
      setError(e instanceof Error ? e.message : "Не удалось изменить статус");
    }
  };

  const handleDelete = async (task: Task) => {
    setIsSubmitting(true);
    try {
      await tasksApi.remove(task.id);
      refetch();
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
        <div className={styles.newTaskButton}>
          <Button onClick={() => setModal({ type: "add" })}>
            + Новая задача
          </Button>
        </div>
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

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {isLoading ? (
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