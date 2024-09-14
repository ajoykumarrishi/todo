import React, { useState, useEffect } from "react";
import AddTaskComponent from "./components/add-task-component.js";
import TaskComponent from "./components/task-component.js";
import {
  fetchTasks,
  addTask as apiAddTask,
  deleteTask as apiDeleteTask,
  changeActiveStatus as apiChangeActiveStatus,
} from "./services/api-service.js";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await fetchTasks();
      setTasks(response.tasks);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  const getAllTasks = () => setFilter("all");
  const getActiveTasks = () => setFilter("active");
  const getCompletedTasks = () => setFilter("completed");

  const addTask = async (e) => {
    if (e.key === "Enter") {
      try {
        const response = await apiAddTask(e.target.value);
        setTasks([...tasks, response.task]);
        e.target.value = "";
      } catch (error) {
        console.error("Failed to add task:", error);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await apiDeleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const changeActiveStatus = async (id, completed) => {
    try {
      await apiChangeActiveStatus(id, completed);
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    } catch (error) {
      console.error("Failed to change task status:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4 display-4 text-primary">
        My Playful To-Do List
      </h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-body">
              <AddTaskComponent addTask={addTask} />
              <div className="btn-group w-100 mb-4" role="group">
                <button
                  className={`btn ${
                    filter === "all" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={getAllTasks}
                >
                  All
                </button>
                <button
                  className={`btn ${
                    filter === "active" ? "btn-primary" : "btn-outline-primary"
                  }`}
                  onClick={getActiveTasks}
                >
                  Active
                </button>
                <button
                  className={`btn ${
                    filter === "completed"
                      ? "btn-primary"
                      : "btn-outline-primary"
                  }`}
                  onClick={getCompletedTasks}
                >
                  Completed
                </button>
              </div>
              <ul className="list-group">
                {filteredTasks.map((task) => (
                  <TaskComponent
                    key={task.id}
                    changeActiveStatus={() =>
                      changeActiveStatus(task.id, task.completed)
                    }
                    task={task}
                    deleteTask={() => deleteTask(task.id)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
