import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HomePage from '../pages/Home';
import CategoryPage from '../pages/Category';
import ProductPage from '../pages/Product';
// import CartPage from '../pages/Cart'; // If a dedicated cart page is needed
import { CartProvider } from '../hooks/useCart';
import CartSidebar from '../components/CartSidebar';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductPage />} />
        {/* <Route path="/cart" element={<CartPage />} /> */}
        {/* Add other routes here */}
      </Routes>
    </AnimatePresence>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          <CartSidebar />
        </div>
      </CartProvider>
    </Router>
  );
};

export default AppRouter;

