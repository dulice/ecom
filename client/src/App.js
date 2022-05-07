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

function App() {
  return (
    <div className="App">
      <ToastContainer position="bottom-center" limit={1} />
      <Header />
      <Routes>
        <Route path="/" element={ <Home />} />
        <Route path="/cart" element={ <Cart /> } />
        <Route path="products/:slug" element={ <ProductDetail />} />
        <Route path="/shipping" element={<ShippingAddress />} />
        <Route path="/payment" element={ <PaymentMethod /> } />
        <Route path="/placeorder" element={ <Placeorder /> } />
        <Route path="/order/:id" element={ <OrderFinish /> } />
        <Route path="/orderhistory" element={ <OrderHistory /> } />
        <Route path="/profile" element={ <Profile /> } />
        <Route path="/signin" element={ <SignIn /> } />
        <Route path="/signup" element={ <Signup /> } />
      </Routes>
    </div>
  );
}

export default App;
