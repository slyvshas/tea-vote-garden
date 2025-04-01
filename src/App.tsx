import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { TeaShopProvider } from "@/context/TeaShopContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from '@/components/Navbar';

// Pages
import HomePage from "@/pages/HomePage";
import TeaShopsPage from "@/pages/TeaShopsPage";
import TeaShopDetailPage from "@/pages/TeaShopDetailPage";
import LoginPage from "@/pages/LoginPage";
import AddTeaShopPage from "@/pages/AddTeaShopPage";
import NotFound from "@/pages/NotFound";

const App: React.FC = () => (
  <ThemeProvider>
    <AuthProvider>
      <TeaShopProvider>
        <TooltipProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tea-shops" element={<TeaShopsPage />} />
                  <Route path="/shop/:id" element={<TeaShopDetailPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route 
                    path="/add" 
                    element={
                      <ProtectedRoute requireAdmin>
                        <AddTeaShopPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Toaster />
            </div>
          </Router>
        </TooltipProvider>
      </TeaShopProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
