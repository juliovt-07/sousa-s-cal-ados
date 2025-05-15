import React from 'react';
import { useParams } from 'react-router-dom';
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

interface Category {
  id: string;
  name: string;
  active: boolean;
}

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  const allProducts = useFetchData<Product[]>('/products.json', { activeOnly: true });
  const categories = useFetchData<Category[]>('/categories.json', { activeOnly: true });

  const currentCategory = categories?.find(cat => cat.id === categoryId);

  const filteredProducts = allProducts?.filter(product => product.category === categoryId);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!filteredProducts || !currentCategory) {
    // TODO: Add a proper loading skeleton/spinner component from shadcn/ui
    return <div className="container mx-auto px-4 py-8 text-center">Carregando produtos da categoria...</div>;
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">{currentCategory?.name || 'Categoria'}</h1>
        <p>Nenhum produto encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left">{currentCategory?.name}</h1>
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
};

export default CategoryPage;

