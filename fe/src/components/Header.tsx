import React from 'react';
import { FileText, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

export const Header: React.FC = () => {
  const { signout } = useAuth();

  return (
    <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40 backdrop-blur-lg bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Second Brain</h1>
              <p className="text-sm text-gray-400">Your knowledge hub</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <User size={18} />
              Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={signout}>
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};