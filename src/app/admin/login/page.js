// app/admin/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminLoginPage() {
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
      'User not found': 'Akun dengan email ini tidak ditemukan. Silakan periksa kembali.',
      'Invalid email': 'Format email tidak valid. Contoh: admin@barcomp.com',
      'Invalid password': 'Password yang Anda masukkan salah. Silakan coba lagi.',
      'Access denied': 'Akses ditolak. Hanya Super Admin yang dapat mengakses panel ini.',
      'Account disabled': 'Akun Anda telah dinonaktifkan. Hubungi administrator untuk informasi lebih lanjut.',
      'Too many attempts': 'Terlalu banyak percobaan login. Silakan coba lagi dalam beberapa menit.',
      'Network error': 'Koneksi internet bermasalah. Periksa koneksi Anda dan coba lagi.',
      'Login failed': 'Login gagal. Silakan periksa email dan password Anda.',
      'Unexpected token': 'Terjadi kesalahan sistem. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.',
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

    // Validasi input
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
      setError('Format email tidak valid. Contoh: admin@barcomp.com');
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
        }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed');
      }

      // Check if user is SUPER_ADMIN
      if (data.user.role !== 'super_admin') {
        setError('Akses ditolak. Hanya Super Admin yang dapat mengakses panel ini.');
        setLoading(false);
        return;
      }

      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));

      setSuccess('Login berhasil! Mengalihkan ke admin panel...');
      
      // Redirect to admin dashboard
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 1000);

    } catch (err) {
      console.error('Login error:', err);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="max-w-md w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Barcomp Admin
          </h1>
          <p className="mt-3 text-base text-gray-600">
            Panel Administrator - Akses Terbatas
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 animate-slide-up">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Admin Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Masukkan kredensial Super Admin Anda
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="animate-shake border-red-400 bg-red-50">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <AlertDescription className="text-red-800 font-medium text-sm leading-relaxed">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="bg-green-50 border-green-400 animate-fade-in">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <AlertDescription className="text-green-800 font-medium text-sm">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email Field */}
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
                    placeholder="admin@barcomp.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 pr-4 h-12 border-gray-300 focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF] transition-all duration-300 text-gray-900 placeholder:text-gray-400 bg-white"
                    required
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <Link 
                    href="/admin/forgot-password" 
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

              {/* Remember Me */}
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
                  Ingat saya selama 30 hari
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold h-12 text-base transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 h-5 w-5" />
                    Masuk ke Admin Panel
                  </>
                )}
              </Button>

              {/* Security Notice */}
              <div className="pt-4 border-t border-gray-200">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        Area Terbatas
                      </p>
                      <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                        Panel ini hanya untuk Super Administrator. Akses tidak sah akan dicatat dan dilaporkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
          >
            <svg 
              className="mr-2 h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Kembali ke Website
          </Link>
        </div>
      </div>

      {/* Styles */}
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
  );
}   