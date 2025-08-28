import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { mockListings } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import { MapPin, Clock, Eye, MessageSquare, Heart, Share2, Flag, DollarSign, User, Star } from 'lucide-react';

const ListingDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);

  // Find the listing
  const listing = mockListings.find(l => l.id === id);

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Talep Bulunamadı</h1>
          <p className="text-gray-600 mb-6">Aradığınız talep mevcut değil veya kaldırılmış olabilir.</p>
          <Button asChild style={{ backgroundColor: '#ffff00', color: 'black' }}>
            <Link to="/">Ana Sayfaya Dön</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Mesaj Boş",
        description: "Lütfen mesajınızı yazın.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Mesaj Gönderildi!",
      description: "Mesajınız talep sahibine iletildi. En kısa sürede size dönüş yapacaktır.",
    });
    setMessage('');
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Favorilerden Çıkarıldı" : "Favorilere Eklendi",
      description: isFavorited ? "Talep favorilerinizden kaldırıldı." : "Talep favorilerinize eklendi.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Kopyalandı",
      description: "Talep linki panoya kopyalandı.",
    });
  };

  // Related listings from same category
  const relatedListings = mockListings
    .filter(l => l.id !== id && l.category === listing.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
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
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{listing.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {listing.timeAgo}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {listing.views} görüntüleme
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleFavorite}
                      className={isFavorited ? 'text-red-500 border-red-500' : ''}
                    >
                      <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Talep Detayları</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
                {listing.budget && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">Bütçe: {listing.budget}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Talep Sahibi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
                        {listing.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h3 className="font-semibold">{listing.user.name}</h3>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{listing.user.rating}</span>
                        {listing.user.verified && (
                          <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-600">
                            ✓ Doğrulanmış
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Toplam Talep</p>
                    <p className="font-semibold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Listings */}
            {relatedListings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Benzer Talepler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {relatedListings.map((relatedListing) => (
                      <div key={relatedListing.id} className="border-l-4 border-yellow-400 pl-4">
                        <Link to={`/listing/${relatedListing.id}`} className="block hover:bg-gray-50 p-2 rounded">
                          <h4 className="font-medium mb-1">{relatedListing.title}</h4>
                          <p className="text-sm text-gray-600 line-clamp-2">{relatedListing.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {relatedListing.location}
                            <Clock className="h-3 w-3 ml-3 mr-1" />
                            {relatedListing.timeAgo}
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Satıcıysan İletişime Geç
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Merhaba, talebinizle ilgili size ürün/hizmet sunabilirim. Detayları görüşelim..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={handleSendMessage}
                  className="w-full font-medium"
                  style={{ backgroundColor: '#ffff00', color: 'black' }}
                >
                  Mesaj Gönder
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Mesajınız talep sahibine iletilecek
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>İstatistikler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Görüntüleme:</span>
                    <span className="font-medium">{listing.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mesaj:</span>
                    <span className="font-medium">{listing.messages}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Favoriye Eklenme:</span>
                    <span className="font-medium">{Math.floor(listing.views / 10)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Yayınlanma:</span>
                    <span className="font-medium">{listing.timeAgo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Güvenlik İpuçları</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-green-400 mt-2 mr-2 flex-shrink-0"></span>
                    Kişisel bilgilerinizi koruyun
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-green-400 mt-2 mr-2 flex-shrink-0"></span>
                    Peşin ödeme yapmaktan kaçının
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-green-400 mt-2 mr-2 flex-shrink-0"></span>
                    Şüpheli durumları bildirin
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-green-400 mt-2 mr-2 flex-shrink-0"></span>
                    Güvenilir satıcıları tercih edin
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;