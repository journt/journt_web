import { Metadata } from 'next';
import BlogList from '@/components/BlogList';

export const metadata: Metadata = {
  title: 'Blog | Journt',
  description: 'Travel tips, inspiration, and stories from Journt.'
};

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Journt Blog</h1>
      <BlogList />
    </main>
  );
}
