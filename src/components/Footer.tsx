import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-foreground/10">
      <div className="container mx-auto px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-heading text-xl font-bold">U1</span>
              </div>
              <span className="font-heading text-2xl text-foreground">UniOne</span>
            </div>
            <p className="font-paragraph text-foreground/70 leading-relaxed">
              Empowering engineering students with cutting-edge educational technology and premium learning resources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xl text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Explore Free', path: '/explore-free' },
                { name: 'UniOne Store', path: '/store' },
                { name: 'Premium Notes', path: '/premium' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-paragraph text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Student Resources */}
          <div>
            <h3 className="font-heading text-xl text-foreground mb-6">For Students</h3>
            <ul className="space-y-3">
              {[
                { name: 'Register', path: '/register' },
                { name: 'Login', path: '/login' },
                { name: 'Student Dashboard', path: '/student-dashboard' },
                { name: 'Scholarships', path: '/scholarships' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-paragraph text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading text-xl text-foreground mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="font-paragraph text-foreground/70">support@unione.edu</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="font-paragraph text-foreground/70">+91 1800-123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="font-paragraph text-foreground/70">Engineering Campus, Tech City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="font-paragraph text-foreground/60 text-sm">
              © {new Date().getFullYear()} UniOne. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy" className="font-paragraph text-foreground/60 hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="font-paragraph text-foreground/60 hover:text-primary text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
