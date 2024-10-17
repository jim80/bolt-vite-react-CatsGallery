import { useState, useEffect } from 'react';
import { Grid, Plus } from 'lucide-react';

const UNSPLASH_ACCESS_KEY = 'GSPyo3XK16g0lBhVBnHLnuSUjq_h4GUkWEvOax6KRm4';

interface Photo {
  id: string;
  urls: {
    regular: string;
  };
  alt_description: string;
  uniqueKey: string;
}

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async (loadMore = false) => {
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=burman+cat&per_page=10&page=${page}`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      const data = await response.json();
      if (loadMore) {
        setPhotos((prevPhotos) => [
          ...prevPhotos,
          ...data.results.map((photo: Photo) => ({
            ...photo,
            uniqueKey: `${photo.id}-${page}`, // Add a unique key
          })),
        ]);
      } else {
        setPhotos(
          data.results.map((photo: Photo) => ({
            ...photo,
            uniqueKey: `${photo.id}-${page}`, // Add a unique key
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchPhotos(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold flex items-center">
            <Grid className="mr-2" />
            Cats Gallery
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.uniqueKey} // Use the new unique key
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <img
                src={photo.urls.regular}
                alt={photo.alt_description}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
            ) : (
              <Plus className="mr-2" />
            )}
            Load More Cats
          </button>
        </div>
      </main>
      <footer className="bg-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Images provided by Unsplash</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
