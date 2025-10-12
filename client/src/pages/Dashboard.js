import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from '../store/slices/cardSlice';
import { fetchCollections } from '../store/slices/collectionSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { cards, loading: cardsLoading } = useSelector(state => state.cards);
  const { collections, loading: collectionsLoading } = useSelector(state => state.collections);

  React.useEffect(() => {
    dispatch(fetchCards());
    dispatch(fetchCollections());
  }, [dispatch]);

  const recentCards = cards.slice(0, 6);
  const recentCollections = collections.slice(0, 3);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to Your Card Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your learning cards and collections
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/upload"
          className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Upload Content</h3>
          <p className="text-blue-100">Add new files to create cards</p>
        </Link>
        
        <Link
          to="/cards"
          className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">View Cards</h3>
          <p className="text-green-100">Browse all your cards</p>
        </Link>
        
        <Link
          to="/collections"
          className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md transition-colors"
        >
          <h3 className="text-xl font-semibold mb-2">Collections</h3>
          <p className="text-purple-100">Organize your cards</p>
        </Link>
      </div>

      {/* Recent Cards */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Recent Cards
          </h2>
          <Link
            to="/cards"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            View All
          </Link>
        </div>
        
        {cardsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading cards...</p>
          </div>
        ) : recentCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCards.map(card => (
              <div
                key={card._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {card.type} • {card.category}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {card.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No cards yet. Upload some content to get started!
            </p>
            <Link
              to="/upload"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Upload Content
            </Link>
          </div>
        )}
      </div>

      {/* Recent Collections */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Recent Collections
          </h2>
          <Link
            to="/collections"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            View All
          </Link>
        </div>
        
        {collectionsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading collections...</p>
          </div>
        ) : recentCollections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCollections.map(collection => (
              <div
                key={collection._id}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {collection.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {collection.cards?.length || 0} cards
                </p>
                {collection.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {collection.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No collections yet. Create your first collection!
            </p>
            <Link
              to="/collections"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Create Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
