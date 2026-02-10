import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { Smartphone, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-blue-600 font-bold text-xl">
              <Smartphone className="h-6 w-6" />
              <span>MobileShowroom</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAdmin ? (
              <>
                <Link to="/admin/dashboard" className="flex items-center text-gray-600 hover:text-blue-600">
                  <LayoutDashboard className="h-5 w-5 mr-1" />
                  <span className="hidden sm:block">Dashboard</span>
                </Link>
                <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                  <LogOut className="h-5 w-5 mr-1" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Shop Owner Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}