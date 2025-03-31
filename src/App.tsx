
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { TeaShopProvider } from "@/context/TeaShopContext";
import Layout from "@/components/Layout";

// Pages
import HomePage from "@/pages/HomePage";
import TeaShopsPage from "@/pages/TeaShopsPage";
import TeaShopDetailPage from "@/pages/TeaShopDetailPage";
import AddTeaShopPage from "@/pages/AddTeaShopPage";
import NotFound from "@/pages/NotFound";

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Wrap App component in React.FC to ensure React context is properly established
const App: React.FC = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TeaShopProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/tea-shops" element={<TeaShopsPage />} />
                  <Route path="/shop/:id" element={<TeaShopDetailPage />} />
                  <Route path="/add" element={<AddTeaShopPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </TeaShopProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
