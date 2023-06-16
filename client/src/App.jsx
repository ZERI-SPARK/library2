import { Routes, Route } from "react-router-dom";

import "./App.css";
import Login from "./screens/login";
import Home from "./screens/home/home";
import { MyContext } from "./MyContext";
import { useState } from "react";
import Cart from "./screens/cart";
function App() {
  const [cartItems, setCartItems] = useState([]);
  return (
    <>
      <MyContext.Provider value={{ cartItems, setCartItems }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </MyContext.Provider>
    </>
  );
}

export default App;
