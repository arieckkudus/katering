import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams untuk ambil ID dari URL
import api from "../../api";

function Invoice() {
  const { id_checkout } = useParams(); // Ambil ID checkout dari URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch invoice data dari API
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token"); // Ambil token untuk Auth
        const response = await api.get(`/customer/${id_checkout}/invoice`, {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
          },
        });

        console.log("API Response:", response.data); // Debugging
        setInvoice(response.data.invoice); // Simpan data invoice di state
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id_checkout]);

  // Fungsi kembali ke Dashboard
  const handleBack = () => {
    navigate("/dashboard-admin");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Detail Invoice</Typography>
      <Button variant="contained" color="default" onClick={handleBack} style={{ marginBottom: "20px" }}>
        Kembali ke Dashboard
      </Button>

      {loading ? (
        <CircularProgress />
      ) : invoice ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID Invoice</TableCell>
                <TableCell>Nama Item</TableCell>
                <TableCell>Jumlah Porsi</TableCell>
                <TableCell>Harga Satuan</TableCell>
                <TableCell>Total Harga</TableCell>
                <TableCell>Tanggal Pengiriman</TableCell>
                <TableCell>Nama Perusahaan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.nama_item}</TableCell>
                <TableCell>{invoice.jumlah_porsi}</TableCell>
                <TableCell>{invoice.harga_satuan}</TableCell>
                <TableCell>{invoice.total_harga}</TableCell>
                <TableCell>{invoice.tanggal_pengiriman_makanan}</TableCell>
                <TableCell>{invoice.nama_perusahaan}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="error">Invoice tidak ditemukan.</Typography>
      )}
    </Container>
  );
}

export default Invoice;
