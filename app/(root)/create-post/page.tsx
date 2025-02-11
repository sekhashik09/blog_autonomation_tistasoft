'use client';

import React, { useState, useEffect } from 'react';
import { getPosts, createPost, deletePost } from './wordpressApis';

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
  const [newPost, setNewPost] = useState({ title: '', content: '', status: 'draft', date: '' });

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts(selectedSite);
      setPosts(data);
    };
    fetchPosts();
  }, [selectedSite]);

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content) {
      alert('Title and content are required');
      return;
    }

    const post = {
      title: newPost.title,
      content: newPost.content,
      status: newPost.status,
      date: newPost.date || new Date().toISOString(),
    };

    const createdPost = await createPost(selectedSite, post);
    if (createdPost) {
      setPosts([...posts, createdPost]);
      setNewPost({ title: '', content: '', status: 'draft', date: '' });
    }
  };

  return (
    <div className="bg-white text-black p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Posts</h1>

      {/* Site Selection */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Site</label>
        <select
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
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

      {/* Post Creation */}
      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Content</label>
        <textarea
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Status</label>
        <select
          className="mt-1 block w-full p-2 border border-gray-300 rounded"
          value={newPost.status}
          onChange={(e) => setNewPost({ ...newPost, status: e.target.value })}
        >
          <option value="draft">Draft</option>
          <option value="publish">Publish</option>
          <option value="future">Schedule</option>
        </select>
      </div>

      {newPost.status === 'future' && (
        <div className="mb-4">
          <label className="block text-gray-700">Schedule Date</label>
          <input
            type="datetime-local"
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
            value={newPost.date}
            onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
          />
        </div>
      )}

      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCreatePost}>
        Create Post
      </button>

      {/* Post List */}
      <div className="mt-6">
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts available.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow mb-4">
              <h2 className="text-xl font-semibold">{post.title.rendered}</h2>
              <p className="text-gray-600">{post.status}</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-2"
                onClick={async () => {
                  const success = await deletePost(selectedSite, post.id);
                  if (success) {
                    setPosts((prevPosts) => prevPosts.filter((p) => p.id !== post.id));
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
