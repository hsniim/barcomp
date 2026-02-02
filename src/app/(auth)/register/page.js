'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Loader2,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    username: '',
    phone: '',
    company: '',
    jobTitle: '',
    city: '',
    agreeToTerms: false,
    agreeToNewsletter: true
  });

  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const getUserFriendlyError = (errorMessage) => {
    const errorMap = {
      'Email already exists': 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
      'Username already taken': 'Username sudah digunakan. Silakan pilih username lain.',
      'Invalid email format': 'Format email tidak valid. Contoh: nama@email.com',
      'Password too weak': 'Password terlalu lemah. Gunakan kombinasi huruf besar, kecil, angka, dan simbol.',
      'Registration failed': 'Registrasi gagal. Silakan coba lagi.',
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return errorMessage || 'Terjadi kesalahan saat registrasi. Silakan coba lagi.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (currentStep < 3) {
      if (currentStep === 1) {
        if (!formData.email.trim()) {
          setError('Email tidak boleh kosong');
          return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Format email tidak valid. Contoh: nama@email.com');
          return;
        }

        if (!formData.password.trim()) {
          setError('Password tidak boleh kosong');
          return;
        }

        if (formData.password.length < 8) {
          setError('Password minimal 8 karakter');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          setError('Password tidak cocok. Silakan periksa kembali.');
          return;
        }
      }
      
      if (currentStep === 2) {
        if (!formData.fullName.trim() || !formData.username.trim()) {
          setError('Nama lengkap dan username wajib diisi');
          return;
        }

        if (formData.username.length < 3) {
          setError('Username minimal 3 karakter');
          return;
        }
      }
      
      setError('');
      setCurrentStep(currentStep + 1);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Anda harus menyetujui syarat dan ketentuan');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          username: formData.username,
          phone: formData.phone,
          company: formData.company,
          jobTitle: formData.jobTitle,
          city: formData.city,
          newsletterSubscribed: formData.agreeToNewsletter
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Registrasi gagal');
      }

      setSuccess('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);

    } catch (err) {
      const friendlyError = getUserFriendlyError(err.message);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (error) setError('');
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    return { label: labels[passwordStrength] || '', color: colors[passwordStrength] || '' };
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" style={{ paddingTop: 'calc(var(--navbar-height, 80px) + 3rem)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="absolute inset-0 bg-grid-pattern opacity-5" />

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="mt-6 text-4xl font-bold text-gray-900 tracking-tight">
              Buat Akun Baru
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Bergabunglah dengan komunitas Barcomp
            </p>
          </div>

          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-slide-up">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Daftar Akun
              </CardTitle>
              <div className="flex gap-2 mt-4">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                      step <= currentStep ? 'bg-[#0066FF]' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="px-6 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive" className="animate-shake border-red-400 bg-red-50">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <AlertDescription className="text-red-800 font-medium text-sm leading-relaxed">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="bg-green-50 border-green-400 animate-fade-in">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertDescription className="text-green-800 font-medium text-sm">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address *
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-[#0066FF] z-10 pointer-events-none" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="nama@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-10 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                          required
                          disabled={loading}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                        Password *
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-[#0066FF] z-10 pointer-events-none" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Minimal 8 karakter"
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-12 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none z-10"
                          disabled={loading}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>

                      {formData.password && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${getPasswordStrengthLabel().color}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {getPasswordStrengthLabel().label}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Gunakan kombinasi huruf besar, kecil, angka, dan simbol
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                        Konfirmasi Password *
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-[#0066FF] z-10 pointer-events-none" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Ulangi password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 pr-12 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none z-10"
                          disabled={loading}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                        Nama Lengkap *
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-[#0066FF] z-10 pointer-events-none" />
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="pl-10 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
                        Username *
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-[#0066FF] z-10 pointer-events-none" />
                        <Input
                          id="username"
                          name="username"
                          type="text"
                          placeholder="johndoe"
                          value={formData.username}
                          onChange={handleChange}
                          className="pl-10 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                          required
                          disabled={loading}
                        />
                      </div>
                      <p className="text-xs text-gray-500">Username akan ditampilkan di profil Anda</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        No. Telepon
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-[#0066FF] z-10 pointer-events-none" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="081234567890"
                          value={formData.phone}
                          onChange={handleChange}
                          className="pl-10 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-semibold text-gray-700">
                        Perusahaan (Opsional)
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        placeholder="PT. Nama Perusahaan"
                        value={formData.company}
                        onChange={handleChange}
                        className="h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="jobTitle" className="text-sm font-semibold text-gray-700">
                        Jabatan (Opsional)
                      </Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        placeholder="Software Developer"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        className="h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                        Kota (Opsional)
                      </Label>
                      <div className="relative group">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-[#0066FF] z-10 pointer-events-none" />
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="Jakarta"
                          value={formData.city}
                          onChange={handleChange}
                          className="pl-10 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex items-start">
                        <input
                          id="agreeToTerms"
                          name="agreeToTerms"
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#0066FF] focus:ring-[#0066FF] border-gray-300 rounded mt-1 cursor-pointer"
                          required
                          disabled={loading}
                        />
                        <Label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                          Saya menyetujui{' '}
                          <Link href="/terms" className="text-[#0066FF] hover:underline font-semibold">
                            Syarat & Ketentuan
                          </Link>{' '}
                          dan{' '}
                          <Link href="/privacy" className="text-[#0066FF] hover:underline font-semibold">
                            Kebijakan Privasi
                          </Link>
                        </Label>
                      </div>

                      <div className="flex items-start">
                        <input
                          id="agreeToNewsletter"
                          name="agreeToNewsletter"
                          type="checkbox"
                          checked={formData.agreeToNewsletter}
                          onChange={handleChange}
                          className="h-4 w-4 text-[#0066FF] focus:ring-[#0066FF] border-gray-300 rounded mt-1 cursor-pointer"
                          disabled={loading}
                        />
                        <Label htmlFor="agreeToNewsletter" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                          Kirimkan saya update dan newsletter
                        </Label>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 h-12 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-700 font-medium transition-all duration-300"
                      onClick={goToPreviousStep}
                      disabled={loading}
                    >
                      Kembali
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold h-12 text-base transition-colors duration-300"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        <UserPlus className="mr-2 h-5 w-5" />
                        Daftar
                      </>
                    ) : (
                      'Lanjutkan'
                    )}
                  </Button>
                </div>

                <div className="text-center pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Sudah punya akun?{' '}
                    <Link 
                      href="/login" 
                      className="font-semibold text-[#0066FF] hover:text-[#0052CC] transition-colors duration-200 hover:underline"
                    >
                      Masuk sekarang
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <style jsx global>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-5px);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(5px);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }

          .animate-slide-up {
            animation: slide-up 0.6s ease-out;
          }

          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }

          .bg-grid-pattern {
            background-image: 
              linear-gradient(to right, rgba(0, 102, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 102, 255, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
          }
        `}</style>
      </div>

      <Footer />
    </>
  );
}