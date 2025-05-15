import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';
import { motion } from 'framer-motion';

const ProductPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} // Consistent with router animation
    >
      <ProductDetail productId={productId} />
    </motion.div>
  );
};

export default ProductPage;

