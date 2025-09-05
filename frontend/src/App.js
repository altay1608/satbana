import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ListingDetail from "./pages/ListingDetail";
import PostRequest from "./pages/PostRequest";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <AuthProvider>
      <div className="App min-h-screen bg-gray-50 flex flex-col">
        <BrowserRouter>
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/listing/:id" element={<ListingDetail />} />
              <Route path="/post-request" element={<PostRequest />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;