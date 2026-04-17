import { useState, useEffect } from "react";
import "./App.css";

/* ICON IMPORTS */

import {
  FaPlus,
  FaTrash,
  FaMoon,
  FaSun,
  FaSearch,
  FaBook,
  FaBriefcase,
  FaUser,
  FaHeartbeat,
  FaBars,
  FaClipboardList
} from "react-icons/fa";

function App() {

  // STATES
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("study");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // LOAD TASKS
  useEffect(() => {

    const savedTasks =
      JSON.parse(localStorage.getItem("tasks")) || [];

    setTasks(savedTasks);

  }, []);

  // SAVE TASKS
  useEffect(() => {

    localStorage.setItem(
      "tasks",
      JSON.stringify(tasks)
    );

  }, [tasks]);

  // DARK MODE
  useEffect(() => {

    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

  }, [darkMode]);

  // ADD TASK
  const addTask = () => {

    if (input.trim() === "") return;

    const newTask = {
      text: input,
      category: category,
      date: date,
      priority: priority,
      completed: false
    };

    setTasks([...tasks, newTask]);

    setInput("");
    setDate("");
    setPriority("medium");
  };

  // TOGGLE COMPLETE
  const toggleTask = (index) => {

    const updated = [...tasks];

    updated[index].completed =
      !updated[index].completed;

    setTasks(updated);
  };

  // DELETE TASK
  const deleteTask = (index) => {

  const taskElements =
    document.querySelectorAll(".task-item");

  taskElements[index].classList.add("removing");

  setTimeout(() => {

    const updated =
      tasks.filter((_, i) => i !== index);

    setTasks(updated);

  }, 300);

};

  // PROGRESS
  const completed =
    tasks.filter(t => t.completed).length;

  const progress =
    tasks.length === 0
      ? 0
      : (completed / tasks.length) * 100;

  return (

    <div className="background-wrapper">

      {/* PARTICLES */}

      <div className="particles">

        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>

      </div>

      {/* LAYOUT */}

      <div className="layout">

        {/* SIDEBAR */}

        <div className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}>

          <h2 className="sidebar-title">
            Taskify
          </h2>

          <button
            className={`side-btn ${
              filter === "all" ? "active" : ""
            }`}
            onClick={() =>
              setFilter("all")
            }
          >
            <FaClipboardList /> All Tasks
          </button>

          <button
            className={`side-btn ${
              filter === "study" ? "active" : ""
            }`}
            onClick={() =>
              setFilter("study")
            }
          >
            <FaBook /> Study
          </button>

          <button
            className={`side-btn ${
              filter === "work" ? "active" : ""
            }`}
            onClick={() =>
              setFilter("work")
            }
          >
            <FaBriefcase /> Work
          </button>

          <button
            className={`side-btn ${
              filter === "personal" ? "active" : ""
            }`}
            onClick={() =>
              setFilter("personal")
            }
          >
            <FaUser /> Personal
          </button>

          <button
            className={`side-btn ${
              filter === "health" ? "active" : ""
            }`}
            onClick={() =>
              setFilter("health")
            }
          >
            <FaHeartbeat /> Health
          </button>

        </div>

        {/* OVERLAY */}

        {sidebarOpen && (

          <div
            className="overlay"
            onClick={() =>
              setSidebarOpen(false)
            }
          />

        )}

        {/* MAIN CONTENT */}

        <div className="app-container">

          {/* HEADER */}

          <div className="header-box">

            <div className="header-row">

              {/* MOBILE MENU BUTTON */}

              <button
                className="menu-btn"
                onClick={() =>
                  setSidebarOpen(!sidebarOpen)
                }
              >
                <FaBars />
              </button>

              <div>

                <h1>Taskify</h1>

                <p className="subtitle">
                  Stay organized. Stay productive.
                </p>

              </div>

              <button
                className="dark-toggle"
                onClick={() =>
                  setDarkMode(!darkMode)
                }
              >
                {darkMode
                  ? <FaSun />
                  : <FaMoon />}
              </button>

            </div>

          </div>

          {/* PROGRESS */}

          <div className="progress-box">

            <p>
              Progress: {progress.toFixed(0)}%
            </p>

            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`
                }}
              />

            </div>

          </div>

          {/* INPUT SECTION */}

          <div className="input-section">

            <select
              className="task-select"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="study">
                Study
              </option>

              <option value="work">
                Work
              </option>

              <option value="personal">
                Personal
              </option>

              <option value="health">
                Health
              </option>

            </select>

            <input
              type="text"
              className="task-input"
              placeholder="Enter task..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
            />

            <select
              className="task-select"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >

              <option value="high">
                High
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="low">
                Low
              </option>

            </select>

            <input
              type="date"
              className="task-input"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

            <button
              className="btn"
              onClick={addTask}
            >
              <FaPlus /> Add
            </button>

          </div>

          {/* SEARCH */}

          <div className="search-box">

            <FaSearch className="search-icon" />

            <input
              type="text"
              className="task-input search-input"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* TASK LIST */}

          <ul className="task-list">

            {tasks.length === 0 ? (

              <p className="empty">
                No tasks yet. Add your first task!
              </p>

            ) : (

              tasks

                .sort((a, b) => {

                  const order = {
                    high: 1,
                    medium: 2,
                    low: 3
                  };

                  return order[a.priority]
                    - order[b.priority];

                })

                .filter(task => {

                  const matchesSearch =
                    task.text
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      );

                  const matchesFilter =
                    filter === "all" ||
                    task.category === filter;

                  return matchesSearch &&
                         matchesFilter;

                })

                .map((task, index) => (

                  <li
                    key={index}
                    className={
                      `task-item ${
                        task.completed
                          ? "completed"
                          : ""
                      }`
                    }
                  >

                    <div
                      onClick={() =>
                        toggleTask(index)
                      }
                    >

                      <span
                        className={`priority ${task.priority}`}
                      >
                        {task.priority}
                      </span>

                      <span
                        className={`category ${task.category}`}
                      >

                        {task.category === "study" && <FaBook />}
                        {task.category === "work" && <FaBriefcase />}
                        {task.category === "personal" && <FaUser />}
                        {task.category === "health" && <FaHeartbeat />}

                        {task.category}

                      </span>

                      {task.text}

                      {task.date && (

                        <p className="task-date">
                          {task.date}
                        </p>

                      )}

                    </div>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteTask(index)
                      }
                    >
                      <FaTrash />
                    </button>

                  </li>

                ))

            )}

          </ul>

        </div>

      </div>

    </div>

  );
}

export default App;