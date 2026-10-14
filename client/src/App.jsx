
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";
import Categories from "./Categories";
import Store from "./Store";
import Auth from "./Auth";
import Admin from "./Admin";
import Cart from "./Cart";
import Checkout from "./Checkout";
import About from "./About";
import Contact from "./Contact";
function App() {
    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Store />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;
