import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api"; // Pastikan path ke api.js sudah benar

function MenuItemEdit() {
  const [formData, setFormData] = useState({
    nama_item: "",
    nama_deskripsi: "",
    harga: "",
    foto: null,
    foto_url: "", // Menyimpan URL foto untuk menampilkan gambar yang sudah ada
  });

  const [loading, setLoading] = useState(true); // Status loading untuk UI
  const [error, setError] = useState(null); // Menyimpan error
  const { id } = useParams(); // Mengambil ID dari URL
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItem = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get(`/menuitem/${id}/get`, {
          headers: {
            Authorization: `Bearer ${token}`, // Menambahkan Bearer token
          },
        });

        const data = response.data.data;
        setFormData({
          nama_item: data.nama_item,
          nama_deskripsi: data.nama_deskripsi,
          harga: data.harga,
          foto: null, // Tidak menampilkan foto di form, tetapi akan disertakan dalam update
          foto_url: data.foto ? `http://127.0.0.1:8000/${data.foto}` : "", // Menampilkan URL foto
        });
      } catch (err) {
        setError("Gagal mengambil data menu item. Silakan coba lagi.");
      } finally {
        setLoading(false); // Mengubah status loading setelah data diambil
      }
    };

    fetchMenuItem();
  }, [id]);

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
      data.append("foto", formData.foto); // Menambahkan foto baru jika ada
    }

    const token = localStorage.getItem("token");

    try {
      const response = await api.post(`/menuitem/${id}/edit`, data, { // Mengubah URL untuk update
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Menu item berhasil diperbarui!");
      navigate("/list-menuitem"); // Navigasi kembali ke daftar
    } catch (err) {
      console.error("Error updating menu item:", err);
      alert("Gagal memperbarui menu item.");
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6" gutterBottom>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Coba Lagi
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Menu Item
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
        
        {/* Menampilkan foto yang sudah ada */}
        {formData.foto_url && (
          <Box sx={{ marginBottom: "16px" }}>
            <Typography variant="body1">Foto Menu Item:</Typography>
            <img
              src={formData.foto_url}
              alt="Menu Item"
              style={{ maxWidth: "200px", maxHeight: "200px", marginTop: "8px" }}
            />
          </Box>
        )}
        
        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" type="submit" sx={{ marginTop: "16px" }}>
          Update Menu Item
        </Button>
      </form>

      {/* Tombol Kembali ke Dashboard Merchant */}
      <Button
        variant="outlined"
        color="secondary"
        sx={{ marginTop: "16px" }}
        onClick={() => navigate("/dashboard-merchant")}
      >
        Kembali ke Dashboard Merchant
      </Button>
    </Container>
  );
}

export default MenuItemEdit;
