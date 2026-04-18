import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

/* ===================== VIEWS ===================== */

const Dashboard = ({ tasks }) => {
  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  return (
    <div className="dashboard">
      <h2>📊 Dashboard</h2>

      <div className="stats">
        <div>Total: {tasks.length}</div>
        <div>Done: {completed}</div>
        <div>Pending: {pending}</div>
      </div>
    </div>
  );
};

const Calendar = ({ tasks }) => {
  return (
    <div className="calendar">
      <h2>🗓 Calendar</h2>

      {tasks.length === 0 ? (
        <p className="empty">No scheduled tasks</p>
      ) : (
        tasks.map(t => (
          <div key={t.id} className="calendar-item">
            📅 {t.dueDate || "No date"} — {t.text}
          </div>
        ))
      )}
    </div>
  );
};

/* ===================== MAIN APP ===================== */

function App() {
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );

  const [input, setInput] = useState("");
  const [category, setCategory] = useState("General");
  const [search, setSearch] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [view, setView] = useState("dashboard");
  const [dark, setDark] = useState(true);

  /* SAVE LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  /* ADD TASK */
  const addTask = () => {
    if (!input.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: input,
        completed: false,
        category,
        dueDate
      }
    ]);

    setInput("");
    setDueDate("");
  };

  /* TOGGLE */
  const toggleTask = (id) => {
    setTasks(
      tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  /* DELETE */
  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  /* DRAG */
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    setTasks(items);
  };

  /* FILTER */
  const filteredTasks = tasks.filter(t =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  const completed = tasks.filter(t => t.completed).length;
  const pending = tasks.length - completed;

  const pieData = [
    { name: "Done", value: completed },
    { name: "Left", value: pending }
  ];

  const COLORS = ["#10b981", "#ef4444"];

  return (
    <div className={`app ${dark ? "dark" : "light"}`}>

      {/* ================= SIDEBAR ================= */}
    <div className="sidebar">
  <h2> Taskify </h2>

  {/* NAV ITEMS */}
  <button
    className={`nav-btn ${view === "dashboard" ? "active" : ""}`}
    onClick={() => setView("dashboard")}
  >
    📊 Dashboard
  </button>

  <button
    className={`nav-btn ${view === "calendar" ? "active" : ""}`}
    onClick={() => setView("calendar")}
  >
    🗓 Calendar
  </button>

  {/* THEME TOGGLE (NOW SAME STYLE AS NAV) */}
  <button
    className="nav-btn theme-toggle"
    onClick={() => setDark(!dark)}
  >
    {dark ? "🌙 Dark Mode" : "☀ Light Mode"}
  </button>
</div>

      {/* ================= MAIN ================= */}
      <div className="main">

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >

            {/* ================= DASHBOARD ================= */}
            {view === "dashboard" && (
              <>
                <Dashboard tasks={tasks} />

                {/* ================= TASK FORM ================= */}
                <div className="task-form-wrapper">

                  <div className="task-form-card">
                    <div className="form-title">Add New Task</div>

                    <input
                      className="input primary-input"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="What do you want to achieve?"
                    />

                    <div className="form-grid">
                      <select
                        className="input"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option>General</option>
                        <option>Study</option>
                        <option>Work</option>
                      </select>

                      <input
                        className="input"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>

                    <button className="add-btn" onClick={addTask}>
                      + Add Task
                    </button>
                  </div>

                  {/* ================= SEARCH ================= */}
                  <div className="search-card">
                    <div className="form-title small">Search Tasks</div>

                    <input
                      className="input search-input"
                      placeholder="Search tasks, category, keyword..."
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                </div>

                {/* ================= PIE CHART ================= */}
                <PieChart width={220} height={180}>
                  <Pie data={pieData} dataKey="value" outerRadius={60}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>

                {/* ================= TASK LIST ================= */}
                {filteredTasks.length === 0 ? (
                  <div className="empty">
                    <h3>No tasks yet 🚀</h3>
                    <p>Create your first task above</p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="tasks">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="task-container"
                        >
                          {filteredTasks.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <motion.div
                                  layout
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="task-item"
                                >
                                  <span>
                                    <b>{task.category}</b> — {task.text}
                                  </span>

                                  <div>
                                    <button onClick={() => toggleTask(task.id)}>
                                      ✔
                                    </button>
                                    <button onClick={() => deleteTask(task.id)}>
                                      ❌
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </>
            )}

            {/* ================= CALENDAR ================= */}
            {view === "calendar" && <Calendar tasks={tasks} />}

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;