import { useState, useEffect } from 'react';
import { Check, X, Users, BookOpen, Trash2 } from 'lucide-react';
import api from '../lib/axios';

export default function AdminDashboard() {
  const [proposers, setProposers] = useState<any[]>([]);
  const [pendingResources, setPendingResources] = useState<any[]>([]);
  const [publishedResources, setPublishedResources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('verifications');

  useEffect(() => {
    fetchPendingProposers();
    fetchPendingResources();
    fetchPublishedResources();
  }, []);

  const fetchPendingProposers = async () => {
    try {
      const { data } = await api.get('/admin/pending-proposers');
      setProposers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPendingResources = async () => {
    try {
      const { data } = await api.get('/admin/pending-resources');
      setPendingResources(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPublishedResources = async () => {
    try {
      const { data } = await api.get('/resources');
      setPublishedResources(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVerify = async (id: number, status: 'active' | 'suspended') => {
    try {
      await api.put(`/admin/verify-proposer/${id}`, { status });
      fetchPendingProposers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleResourceReview = async (id: number, status: 'published' | 'rejected') => {
    try {
      await api.put(`/admin/approve-resource/${id}`, { status });
      fetchPendingResources();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/admin/resources/${id}`);
      fetchPublishedResources();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-warm-900 mb-2">Admin Dashboard</h1>
        <p className="text-warm-600">Manage platform verifications and educational content.</p>
      </div>

      <div className="flex border-b border-warm-200 mb-8">
        <button 
          className={`pb-4 px-4 font-medium flex items-center gap-2 ${activeTab === 'verifications' ? 'border-b-2 border-earth-600 text-earth-600' : 'text-warm-500 hover:text-warm-800'}`}
          onClick={() => setActiveTab('verifications')}
        >
          <Users className="w-5 h-5" /> Pending Farmers
          {proposers.length > 0 && <span className="bg-earth-100 text-earth-700 text-xs px-2 py-0.5 rounded-full">{proposers.length}</span>}
        </button>
        <button 
          className={`pb-4 px-4 font-medium flex items-center gap-2 ${activeTab === 'resources' ? 'border-b-2 border-earth-600 text-earth-600' : 'text-warm-500 hover:text-warm-800'}`}
          onClick={() => setActiveTab('resources')}
        >
          <BookOpen className="w-5 h-5" /> Content Moderation
          {pendingResources.length > 0 && <span className="bg-earth-100 text-earth-700 text-xs px-2 py-0.5 rounded-full">{pendingResources.length}</span>}
        </button>
      </div>

      {activeTab === 'verifications' && (
        <div className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-warm-50 border-b border-warm-100 text-warm-700 text-sm">
              <tr>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Farm Details</th>
                <th className="p-4 font-semibold">Certifications</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100 text-sm">
              {proposers.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-warm-500">No pending verifications.</td></tr>
              ) : proposers.map((p) => (
                <tr key={p.id} className="hover:bg-warm-50/50">
                  <td className="p-4">
                    <div className="font-semibold text-warm-900">{p.name}</div>
                    <div className="text-warm-500">{p.email}</div>
                  </td>
                  <td className="p-4 text-warm-700">
                    {p.proposer_profile?.farm_name || 'N/A'}
                  </td>
                  <td className="p-4 text-warm-700 max-w-xs truncate">
                    {p.proposer_profile?.certification_details || 'None provided'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleVerify(p.id, 'active')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                        <Check className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleVerify(p.id, 'suspended')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" title="Reject">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-warm-900 mb-4">Pending Articles for Review</h2>
          {pendingResources.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-8 text-center text-warm-500">
              No new content requires moderation.
            </div>
          ) : (
            pendingResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-sm border border-warm-100 p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-earth-600 uppercase tracking-wider bg-earth-50 px-2 py-1 rounded-md">{resource.resource_type}</span>
                    <span className="text-xs text-warm-500">Submitted by: <strong className="text-warm-800">{resource.author?.name}</strong></span>
                  </div>
                  <h3 className="text-xl font-bold text-warm-900 mb-3">{resource.title}</h3>
                  <p className="text-warm-600 text-sm bg-warm-50 p-4 rounded-xl border border-warm-100 whitespace-pre-wrap">{resource.content}</p>
                </div>
                
                <div className="flex md:flex-col gap-2 w-full md:w-32">
                  <button 
                    onClick={() => handleResourceReview(resource.id, 'published')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 font-medium transition-colors"
                  >
                    <Check className="w-4 h-4" /> Publish
                  </button>
                  <button 
                    onClick={() => handleResourceReview(resource.id, 'rejected')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-medium transition-colors"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))
          )}

          <h2 className="text-xl font-bold text-warm-900 mb-4 mt-12">Manage Published Content</h2>
          {publishedResources.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-warm-100 p-8 text-center text-warm-500">
              No published content available.
            </div>
          ) : (
            publishedResources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-sm border border-warm-100 p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-earth-600 uppercase tracking-wider bg-earth-50 px-2 py-1 rounded-md">{resource.resource_type}</span>
                    <span className="text-xs text-warm-500">Submitted by: <strong className="text-warm-800">{resource.author?.name}</strong></span>
                  </div>
                  <h3 className="text-xl font-bold text-warm-900 mb-3">{resource.title}</h3>
                </div>
                
                <div className="flex w-full md:w-32">
                  <button 
                    onClick={() => handleDeleteResource(resource.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
