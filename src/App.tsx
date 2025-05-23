
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OAuthProvider } from "@/contexts/OAuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import GmailConnection from "@/pages/GmailConnection";
import SlackIntegration from "@/pages/SlackIntegration";
import Emails from "@/pages/Emails";
import Settings from "@/pages/Settings";
import OAuthCallback from "@/pages/OAuthCallback";
import NotFound from "@/pages/NotFound";
import RequireAuth from "@/components/RequireAuth";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OAuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/oauth/callback" element={<OAuthCallback />} />
                  
                  {/* Protected Routes */}
                  <Route element={
                    <RequireAuth>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </RequireAuth>
                  }>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/emails" element={<Emails />} />
                    <Route path="/gmail" element={<GmailConnection />} />
                    <Route path="/slack" element={<SlackIntegration />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Route>
                  
                  {/* 404 Page */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </OAuthProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
