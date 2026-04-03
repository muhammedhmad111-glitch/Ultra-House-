import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Trash2, 
  RefreshCw, 
  Search, 
  MessageSquare,
  Filter,
  ExternalLink,
  User as UserIcon
} from 'lucide-react';
import { getAllReviews, deleteReview } from '../../services/reviewService';
import { Review } from '../../types';
import Button from '../../components/ui/Button';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string, reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(productId, reviewId);
        toast.success("Review deleted successfully!");
        fetchReviews();
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(search.toLowerCase()) || 
                          r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter;
    return matchesSearch && matchesRating;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor and manage customer feedback across all products.</p>
        </div>
        <Button variant="outline" onClick={fetchReviews} disabled={loading}>
          <RefreshCw className={cn("mr-2", loading && "animate-spin")} size={18} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-white p-4 rounded-3xl border shadow-sm">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search reviews by user or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl text-sm outline-none focus:ring-2 ring-black/5 transition-all"
          />
        </div>
        <div className="md:col-span-4 flex items-center gap-2">
          <Filter className="text-gray-400" size={18} />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm font-bold outline-none border border-transparent focus:border-gray-200 transition-all"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm">
          <RefreshCw className="animate-spin text-gray-400 mx-auto mb-2" size={32} />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading Reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border shadow-sm text-gray-500 font-medium">
          No reviews found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-3xl border shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-grow space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <UserIcon size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{review.userName}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={cn(
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="text-gray-400 mt-1 flex-shrink-0" size={16} />
                      <p className="text-sm text-gray-700 leading-relaxed italic">"{review.comment}"</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Link 
                      to={`/product/${review.productId}`} 
                      target="_blank"
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline"
                    >
                      View Product <ExternalLink size={12} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(review.productId, review.id)}
                      className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                      <Trash2 size={12} />
                      Delete Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
