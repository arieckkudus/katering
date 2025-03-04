import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./login.css";
import Swal from "sweetalert2";

function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Hapus token dan role jika ada di localStorage saat komponen dimuat
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/login", { name, password });

      Swal.fire({
        title: "Berhasil!",
        text: "Login Berhasil.",
        icon: "success",
        confirmButtonText: "OK",
      });

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.user.role);

      if (response.data.user?.role === "1") {
        navigate("/dashboard-admin");
      }

      if (response.data.user?.role === "2") {
        navigate("/dashboard-merchant");
      }

      if (response.data.user?.role === "3") {
        navigate("/dashboard-customer");
      }
    } catch (err) {
      setError("Login gagal, periksa kembali nama dan password.");
      console.error("Login Error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login Page</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              placeholder="Masukkan nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="register-link">
          Belum punya akun?{" "}
          <button className="btn-secondary" onClick={() => navigate("/register")}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
