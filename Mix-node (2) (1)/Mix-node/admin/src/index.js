import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Outlet,useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// Fixed for Admin
import Sidebar from './Sidebar';
import Footer from './Footer';
import ProtectedRoute from './session';
import ThemeLoader from './ThemeLoader';

// Admin panel pages
import Dashboard from './Components/index';
import Category from './Components/Blogs';
import Service from './Components/Service';
import Testimonial from './Components/Testi';
import Product from './Components/Product';
import Faq from './Components/Faq';
import Settings from './Components/Settings';

// Authentication
import Register from './authentication/register';
import Login from './authentication/login';

// Website pages
import HOME from './website/index';
import Contact from './website/Contact';
import Blog from './website/Blogs';
import Services from './website/Services';
import About from './website/About';
import Footers from './website/Footer';
import Headers from './website/Header';
const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    // Get the last part of the path (e.g., 'service' from '/admin/service')
    const pathArray = location.pathname.split('/').filter(Boolean);
    const lastPath = pathArray[pathArray.length - 1];
    
    // Capitalize and format
    const pageTitle = lastPath 
      ? lastPath.charAt(0).toUpperCase() + lastPath.slice(1) 
      : "Home";

    document.title = `${pageTitle} | Agro Farm`;
  }, [location]);

  return null; // This component doesn't render anything
};

// --- LAYOUT COMPONENTS ---

// Website Layout (Header + Content + Footer)
const WebsiteLayout = () => (
  <>
    <Headers />
    <Outlet /> {/* This renders the specific website page */}
    <Footers />
  </>
);

// Admin Layout (Sidebar + Protected Content + Footer)
const AdminLayout = () => (
  <ProtectedRoute>
    <div className="admin-wrapper">
      <Sidebar />
      <main className="admin-main-content">
        <Outlet /> {/* This renders the specific admin page */}
      </main>
      <Footer />
    </div>
  </ProtectedRoute>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <TitleUpdater />
      <ThemeLoader>
      <Routes>
        
        {/* 1. PUBLIC WEBSITE ROUTES (With Header/Footer) */}
        <Route element={<WebsiteLayout />}>
          <Route path="/" element={<HOME />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/service" element={<Services />} />
        </Route>

        {/* 2. AUTHENTICATION ROUTES (No Header/Footer) */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 3. ADMIN PANEL ROUTES (With Sidebar/Protected) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> {/* This is /admin */}
          <Route path="blog" element={<Category />} />
          <Route path="service" element={<Service />} />
          <Route path="setting" element={<Settings />} />
          <Route path="faq" element={<Faq />} />
          <Route path="product" element={<Product />} />
          <Route path="testimonial" element={<Testimonial />} />
        </Route>

      </Routes>
      </ThemeLoader>
    </Router>
  </React.StrictMode>
);