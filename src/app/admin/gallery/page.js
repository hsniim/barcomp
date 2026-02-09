// app/admin/gallery/page.js
// FIXED: Soft delete confirmation (shows deleted_at in console for debugging)
// No major changes needed as DELETE is handled by API route
// Added better error handling for delete operations

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function GalleryListPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    console.log('[GalleryList] Fetching gallery items');
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      
      if (!res.ok) {
        throw new Error('Gagal memuat gallery');
      }

      const data = await res.json();
      console.log('[GalleryList] Fetched items:', data.length);
      setItems(data);
    } catch (error) {
      console.error('[GalleryList] Fetch error:', error);
      toast.error('Gagal memuat gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Yakin ingin menghapus "${title}"?`)) {
      return;
    }

    console.log('[GalleryList] Deleting item:', id);
    setDeleting(id);

    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      console.log('[GalleryList] Delete response:', data);

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menghapus');
      }

      toast.success('Gallery item berhasil dihapus');
      
      // Remove from local state
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('[GalleryList] Delete error:', error);
      toast.error(error.message || 'Gagal menghapus gallery item');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Memuat gallery...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gallery Management</h1>
        <Link
          href="/admin/gallery/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Tambah Gallery
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-500">Belum ada gallery item</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden shadow">
              <img
                src={item.thumbnail_url || item.image_url}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                {item.category && (
                  <span className="inline-block px-2 py-1 text-xs bg-gray-200 rounded mb-2">
                    {item.category}
                  </span>
                )}
                {item.featured && (
                  <span className="inline-block px-2 py-1 text-xs bg-yellow-200 rounded mb-2 ml-2">
                    Featured
                  </span>
                )}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description || 'Tidak ada deskripsi'}
                </p>
                
                <div className="flex gap-2">
                  <Link
                    href={`/admin/gallery/edit/${item.id}`}
                    className="flex-1 text-center px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={deleting === item.id}
                    className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                  >
                    {deleting === item.id ? 'Menghapus...' : 'Hapus'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}