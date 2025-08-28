import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockListings } from '../data/mockData';
import { MapPin, Clock, Eye, MessageSquare, Filter } from 'lucide-react';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [sortBy, setSortBy] = useState('newest');
  const [filterUrgency, setFilterUrgency] = useState('all');

  // Filter listings by category
  const filteredListings = mockListings.filter(listing => 
    categoryId === 'all' || listing.category.toLowerCase().includes(categoryId)
  );

  const categoryNames = {
    'emlak': 'Emlak',
    'vasita': 'Vasıta', 
    'elektronik': 'Elektronik',
    'ev-yasam': 'Ev & Yaşam',
    'moda': 'Moda',
    'is': 'İş Arıyorum',
    'hizmet': 'Hizmet',
    'diger': 'Diğer',
    'all': 'Tüm Kategoriler'
  };

  const urgencyOptions = [
    { value: 'all', label: 'Tüm Aciliyet Durumları' },
    { value: 'acil', label: 'Acil' },
    { value: 'bu-hafta', label: 'Bu Hafta' },
    { value: 'bu-ay', label: 'Bu Ay' },
    { value: 'acil-degil', label: 'Acil Değil' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">
            {categoryNames[categoryId] || 'Kategori'} Talepleri
          </h1>
          <p className="text-gray-600">
            {filteredListings.length} talep bulundu
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtreler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Sıralama</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">En Yeni</SelectItem>
                      <SelectItem value="oldest">En Eski</SelectItem>
                      <SelectItem value="most-viewed">En Çok Görüntülenen</SelectItem>
                      <SelectItem value="most-messages">En Çok Mesaj Alan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Aciliyet</label>
                  <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full"
                  style={{ backgroundColor: '#ffff00', color: 'black' }}
                >
                  Filtreleri Uygula
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Kategori İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Toplam Talep:</span>
                    <span className="font-medium">{filteredListings.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acil Talepler:</span>
                    <span className="font-medium text-red-600">
                      {filteredListings.filter(l => l.urgency === 'Acil').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bu Hafta:</span>
                    <span className="font-medium text-orange-600">
                      {filteredListings.filter(l => l.urgency === 'Bu hafta').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Listings Grid */}
          <div className="lg:w-3/4">
            {filteredListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500 mb-4">Bu kategoride henüz talep bulunmuyor.</p>
                  <Button
                    asChild
                    style={{ backgroundColor: '#ffff00', color: 'black' }}
                  >
                    <Link to="/post-request">İlk Talebi Sen Ver</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredListings.map((listing) => (
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge 
                          variant="secondary"
                          style={{ backgroundColor: '#ffff00', color: 'black' }}
                        >
                          {listing.category}
                        </Badge>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            listing.urgency === 'Acil' 
                              ? 'border-red-500 text-red-500' 
                              : listing.urgency === 'Bu hafta'
                              ? 'border-orange-500 text-orange-500'
                              : 'border-gray-500 text-gray-500'
                          }`}
                        >
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
                      
                      {/* Budget */}
                      {listing.budget && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-green-600">
                            Bütçe: {listing.budget}
                          </span>
                        </div>
                      )}

                      <div className="space-y-2 text-sm text-gray-500 mb-4">
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
                            {listing.messages} mesaj
                          </div>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                            {listing.user.name.charAt(0)}
                          </div>
                          <div className="ml-2">
                            <p className="text-sm font-medium">{listing.user.name}</p>
                            {listing.user.verified && (
                              <p className="text-xs text-green-600">✓ Doğrulanmış</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Puan</p>
                          <p className="text-sm font-medium">⭐ {listing.user.rating}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          asChild
                          className="flex-1"
                          style={{ backgroundColor: '#ffff00', color: 'black' }}
                        >
                          <Link to={`/listing/${listing.id}`}>Detayları Gör</Link>
                        </Button>
                        <Button variant="outline" size="sm">
                          💬 Mesaj Gönder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredListings.length > 0 && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2"
                  style={{ borderColor: '#ffff00', color: 'black' }}
                >
                  Daha Fazla Yükle
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;