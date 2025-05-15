import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useFetchData from '../hooks/useFetchData';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui setup
import { Badge } from '@/components/ui/badge'; // Assuming shadcn/ui setup

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  isNew: boolean;
  active: boolean;
}

interface ProductDetailProps {
    productId: string | undefined;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const { addToCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/products.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        // Find the product by ID
        const foundProduct = data.find(p => p.id === productId);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Produto não encontrado.');
        }
      } catch (err) {
        setError('Falha ao carregar os detalhes do produto.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    } else {
      setError('ID do produto não fornecido.');
      setLoading(false);
    }
  }, [productId, addToCart]);
  // Fetch settings for WhatsApp link
  const settings = useFetchData<any>("/settings.json");

  if (loading) {
    return <p>Carregando detalhes do produto...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!product) {
    return <p>Produto não encontrado.</p>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  };


  const handleBuyNow = () => {
    if (!settings || !product) return;

    const itemDescription = `1x ${product.name} (${formatPrice(product.price)})`;
    const totalAmount = formatPrice(product.price);

    let message = settings.whatsappMessageTemplate
      .replace("{{items}}", itemDescription)
      .replace("{{total}}", totalAmount);

    const whatsappLink = `https://api.whatsapp.com/send?phone=${settings.whatsappNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Image Section - Full width on mobile, half on desktop */}
        <motion.div 
          className="w-full md:w-1/2" 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <img 
            src={product.image || '/placeholder-image.png'} 
            alt={product.name} 
            className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Details Section - Full width on mobile, half on desktop */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col" 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {product.isNew && (
            <Badge variant="destructive" className="w-fit mb-2">Novo</Badge>
          )}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary mb-6">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground mb-6 text-base leading-relaxed">{product.description}</p>
          
          <motion.div whileTap={{ scale: 0.95 }} className="mt-auto flex flex-col sm:flex-row gap-2">
            <Button 
              size="lg" 
              className="w-full sm:w-auto flex-grow"
              onClick={() => addToCart(product)}
              aria-label={`Adicionar ${product.name} ao carrinho`}
            >
              Adicionar ao Carrinho
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto flex-grow"
              onClick={handleBuyNow}
              aria-label={`Comprar ${product.name} agora`}
            >
              Comprar Agora
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;

