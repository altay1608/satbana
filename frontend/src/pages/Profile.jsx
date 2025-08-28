import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { mockListings } from '../data/mockData';
import { 
  User, 
  Settings, 
  Heart, 
  MessageSquare, 
  Eye, 
  Edit2,
  MapPin,
  Clock,
  Star,
  Shield,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';

const Profile = () => {
  // Mock user data
  const [user] = useState({
    id: '1',
    firstName: 'Mehmet',
    lastName: 'Kaya',
    email: 'mehmet.kaya@email.com',
    phone: '0555 123 45 67',
    location: 'İstanbul, Türkiye',
    joinDate: 'Ocak 2024',
    rating: 4.8,
    totalRequests: 12,
    completedRequests: 8,
    verified: true,
    profilePicture: null
  });

  // Mock user's listings (requests)
  const userListings = mockListings.slice(0, 5);
  
  // Mock favorite listings
  const favoriteListings = mockListings.slice(5, 8);

  // Mock messages
  const recentMessages = [
    {
      id: '1',
      senderName: 'Ayşe D.',
      message: 'iPhone talebiniz hakkında...',
      time: '2 saat önce',
      unread: true
    },
    {
      id: '2',
      senderName: 'Can Y.',
      message: 'Merhaba, BMW ile ilgili...',
      time: '1 gün önce',
      unread: false
    },
    {
      id: '3',
      senderName: 'Zeynep M.',
      message: 'MacBook talebiniz için...',
      time: '2 gün önce',
      unread: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Info Card */}
            <Card>
              <CardContent className="pt-6 text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="bg-gray-200 text-gray-700 text-xl font-bold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-bold text-xl mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <div className="flex items-center justify-center mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-sm text-gray-600">{user.rating}</span>
                  {user.verified && (
                    <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-600">
                      ✓ Doğrulanmış
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-gray-500 space-y-1">
                  <div className="flex items-center justify-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {user.location}
                  </div>
                  <div className="flex items-center justify-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Üye: {user.joinDate}
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  variant="outline"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Profili Düzenle
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">İstatistikler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Toplam Talep:</span>
                  <span className="font-medium">{user.totalRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tamamlanan:</span>
                  <span className="font-medium text-green-600">{user.completedRequests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Başarı Oranı:</span>
                  <span className="font-medium">
                    {Math.round((user.completedRequests / user.totalRequests) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Değerlendirme:</span>
                  <span className="font-medium">{user.rating}/5.0</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  asChild 
                  className="w-full justify-start" 
                  style={{ backgroundColor: '#ffff00', color: 'black' }}
                >
                  <Link to="/post-request">
                    <User className="h-4 w-4 mr-2" />
                    Yeni Talep Ver
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  Hesap Ayarları
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Güvenlik
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="requests" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="requests">Taleplerim</TabsTrigger>
                <TabsTrigger value="messages">Mesajlar</TabsTrigger>
                <TabsTrigger value="favorites">Favoriler</TabsTrigger>
                <TabsTrigger value="settings">Ayarlar</TabsTrigger>
              </TabsList>

              {/* My Requests Tab */}
              <TabsContent value="requests" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Taleplerim</h2>
                  <Button 
                    asChild
                    style={{ backgroundColor: '#ffff00', color: 'black' }}
                  >
                    <Link to="/post-request">Yeni Talep Ver</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userListings.map((listing) => (
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
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {listing.description}
                        </p>
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
                              {listing.messages}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            asChild
                            className="flex-1"
                            variant="outline"
                          >
                            <Link to={`/listing/${listing.id}`}>Görüntüle</Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            Düzenle
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Messages Tab */}
              <TabsContent value="messages" className="space-y-6">
                <h2 className="text-2xl font-bold">Mesajlar</h2>
                
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${
                      message.unread ? 'border-l-4 border-yellow-400' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h4 className={`font-medium ${message.unread ? 'font-bold' : ''}`}>
                                {message.senderName}
                              </h4>
                              {message.unread && (
                                <Badge 
                                  variant="secondary" 
                                  className="ml-2 text-xs"
                                  style={{ backgroundColor: '#ffff00', color: 'black' }}
                                >
                                  Yeni
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">
                              {message.message}
                            </p>
                            <p className="text-xs text-gray-500">{message.time}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Yanıtla
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="space-y-6">
                <h2 className="text-2xl font-bold">Favorilerim</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {favoriteListings.map((listing) => (
                    <Card key={listing.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge 
                            variant="secondary"
                            style={{ backgroundColor: '#ffff00', color: 'black' }}
                          >
                            {listing.category}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-red-500">
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardTitle className="text-lg mb-3 line-clamp-2">
                          {listing.title}
                        </CardTitle>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {listing.description}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {listing.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {listing.timeAgo}
                          </div>
                        </div>
                        <Button
                          asChild
                          className="w-full"
                          style={{ backgroundColor: '#ffff00', color: 'black' }}
                        >
                          <Link to={`/listing/${listing.id}`}>Detayları Gör</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <h2 className="text-2xl font-bold">Hesap Ayarları</h2>
                
                <div className="space-y-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Kişisel Bilgiler
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Ad</label>
                          <p className="text-gray-700">{user.firstName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Soyad</label>
                          <p className="text-gray-700">{user.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            E-posta
                          </label>
                          <p className="text-gray-700">{user.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            Telefon
                          </label>
                          <p className="text-gray-700">{user.phone}</p>
                        </div>
                      </div>
                      <Button variant="outline">
                        <Edit2 className="h-4 w-4 mr-2" />
                        Düzenle
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Security */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Güvenlik
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Şifre</p>
                          <p className="text-sm text-gray-500">Son değiştirilme: 2 ay önce</p>
                        </div>
                        <Button variant="outline" size="sm">Değiştir</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">İki Faktörlü Doğrulama</p>
                          <p className="text-sm text-gray-500">Hesap güvenliğinizi artırın</p>
                        </div>
                        <Button variant="outline" size="sm">Etkinleştir</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notifications */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Bildirim Tercihleri</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">E-posta Bildirimleri</p>
                          <p className="text-sm text-gray-500">Yeni mesajlar ve güncellemeler</p>
                        </div>
                        <Button variant="outline" size="sm">Ayarla</Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">SMS Bildirimleri</p>
                          <p className="text-sm text-gray-500">Acil durumlar için</p>
                        </div>
                        <Button variant="outline" size="sm">Ayarla</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;