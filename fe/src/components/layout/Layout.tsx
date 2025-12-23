import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signout } = useAuth();

  const handleLogout = () => {
    signout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/home" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="text-xl font-semibold">Second Brain</span>
            </Link>
            
            <nav className="flex items-center gap-1">
              <Link to="/home">
                <Button 
                  variant={isActive('/home') ? "secondary" : "ghost"} 
                  size="sm"
                  className={isActive('/home') ? 'bg-secondary' : ''}
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button 
                  variant={isActive('/profile') ? "secondary" : "ghost"} 
                  size="sm"
                  className={isActive('/profile') ? 'bg-secondary' : ''}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>

              <div className="w-px h-6 bg-border mx-2" />
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {children}
    </div>
  );
};

export default Layout;