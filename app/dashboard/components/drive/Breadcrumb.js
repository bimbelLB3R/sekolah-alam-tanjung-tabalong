// components/drive/Breadcrumb.jsx
'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ path = [] }) {
  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        href="/drive"
        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Home className="h-4 w-4" />
        <span>My Drive</span>
      </Link>

      {path.map((folder, index) => (
        <div key={folder.id} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {index === path.length - 1 ? (
            <span className="font-medium text-gray-900">{folder.name}</span>
          ) : (
            <Link
              href={`/drive/${folder.id}`}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {folder.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}