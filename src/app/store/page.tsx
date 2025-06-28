import { Metadata } from 'next';
import StoreGrid from '@/components/StoreGrid';

export const metadata: Metadata = {
  title: 'Store | Journt',
  description: 'Shop digital downloads for your next adventure.'
};

export default function StorePage() {
  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Journt Store</h1>
      <StoreGrid />
    </main>
  );
}
