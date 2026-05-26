import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';

export default function AppLayout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <Outlet />
      </main>
      <footer className="bg-warm-900 text-warm-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">EcoRoots</h3>
            <p className="text-warm-300">Connecting organic farmers directly with mindful consumers for a sustainable future.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-warm-300">
              <li><a href="/marketplace" className="hover:text-white transition-colors">Marketplace</a></li>
              <li><a href="/awareness" className="hover:text-white transition-colors">Awareness Hub</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-warm-300">support@ecoroots.com</p>
            <p className="text-warm-300">+91 6295680676</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-4 border-t border-warm-800 text-center text-warm-400">
          <p>&copy; 2026 EcoRoots. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
