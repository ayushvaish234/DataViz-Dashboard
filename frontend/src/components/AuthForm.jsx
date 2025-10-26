import React, { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function AuthForm() {
  const { saveToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });
        saveToken(res.data.access_token, res.data.role);
        alert("Logged in successfully");
      } else {
        await API.post("/auth/signup", { email, password });
        alert("Signup successful. Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      if (err.response) {
        // Backend responded with an error
        alert(err.response.data.detail || "Action failed");
      } else if (err.request) {
        // Request made but no response
        alert("No response from server. Check backend.");
      } else {
        // Other errors
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded w-96">
      <h2 className="text-lg font-semibold mb-2">
        {isLogin ? "Login" : "Sign up"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          className="border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign up"}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-2 text-sm underline"
      >
        Switch to {isLogin ? "Sign up" : "Login"}
      </button>
    </div>
  );
}
