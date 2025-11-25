import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Generator } from './components/Generator';
import { Library } from './components/Library';
import { Profile } from './components/Profile';
import { View, UserState } from './types';
import { initializeUser, isStorageAvailable } from './services/storageService';
import { BLOCK_MSG } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('generator');
  const [user, setUser] = useState<UserState | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    // 1. Check for Anti-Circumvention (Incognito/Storage disabled)
    if (!isStorageAvailable()) {
      setIsBlocked(true);
      return;
    }

    // 2. Initialize User & Credits
    const currentUser = initializeUser();
    setUser(currentUser);

    // 3. Check Account Block status
    if (currentUser.isBlocked) {
      setIsBlocked(true);
    }
  }, []);

  const refreshUser = () => {
    const updated = initializeUser();
    setUser(updated);
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md text-center border-t-8 border-brand-danger">
          <i className="fa-solid fa-ban text-6xl text-brand-danger mb-6"></i>
          <h1 className="text-2xl font-black text-gray-800 mb-4">Acesso Bloqueado</h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">
            {BLOCK_MSG}
          </p>
          <button className="w-full bg-brand-purple text-white py-4 rounded-xl font-bold text-xl">
            Entrar em Contato
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-brand-purple"><i className="fa-solid fa-circle-notch fa-spin text-4xl"></i></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      <Header currentView={currentView} setView={setCurrentView} />
      
      <main className="max-w-2xl mx-auto">
        {currentView === 'generator' && (
          <Generator user={user} refreshUser={refreshUser} setView={setCurrentView} />
        )}
        {currentView === 'library' && (
          <Library />
        )}
        {currentView === 'profile' && (
          <Profile user={user} />
        )}
      </main>
    </div>
  );
};

export default App;