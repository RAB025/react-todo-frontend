import React, { useEffect, useState } from "react";

export default function TodoApp() {
  const API_URL = "http://127.0.0.1:5000";

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/tasks`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return alert("Task title required");
    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });
    setTitle("");
    setDescription("");
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>To-Do Manager</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />
        <button onClick={addTask} style={{ width: "100%", padding: "10px", marginTop: "8px" }}>
          Add Task
        </button>
      </div>

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "10px",
          }}
        >
          <h3 style={{ textDecoration: task.completed ? "line-through" : "none" }}>
            {task.title}
          </h3>
          <p>{task.description}</p>

          <button onClick={() => toggleComplete(task)}>
            {task.completed ? "Undo" : "Mark as Done"}
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            style={{ marginLeft: "10px", color: "red" }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
