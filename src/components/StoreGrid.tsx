const products = [
  {
    id: 1,
    title: 'Ultimate Europe Packing List (PDF)',
    description: 'Minimalist, printable checklist for any trip.',
    price: '$5',
    image: '/store/packing-list.jpg',
    link: '#', // Replace with Gumroad/Stripe link
  },
  {
    id: 2,
    title: 'City Guide Template (Notion)',
    description: 'Plan your city adventures with this Notion template.',
    price: '$7',
    image: '/store/city-guide.jpg',
    link: '#',
  },
  {
    id: 3,
    title: 'Travel Budget Spreadsheet',
    description: 'Google Sheets for tracking expenses on the go.',
    price: '$4',
    image: '/store/budget.jpg',
    link: '#',
  },
];

export default function StoreGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="rounded-xl shadow-lg bg-white hover:shadow-xl transition p-6 flex flex-col">
          <div className="mb-4 rounded-lg overflow-hidden aspect-video bg-gray-100">
            {/* Replace with actual images */}
            <img src={product.image} alt={product.title} className="object-cover w-full h-full" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
          <p className="text-gray-600 mb-2 flex-1">{product.description}</p>
          <div className="flex items-center justify-between mt-4">
            <span className="font-bold text-lg text-primary">{product.price}</span>
            <a href={product.link} target="_blank" rel="noopener noreferrer" className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-primary/90 transition">Buy Now</a>
          </div>
        </div>
      ))}
    </div>
  );
}
