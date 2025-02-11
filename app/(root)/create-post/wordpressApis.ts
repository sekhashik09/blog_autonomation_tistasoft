import axios, { AxiosInstance } from 'axios';

interface Site {
  id?: number;
  name: string;
  url: string;
  username: string;
  password: string;
}

interface Post {
  title: string;
  content: string;
  status?: string;
  date?: string;
}

interface WordPressPostResponse {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  status: string;
  date: string;
}

const createApiClient = (url: string, username: string, password: string): AxiosInstance => {
  return axios.create({
    baseURL: `${url}/wp-json/wp/v2`,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    },
  });
};

export const getPosts = async (site: Site): Promise<WordPressPostResponse[]> => {
  try {
    const client = createApiClient(site.url, site.username, site.password);
    const response = await client.get<WordPressPostResponse[]>('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

export const createPost = async (site: Site, post: Post): Promise<WordPressPostResponse | null> => {
  try {
    const client = createApiClient(site.url, site.username, site.password);
    const response = await client.post<WordPressPostResponse>('/posts', post);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    return null;
  }
};

export const updatePost = async (site: Site, postId: number, post: Post): Promise<WordPressPostResponse | null> => {
  try {
    const client = createApiClient(site.url, site.username, site.password);
    const response = await client.put<WordPressPostResponse>(`/posts/${postId}`, post);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    return null;
  }
};

export const deletePost = async (site: Site, postId: number): Promise<boolean> => {
  try {
    const client = createApiClient(site.url, site.username, site.password);
    await client.delete(`/posts/${postId}`);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    return false;
  }
};
