'use client';

import React, { useState, useEffect } from 'react';
import { getPosts, createPost, deletePost, updatePost } from './wordpressApis';

interface Site {
  id: number;
  name: string;
  url: string;
  username: string;
  password: string;
}

interface WordPressPostResponse {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  status: string;
  date: string;
}

export default function Page() {
  const sites = [
    { id: 2, name: 'Newsbyte', url: 'https://newsbyte.com.au', username: 'editor', password: '4UUa k7jm RgPs syQc 78OT a38e' },
  ];

  const [selectedSite, setSelectedSite] = useState<Site>(sites[0]);
  const [posts, setPosts] = useState<WordPressPostResponse[]>([]);
  const [postForm, setPostForm] = useState({ id: null as number | null, title: '', content: '', status: 'draft', date: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts(selectedSite);
      setPosts(data);
    };
    fetchPosts();
  }, [selectedSite]);

  const handleSubmit = async () => {
    if (!postForm.title || !postForm.content) {
      alert('Title and content are required');
      return;
    }

    const post = {
      title: postForm.title,
      content: postForm.content,
      status: postForm.status,
      date: postForm.date || new Date().toISOString(),
    };

    if (isEditing && postForm.id) {
      const updatedPost = await updatePost(selectedSite, postForm.id, post);
      if (updatedPost) {
        setPosts(posts.map(p => p.id === postForm.id ? updatedPost : p));
        resetForm();
      }
    } else {
      const createdPost = await createPost(selectedSite, post);
      if (createdPost) {
        setPosts([...posts, createdPost]);
        resetForm();
      }
    }
  };

  const handleEdit = (post: WordPressPostResponse) => {
    const confirmEdit = window.confirm('Are you sure you want to edit this post? Any unsaved changes in the form will be replaced.');
    if (confirmEdit) {
      setPostForm({
        id: post.id,
        title: post.title.rendered,
        content: post.content.rendered,
        status: post.status,
        date: post.date
      });
      setIsEditing(true);
    }
  };

  const handleDelete = async (postId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    if (confirmDelete) {
      const success = await deletePost(selectedSite, postId);
      if (success) {
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
      }
    }
  };

  const resetForm = () => {
    setPostForm({ id: null, title: '', content: '', status: 'draft', date: '' });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage WordPress Posts</h1>

        {/* Site Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label className="block text-gray-700 font-medium mb-2">Select Site</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition"
            value={selectedSite.id}
            onChange={(e) => {
              const site = sites.find((s) => s.id === Number(e.target.value));
              if (site) setSelectedSite(site);
            }}
          >
            {sites.map((site) => (
              <option key={site.id} value={site.id}>{site.name}</option>
            ))}
          </select>
        </div>

        {/* Post Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{isEditing ? 'Edit Post' : 'Create New Post'}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Title</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Content</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition"
                rows={6}
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">Status</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition"
                value={postForm.status}
                onChange={(e) => setPostForm({ ...postForm, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="publish">Publish</option>
                <option value="future">Schedule</option>
              </select>
            </div>

            {postForm.status === 'future' && (
              <div>
                <label className="block text-gray-700 font-medium mb-2">Schedule Date</label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 transition"
                  value={postForm.date}
                  onChange={(e) => setPostForm({ ...postForm, date: e.target.value })}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
                onClick={handleSubmit}
              >
                {isEditing ? 'Update Post' : 'Create Post'}
              </button>
              {isEditing && (
                <button
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition font-medium"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Post List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-600">No posts available.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  <h3 className="text-lg font-semibold text-gray-800">{post.title.rendered}</h3>
                  <p className="text-gray-600 capitalize">Status: {post.status}</p>
                  <div className="mt-3 flex gap-3">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                      onClick={() => handleEdit(post)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}