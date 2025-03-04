import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Container,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete"; // Icon untuk tombol delete
import EditIcon from "@mui/icons-material/Edit"; // Icon untuk tombol edit
import api from "../../api"; // Pastikan path ke api.js sudah benar

function MenuItemList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook untuk navigasi

  // Mengambil data dari API
  useEffect(() => {
    const fetchMenuItems = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await api.get("/menuitem/profilemerchant", {
          headers: {
            Authorization: `Bearer ${token}`, // Menambahkan Bearer token
          },
        });
        setMenuItems(response.data.data); // Menyimpan data menu ke state
      } catch (err) {
        setError("Gagal mengambil data menu item. Silakan coba lagi.");
      } finally {
        setLoading(false); // Mengubah status loading setelah data diambil
      }
    };

    fetchMenuItems();
  }, []);

  // Fungsi untuk menangani klik menu item untuk edit
  const handleEdit = (id) => {
    navigate(`/menuitem/edit/${id}`); // Navigasi ke halaman edit menu item
  };

  // Fungsi untuk menghapus menu item
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    if (window.confirm("Apakah Anda yakin ingin menghapus menu item ini?")) {
      try {
        const response = await api.delete(`/menuitem/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Menu item berhasil dihapus!");
        setMenuItems(menuItems.filter((item) => item.id !== id)); // Menghapus item dari daftar
      } catch (err) {
        alert("Gagal menghapus menu item.");
      }
    }
  };

  // Fungsi untuk kembali ke Dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard-merchant"); // Navigasi kembali ke dashboard-merchant
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
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
        Daftar Menu Item
      </Typography>
      <Button variant="outlined" onClick={handleBackToDashboard} sx={{ marginBottom: 2 }}>
        Kembali ke Dashboard
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Item</TableCell>
              <TableCell>Deskripsi</TableCell>
              <TableCell>Harga</TableCell>
              <TableCell>Foto</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nama_item}</TableCell>
                <TableCell>{item.nama_deskripsi}</TableCell>
                <TableCell>{item.harga}</TableCell>
                <TableCell>
                  <img
                    src={`http://127.0.0.1:8000/${item.foto}`}
                    alt={item.nama_item}
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(item.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default MenuItemList;
