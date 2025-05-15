import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui setup
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // Assuming shadcn/ui setup
import { useCart } from '../hooks/useCart';
import useFetchData from '../hooks/useFetchData';

interface Category {
  id: string;
  name: string;
  active: boolean;
}

interface Settings {
  storeName: string;
  // other settings...
}

const Header: React.FC = () => {
  const { cartItems, openCart } = useCart();
  const categories = useFetchData<Category[]>('/data/categories.json', { activeOnly: true });
  const settings = useFetchData<Settings>('/data/settings.json');

  const totalItemsInCart = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 ml-4 flex items-center space-x-2">
            {/* <Icons.logo className="h-6 w-6" /> */}
            <img src="/logo.png" alt="logo" width={70} />
            <span className="hidden font-bold sm:inline-block">
              {/* {settings?.storeName || 'Sousa\'s Calçados'} */}
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Home
            </Link>
            {categories?.map(category => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <Link to="/" className="flex items-center space-x-2 mb-6">
                 {/* <Icons.logo className="h-6 w-6" /> */}
                 <img src="/logo.png" alt="logo" width={150} />
                <span className="font-bold">
                  {/* {settings?.storeName || 'Sousa\'s Calçados'} */}
                </span>
              </Link>
              <nav className="flex flex-col space-y-3">
                <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground/60" onClick={() => document.dispatchEvent(new Event('click'))}>Home</Link>
                {categories?.map(category => (
                  <Link
                    key={category.id}
                    to={`/category/${category.id}`}
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                    onClick={() => document.dispatchEvent(new Event('click'))} // Close sheet on navigate
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Store Name (centered when menu is on left) */}
        <div className="w-full flex md:hidden items-center justify-center">
            <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.png" alt="logo" width={70} />
                <span className="font-bold">
                    {/* {settings?.storeName || 'Sousa\'s Calçados'} */}
                </span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 md:justify-end">
          <Button variant="ghost" size="icon" onClick={openCart} aria-label="Abrir carrinho">
            <ShoppingCart className="h-5 w-5" />
            {totalItemsInCart > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {totalItemsInCart}
              </span>
            )}
            <span className="sr-only">Carrinho</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

