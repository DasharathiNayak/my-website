import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", form);

      setMessage(response.data.message);

      if (response.data.message === "Login Successful") {
        localStorage.setItem("user_id", response.data.user_id);
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage("Invalid Email or Password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>TestCraftAI</h1>
        <p>AI Powered Test Case Generator</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            Login
          </button>

        </form>

        <h5>{message}</h5>

      </div>
    </div>
  );
}

export default Login;