import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/axios';
import { Leaf, Mail, Lock, User, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    location: '',
    farm_name: '',
    certification_details: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/register', formData);
      const { user, access_token } = response.data;
      
      setAuth(user, access_token);
      
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'proposer') navigate('/proposer');
      else navigate('/marketplace');
      
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0] as string[];
        setError(firstError[0]);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-warm-100">
        
        <div className="bg-earth-800 px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-earth-600 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/20">
              <Leaf className="w-8 h-8 text-earth-200" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Join EcoRoots</h2>
            <p className="text-earth-200 text-sm">Create an account to connect with organic farming</p>
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-warm-800 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-warm-400" />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 focus:bg-white transition-colors text-warm-900"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warm-800 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-warm-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 focus:bg-white transition-colors text-warm-900"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-warm-800 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-warm-400" />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 focus:bg-white transition-colors text-warm-900"
                  placeholder="•••••••• (Min 8 characters)"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-warm-800 mb-2">Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-warm-50 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 focus:bg-white transition-colors text-warm-900 appearance-none"
                >
                  <option value="customer">General Customer</option>
                  <option value="proposer">Organic Farmer / Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-warm-800 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-warm-400" />
                  <input 
                    type="text" 
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-warm-50 border border-warm-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 focus:bg-white transition-colors text-warm-900"
                    placeholder="City, Region"
                  />
                </div>
              </div>
            </div>

            {formData.role === 'proposer' && (
              <div className="p-5 bg-earth-50 border border-earth-100 rounded-2xl space-y-4">
                <h3 className="font-bold text-earth-800">Proposer Verification Details</h3>
                <p className="text-xs text-earth-600 mb-4">You will need to be approved by an administrator before listing products.</p>
                
                <div>
                  <label className="block text-sm font-semibold text-earth-800 mb-2">Farm/Organization Name</label>
                  <input 
                    type="text" 
                    name="farm_name"
                    value={formData.farm_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 transition-colors text-warm-900"
                    placeholder="Green Valley Farms"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-earth-800 mb-2">Organic Certifications</label>
                  <textarea 
                    name="certification_details"
                    value={formData.certification_details}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-earth-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-earth-500 transition-colors text-warm-900 h-24 resize-none"
                    placeholder="List your USDA, GlobalG.A.P, or local organic certification numbers..."
                    required
                  ></textarea>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-earth-600 text-white font-bold py-3.5 rounded-xl hover:bg-earth-700 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-earth-600/20 mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-warm-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-earth-600 hover:text-earth-800 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
