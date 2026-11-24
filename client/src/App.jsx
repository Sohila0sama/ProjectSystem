import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import Cart from "./pages/Cart";
import CreateItem from "./pages/CreateItem";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/create-item" element={<CreateItem />} />
         <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}