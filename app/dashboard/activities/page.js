"use client"
import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit2, Trash2, Save, X, MoreVertical } from 'lucide-react';

export default function ActivitiesDashboard() {
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: ''
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.menu-button') && !e.target.closest('.menu-dropdown')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/activities');
      const data = await res.json();
      if (data.success) setActivities(data.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/activities/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        setImagePreview(data.url);
        setFormData(prev => ({ ...prev, image: data.url }));
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      alert('Error uploading image');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in title and description');
      return;
    }

    setLoading(true);

    try {
      const url = editingId ? `/api/activities/${editingId}` : '/api/activities';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      
      if (data.success) {
        await fetchActivities();
        resetForm();
        alert(editingId ? 'Activity updated successfully!' : 'Activity created successfully!');
      } else {
        alert(data.error || 'Failed to save activity');
      }
    } catch (error) {
      alert('Error saving activity');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity) => {
    setFormData({
      title: activity.title,
      description: activity.description,
      content: activity.content || '',
      image: activity.image || ''
    });
    setImagePreview(activity.image || '');
    setEditingId(activity.id);
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleDelete = async (id) => {
    const activity = activities.find(a => a.id === id);
    const confirmMsg = activity?.image 
      ? 'This will delete the activity and its image from S3. Are you sure?' 
      : 'Are you sure you want to delete this activity?';
    
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/activities/${id}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        await fetchActivities();
        const message = data.imageDeleted 
          ? 'Activity and image deleted successfully!' 
          : 'Activity deleted successfully!';
        alert(message);
      } else {
        alert(data.error || 'Failed to delete activity');
      }
    } catch (error) {
      alert('Error deleting activity');
      console.error(error);
    }
    setOpenMenuId(null);
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', content: '', image: '' });
    setImagePreview('');
    setEditingId(null);
    setIsModalOpen(false);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Activities Management</h1>
            <p className="text-gray-600 mt-1">Ceritakan pengalaman dan filosofi  aktivitasmu bersama anak-anak</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Add Activity
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-y-auto mb-10">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No activities found. Click Add Activity to create one.
                  </td>
                </tr>
              ) : (
                activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      {activity.image ? (
                        <img 
                          src={activity.image} 
                          alt={activity.title} 
                          className="w-16 h-16 object-cover rounded-lg shadow-sm" 
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          No image
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleDateString('id-ID')}{" "}
                        by {activity.created_by}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                        {activity.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-md line-clamp-2">
                        {activity.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => toggleMenu(activity.id)}
                          className="menu-button p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>
                        
                        {openMenuId === activity.id && (
                          <div className="menu-dropdown absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button
                              onClick={() => handleEdit(activity)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit Activity
                            </button>
                            <button
                              onClick={() => handleDelete(activity.id)}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Activity
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Activity' : 'Add New Activity'}
                  </h2>
                  <button 
                    onClick={resetForm} 
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter activity title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <p className="text-xs text-gray-500 mt-1">Slug will be auto-generated from title</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter short description"
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Enter detailed content (optional)"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <div className="flex items-start gap-4">
                      <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                        <Upload className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          {uploading ? 'Uploading...' : 'Upload to S3'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      {imagePreview && (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-24 h-24 object-cover rounded-lg shadow-sm" 
                          />
                          <button
                            onClick={() => {
                              setImagePreview('');
                              setFormData({ ...formData, image: '' });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Maximum file size: 5MB</p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || uploading}
                      className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-5 h-5" />
                      {loading ? 'Saving...' : editingId ? 'Update Activity' : 'Create Activity'}
                    </button>
                    <button
                      onClick={resetForm}
                      disabled={loading}
                      className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}