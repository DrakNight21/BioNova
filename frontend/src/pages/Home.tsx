import { ArrowRight, Sprout, ShieldCheck, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const categories = [
    { name: 'Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80' },
    { name: 'Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80' },
    { name: 'Grains', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Dairy', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="flex flex-col gap-20">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-earth-900/80 to-earth-800/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Organic Farm"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Nurture Nature, <br /> Nourish You
          </h1>
          <p className="text-xl md:text-2xl text-earth-50 mb-10 drop-shadow-md">
            Direct from verified organic farmers to your table. Experience the true taste of sustainable agriculture.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/marketplace" className="bg-earth-500 hover:bg-earth-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
              Shop Fresh <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/awareness" className="bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center text-earth-600 mb-2">
              <Sprout className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-warm-900">100% Organic</h3>
            <p className="text-warm-600">Every product is grown using sustainable, chemical-free methods that protect our soil.</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center text-earth-600 mb-2">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-warm-900">Verified Farmers</h3>
            <p className="text-warm-600">We rigorously verify every farmer's certifications to guarantee organic authenticity.</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-earth-100 rounded-full flex items-center justify-center text-earth-600 mb-2">
              <Truck className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-warm-900">Farm to Door</h3>
            <p className="text-warm-600">Fresh produce delivered directly from the farm to reduce emissions and ensure freshness.</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-warm-900 mb-4">Shop by Category</h2>
              <div className="w-20 h-1 bg-earth-500 rounded-full"></div>
            </div>
            <Link to="/marketplace" className="text-earth-600 font-semibold hover:text-earth-800 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link to={`/marketplace?category=${cat.name.toLowerCase()}`} key={cat.name} className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-earth-200 transition-colors">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
