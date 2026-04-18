import { motion } from "framer-motion";

export const TaskItem = ({ task, toggleTask, deleteTask }) => {
  return (
    <motion.div
      layout
      className={`task ${task.completed ? "done" : ""}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
    >
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
        />
        <span>{task.text}</span>
      </div>

      <button onClick={() => deleteTask(task.id)}>✕</button>
    </motion.div>
  );
};