import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import React from "react";
import Verification from "./pages/Verification";
import ForgotPassword from "./pages/ForgotPassword";
import NewPassword from "./pages/NewPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import "./App.css";
import PostDetails from "./pages/PostDetails";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verification/:token" element={<Verification />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<NewPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/c/:uuid" element={<PostDetails />} />
      </Routes>
    </div>
  );
}

export default App;
