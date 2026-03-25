import { Link } from 'react-router-dom';
import { Leaf, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-green-900 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">EcoTrack</span>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Promoting sustainable waste management through technology. 
              Join us in making Kenya cleaner and greener.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/EcoTrack"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EcoTrack on Facebook"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.twitter.com/EcoTrack"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EcoTrack on Twitter"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/EcoTrack"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EcoTrack on Instagram"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/ecotrack"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="EcoTrack on LinkedIn"
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-green-100 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/waste-categories" className="text-green-100 hover:text-white transition-colors text-sm">
                  Waste Categories
                </Link>
              </li>
              <li>
                <Link to="/recycling-centers" className="text-green-100 hover:text-white transition-colors text-sm">
                  Recycling Centers
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-green-100 hover:text-white transition-colors text-sm">
                  Rewards Program
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="text-green-100 hover:text-white transition-colors text-sm">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Waste Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Waste Types</h3>
            <ul className="space-y-2">
              <li className="text-green-100 text-sm flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Plastic
              </li>
              <li className="text-green-100 text-sm flex items-center">
                <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
                Paper
              </li>
              <li className="text-green-100 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Glass
              </li>
              <li className="text-green-100 text-sm flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                Metal
              </li>
              <li className="text-green-100 text-sm flex items-center">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                Organic
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start text-green-100 text-sm">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>123 Eco Street, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center text-green-100 text-sm">
                <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>+254 712 345 678</span>
              </li>
              <li className="flex items-center text-green-100 text-sm">
                <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>info@ecotrack.co.ke</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
          <p className="text-green-100 text-sm text-center md:text-left">
            {currentYear} EcoTrack. All rights reserved.
          </p>
          <p className="text-green-100 text-sm mt-2 md:mt-0">
            Promoting Sustainable Development Goals 11 & 12
          </p>
        </div>
      </div>
    </footer>
  );
}
