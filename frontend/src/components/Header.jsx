import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, Menu, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { id: 'emlak', name: 'Emlak', href: '/category/emlak' },
    { id: 'vasita', name: 'Vasıta', href: '/category/vasita' },
    { id: 'elektronik', name: 'Elektronik', href: '/category/elektronik' },
    { id: 'ev-yasam', name: 'Ev & Yaşam', href: '/category/ev-yasam' },
    { id: 'moda', name: 'Moda', href: '/category/moda' },
    { id: 'is', name: 'İş Arıyorum', href: '/category/is' },
    { id: 'hizmet', name: 'Hizmet', href: '/category/hizmet' },
    { id: 'diger', name: 'Diğer', href: '/category/diger' },
  ];

  return (
    <header className="bg-white shadow-md">
      {/* Top Header */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div 
                className="px-4 py-2 rounded-md font-bold text-xl text-black"
                style={{ backgroundColor: '#ffff00' }}
              >
                hemensatbana.com
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ne arıyorsunuz? (örn: iPhone 15, BMW 3.20i, 3+1 daire...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-12 h-12 text-lg"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  style={{ backgroundColor: '#ffff00', color: 'black' }}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button
                asChild
                className="text-white font-medium"
                style={{ backgroundColor: '#ffff00', color: 'black' }}
              >
                <Link to="/post-request">
                  <Plus className="h-4 w-4 mr-2" />
                  Talep Ver
                </Link>
              </Button>

              <Button variant="ghost" size="sm">
                <Heart className="h-5 w-5 mr-1" />
                Favorilerim
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5 mr-1" />
                    Hesabım
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/login">Giriş Yap</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register">Üye Ol</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profilim</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-8 py-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.href}
                className="text-gray-700 hover:text-black font-medium transition-colors duration-200 whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;