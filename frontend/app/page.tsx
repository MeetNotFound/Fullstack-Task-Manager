"use client";

import { useState, useEffect } from "react";

type Task = {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
};

export default function Dashboard() {
  // Auth State
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState("");

  // Task State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Check for token on load
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
  }, []);

  // Fetch tasks when token changes
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const endpoint = isLogin ? "/token" : "/register";
    
    // OAuth2 expects form data for login
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const body = isLogin ? formData : JSON.stringify({ username, password });
    const headers = isLogin 
      ? { "Content-Type": "application/x-www-form-urlencoded" }
      : { "Content-Type": "application/json" };

    try {
      const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: headers,
        body: body,
      });
      const data = await res.json();
      
      if (res.ok) {
        setToken(data.access_token);
        localStorage.setItem("token", data.access_token);
      } else {
        setAuthError(data.detail || "Authentication failed");
      }
    } catch (error) {
      setAuthError("Network error. Is the server running?");
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setTasks([]);
  };

  const fetchTasks = async () => {
    const res = await fetch("http://127.0.0.1:8000/tasks/", {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) return logout();
    if (res.ok) setTasks(await res.json());
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://127.0.0.1:8000/tasks/", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, status: "pending", priority: "medium" }),
    });
    setTitle(""); setDescription(""); fetchTasks();
  };

  const updateStatus = async (id: number, newStatus: string) => {
    await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`http://127.0.0.1:8000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  // --- Auth Screen ---
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <form onSubmit={handleAuth} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          {authError && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{authError}</p>}
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
          <p className="text-center text-sm text-gray-500 cursor-pointer hover:text-blue-600" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </p>
        </form>
      </div>
    );
  }

  // --- Dashboard Screen ---
  const filteredTasks = tasks.filter(t => filterStatus === "all" || t.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Task Dashboard</h1>
            <p className="text-gray-500">Securely logged in.</p>
          </div>
          <button onClick={logout} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
            Sign Out
          </button>
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200"><p className="text-sm text-gray-500 font-medium">Total</p><p className="text-2xl font-bold">{tasks.length}</p></div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100"><p className="text-sm text-blue-600 font-medium">Pending</p><p className="text-2xl font-bold text-blue-900">{tasks.filter(t => t.status === 'pending').length}</p></div>
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100"><p className="text-sm text-yellow-600 font-medium">In Progress</p><p className="text-2xl font-bold text-yellow-900">{tasks.filter(t => t.status === 'in_progress').length}</p></div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100"><p className="text-sm text-green-600 font-medium">Completed</p><p className="text-2xl font-bold text-green-900">{tasks.filter(t => t.status === 'completed').length}</p></div>
        </div>

        {/* Add Task */}
        <form onSubmit={addTask} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex gap-4">
          <input type="text" placeholder="New task title..." value={title} onChange={(e) => setTitle(e.target.value)} required className="flex-1 px-4 py-3 border rounded-lg bg-gray-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} className="flex-1 px-4 py-3 border rounded-lg bg-gray-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Add</button>
        </form>

        {/* Task List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <h2 className="font-semibold text-gray-800">Your Tasks</h2>
             <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm bg-white text-slate-900 cursor-pointer focus:ring-2 focus:ring-blue-500">
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
             </select>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredTasks.length === 0 ? <p className="p-8 text-center text-gray-500">No tasks found.</p> : 
              filteredTasks.map(task => (
                <div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                  <div>
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <select value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)} className="p-2 border rounded-lg text-sm bg-white text-slate-900 cursor-pointer hover:bg-gray-50">
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg font-medium text-sm transition">Delete</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>

      </div>
    </div>
  );
}