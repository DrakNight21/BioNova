import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { ShoppingCart, Leaf, User as UserIcon, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Cart from '../Cart';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-earth-700">
            <Leaf className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight">EcoRoots</span>
          </Link>
          
          <div className="flex items-center gap-8">
            <Link to="/marketplace" className="text-warm-800 hover:text-earth-600 font-medium transition-colors">Marketplace</Link>
            <Link to="/awareness" className="text-warm-800 hover:text-earth-600 font-medium transition-colors">Awareness Hub</Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-6">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-earth-600 hover:text-earth-800 font-semibold">Admin Panel</Link>
                )}
                {user?.role === 'proposer' && (
                  <Link to="/proposer" className="text-earth-600 hover:text-earth-800 font-semibold">My Farm</Link>
                )}
                
                <button onClick={() => setIsCartOpen(true)} className="relative">
                  <ShoppingCart className="w-6 h-6 text-warm-800 hover:text-earth-600 transition-colors" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-earth-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
                
                <button onClick={logout} className="flex items-center gap-2 text-warm-600 hover:text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="flex items-center gap-2 text-warm-800 hover:text-earth-600 font-medium">
                  <UserIcon className="w-5 h-5" /> Login
                </Link>
                <Link to="/register" className="bg-earth-600 text-white px-5 py-2 rounded-full font-medium hover:bg-earth-700 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}
