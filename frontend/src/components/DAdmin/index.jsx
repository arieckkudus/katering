import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";

function DashboardAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "1") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");

      setTimeout(() => {
        navigate("/login");
      }, 0);
    }
  }, [navigate]);

  return (
    <Container>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard Admin
          </Typography>
          <Button color="inherit" onClick={() => navigate("/add-client")}>
            Add Client
          </Button>
          <Button color="inherit" onClick={() => navigate("/list-client")}>
            List Client
          </Button>
          <Button color="inherit" onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            navigate("/login");
          }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Selamat datang di Dashboard Admin
        </Typography>
        <Typography variant="body1">
          Kelola data klien dengan mudah menggunakan menu di atas.
        </Typography>
      </Box>
    </Container>
  );
}

export default DashboardAdmin;
