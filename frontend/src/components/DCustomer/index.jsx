import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Menu,
  MenuItem,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import api from "../../api";

function DashboardCustomer() {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState(null);
  const [cartAnchor, setCartAnchor] = useState(null);
  const [invoiceAnchor, setInvoiceAnchor] = useState(null);
  const [openCheckoutDialog, setOpenCheckoutDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [jumlahPorsi, setJumlahPorsi] = useState(1);
  const [tanggalPemesanan, setTanggalPemesanan] = useState("");
  const [openInvoiceDialog, setOpenInvoiceDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleDetailInvoice = (item) => {
    console.log(item);
    
    setSelectedInvoice(item);
    setOpenInvoiceDialog(true);
  };

  const handleCloseDetailInvoice = () => {
    setOpenInvoiceDialog(false);
    setSelectedInvoice(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "3") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setTimeout(() => navigate("/login"), 0);
    } else {
      fetchMenuItems();
      fetchCartItems();
      fetchInvoices();
    }
  }, [navigate]);

  const fetchMenuItems = () => {
    api
      .get("/menuitem/get")
      .then((res) => {
        if (res.data.status === "success") {
          setMenuItems(res.data.data);
        } else {
          setError(res.data.message || "Gagal mengambil data menu.");
        }
      })
      .catch(() => setError("Terjadi kesalahan dalam mengambil data."));
  };

  const fetchCartItems = () => {
    api
      .get("/customer/cart")
      .then((res) => {
        if (res.data.status === "success") {
          setCartItems(res.data.data);
        }
      })
      .catch(() => console.error("Gagal mengambil data keranjang"));
  };

  const fetchInvoices = () => {
    api
      .get(`/customer/invoice`)
      .then((res) => {
        console.log(res);

        if (res.data.data) {
          setInvoices(res.data.data);
        }
      })
      .catch(() => console.error("Gagal mengambil data invoice"));
  };

  const handleOpenCart = (event) => setCartAnchor(event.currentTarget);
  const handleCloseCart = () => setCartAnchor(null);

  const handleOpenInvoice = (event) => setInvoiceAnchor(event.currentTarget);
  const handleCloseInvoice = () => setInvoiceAnchor(null);

  const handleOpenCheckout = (item) => {
    setSelectedItem(item);
    setOpenCheckoutDialog(true);
  };

  const handleCloseCheckout = () => {
    setOpenCheckoutDialog(false);
    setSelectedItem(null);
    setJumlahPorsi(1);
  };

  const handleCheckout = () => {
    if (!selectedItem) return;

    api
      .post(`/customer/${selectedItem.id}/checkout`, {
        jumlah_porsi: jumlahPorsi,
        tanggal_pengiriman_makanan: tanggalPemesanan, // Tambahkan tanggal pemesanan
      })
      .then((res) => {
        if (res.data.status === "success") {
          fetchCartItems();
          handleCloseCheckout();
        }
      })
      .catch(() => console.error("Gagal menambahkan ke keranjang"));
  };

  const handlecheckoutCart = (item) => {
    if (!item) return;

    api
      .put(`/customer/cart/checkout/${item.id}`, { status: 2 }) // Perbaikan objek request
      .then((res) => {
        if (res.data.status === "success") {
          fetchCartItems(); // Perbarui daftar keranjang
          handleCloseCheckout(); // Tutup modal (jika ada)
        }
      })
      .catch(() => console.error("Gagal menambahkan ke checkout"));
  };
  useEffect(() => {
    return () => {
      console.log(invoices);
    };
  }, [invoices]);

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard Customer
          </Typography>
          <IconButton color="inherit" onClick={handleOpenCart}>
            <ShoppingCartIcon />
          </IconButton>
          <Menu
            anchorEl={cartAnchor}
            open={Boolean(cartAnchor)}
            onClose={handleCloseCart}
          >
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <MenuItem key={item.id}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        item.menu_item?.foto
                          ? `http://127.0.0.1:8000/${item.menu_item.foto}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={item.menu_item?.nama_item || "Menu Tidak Ditemukan"}
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: 10,
                        borderRadius: 5,
                      }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {item.menu_item?.nama_item || "Menu Tidak Ditemukan"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.jumlah_porsi}x - Rp{" "}
                        {item.total_harga.toLocaleString("id-ID")}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        onClick={() => handlecheckoutCart(item)}
                      >
                        Beli
                      </Button>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem>Tidak ada item di keranjang</MenuItem>
            )}
          </Menu>

          <IconButton color="inherit" onClick={handleOpenInvoice}>
            <ReceiptIcon />
          </IconButton>
          <Menu
            anchorEl={invoiceAnchor}
            open={Boolean(invoiceAnchor)}
            onClose={handleCloseInvoice}
          >
            {invoices.length > 0 ? (
              invoices.map((item) => (
                <MenuItem key={item.id}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        item.invoice_item?.foto
                          ? `http://127.0.0.1:8000/${item.invoice_item.foto}`
                          : "https://via.placeholder.com/50"
                      }
                      alt={
                        item.invoice_item?.nama_item || "Menu Tidak Ditemukan"
                      }
                      style={{
                        width: 50,
                        height: 50,
                        marginRight: 10,
                        borderRadius: 5,
                      }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {item.invoice_item?.nama_item || "Menu Tidak Ditemukan"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.jumlah_porsi}x - Rp{" "}
                        {item.total_harga.toLocaleString("id-ID")}
                      </Typography>
                      <Button
                        variant="contained"
                        sx={{ mt: 1 }}
                        onClick={() => handleDetailInvoice(item)}
                      >
                        Rincian
                      </Button>
                      <Dialog
                        open={openInvoiceDialog}
                        onClose={handleCloseDetailInvoice}
                      >
                        <DialogTitle>Rincian Invoice</DialogTitle>
                        <DialogContent>
                          {selectedInvoice && (
                            <>
                              <img
                                  src={
                                    selectedInvoice.invoice_item?.foto
                                      ? `http://127.0.0.1:8000/${selectedInvoice.invoice_item.foto}`
                                      : "https://via.placeholder.com/150"
                                  }
                                  alt={selectedInvoice.invoice_item?.nama_item || "Gambar tidak tersedia"}
                                  style={{
                                    width: "100%",
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                    marginBottom: "10px",
                                  }}
                                />
                              <Typography variant="body1">
                                Nama Restoran: {selectedInvoice.menu_item?.profile_merchant.nama_perusahaan}
                              </Typography>
                              <Typography variant="body1">
                                Menu: {selectedInvoice.invoice_item?.nama_item}
                              </Typography>
                              <Typography variant="body1">
                                Jumlah Porsi: {selectedInvoice.jumlah_porsi}
                              </Typography>
                              <Typography variant="body1">
                                Total Harga: Rp{" "}
                                {selectedInvoice.total_harga.toLocaleString(
                                  "id-ID"
                                )}
                              </Typography>
                              <Typography variant="body1">
                                Tanggal Pemesanan:{" "}
                                {selectedInvoice.tanggal_pengiriman_makanan}
                              </Typography>
                            </>
                          )}
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseDetailInvoice}>
                            Tutup
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  </Box>
                </MenuItem>
              ))
            ) : (
              <MenuItem>Tidak ada item di keranjang</MenuItem>
            )}
          </Menu>

          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/login");
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Daftar Menu Item
        </Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {menuItems.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      item.foto
                        ? `http://127.0.0.1:8000/${item.foto}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={item.nama_item}
                  />
                  <CardContent>
                    <Typography variant="h6">{item.nama_item}</Typography>
                    <Typography variant="body1">
                      Rp {item.harga.toLocaleString("id-ID")}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => handleOpenCheckout(item)}
                    >
                      Checkout
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={openCheckoutDialog} onClose={handleCloseCheckout}>
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Harga: Rp{" "}
              {(selectedItem.harga * jumlahPorsi).toLocaleString("id-ID")}
            </Typography>
          )}
          <TextField
            label="Jumlah Porsi"
            type="number"
            fullWidth
            value={jumlahPorsi}
            onChange={(e) => setJumlahPorsi(e.target.value)}
          />
          <TextField
            label="Tanggal Pemesanan"
            type="date"
            fullWidth
            value={tanggalPemesanan}
            onChange={(e) => setTanggalPemesanan(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCheckout}>Batal</Button>
          <Button variant="contained" onClick={handleCheckout}>
            Tambah ke Keranjang
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default DashboardCustomer;
