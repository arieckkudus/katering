import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate dari react-router-dom
import api from "../../api";

function ListClient() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inisialisasi useNavigate

  // Fetch data clients saat halaman dimuat
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get("/profilemerchant/get");
        console.log("API Response:", response.data); // Cek di console
  
        const data = response.data.data || []; // Gunakan default [] jika undefined
        setClients(data);
        console.log("Clients state:", data); // Cek apakah state terupdate
      } catch (error) {
        console.error("Error fetching client data:", error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchClients();
  }, []);

  // Fungsi untuk menangani edit
  const handleEdit = (clientId) => {
    // Navigasi ke halaman edit-client dengan clientId
    navigate(`/edit-client/${clientId}`);
  };

  // Fungsi untuk menghapus client
  const handleDelete = async (clientId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus client ini?")) {
      try {
        await api.post(`/profilemerchant/${clientId}/delete`); // Panggil API untuk menghapus
        alert("Client berhasil dihapus!");
        
        // Refresh data client setelah penghapusan
        setClients((prevClients) => prevClients.filter(client => client.id !== clientId));
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Terjadi kesalahan saat menghapus client.");
      }
    }
  };

  // Fungsi untuk navigasi ke dashboard-admin
  const handleBack = () => {
    navigate("/dashboard-admin");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>List Client</Typography>
      <Button
        variant="contained"
        color="default"
        onClick={handleBack}
        style={{ marginBottom: "20px" }}
      >
        Kembali ke Dashboard
      </Button>
      
      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ID User</TableCell>
                <TableCell>Nama Perusahaan</TableCell>
                <TableCell>Alamat</TableCell>
                <TableCell>Kontak</TableCell>
                <TableCell>Deskripsi</TableCell>
                <TableCell>Aksi</TableCell> {/* Kolom Aksi */}
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.id_user}</TableCell>
                    <TableCell>{client.nama_perusahaan}</TableCell>
                    <TableCell>{client.alamat}</TableCell>
                    <TableCell>{client.kontak}</TableCell>
                    <TableCell>{client.deskripsi}</TableCell>
                    <TableCell>
                      {/* Tombol Edit dan Delete */}
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(client.id)} // Fungsi navigasi edit
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(client.id)} // Logika delete
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">Tidak ada data</TableCell> {/* Kolom Aksi menambah satu */}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default ListClient;
