'use client';

import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import axios from "axios";
import ShortDateTime from "../components/ShortDateTime";
import Image from "next/image";

const Page = ({params}) => {
    // const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const blogAPI = "https://sassymoms.com.au";

    useEffect(() => {
        const slug =  params.slug;
        if (!slug) return; // Wait until slug is available

        const fetchPost = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${blogAPI}/wp-json/wp/v2/posts?slug=${slug}`
                );
                if (response.data.length > 0) {
                    const post = response.data[0];
                    const mediaResponse = await axios.get(
                        `${blogAPI}/wp-json/wp/v2/media/${post.featured_media}`
                    );
                    setPost({
                        ...post,
                        jetpack_featured_media_url: mediaResponse.data.source_url,
                    });
                } else {
                    setError("Post not found");
                }
            } catch (err) {
                setError("Error fetching post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params.slug]); // Add slug to dependency array

    if (!params.slug) {
        return <div className="text-center py-10">Loading slug...</div>;
    }

    if (loading) {
        return <div className="text-center py-10">Loading post...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!post) {
        return <div className="text-center py-10">No post data available</div>;
    }

    return (
        <div className="px-6 py-8 max-w-3xl mx-auto">
            {/* Post Title */}
            <h1
                className="text-3xl font-bold mb-4"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            ></h1>

            {/* Metadata */}
            <div className="text-sm text-gray-600 mb-6">
                {post.modified !== post.date && <ShortDateTime datetime={post.modified} />}
                {post._embedded?.author && (
                    <p>Author: {post._embedded.author[0].name}</p>
                )}
            </div>

            {/* Featured Media */}
            {post.jetpack_featured_media_url && (
                <Image
                    src={post.jetpack_featured_media_url}
                    alt={post.title.rendered}
                    className="w-full mb-6 rounded"
                />
            )}

            {/* Post Content */}
            <div
                className="max-w-none mt-10"
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            ></div>
        </div>
    );
};

export default Page;
