import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMember } from '@/integrations';
import Cart from '@/components/Cart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { member, isAuthenticated, isLoading, actions } = useMember();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore Free', path: '/explore-free' },
    { name: 'UniOne Store', path: '/store' },
    { name: 'Notes Premium', path: '/premium' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-foreground/10">
        <div className="container mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-heading text-xl font-bold">U1</span>
              </div>
              <span className="font-heading text-2xl text-foreground">UniOne</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-paragraph text-base transition-colors ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoading ? (
                <div className="w-20 h-10 bg-glassmorphism-overlay animate-pulse rounded-lg" />
              ) : isAuthenticated ? (
                <>
                  <Link to={member?.profile?.nickname?.includes('admin') ? '/admin-dashboard' : '/student-dashboard'}>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 font-paragraph">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={actions.logout}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-paragraph"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 font-paragraph">
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-foreground"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden mt-6 pb-6 space-y-4 border-t border-foreground/10 pt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block font-paragraph text-base transition-colors ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-foreground/70 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="space-y-3 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link to={member?.profile?.nickname?.includes('admin') ? '/admin-dashboard' : '/student-dashboard'}>
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10 font-paragraph"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        actions.logout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-paragraph"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10 font-paragraph"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Button>
                    </Link>
                    <Link to="/register">
                      <Button
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-paragraph"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
      <Cart />
    </>
  );
}
