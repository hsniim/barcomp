// app/admin/profile/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { User, Mail, Shield, Calendar, Edit, LogOut, Save, Upload, Lock, Eye, EyeOff } from 'lucide-react';

// shadcn-ui components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [activeTab, setActiveTab] = useState('view');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile data (read-only untuk view)
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    avatar: '/images/superadmin_avatar.jpg',
    role: 'super_admin',
    created_at: '',
    updated_at: ''
  });

  // Form data untuk edit profile
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Fetch profile data saat mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch profile dari API
  const fetchProfile = async () => {
    try {
      setFetchingProfile(true);
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        const userData = {
          full_name: data.user.full_name || '',
          email: data.user.email || '',
          avatar: data.user.avatar || '/images/superadmin_avatar.jpg',
          role: data.user.role || 'super_admin',
          created_at: data.user.created_at || '',
          updated_at: data.user.updated_at || ''
        };

        setProfileData(userData);
        setFormData({
          full_name: userData.full_name,
          email: userData.email
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setFetchingProfile(false);
    }
  };

  // Format date ke locale Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return '-';
    }
  };

  // Handle input change untuk form edit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle input change untuk password dialog
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Format file tidak valid. Gunakan JPG, PNG, atau WebP');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setAvatarFile(file);
    
    // Create preview dengan URL.createObjectURL
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  // Upload avatar ke server
  const uploadAvatar = async () => {
    if (!avatarFile) return null;

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('image', avatarFile);

      const uploadResponse = await fetch('/api/upload-image?type=avatar', {
        method: 'POST',
        body: uploadFormData
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload avatar gagal');
      }

      const uploadData = await uploadResponse.json();
      
      // Return relative path (e.g., /uploads/avatars/filename.jpg)
      return uploadData.path || uploadData.url;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Gagal upload avatar');
    }
  };

  // Handle submit edit profile
  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    // Validasi client-side
    if (!formData.full_name.trim()) {
      toast.error('Nama lengkap wajib diisi');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email wajib diisi');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Format email tidak valid');
      return;
    }

    setLoading(true);

    try {
      // Upload avatar jika ada
      let avatarUrl = profileData.avatar;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      // Update profile via API
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          avatar_url: avatarUrl
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memperbarui profil');
      }

      const result = await response.json();

      // Refetch profile untuk data terbaru
      await fetchProfile();

      // Reset avatar preview dan file
      setAvatarPreview(null);
      setAvatarFile(null);

      toast.success('Profil berhasil diperbarui');
      
      // Kembali ke tab view
      setActiveTab('view');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  // Handle submit change password
  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    // Validasi password
    if (!passwordData.old_password) {
      toast.error('Password lama wajib diisi');
      return;
    }

    if (!passwordData.new_password) {
      toast.error('Password baru wajib diisi');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Password baru minimal 8 karakter');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    setPasswordLoading(true);

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengubah password');
      }

      // Reset form
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });

      toast.success('Password berhasil diubah');
      setIsPasswordDialogOpen(false);
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Gagal mengubah password');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        toast.success('Logout berhasil');
        router.push('/admin/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Gagal logout');
    }
  };

  // Cancel edit - kembali ke view tab
  const handleCancelEdit = () => {
    // Reset form ke data profile saat ini
    setFormData({
      full_name: profileData.full_name,
      email: profileData.email
    });
    setAvatarPreview(null);
    setAvatarFile(null);
    setActiveTab('view');
  };

  // Loading skeleton
  if (fetchingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <Card className="border border-gray-200">
              <CardHeader className="pb-4">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Kelola informasi profil Anda</p>
        </div>

        {/* Tabs Component */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="view">View Profile</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          </TabsList>

          {/* VIEW PROFILE TAB */}
          <TabsContent value="view">
            <Card className="border border-gray-200 rounded-lg shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Informasi Profil
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Detail informasi akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden">
                      <Image
                        src={profileData.avatar}
                        alt={profileData.full_name}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Nama Lengkap
                    </Label>
                    <p className="text-lg font-semibold text-gray-900">{profileData.full_name}</p>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      Email
                    </Label>
                    <p className="text-gray-900">{profileData.email}</p>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      Role
                    </Label>
                    <div className="inline-block px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md text-sm font-medium uppercase">
                      {profileData.role.replace('_', ' ')}
                    </div>
                  </div>

                  {/* Created At */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Akun Dibuat
                    </Label>
                    <p className="text-gray-600 text-sm">{formatDate(profileData.created_at)}</p>
                  </div>

                  {/* Updated At */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Terakhir Diperbarui
                    </Label>
                    <p className="text-gray-600 text-sm">{formatDate(profileData.updated_at)}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => setActiveTab('edit')}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EDIT PROFILE TAB */}
          <TabsContent value="edit">
            <form onSubmit={handleSubmitProfile}>
              <Card className="border border-gray-200 rounded-lg shadow-sm">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Edit Profil
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Perbarui informasi profil Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden">
                        <Image
                          src={avatarPreview || profileData.avatar}
                          alt="Avatar preview"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="avatar-upload"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Avatar
                        </Label>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        JPG, PNG atau WebP. Maksimal 5MB.
                      </p>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        type="text"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        placeholder="Masukkan nama lengkap"
                        className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="admin@barcomp.com"
                        className="border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Change Password Button (Dialog Trigger) */}
                    <div className="pt-4 border-t border-gray-200">
                      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-gray-300 hover:bg-gray-50"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Ubah Password
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Ubah Password</DialogTitle>
                            <DialogDescription>
                              Masukkan password lama dan password baru Anda
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleSubmitPassword} className="space-y-4 pt-4">
                            {/* Old Password */}
                            <div className="space-y-2">
                              <Label htmlFor="old_password" className="text-sm font-medium">
                                Password Lama <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="old_password"
                                  name="old_password"
                                  type={showOldPassword ? 'text' : 'password'}
                                  value={passwordData.old_password}
                                  onChange={handlePasswordChange}
                                  placeholder="Masukkan password lama"
                                  className="pr-10"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowOldPassword(!showOldPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                  {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                              <Label htmlFor="new_password" className="text-sm font-medium">
                                Password Baru <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="new_password"
                                  name="new_password"
                                  type={showNewPassword ? 'text' : 'password'}
                                  value={passwordData.new_password}
                                  onChange={handlePasswordChange}
                                  placeholder="Minimal 8 karakter"
                                  className="pr-10"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                              <Label htmlFor="confirm_password" className="text-sm font-medium">
                                Konfirmasi Password Baru <span className="text-red-500">*</span>
                              </Label>
                              <div className="relative">
                                <Input
                                  id="confirm_password"
                                  name="confirm_password"
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  value={passwordData.confirm_password}
                                  onChange={handlePasswordChange}
                                  placeholder="Ulangi password baru"
                                  className="pr-10"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                              <p className="text-xs font-medium text-blue-900 mb-1">Persyaratan Password:</p>
                              <ul className="text-xs text-blue-800 space-y-0.5 list-disc list-inside">
                                <li>Minimal 8 karakter</li>
                                <li>Password baru harus cocok dengan konfirmasi</li>
                              </ul>
                            </div>

                            <DialogFooter className="gap-2 sm:gap-0">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsPasswordDialogOpen(false);
                                  setPasswordData({
                                    old_password: '',
                                    new_password: '',
                                    confirm_password: ''
                                  });
                                }}
                                disabled={passwordLoading}
                              >
                                Batal
                              </Button>
                              <Button
                                type="submit"
                                disabled={passwordLoading}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {passwordLoading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Menyimpan...
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Password
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="flex-1 border-gray-300 hover:bg-gray-50"
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Menyimpan...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Simpan
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}