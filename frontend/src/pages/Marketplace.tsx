import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ShoppingBag, MapPin, Plus, Minus } from 'lucide-react';
import api from '../lib/axios';
import { useCartStore } from '../store/cartStore';
import type { Product } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const categoryFilter = searchParams.get('category') || 'all';
  const locationFilter = searchParams.get('location') || '';

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, locationFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (locationFilter) params.location = locationFilter;

      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-warm-900 mb-2">Marketplace</h1>
        <p className="text-warm-600 text-lg">Fresh, organic produce from verified local farmers.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-warm-100 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-earth-700">
              <Filter className="w-5 h-5" />
              <h3 className="font-bold text-lg">Filters</h3>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-warm-800 mb-3">Category</h4>
              <div className="space-y-2">
                {['all', 'vegetables', 'fruits', 'grains', 'dairy', 'fertilizers'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={categoryFilter === cat}
                      onChange={() => updateFilter('category', cat)}
                      className="text-earth-600 focus:ring-earth-500 rounded-full"
                    />
                    <span className="text-warm-700 capitalize group-hover:text-earth-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-warm-800 mb-3">Location</h4>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-warm-400" />
                <input 
                  type="text" 
                  placeholder="Enter location..." 
                  value={locationFilter}
                  onChange={(e) => updateFilter('location', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500 focus:border-transparent text-sm text-warm-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-earth-600"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  <div className="relative h-48 bg-warm-100 overflow-hidden">
                    <img 
                      src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-earth-700 uppercase tracking-wider">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-warm-900">{product.name}</h3>
                      <span className="font-bold text-lg text-earth-600">₹{product.price}</span>
                    </div>
                    <p className="text-warm-500 text-sm mb-4 line-clamp-2">{product.description}</p>
                    
                    <div className="mt-auto">
                      <div className="flex items-center text-xs text-warm-500 mb-4 bg-warm-50 p-2 rounded-lg">
                        <MapPin className="w-3 h-3 mr-1" /> {product.location || 'Unknown Location'}
                        <span className="mx-2">•</span>
                        <span>{product.proposer?.proposer_profile?.farm_name || product.proposer?.name || 'Farm'}</span>
                      </div>
                      
                      {(() => {
                        if (!isAuthenticated) {
                          return (
                            <Link 
                              to="/login"
                              className="w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors bg-warm-100 text-warm-600 hover:bg-earth-100 hover:text-earth-700"
                            >
                              Login to Buy
                            </Link>
                          );
                        }

                        const cartItem = items.find(item => item.id === product.id);
                        if (cartItem) {
                          return (
                            <div className="flex items-center justify-between bg-earth-50 border border-earth-200 rounded-xl px-4 py-2 w-full">
                              <button 
                                onClick={() => cartItem.quantity > 1 ? updateQuantity(product.id, -1) : removeItem(product.id)}
                                className="p-1 text-earth-600 hover:bg-earth-200 rounded-md transition-colors"
                              >
                                <Minus className="w-5 h-5" />
                              </button>
                              <span className="font-bold text-earth-800 w-8 text-center">{cartItem.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(product.id, 1)}
                                disabled={cartItem.quantity >= product.stock}
                                className="p-1 text-earth-600 hover:bg-earth-200 rounded-md transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          );
                        }
                        return (
                          <button 
                            onClick={() => addItem(product)}
                            disabled={product.stock === 0}
                            className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                              product.stock > 0 
                                ? 'bg-earth-100 text-earth-700 hover:bg-earth-600 hover:text-white' 
                                : 'bg-warm-100 text-warm-400 cursor-not-allowed'
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-warm-100 shadow-sm">
              <div className="w-16 h-16 bg-warm-100 text-warm-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-warm-800 mb-2">No products found</h3>
              <p className="text-warm-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}
