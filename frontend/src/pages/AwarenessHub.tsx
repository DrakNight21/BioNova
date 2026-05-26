import { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, ChevronRight } from 'lucide-react';
import api from '../lib/axios';

interface Resource {
  id: number;
  title: string;
  content: string;
  resource_type: 'article' | 'guide' | 'video_link';
  created_at: string;
  author: {
    name: string;
  };
}

export default function AwarenessHub() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data } = await api.get('/resources');
      setResources(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video_link': return <Video className="w-5 h-5 text-earth-600" />;
      case 'guide': return <BookOpen className="w-5 h-5 text-earth-600" />;
      default: return <FileText className="w-5 h-5 text-earth-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-earth-800 rounded-3xl p-8 md:p-12 text-white mb-12 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-earth-600 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Awareness Hub</h1>
          <p className="text-earth-100 text-lg md:text-xl">
            Learn about organic farming practices, sustainable agriculture, and the impact of your food choices.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Feed */}
        <div className="lg:w-2/3">
          <div className="flex items-center gap-2 mb-8">
            <h2 className="text-2xl font-bold text-warm-900">Latest Articles</h2>
            <div className="flex-1 h-px bg-warm-200 ml-4"></div>
          </div>

          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-warm-100 shadow-sm h-48"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {resources.map((resource) => (
                <article key={resource.id} className="bg-white p-6 rounded-2xl border border-warm-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-earth-50 rounded-full flex items-center justify-center">
                      {getIcon(resource.resource_type)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-earth-600 uppercase tracking-wider">{resource.resource_type}</span>
                      <p className="text-xs text-warm-500">By {resource.author.name} • {new Date(resource.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-warm-900 mb-3 group-hover:text-earth-700 transition-colors">{resource.title}</h3>
                  <p className={`text-warm-600 mb-4 leading-relaxed ${expandedIds.has(resource.id) ? '' : 'line-clamp-3'}`}>
                    {resource.content}
                  </p>
                  <button 
                    onClick={() => toggleExpand(resource.id)}
                    className="text-earth-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    {expandedIds.has(resource.id) ? 'Show Less' : 'Read More'} <ChevronRight className={`w-4 h-4 transition-transform ${expandedIds.has(resource.id) ? 'rotate-90' : ''}`} />
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl border border-warm-100 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-warm-900 mb-6">Trending Topics</h3>
            <ul className="space-y-4">
              {['Composting Basics', 'Pest Control without Chemicals', 'Crop Rotation Methods', 'Understanding Soil Ph'].map((topic, i) => (
                <li key={i} className="flex items-center justify-between group cursor-pointer border-b border-warm-100 pb-4 last:border-0 last:pb-0">
                  <span className="text-warm-700 font-medium group-hover:text-earth-600 transition-colors">{topic}</span>
                  <div className="w-6 h-6 rounded-full bg-warm-50 flex items-center justify-center group-hover:bg-earth-50 transition-colors">
                    <ChevronRight className="w-4 h-4 text-warm-400 group-hover:text-earth-600" />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 bg-earth-50 p-6 rounded-xl border border-earth-100 text-center">
              <h4 className="font-bold text-earth-800 mb-2">Expert Tips Delivered</h4>
              <p className="text-sm text-earth-600 mb-4">Subscribe to our newsletter for weekly organic farming tips.</p>
              <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded-lg border border-earth-200 mb-3 focus:outline-none focus:ring-2 focus:ring-earth-500" />
              <button className="w-full bg-earth-600 text-white font-medium py-2 rounded-lg hover:bg-earth-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
