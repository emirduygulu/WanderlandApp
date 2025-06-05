import React, { createContext, ReactNode, useContext, useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { blogData as initialBlogData } from '../data/BlogData';

interface BlogPost {
  id: number;
  blogTitle: string;
  blogContent: string;
  yazar: string;
  tarih: string;
  kategori: string;
  resim: ImageSourcePropType;
  konum: string;
  okunmaSuresi: string;
  additionalImages?: string[];
}

interface BlogContextType {
  blogs: BlogPost[];
  addBlog: (blog: Omit<BlogPost, 'id' | 'tarih' | 'okunmaSuresi'>) => void;
  refreshBlogs: () => void;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogData);

  const calculateReadingTime = (content: string): string => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} dk`;
  };

  const addBlog = (blogData: Omit<BlogPost, 'id' | 'tarih' | 'okunmaSuresi'>) => {
    const newBlog: BlogPost = {
      ...blogData,
      id: Date.now(), // Simple ID generation
      tarih: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      okunmaSuresi: calculateReadingTime(blogData.blogContent),
    };

    setBlogs(prevBlogs => [newBlog, ...prevBlogs]); // Yeni blog'u en başa ekle
  };

  const refreshBlogs = () => {
    // Bu fonksiyon gelecekte API'den veri çekmek için kullanılabilir
    console.log('Refreshing blogs...');
  };

  return (
    <BlogContext.Provider value={{ blogs, addBlog, refreshBlogs }}>
      {children}
    </BlogContext.Provider>
  );
}; 