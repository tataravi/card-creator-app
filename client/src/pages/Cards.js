import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards, deleteCardAsync } from '../store/slices/cardSlice';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  Calendar,
  Tag,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

const Cards = () => {
  const dispatch = useDispatch();
  const { cards, loading, error } = useSelector((state) => state.cards);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCard, setSelectedCard] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCards());
  }, [dispatch]);

  const handleDeleteCard = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      try {
        await dispatch(deleteCardAsync(cardId)).unwrap();
        toast.success('Card deleted successfully');
      } catch (error) {
        toast.error('Failed to delete card');
      }
    }
  };

  const handleViewCard = (card) => {
    setSelectedCard(card);
    setShowModal(true);
  };

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchesType = selectedType === 'all' || card.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [...new Set(cards.map(card => card.category))];
  const types = [...new Set(cards.map(card => card.type))];

  const getTypeIcon = (type) => {
    const icons = {
      concept: <FileText className="h-4 w-4" />,
      action: <Tag className="h-4 w-4" />,
      quote: <Star className="h-4 w-4" />,
      checklist: <Tag className="h-4 w-4" />,
      mindmap: <Tag className="h-4 w-4" />
    };
    return icons[type] || <FileText className="h-4 w-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      concept: 'bg-blue-100 text-blue-800',
      action: 'bg-green-100 text-green-800',
      quote: 'bg-purple-100 text-purple-800',
      checklist: 'bg-orange-100 text-orange-800',
      mindmap: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        Error loading cards: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Cards ({filteredCards.length})
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and view your learning cards
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cards by title, content, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Card
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCards.map((card) => (
                <tr key={card._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getTypeColor(card.type)}`}>
                          {getTypeIcon(card.type)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {card.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">
                          {card.content}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(card.type)}`}>
                      {card.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {card.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {card.source}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewCard(card)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Edit functionality */}}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCard(card._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedCategory !== 'all' || selectedType !== 'all' 
                ? 'No cards match your filters' 
                : 'No cards found. Upload some content to get started!'}
            </div>
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {showModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getTypeColor(selectedCard.type)}`}>
                    {getTypeIcon(selectedCard.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {selectedCard.title}
                    </h2>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedCard.type)}`}>
                        {selectedCard.type}
                      </span>
                      <span>{selectedCard.category}</span>
                      {selectedCard.metadata?.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span>{selectedCard.metadata.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="space-y-6">
                {/* Content */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Content</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedCard.content}
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {selectedCard.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCard.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Attachments */}
                {selectedCard.attachments && selectedCard.attachments.some(att => att.mimetype && att.mimetype.startsWith('image/')) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Attachments</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedCard.attachments
                        .filter(att => att.mimetype && att.mimetype.startsWith('image/'))
                        .map((attachment, index) => (
                          <div key={index} className="relative">
                            <img
                              src={`/uploads/${attachment.filename}`}
                              alt={attachment.originalName}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Source:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{selectedCard.source}</span>
                    </div>
                    {selectedCard.metadata?.lastReviewed && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Last Reviewed:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {new Date(selectedCard.metadata.lastReviewed).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedCard.metadata?.difficulty && (
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Difficulty:</span>
                        <span className="ml-2 text-gray-900 dark:text-white">{selectedCard.metadata.difficulty}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {/* Edit functionality */}}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
