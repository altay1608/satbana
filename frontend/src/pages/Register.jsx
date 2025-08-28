import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreeMarketing: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen tüm zorunlu alanları doldurun.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Şifre Uyuşmuyor",
        description: "Şifre ve şifre tekrarı aynı olmalıdır.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.agreeTerms) {
      toast({
        title: "Kullanım Koşulları",
        description: "Kullanım koşullarını kabul etmelisiniz.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Mock registration success
    setTimeout(() => {
      toast({
        title: "Kayıt Başarılı!",
        description: "Hesabınız oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div 
              className="px-6 py-3 rounded-lg font-bold text-xl text-black inline-block"
              style={{ backgroundColor: '#ffff00' }}
            >
              hemensatbana.com
            </div>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Üye Ol</CardTitle>
            <p className="text-gray-600">Yeni hesap oluşturun</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="Adınız"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad *</Label>
                  <Input
                    id="lastName"
                    placeholder="Soyadınız"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">E-posta *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ornek@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    placeholder="0555 123 45 67"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Şifre *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="En az 6 karakter"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrarı *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Şifrenizi tekrar girin"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeTerms', checked)}
                  />
                  <Label htmlFor="agreeTerms" className="text-sm leading-relaxed">
                    <Link to="/terms" className="text-blue-600 hover:underline">Kullanım Koşulları</Link>'nı ve{' '}
                    <Link to="/privacy" className="text-blue-600 hover:underline">Gizlilik Politikası</Link>'nı okudum, kabul ediyorum. *
                  </Label>
                </div>
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeMarketing"
                    checked={formData.agreeMarketing}
                    onCheckedChange={(checked) => handleInputChange('agreeMarketing', checked)}
                  />
                  <Label htmlFor="agreeMarketing" className="text-sm">
                    Kampanya ve duyurulardan haberdar olmak istiyorum.
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full font-medium"
                style={{ backgroundColor: '#ffff00', color: 'black' }}
                disabled={isLoading}
              >
                {isLoading ? 'Hesap oluşturuluyor...' : 'Üye Ol'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 text-center">
              <span className="text-sm text-gray-500">veya</span>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full" type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google ile Üye Ol
              </Button>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="text-blue-600 hover:underline font-medium">
                  Giriş Yap
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <Link to="/privacy" className="hover:underline">Gizlilik Politikası</Link>
          <span className="mx-2">•</span>
          <Link to="/terms" className="hover:underline">Kullanım Koşulları</Link>
          <span className="mx-2">•</span>
          <Link to="/help" className="hover:underline">Yardım</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;