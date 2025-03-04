import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Container, CssBaseline, Toolbar, Typography, Button } from "@mui/material";

function DashboardMerchant() {
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "2") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login"); // Redirect ke login jika tidak sesuai
    }
  }, [navigate]);

  const handleMenuItemClick = (item) => {
    setSelectedMenu(item);
    // Navigasi ke halaman yang sesuai, misalnya ke halaman list atau profile
    if (item === "List") {
      navigate("/list-menuitem");
    } else if (item === "Add Menu Item") {
      navigate("/add-menuitem");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar dengan tombol navigasi */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Dashboard Customer
          </Typography>
          <Button color="inherit" onClick={() => handleMenuItemClick("List")}>
            List
          </Button>
          <Button color="inherit" onClick={() => handleMenuItemClick("Add Menu Item")}>
            Add Menu Item
          </Button>
        </Toolbar>
      </AppBar>

      {/* Konten Utama */}
      <main style={{ flexGrow: 1, padding: "24px", marginTop: "64px" }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Selamat datang di Dashboard Merchant
          </Typography>
          <Typography variant="body1" paragraph>
            Ini adalah halaman dashboard untuk Merchant.
          </Typography>
        </Container>
      </main>
    </div>
  );
}

export default DashboardMerchant;
