import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-24 h-24 bg-gray-100 rounded-[2.5rem] flex items-center justify-center text-gray-400">
        <Construction size={48} />
      </div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">{description}</p>
      </div>
      <div className="bg-blue-50 text-blue-600 px-6 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest">
        Coming Soon
      </div>
    </div>
  );
}
