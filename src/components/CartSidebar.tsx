import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui setup
import CheckoutButton from './CheckoutButton'; // Will be created later

const CartSidebar: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, isCartOpen, closeCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '100%', opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
    exit: { opacity: 0, x: -20 },
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCart} // Close on overlay click
        />
      )}
      {isCartOpen && (
        <motion.aside
          initial="closed"
          animate="open"
          exit="closed"
          variants={sidebarVariants}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-xl flex flex-col z-[60] text-white"
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Seu Carrinho</h2>
            <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Fechar carrinho">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCartIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Seu carrinho está vazio.</p>
              <Button onClick={closeCart} className="mt-4">Continuar Comprando</Button>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <img 
                      src={item.image || '/placeholder-image.png'} 
                      alt={item.name} 
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)}</p>
                      <div className="flex items-center mt-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 text-black" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label={`Diminuir quantidade de ${item.name}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 text-sm w-4 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-6 w-6 text-black" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label={`Aumentar quantidade de ${item.name}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive/80 h-7 w-7 mt-1"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remover ${item.name} do carrinho`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="p-6 border-t mt-auto">
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Subtotal:</p>
                <p className="text-xl font-bold">{formatPrice(getCartTotal())}</p>
              </div>
              <CheckoutButton />
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

// Placeholder for ShoppingCartIcon if not available from lucide-react or similar
const ShoppingCartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

export default CartSidebar;

