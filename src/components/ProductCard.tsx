import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming shadcn/ui setup
import { Badge } from "@/components/ui/badge"; // Assuming shadcn/ui setup
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui setup
import { useCart } from '../hooks/useCart';

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

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  if (!product || !product.active) {
    return null; // Do not render if product is not active or undefined
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="h-full flex flex-col overflow-hidden">
        <Link to={`/product/${product.id}`} className="block group">
          <CardHeader className="p-0 relative">
            <motion.img
              src={product.image || '/placeholder-image.png'} // Fallback image
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            {product.isNew && (
              <Badge className="absolute top-2 right-2" variant="destructive">Novo</Badge>
            )}
          </CardHeader>
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground truncate">{product.description}</p>
          </CardContent>
        </Link>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
          <Button onClick={() => addToCart(product)} size="sm" aria-label={`Adicionar ${product.name} ao carrinho`}>
            Adicionar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;

