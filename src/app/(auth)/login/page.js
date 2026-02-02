'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const getUserFriendlyError = (errorMessage) => {
    const errorMap = {
      'Invalid credentials': 'Email atau password yang Anda masukkan salah. Silakan coba lagi.',
      'User not found': 'Akun dengan email ini tidak ditemukan. Silakan periksa kembali atau daftar akun baru.',
      'Invalid email': 'Format email tidak valid. Contoh: nama@email.com',
      'Invalid password': 'Password yang Anda masukkan salah. Silakan coba lagi.',
      'Account disabled': 'Akun Anda telah dinonaktifkan. Hubungi admin untuk informasi lebih lanjut.',
      'Too many attempts': 'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.',
      'Network error': 'Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.',
      'Login failed': 'Login gagal. Silakan periksa email dan password Anda.',
      'Unexpected token': 'Terjadi kesalahan sistem. Silakan coba lagi atau hubungi admin jika masalah berlanjut.',
    };

    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return 'Terjadi kesalahan saat login. Silakan periksa email dan password Anda, lalu coba lagi.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email.trim()) {
      setError('Email tidak boleh kosong');
      return;
    }

    if (!formData.password.trim()) {
      setError('Password tidak boleh kosong');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid. Contoh: nama@email.com');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('Login berhasil! Mengalihkan...');
      
      setTimeout(() => {
        if (data.user.role === 'admin' || data.user.role === 'super_admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      }, 1000);

    } catch (err) {
      const friendlyError = getUserFriendlyError(err.message);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
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
              Welcome Back
            </h1>
            <p className="mt-3 text-base text-gray-600">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-slide-up">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Login</CardTitle>
              <CardDescription className="text-center text-gray-600">
                Masukkan email dan password Anda
              </CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm text-[#0066FF] hover:text-[#0052CC] font-medium transition-colors duration-200 hover:underline"
                    >
                      Lupa password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-[#0066FF] z-10 pointer-events-none" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-12 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                      required
                      disabled={loading}
                      autoComplete="current-password"
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
                </div>

                <div className="flex items-center pt-1">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#0066FF] focus:ring-[#0066FF] border-gray-300 rounded cursor-pointer transition-all duration-200"
                    disabled={loading}
                  />
                  <Label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer font-medium">
                    Ingat saya
                  </Label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold h-12 text-base transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Masuk
                    </>
                  )}
                </Button>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">Atau lanjutkan dengan</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-gray-700"
                    disabled={loading}
                    onClick={() => {/* Google OAuth */}}
                  >
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-gray-700"
                    disabled={loading}
                    onClick={() => {/* LinkedIn OAuth */}}
                  >
                    <svg className="mr-2 h-5 w-5" fill="#0A66C2" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </Button>
                </div>

                <div className="text-center pt-6">
                  <p className="text-sm text-gray-600">
                    Belum punya akun?{' '}
                    <Link 
                      href="/register" 
                      className="font-semibold text-[#0066FF] hover:text-[#0052CC] transition-colors duration-200 hover:underline"
                    >
                      Daftar sekarang
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