import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="p-6 border-b border-warm-200 flex justify-between items-center bg-warm-50">
          <h2 className="text-2xl font-bold text-warm-900">Your Cart</h2>
          <button onClick={onClose} className="p-2 text-warm-500 hover:text-earth-600 hover:bg-earth-100 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center text-warm-500 mt-20">
              <p className="text-lg">Your cart is empty.</p>
              <button onClick={onClose} className="mt-4 text-earth-600 font-medium hover:underline">Continue Shopping</button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-warm-100 pb-6">
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=150&q=80'} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-warm-200" />
                  <div className="flex-1">
                    <h3 className="font-bold text-warm-900">{item.name}</h3>
                    <p className="text-earth-700 font-medium mt-1">₹{item.price}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 bg-warm-50 border border-warm-200 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-warm-600 hover:text-earth-600 disabled:opacity-50" disabled={item.quantity <= 1}>
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-warm-900 w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-warm-600 hover:text-earth-600 disabled:opacity-50" disabled={item.quantity >= item.stock}>
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2 text-warm-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-warm-200 bg-warm-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-warm-800">Total</span>
              <span className="text-2xl font-bold text-earth-700">₹{total().toFixed(2)}</span>
            </div>
            <button className="w-full bg-earth-600 text-white font-bold py-4 rounded-xl hover:bg-earth-700 transition-colors shadow-lg">
              Proceed to Checkout
            </button>
            <button onClick={clearCart} className="w-full mt-4 text-warm-500 font-medium hover:text-red-600 transition-colors">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
