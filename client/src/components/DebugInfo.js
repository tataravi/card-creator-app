import React from 'react';
import { useSelector } from 'react-redux';

const DebugInfo = () => {
  const auth = useSelector((state) => state.auth);
  const cards = useSelector((state) => state.cards);
  const collections = useSelector((state) => state.collections);

  return (
    <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <div>Auth: {auth.isAuthenticated ? '✅' : '❌'}</div>
        <div>Token: {auth.token ? '✅' : '❌'}</div>
        <div>User: {auth.user?.name || 'None'}</div>
        <div>Cards: {cards.cards.length} (loading: {cards.loading ? '✅' : '❌'})</div>
        <div>Collections: {collections.collections.length} (loading: {collections.loading ? '✅' : '❌'})</div>
        {cards.error && <div className="text-red-400">Cards Error: {cards.error}</div>}
        {collections.error && <div className="text-red-400">Collections Error: {collections.error}</div>}
        {auth.error && <div className="text-red-400">Auth Error: {auth.error}</div>}
      </div>
    </div>
  );
};

export default DebugInfo;
