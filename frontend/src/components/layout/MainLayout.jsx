import { Outlet, Link } from 'react-router-dom';
import { BookOpen, Briefcase, Search, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-soft sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SP</span>
                </div>
                <span className="font-bold text-xl text-gray-900 tracking-tight">Skill Path <span className="text-primary-600">Maroc</span></span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/courses" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
                <BookOpen size={18} /> Courses
              </Link>
              <Link to="/marketplace" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-2 transition-colors">
                <Briefcase size={18} /> Marketplace
              </Link>
              
              <div className="flex items-center gap-4 ml-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">Log in</Link>
                <Link to="/register" className="btn-primary py-2 px-5">Get Started</Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg absolute w-full">
            <Link to="/courses" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 flex items-center gap-3">
              <BookOpen size={18} /> Courses
            </Link>
            <Link to="/marketplace" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 flex items-center gap-3">
              <Briefcase size={18} /> Marketplace
            </Link>
            <div className="border-t border-gray-100 my-2 pt-2">
              <Link to="/login" className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50">Log in</Link>
              <Link to="/register" className="block px-3 py-3 mt-1 text-center bg-primary-600 text-white rounded-md text-base font-medium hover:bg-primary-700">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">SP</span>
                </div>
                <span className="font-bold text-xl tracking-tight">Skill Path Maroc</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering the Moroccan community with world-class education and freelance opportunities. Learn, teach, work, and grow.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-6 text-gray-100">Platform</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/courses" className="hover:text-primary-400 transition-colors">Browse Courses</Link></li>
                <li><Link to="/marketplace" className="hover:text-primary-400 transition-colors">Freelance Jobs</Link></li>
                <li><Link to="/instructors" className="hover:text-primary-400 transition-colors">Become an Instructor</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-gray-100">Resources</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-primary-400 transition-colors">Blog</Link></li>
                <li><Link to="/help" className="hover:text-primary-400 transition-colors">Help Center</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-6 text-gray-100">Contact</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li>contact@skillpathmaroc.ma</li>
                <li>+212 500 000 000</li>
                <li>Casablanca, Morocco</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} Skill Path Maroc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
