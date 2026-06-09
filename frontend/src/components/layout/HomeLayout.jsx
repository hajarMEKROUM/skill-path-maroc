import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

const HomeLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SP</span>
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">
                  Skill Path <span className="text-primary-600">Maroc</span>
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2">
                    <LayoutDashboard size={18} /> Tableau de bord
                  </Link>
                  <Link to="/dashboard/profile" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2">
                    <User size={18} /> Profil
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 font-medium flex items-center gap-2"
                  >
                    <LogOut size={18} /> Déconnexion
                  </button>
                  {user?.name && (
                    <span className="text-sm text-gray-500">Bonjour, {user.name.split(' ')[0]}</span>
                  )}
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Connexion</Link>
                  <Link to="/register" className="btn-primary py-2 px-5">S&apos;inscrire</Link>
                </>
              )}
            </div>

            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Tableau de bord</Link>
                <Link to="/dashboard/profile" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Profil</Link>
                <button type="button" onClick={() => { setIsMenuOpen(false); handleLogout(); }} className="block w-full text-left px-3 py-3 text-base font-medium text-red-600">
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                <Link to="/register" className="block px-3 py-3 mt-1 text-center bg-primary-600 text-white rounded-md text-base font-medium" onClick={() => setIsMenuOpen(false)}>S&apos;inscrire</Link>
              </>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SP</span>
                </div>
                <span className="font-bold text-xl tracking-tight">Skill Path Maroc</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Plateforme marocaine pour apprendre la programmation et accéder à des opportunités freelance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-6 text-gray-100">Plateforme</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/courses" className="hover:text-primary-400 transition-colors">Catalogue de cours</Link></li>
                <li><Link to="/dashboard/jobs" className="hover:text-primary-400 transition-colors">Missions freelance</Link></li>
                <li><Link to="/community" className="hover:text-primary-400 transition-colors">Forum</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-6 text-gray-100">Ressources</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                {!isAuthenticated && <li><Link to="/register" className="hover:text-primary-400 transition-colors">Créer un compte</Link></li>}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-6 text-gray-100">Contact</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>contact@skillpathmaroc.ma</li>
                <li>Casablanca, Maroc</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-gray-500 text-center">
            <p>&copy; {new Date().getFullYear()} Skill Path Maroc. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
