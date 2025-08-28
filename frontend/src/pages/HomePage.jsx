import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { mockListings } from '../data/mockData';
import { MapPin, Clock, Eye, MessageSquare } from 'lucide-react';

const HomePage = () => {
  // Get featured listings (first 8)
  const featuredListings = mockListings.slice(0, 8);

  const categoryStats = [
    { name: 'Emlak', count: 1245, icon: '🏠' },
    { name: 'Vasıta', count: 892, icon: '🚗' },
    { name: 'Elektronik', count: 567, icon: '📱' },
    { name: 'Ev & Yaşam', count: 423, icon: '🏡' },
    { name: 'Moda', count: 334, icon: '👕' },
    { name: 'İş Arıyorum', count: 198, icon: '💼' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="py-16 text-center"
        style={{ 
          background: `linear-gradient(135deg, #ffff00 0%, #f0f000 100%)` 
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Aradığınızı Bulun, Satıcılar Size Gelsin!
          </h1>
          <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto">
            Türkiye'nin ilk ters pazaryeri platformu. Ne arıyorsanız talep verin, 
            satıcılar sizinle iletişime geçsin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-black text-white hover:bg-gray-800 font-medium px-8 py-3"
            >
              <Link to="/post-request">Hemen Talep Ver</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-black text-black hover:bg-gray-100 font-medium px-8 py-3"
            >
              <Link to="/category/emlak">Talepleri İncele</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Category Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Kategoriler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryStats.map((category) => (
              <Link
                key={category.name}
                to={`/category/${category.name.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-600">{category.count} talep</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Son Talepler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge 
                      variant="secondary"
                      style={{ backgroundColor: '#ffff00', color: 'black' }}
                    >
                      {listing.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {listing.urgency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardTitle className="text-lg mb-3 line-clamp-2">
                    {listing.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {listing.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-2" />
                      {listing.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-2" />
                      {listing.timeAgo}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {listing.views}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {listing.messages}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      asChild
                      className="w-full"
                      style={{ backgroundColor: '#ffff00', color: 'black' }}
                    >
                      <Link to={`/listing/${listing.id}`}>Detayları Gör</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2"
              style={{ borderColor: '#ffff00', color: 'black' }}
            >
              <Link to="/category/all">Tüm Talepleri Gör</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-black"
                style={{ backgroundColor: '#ffff00' }}
              >
                1
              </div>
              <h3 className="font-semibold text-lg mb-2">Talebinizi Verin</h3>
              <p className="text-gray-600">
                Ne arıyorsanız detaylı bir şekilde açıklayın. Fiyat aralığı, 
                özellikler ve tercihleri belirtin.
              </p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-black"
                style={{ backgroundColor: '#ffff00' }}
              >
                2
              </div>
              <h3 className="font-semibold text-lg mb-2">Satıcılar İletişime Geçer</h3>
              <p className="text-gray-600">
                Aradığınız ürüne sahip satıcılar talebinizi görür ve 
                sizinle iletişime geçer.
              </p>
            </div>
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-black"
                style={{ backgroundColor: '#ffff00' }}
              >
                3
              </div>
              <h3 className="font-semibold text-lg mb-2">En İyisini Seçin</h3>
              <p className="text-gray-600">
                Gelen teklifleri karşılaştırın ve size en uygun 
                olanı seçin.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;