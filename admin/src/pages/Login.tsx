import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      console.log("Login response:", result); // Debugging
  
      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }
  
      if (!result.data || !result.data._id) {
        throw new Error("User ID is missing in response");
      }
  
      localStorage.setItem("userData", JSON.stringify(result.data)); // Store the entire user object
      localStorage.setItem("userId", result.data._id); // Store only the userId separately
  
      alert("Login Successful!");
      navigate("/chats");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "300px", margin: "auto" }}>
      <h2>Login</h2>

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={handleLogin} style={{ width: "100%", padding: "10px" }}>
        Login
      </button>
    </div>
  );
}