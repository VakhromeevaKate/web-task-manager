import { type Task } from "../../types/tasks";
import { TaskCard } from "../../components/TaskCard";
import styles from "./index.module.css";
import { EmptyState } from "../EmptyState";
import { Button } from "../Button";
import { useState } from "react";
import { Modal } from "../Modal";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleAddTask = () => {
    console.log('open modal')
    setModalOpen(true)
  }

  if (!tasks.length) {
    return <EmptyState title='Пока что нет задач' action={
        <Button onClick={handleAddTask}>
            Добавить задачу {modalOpen}
        </Button>
    } />
  }
  return (
    <div className={styles.list}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

        {modalOpen && <Modal
            title={"Создать новую задачу"}
            onClose={() => setModalOpen(false)}
        >
            <div>
                Создаем новую задачу
            </div>
        </Modal>}
    </div>
  );
}