import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, MenuItem, Container, Typography, Box } from "@mui/material";
import api from "../../api";
import Swal from "sweetalert2";

function AddMerchant() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]); // Menyimpan daftar user dari API
  const [merchantData, setMerchantData] = useState({
    id_user: "",
    nama_perusahaan: "",
    alamat: "",
    kontak: "",
    deskripsi: "",
  });

  useEffect(() => {
    // Ambil daftar user dari API
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/get-user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(response.data.user); // Simpan daftar user ke state
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setMerchantData({ ...merchantData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await api.post("/profilemerchant/create", merchantData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Berhasil!",
        text: "Merchant berhasil ditambahkan.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/list-client");
    } catch (error) {
      console.error("Gagal menambahkan merchant:", error);
      Swal.fire({
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan merchant.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Fungsi untuk navigasi ke dashboard-admin
  const handleBack = () => {
    navigate("/dashboard-admin");
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Tambah Merchant
        </Typography>

        {/* Tombol Kembali */}
        <Button
          variant="outlined"
          color="default"
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Kembali ke Dashboard
        </Button>

        <form onSubmit={handleSubmit}>
          {/* Dropdown User */}
          <TextField
            select
            fullWidth
            label="Pilih User"
            name="id_user"
            value={merchantData.id_user}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          >
            {users.length > 0 ? (
              users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Loading...</MenuItem>
            )}
          </TextField>

          {/* Nama Perusahaan */}
          <TextField
            fullWidth
            label="Nama Perusahaan"
            name="nama_perusahaan"
            value={merchantData.nama_perusahaan}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          {/* Alamat */}
          <TextField
            fullWidth
            label="Alamat"
            name="alamat"
            value={merchantData.alamat}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          {/* Kontak */}
          <TextField
            fullWidth
            label="Kontak"
            name="kontak"
            value={merchantData.kontak}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          {/* Deskripsi */}
          <TextField
            fullWidth
            label="Deskripsi"
            name="deskripsi"
            value={merchantData.deskripsi}
            onChange={handleChange}
            required
            sx={{ mb: 2 }}
          />

          {/* Tombol Simpan */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Simpan Merchant
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddMerchant;
