import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui setup
import { useCart } from '../hooks/useCart';
import useFetchData from '../hooks/useFetchData';

interface Settings {
  whatsappNumber: string;
  whatsappMessageTemplate: string;
  currencySymbol?: string;
}

const CheckoutButton: React.FC = () => {
  const { cartItems, getCartTotal } = useCart();
  const settings = useFetchData<Settings>('/data/settings.json');

  const handleCheckout = () => {
    if (!settings || cartItems.length === 0) return;

    const itemsDescription = cartItems
      .map(item => `${item.quantity}x ${item.name} (${formatPrice(item.price * item.quantity)})`)
      .join(', ');
    
    const totalAmount = formatPrice(getCartTotal());

    let message = settings.whatsappMessageTemplate
      .replace('{{items}}', itemsDescription)
      .replace('{{total}}', totalAmount);

    const whatsappLink = `https://api.whatsapp.com/send?phone=${settings.whatsappNumber}&text=${encodeURIComponent(message)}`;

    // Open WhatsApp link in a new tab
    window.open(whatsappLink, '_blank');
    
    // Optionally clear cart after checkout attempt
    // clearCart(); 
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price);
  };

  if (cartItems.length === 0) {
    return null; // Don't show button if cart is empty
  }

  return (
    <Button 
      className="w-full" 
      size="lg" 
      onClick={handleCheckout}
      aria-label="Finalizar Compra e ir para WhatsApp"
    >
      Finalizar Compra
    </Button>
  );
};

export default CheckoutButton;

