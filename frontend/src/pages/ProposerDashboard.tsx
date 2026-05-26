import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, CheckCircle } from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

export default function ProposerDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Resource Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [resourceType, setResourceType] = useState('article');
  const [resourceStatus, setResourceStatus] = useState('');

  // Product Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productStock, setProductStock] = useState('');
  const [productCategory, setProductCategory] = useState('vegetables');
  const [productLocation, setProductLocation] = useState('');
  const [productImageFile, setProductImageFile] = useState<File | null>(null);

  const resetProductForm = () => {
    setProductName('');
    setProductDescription('');
    setProductPrice('');
    setProductStock('');
    setProductCategory('vegetables');
    setProductLocation('');
    setProductImageFile(null);
    setEditingProduct(null);
  };

  const { user } = useAuthStore();

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const { data } = await api.get('/proposer/products');
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/proposer/products/${id}`);
        fetchMyProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const submitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', productName);
      formData.append('description', productDescription);
      formData.append('price', productPrice);
      formData.append('stock', productStock);
      formData.append('category', productCategory);
      if (productLocation) formData.append('location', productLocation);
      if (productImageFile) formData.append('image', productImageFile);

      if (editingProduct) {
        formData.append('_method', 'PUT');
        await api.post(`/proposer/products/${editingProduct.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/proposer/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowProductModal(false);
      resetProductForm();
      fetchMyProducts();
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.errors 
        ? JSON.stringify(error.response.data.errors) 
        : error.response?.data?.message || 'Failed to save product';
      alert('Error: ' + msg);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductPrice(product.price.toString());
    setProductStock(product.stock.toString());
    setProductCategory(product.category);
    setProductLocation(product.location || '');
    setProductImageFile(null);
    setShowProductModal(true);
  };

  const submitResource = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/proposer/submit-resource', {
        title,
        content,
        resource_type: resourceType
      });
      setResourceStatus('Successfully submitted for review!');
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
      setResourceStatus('Failed to submit. Please try again.');
    }
  };

  if (user?.status === 'pending') {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <div className="bg-yellow-50 border border-yellow-200 p-8 rounded-2xl text-yellow-800">
          <h2 className="text-2xl font-bold mb-4">Account Pending Verification</h2>
          <p>Your proposer account is currently being reviewed by our administration team. You will be able to list products and write articles once verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-900 mb-2">My Farm Dashboard</h1>
        <p className="text-warm-600">Manage your farm's products and share your expertise.</p>
      </div>

      <div className="flex border-b border-warm-200 mb-8">
        <button 
          className={`pb-4 px-4 font-medium flex items-center gap-2 ${activeTab === 'inventory' ? 'border-b-2 border-earth-600 text-earth-600' : 'text-warm-500 hover:text-warm-800'}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Plus className="w-5 h-5" /> My Inventory
        </button>
        <button 
          className={`pb-4 px-4 font-medium flex items-center gap-2 ${activeTab === 'articles' ? 'border-b-2 border-earth-600 text-earth-600' : 'text-warm-500 hover:text-warm-800'}`}
          onClick={() => setActiveTab('articles')}
        >
          <FileText className="w-5 h-5" /> Submit Article
        </button>
      </div>

      {activeTab === 'inventory' && (
        <>
          <div className="flex justify-end mb-4">
            <button 
              onClick={() => { resetProductForm(); setShowProductModal(true); }}
              className="bg-earth-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-earth-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-5 h-5" /> Add New Product
            </button>
          </div>

          {showProductModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-warm-900 mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={submitProduct} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-warm-800 mb-1">Product Name</label>
                    <input type="text" required value={productName} onChange={e => setProductName(e.target.value)} className="w-full px-4 py-2 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-warm-800 mb-1">Description</label>
                    <textarea required value={productDescription} onChange={e => setProductDescription(e.target.value)} className="w-full px-4 py-2 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 h-24 resize-none"></textarea>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-warm-800 mb-1">Price (₹)</label>
                      <input type="number" step="0.01" min="0" required value={productPrice} onChange={e => setProductPrice(e.target.value)} className="w-full px-4 py-2 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-warm-800 mb-1">Stock Units</label>
                      <input type="number" min="0" required value={productStock} onChange={e => setProductStock(e.target.value)} className="w-full px-4 py-2 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-warm-800 mb-1">Location</label>
                      <input type="text" placeholder="e.g. New York, NY" value={productLocation} onChange={e => setProductLocation(e.target.value)} className="w-full px-4 py-2 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-warm-800 mb-1">Product Image</label>
                      <input type="file" accept="image/*" onChange={e => setProductImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-warm-800 mb-1">Category</label>
                    <select value={productCategory} onChange={e => setProductCategory(e.target.value)} className="w-full px-4 py-2 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 bg-white">
                      <option value="vegetables">Vegetables</option>
                      <option value="fruits">Fruits</option>
                      <option value="grains">Grains</option>
                      <option value="dairy">Dairy</option>
                      <option value="fertilizers">Fertilizers</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 mt-8">
                    <button type="button" onClick={() => { setShowProductModal(false); resetProductForm(); }} className="px-5 py-2.5 text-warm-600 font-medium hover:bg-warm-50 rounded-xl transition-colors">Cancel</button>
                    <button type="submit" className="px-5 py-2.5 bg-earth-600 text-white font-medium rounded-xl hover:bg-earth-700 transition-colors shadow-sm">Save Product</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-warm-50 border-b border-warm-100 text-warm-700 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 text-sm">
                {products.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-warm-500">No products listed yet.</td></tr>
                ) : products.map((product) => (
                  <tr key={product.id} className="hover:bg-warm-50/50">
                    <td className="p-4 font-medium text-warm-900">{product.name}</td>
                    <td className="p-4 text-warm-600 capitalize">{product.category}</td>
                    <td className="p-4 text-earth-700 font-semibold">₹{product.price}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 text-warm-500 hover:text-earth-600 hover:bg-earth-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-warm-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'articles' && (
        <div className="max-w-3xl">
          <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-8">
            <h2 className="text-xl font-bold text-warm-900 mb-2">Share Your Expertise</h2>
            <p className="text-warm-500 mb-6">Write an article, guide, or link a video for the Awareness Hub. It will be published once approved by an Admin.</p>
            
            {resourceStatus && (
              <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>{resourceStatus}</span>
              </div>
            )}

            <form onSubmit={submitResource} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-warm-800 mb-2">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-warm-800 mb-2">Content / Summary</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 h-40 resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warm-800 mb-2">Type</label>
                <select 
                  value={resourceType}
                  onChange={(e) => setResourceType(e.target.value)}
                  className="w-full px-4 py-3 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 bg-white"
                >
                  <option value="article">Article</option>
                  <option value="guide">Farming Guide</option>
                  <option value="video_link">Video Link</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-earth-600 text-white font-bold py-3.5 rounded-xl hover:bg-earth-700 transition-all shadow-md">
                Submit for Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
