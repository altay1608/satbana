import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Nasıl Çalışır?', href: '/how-it-works' },
      { name: 'Güvenlik', href: '/security' },
      { name: 'Yardım Merkezi', href: '/help' },
      { name: 'İletişim', href: '/contact' }
    ],
    legal: [
      { name: 'Kullanım Koşulları', href: '/terms' },
      { name: 'Gizlilik Politikası', href: '/privacy' },
      { name: 'Çerez Politikası', href: '/cookies' },
      { name: 'KVKK', href: '/kvkk' }
    ],
    categories: [
      { name: 'Emlak', href: '/category/emlak' },
      { name: 'Vasıta', href: '/category/vasita' },
      { name: 'Elektronik', href: '/category/elektronik' },
      { name: 'Hizmet', href: '/category/hizmet' }
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <div 
                className="px-4 py-2 rounded-md font-bold text-lg text-black"
                style={{ backgroundColor: '#ffff00' }}
              >
                hemensatbana.com
              </div>
            </Link>
            <p className="text-gray-600 text-sm">
              Türkiye'nin ilk ters pazaryeri platformu. Aradığınızı talep edin, 
              satıcılar sizinle iletişime geçsin.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Twitter
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Platform</h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Kategoriler</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Yasal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8 border-gray-200" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>© {currentYear} hemensatbana.com</span>
            <span>•</span>
            <span>Tüm hakları saklıdır</span>
          </div>
          
          {/* Copyright Design Credit */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Design by</span>
            <span className="font-semibold text-gray-900">YALDUZ</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;