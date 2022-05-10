import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from "./components/Header";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import SignIn from "./pages/SignIn";
import ShippingAddress from "./pages/ShippingAddress";
import Signup from "./pages/Signup";
import PaymentMethod from "./pages/PaymentMethod";
import Placeorder from "./pages/Placeorder";
import OrderFinish from "./pages/OrderFinish";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import SearchScreen from "./pages/SearchScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Admin/Dashboard";
import AdminRoute from "./components/AdminRoute";
import ProductsList from "./pages/Admin/ProductsList";
import OrderList from "./pages/Admin/OrderList";
import UserList from "./pages/Admin/UserList";
import EditProduct from "./pages/Admin/EditProduct";
import UserEdit from "./pages/Admin/UserEdit";

function App() {
  return (
    <div className="App">
      <ToastContainer position="bottom-center" limit={1} />
      <Header />
      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/cart" element={ <Cart /> } />
        <Route path="products/:slug" element={ <ProductDetail />} />
        <Route path="/shipping" element={<ProtectedRoute><ShippingAddress /></ProtectedRoute>} />
        <Route path="/payment" element={ <ProtectedRoute><PaymentMethod /></ProtectedRoute> } />
        <Route path="/placeorder" element={ <ProtectedRoute><Placeorder /></ProtectedRoute> } />
        <Route path="/order/:id" element={ <OrderFinish /> } />
        <Route path="/orderhistory" element={ <ProtectedRoute><OrderHistory /></ProtectedRoute> } />
        <Route path="/profile" element={ <Profile /> } />
        <Route path="/search" element={ <SearchScreen /> } />
        <Route path="/signin" element={ <SignIn /> } />
        <Route path="/signup" element={ <Signup /> } />

        <Route path="/admin/dashboard" element={ <AdminRoute> <Dashboard /> </AdminRoute>} />
        <Route path="/admin/productsList" element={ <AdminRoute> <ProductsList /> </AdminRoute>} />
        <Route path="/admin/productsList/:id" element={ <AdminRoute> <EditProduct /> </AdminRoute>} />
        <Route path="/admin/ordersList" element={ <AdminRoute> <OrderList /> </AdminRoute>} />
        <Route path="/admin/usersList" element={ <AdminRoute> <UserList /> </AdminRoute>} />
        <Route path="/admin/user/:id" element={ <AdminRoute> <UserEdit /> </AdminRoute>} />

      </Routes>
    </div>
  );
}

export default App;
