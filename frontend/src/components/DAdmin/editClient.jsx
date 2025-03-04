import React, { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom"; // useNavigate untuk routing di React Router v6
import api from "../../api";

function EditClient() {
  const { id } = useParams(); // Mendapatkan ID dari URL
  const navigate = useNavigate(); // Untuk navigasi setelah edit berhasil
  const [client, setClient] = useState({
    nama_perusahaan: "",
    alamat: "",
    kontak: "",
    deskripsi: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mengambil data client untuk di-edit (gunakan /get untuk mengambil data)
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await api.get(`/profilemerchant/${id}/get`); // Endpoint /get untuk mengambil data
        setClient(response.data.data); // Mengisi data client ke state
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  // Fungsi untuk menangani perubahan input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fungsi untuk menangani submit form (gunakan /edit untuk mengupdate data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.put(`/profilemerchant/${id}/edit`, client); // Endpoint /edit untuk update
      console.log("Client updated:", response.data);
      navigate("/list-client"); // Arahkan kembali ke halaman daftar setelah berhasil
    } catch (error) {
      console.error("Error updating client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Edit Client</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nama Perusahaan"
            name="nama_perusahaan"
            value={client.nama_perusahaan}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Alamat"
            name="alamat"
            value={client.alamat}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Kontak"
            name="kontak"
            value={client.kontak}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Deskripsi"
            name="deskripsi"
            value={client.deskripsi}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            style={{ marginTop: "20px" }}
          >
            {isSubmitting ? "Updating..." : "Update Client"}
          </Button>
        </form>
      )}
    </Container>
  );
}

export default EditClient;
