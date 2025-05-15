import React from 'react';
import useFetchData from '../hooks/useFetchData';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  isNew?: boolean;
  category?: string;
  active?: boolean;
}

const HomePage: React.FC = () => {
  const products = useFetchData<Product[]>('/products.json', { activeOnly: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!products) {
    // TODO: Add a proper loading skeleton/spinner component from shadcn/ui
    return <div className="container mx-auto px-4 py-8 text-center">Carregando produtos...</div>;
  }

  if (products.length === 0) {
    return <div className="container mx-auto px-4 py-8 text-center">Nenhum produto disponível no momento.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
};

export default HomePage;

