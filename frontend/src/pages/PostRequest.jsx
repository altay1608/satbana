import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/use-toast';
import { MapPin, DollarSign, Clock, FileText } from 'lucide-react';

const PostRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budgetMin: '',
    budgetMax: '',
    urgency: '',
    contactMethod: 'message'
  });

  const categories = [
    { value: 'emlak', label: 'Emlak' },
    { value: 'vasita', label: 'Vasıta' },
    { value: 'elektronik', label: 'Elektronik' },
    { value: 'ev-yasam', label: 'Ev & Yaşam' },
    { value: 'moda', label: 'Moda' },
    { value: 'is', label: 'İş Arıyorum' },
    { value: 'hizmet', label: 'Hizmet' },
    { value: 'diger', label: 'Diğer' }
  ];

  const urgencyOptions = [
    { value: 'acil', label: 'Acil (Bugün)', color: 'bg-red-500' },
    { value: 'bu-hafta', label: 'Bu Hafta', color: 'bg-orange-500' },
    { value: 'bu-ay', label: 'Bu Ay', color: 'bg-yellow-500' },
    { value: 'acil-degil', label: 'Acil Değil', color: 'bg-green-500' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive"
      });
      return;
    }

    // Mock success
    toast({
      title: "Talep Başarıyla Oluşturuldu!",
      description: "Talebiniz yayınlandı. Satıcılar sizinle iletişime geçecek.",
    });

    // Navigate to home or listing detail
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Talep Ver</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Aradığınız ürün veya hizmeti detaylı şekilde açıklayın. 
            Satıcılar talebinizi görüp sizinle iletişime geçecek.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Temel Bilgiler
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Talep Başlığı *</Label>
                    <Input
                      id="title"
                      placeholder="Örn: iPhone 15 Pro Max 256GB Arıyorum"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Kategori *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange('category', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Detaylı Açıklama *</Label>
                    <Textarea
                      id="description"
                      placeholder="Aradığınız ürün/hizmetin özelliklerini, durumunu, tercihlerinizi detaylı şekilde açıklayın..."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Location & Budget */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Konum & Bütçe
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="location">Konum</Label>
                    <Input
                      id="location"
                      placeholder="Şehir, İlçe (Örn: İstanbul, Kadıköy)"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetMin">Minimum Bütçe (TL)</Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        placeholder="10.000"
                        value={formData.budgetMin}
                        onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetMax">Maksimum Bütçe (TL)</Label>
                      <Input
                        id="budgetMax"
                        type="number"
                        placeholder="15.000"
                        value={formData.budgetMax}
                        onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Urgency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Aciliyet Durumu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {urgencyOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.urgency === option.value
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleInputChange('urgency', option.value)}
                      >
                        <div className={`w-3 h-3 rounded-full mb-2 ${option.color}`}></div>
                        <p className="text-sm font-medium">{option.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Önizleme</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.title ? (
                    <div className="space-y-3">
                      <h3 className="font-semibold">{formData.title}</h3>
                      {formData.category && (
                        <Badge style={{ backgroundColor: '#ffff00', color: 'black' }}>
                          {categories.find(c => c.value === formData.category)?.label}
                        </Badge>
                      )}
                      {formData.description && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {formData.description}
                        </p>
                      )}
                      {formData.location && (
                        <p className="text-sm flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {formData.location}
                        </p>
                      )}
                      {(formData.budgetMin || formData.budgetMax) && (
                        <p className="text-sm flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {formData.budgetMin && formData.budgetMax
                            ? `${formData.budgetMin} - ${formData.budgetMax} TL`
                            : formData.budgetMin
                            ? `${formData.budgetMin} TL+`
                            : `${formData.budgetMax} TL'ye kadar`}
                        </p>
                      )}
                      {formData.urgency && (
                        <Badge variant="outline">
                          {urgencyOptions.find(u => u.value === formData.urgency)?.label}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Talep bilgilerini doldurmaya başlayın...
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>İpuçları</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 mt-2 mr-2 flex-shrink-0"></span>
                      Detaylı açıklama yapın
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 mt-2 mr-2 flex-shrink-0"></span>
                      Bütçe aralığı belirtin
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 mt-2 mr-2 flex-shrink-0"></span>
                      İletişim bilgilerinizi kontrol edin
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 mt-2 mr-2 flex-shrink-0"></span>
                      Aciliyet durumunu doğru seçin
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Submit */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full font-medium"
                    style={{ backgroundColor: '#ffff00', color: 'black' }}
                    size="lg"
                  >
                    Talebi Yayınla
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Talebiniz onaylandıktan sonra yayınlanacak
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostRequest;