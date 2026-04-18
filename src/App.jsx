import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis
} from "recharts";

function App() {
  // ===== STATE =====
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  const [input, setInput] = useState("");
  const [category, setCategory] = useState("General");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [dueDate, setDueDate] = useState("");

  // ===== PRIORITY =====
  const getSmartPriority = (text) => {
    const t = text.toLowerCase();
    if (t.includes("exam")) return "high";
    if (t.includes("project")) return "medium";
    return "low";
  };

  // ===== SAVE =====
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ===== ADD TASK =====
  const addTask = () => {
    if (!input.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: input,
        completed: false,
        priority: getSmartPriority(input),
        category,
        dueDate,
        notified: false
      }
    ]);

    setInput("");
    setDueDate("");
  };

  // ===== TOGGLE =====
  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // ===== DELETE =====
  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // ===== DRAG =====
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setTasks(items);
  };

  // ===== FILTER =====
  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  // ===== PROGRESS =====
  const progress =
    tasks.length === 0
      ? 0
      : Math.round(
          (tasks.filter((t) => t.completed).length / tasks.length) * 100
        );

  // ===== ANALYTICS FIX =====
  const weekly = [0, 0, 0, 0, 0, 0, 0];

  tasks.forEach((task) => {
    if (task.completed && task.dueDate) {
      const day = new Date(task.dueDate).getDay();
      weekly[day]++;
    }
  });

  const lineData = weekly.map((v, i) => ({
    day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
    tasks: v
  }));

  // ===== PIE =====
  const pieData = [
    { name: "Done", value: tasks.filter((t) => t.completed).length },
    { name: "Left", value: tasks.filter((t) => !t.completed).length }
  ];

  const COLORS = ["#10b981", "#ef4444"];

  // ===== NOTIFICATIONS FIX =====
  useEffect(() => {
    if (!("Notification" in window)) return;

    Notification.requestPermission();

    const interval = setInterval(() => {
      const today = new Date().toDateString();

      setTasks((prev) =>
        prev.map((task) => {
          if (
            task.dueDate &&
            !task.completed &&
            !task.notified &&
            new Date(task.dueDate).toDateString() === today
          ) {
            new Notification("🔔 Task Reminder", {
              body: `Due Today: ${task.text}`
            });

            return { ...task, notified: true };
          }
          return task;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // ===== UI =====
  return (
    <div className="card">
      <h1>⚡ Taskify Pro</h1>

      {/* INPUT */}
      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New Task..."
        />
        <button className="add-btn" onClick={addTask}>
          + Add
        </button>
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <select onChange={(e) => setCategory(e.target.value)}>
          <option>General</option>
          <option>Study</option>
          <option>Work</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search tasks..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* PROGRESS */}
      <div className="progress-bar">
        <div className="fill" style={{ width: `${progress}%` }} />
      </div>

      {/* ANALYTICS */}
      <div className="analytics">
        <h3>📊 Dashboard</h3>

        <div className="stats-grid">
          <div className="stat-box">
            Total: {tasks.length}
          </div>
          <div className="stat-box">
            Done: {tasks.filter((t) => t.completed).length}
          </div>
          <div className="stat-box">
            Pending: {tasks.filter((t) => !t.completed).length}
          </div>
          <div className="stat-box">
            {progress}% Complete
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <LineChart width={300} height={200} data={lineData}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="tasks" stroke="#8b5cf6" />
      </LineChart>

      <PieChart width={250} height={200}>
        <Pie data={pieData} dataKey="value" outerRadius={70}>
          {pieData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* LIST */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <AnimatePresence>
                {filteredTasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <motion.div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`task-item ${task.priority}`}
                      >
                        <span onClick={() => toggleTask(task.id)}>
                          {task.text}
                        </span>

                        <button onClick={() => deleteTask(task.id)}>
                          ❌
                        </button>
                      </motion.div>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;