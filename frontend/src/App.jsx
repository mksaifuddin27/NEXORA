import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CompareProvider } from './context/CompareContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { CompareDrawer } from './components/CompareDrawer';
import { CompareModal } from './components/CompareModal';
// Pages
import { LandingPage } from './pages/LandingPage';
import { UserDashboard } from './pages/UserDashboard';
import { ServiceDiscoveryPage } from './pages/ServiceDiscoveryPage';
import { ProviderDetailsPage } from './pages/ProviderDetailsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
// Protected Route wrappers
const ProtectedRoute = ({ children, allowedRole, }) => {
    const { isAuthenticated, role } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }
    if (allowedRole && role !== allowedRole) {
        return <Navigate to="/dashboard" replace/>;
    }
    return <>{children}</>;
};
export const App = () => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    return (<BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <CompareProvider>
            <div className="flex min-h-screen bg-navy-950 text-slate-100 selection:bg-indigo-600 selection:text-white">
              {/* Left Navigation Sidebar */}
              <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen}/>

              {/* Main Content Area on the Right */}
              <div className="flex-1 flex flex-col min-w-0">
                <TopBar onOpenMobileSidebar={() => setMobileSidebarOpen(true)}/>

                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
                  <Routes>
                    {/* Public Core Routes */}
                    <Route path="/" element={<LandingPage />}/>
                    <Route path="/services" element={<ServiceDiscoveryPage />}/>
                    <Route path="/providers/:id" element={<ProviderDetailsPage />}/>
                    <Route path="/about" element={<AboutPage />}/>
                    <Route path="/contact" element={<ContactPage />}/>
                    <Route path="/terms" element={<TermsPage />}/>
                    <Route path="/privacy" element={<PrivacyPage />}/>
                    <Route path="/api-docs" element={<ApiDocsPage />}/>
                    <Route path="/login" element={<LoginPage />}/>
                    <Route path="/register" element={<RegisterPage />}/>

                    {/* Citizen User Protected Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute>
                          <UserDashboard />
                        </ProtectedRoute>}/>
                    <Route path="/my-bookings" element={<ProtectedRoute>
                          <MyBookingsPage />
                        </ProtectedRoute>}/>

                    {/* Officer Management Portal */}
                    <Route path="/officer" element={<ProtectedRoute allowedRole="OFFICER">
                          <OfficerDashboard />
                        </ProtectedRoute>}/>

                    {/* Administrator Console */}
                    <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN">
                          <AdminDashboard />
                        </ProtectedRoute>}/>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                  </Routes>
                </main>

                <Footer />
              </div>

              {/* Floating Global Comparison Drawer & Modal */}
              <CompareDrawer />
              <CompareModal />
            </div>
          </CompareProvider>
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>);
};
export default App;
