import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, deleteCardAsync } from '../store/slices/cardSlice';
import { toast } from 'react-hot-toast';
import { Search, Loader2 } from 'lucide-react';
import Card from '../components/Card';

const View = () => {
  const dispatch = useDispatch();
  const { cards, loading, error } = useSelector((state) => state.cards);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  const handleDeleteCard = async (cardId) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this card? This action cannot be undone.');
    
    if (!isConfirmed) {
      return;
    }

    try {
      await dispatch(deleteCardAsync(cardId)).unwrap();
      toast.success('Card deleted successfully');
    } catch (error) {
      toast.error(error || 'Failed to delete card');
    }
  };

  // Filter cards based on search and filters
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || card.type === filterType;
    const matchesCategory = filterCategory === 'all' || card.category === filterCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Get unique types and categories for filters
  const types = [...new Set(cards.map(card => card.type))];
  const categories = [...new Set(cards.map(card => card.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading cards...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading cards: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          View Cards ({filteredCards.length})
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse and view your learning cards
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="sm:w-48">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Types</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="sm:w-48">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredCards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
          {cards.length === 0 ? (
            <div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No cards found. Upload some content to get started!
              </p>
              <a
                href="/upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Upload Content
              </a>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No cards match your current search and filter criteria.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map((card) => (
            <Card 
              key={card._id} 
              card={card} 
              onDelete={handleDeleteCard}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default View;

