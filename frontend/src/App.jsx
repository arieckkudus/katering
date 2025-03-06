import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import DashboardAdmin from "./components/DAdmin";
import DashboardCustomer from "./components/DCustomer";
import DashboardMerchant from "./components/DMerchant";
import AddMerchant from "./components/DAdmin/AddMerchant";
import ListClient from "./components/DAdmin/ListClient";
import EditClient from "./components/DAdmin/editClient";
import AddItem from "./components/DMerchant/AddMenuItem";
import MenuItemList from "./components/DMerchant/ListItem";
import MenuItemEdit from "./components/DMerchant/EditMenuItem";
import Invoice from "./components/DAdmin/invoice";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-customer" element={<DashboardCustomer />} />
        <Route path="/dashboard-merchant" element={<DashboardMerchant />} />
        <Route path="/add-client" element={<AddMerchant />} />
        <Route path="/list-client" element={<ListClient />} />
        <Route path="/edit-client/:id" element={<EditClient />} />
        <Route path="/add-menuitem" element={<AddItem />} />
        <Route path="/list-menuitem" element={<MenuItemList />} />
        <Route path="/menuitem/edit/:id" element={<MenuItemEdit />} />
        <Route path="/invoice" element={<Invoice />} />
        
        {/* Tambahkan halaman lain di sini */}
      </Routes>
    </Router>
  );
}

export default App;
