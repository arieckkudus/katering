import React, { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../../api";

function AddItem() {
  const [formData, setFormData] = useState({
    nama_item: "",
    nama_deskripsi: "",
    harga: "",
    foto: null,
  });

  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto") {
      setFormData({ ...formData, foto: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("nama_item", formData.nama_item);
    data.append("nama_deskripsi", formData.nama_deskripsi);
    data.append("harga", formData.harga);
    if (formData.foto) {
      data.append("foto", formData.foto);
    }

    const token = localStorage.getItem("token");

    try {
      const response = await api.post("/menuitem/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Menambahkan Bearer token
        },
      });

      console.log(response.data); // Log data untuk melihat hasilnya
      alert("Menu item berhasil ditambahkan!");
      // Reset form setelah submit
      setFormData({ nama_item: "", nama_deskripsi: "", harga: "", foto: null });
    } catch (error) {
      console.error("Error adding menu item:", error);
      alert("Gagal menambahkan menu item. Silakan coba lagi.");
    }
  };

  // Fungsi untuk navigasi ke DashboardMerchant
  const goBackToDashboard = () => {
    navigate("/dashboard-merchant"); // Arahkan ke dashboard-merchant
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tambah Menu Item
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nama Item"
          variant="outlined"
          fullWidth
          margin="normal"
          name="nama_item"
          value={formData.nama_item}
          onChange={handleChange}
        />
        <TextField
          label="Nama Deskripsi"
          variant="outlined"
          fullWidth
          margin="normal"
          name="nama_deskripsi"
          value={formData.nama_deskripsi}
          onChange={handleChange}
        />
        <TextField
          label="Harga"
          variant="outlined"
          fullWidth
          margin="normal"
          name="harga"
          value={formData.harga}
          onChange={handleChange}
        />
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: "16px" }}>
          Tambah Menu Item
        </Button>
      </form>
      
      {/* Tombol untuk kembali ke Dashboard */}
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={goBackToDashboard} 
        sx={{ marginTop: "16px", marginLeft: "8px" }}
      >
        Kembali ke Dashboard
      </Button>
    </Container>
  );
}

export default AddItem;
