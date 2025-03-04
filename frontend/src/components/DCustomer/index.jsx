import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DashboardCustomer() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "3") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login"); // Redirect ke login jika tidak sesuai
    }
  }, [navigate]);

  return (
    <div>
      <h1>Dashboard Customer</h1>
      <p>Selamat datang di halaman cus.</p>
    </div>
  );
}

export default DashboardCustomer;
