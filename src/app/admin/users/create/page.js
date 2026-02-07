// app/admin/users/create/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Check,
  X,
  Eye,
  EyeOff,
  UserPlus,
  Shield,
  Mail,
  Lock,
} from 'lucide-react';
import * as Select from '@radix-ui/react-select';

// ============================================================================
// VALIDATION
// ============================================================================

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validateField(name, value, formData) {
  switch (name) {
    case 'full_name':
      if (!value || value.trim().length === 0) return 'Nama lengkap wajib diisi.';
      if (value.trim().length < 2) return 'Nama lengkap minimal 2 karakter.';
      if (value.trim().length > 255) return 'Nama lengkap maksimal 255 karakter.';
      return null;

    case 'email':
      if (!value || value.trim().length === 0) return 'Email wajib diisi.';
      if (!EMAIL_REGEX.test(value.trim())) return 'Format email tidak valid.';
      return null;

    case 'password':
      if (!value || value.length === 0) return 'Password wajib diisi.';
      if (value.length < 8) return 'Password minimal 8 karakter.';
      if (!/[A-Z]/.test(value)) return 'Password harus mengandung huruf kapital.';
      if (!/[a-z]/.test(value)) return 'Password harus mengandung huruf kecil.';
      if (!/[0-9]/.test(value)) return 'Password harus mengandung angka.';
      return null;

    case 'confirm_password':
      if (!value || value.length === 0) return 'Konfirmasi password wajib diisi.';
      if (value !== formData.password) return 'Password tidak sesuai.';
      return null;

    case 'role':
      if (!value) return 'Role wajib dipilih.';
      return null;

    default:
      return null;
  }
}

function validateAll(formData) {
  const fields = ['full_name', 'email', 'password', 'confirm_password', 'role'];
  const errors = {};
  fields.forEach((field) => {
    const error = validateField(field, formData[field], formData);
    if (error) errors[field] = error;
  });
  return errors;
}

// ============================================================================
// PASSWORD STRENGTH METER
// ============================================================================

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Lemah', color: 'bg-red-500' };
  if (score === 3) return { score, label: 'Sedang', color: 'bg-yellow-500' };
  if (score === 4) return { score, label: 'Kuat', color: 'bg-blue-500' };
  return { score, label: 'Sangat Kuat', color: 'bg-green-500' };
}

function PasswordStrengthBar({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`mt-1 text-xs font-semibold ${score <= 2 ? 'text-red-600' : score === 3 ? 'text-yellow-600' : score === 4 ? 'text-blue-600' : 'text-green-600'}`}>
        Kekuatan: {label}
      </p>
    </div>
  );
}

// ============================================================================
// TOAST
// ============================================================================

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className={`fixed top-4 right-4 z-50 max-w-md px-4 py-3 border rounded-lg shadow-lg ${bgColor} ${textColor}`}
    >
      <div className="flex items-center gap-2">
        {type === 'success' ? (
          <Check className="w-5 h-5 text-green-600" />
        ) : (
          <AlertCircle className="w-5 h-5 text-red-600" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-auto">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================================
// RADIX SELECT — ROLE PICKER
// ============================================================================

/*
  Enum dari schema.prisma  →  users_role { super_admin | admin | editor | user }
  Halaman ini hanya mengekspos: admin, editor, user.
  super_admin dikecualikan secara eksplisit karena privilege-nya terlalu luas
  dan harus diberikan lewat proses terpisah (manual DB / migration).
*/

const ROLE_OPTIONS = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Kelola seluruh konten & pengguna',
    icon: Shield,
  },
  {
    value: 'editor',
    label: 'Editor',
    description: 'Buat & edit artikel dan komentar',
    icon: Mail, // placeholder — ganti dengan ikon yang lebih sesuai jika ada
  },
  {
    value: 'user',
    label: 'Viewer',
    description: 'Akses baca saja',
    icon: Eye,
  },
];

function RoleSelect({ value, onChange, hasError }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className={`w-full px-4 py-2 text-left bg-white border rounded-lg focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none flex items-center justify-between hover:border-gray-400 transition-all duration-200 ${
          hasError ? 'border-red-500' : 'border-gray-300'
        }`}
        aria-label="Pilih Role"
      >
        <Select.Value placeholder="Pilih role pengguna..." className="text-gray-500" />
        <Select.Icon>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className="text-gray-400 transition-transform duration-200"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[100%] overflow-hidden"
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {ROLE_OPTIONS.map((role) => {
              const Icon = role.icon;
              return (
                <Select.Item
                  key={role.value}
                  value={role.value}
                  className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-left cursor-pointer
                             text-gray-700 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none
                             data-[state=checked]:bg-blue-50 data-[state=checked]:text-[#0066FF]
                             transition-colors duration-150"
                >
                  <div
                    className={`p-1.5 rounded-md ${
                      value === role.value ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${value === role.value ? 'text-[#0066FF]' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${value === role.value ? 'text-[#0066FF]' : 'text-gray-800'}`}>
                      {role.label}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{role.description}</p>
                  </div>
                  <Select.ItemIndicator>
                    <Check className="w-4 h-4 text-[#0066FF]" />
                  </Select.ItemIndicator>
                </Select.Item>
              );
            })}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function CreateUserPage() {
  const router = useRouter();

  // ── state ─────────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Show / hide toggles — satu state per field
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Email uniqueness check
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null); // null | true | false

  // ── real-time validation: field-level (setelah di-touch) ──────────────────
  useEffect(() => {
    const newErrors = {};
    Object.keys(touched).forEach((field) => {
      if (touched[field]) {
        const err = validateField(field, formData[field], formData);
        if (err) newErrors[field] = err;
      }
    });
    setErrors(newErrors);
  }, [formData, touched]);

  // ── debounce email availability check ────────────────────────────────────
  const checkEmailAvailability = useCallback(async (email) => {
    if (!email || !EMAIL_REGEX.test(email.trim())) {
      setEmailAvailable(null);
      return;
    }
    setCheckingEmail(true);
    try {
      const res = await fetch(`/api/users/check-email?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();
      setEmailAvailable(data.available);
    } catch {
      setEmailAvailable(null);
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  useEffect(() => {
    if (!touched.email) return;
    const id = setTimeout(() => checkEmailAvailability(formData.email), 600);
    return () => clearTimeout(id);
  }, [formData.email, touched.email, checkEmailAvailability]);

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleRoleChange = (value) => {
    setFormData((prev) => ({ ...prev, role: value }));
    setTouched((prev) => ({ ...prev, role: true }));
  };

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark semua field sebagai touched
    const allTouched = { full_name: true, email: true, password: true, confirm_password: true, role: true };
    setTouched(allTouched);

    // Validasi penuh
    const validationErrors = validateAll(formData);

    // Tambahkan error email availability jika sudah diketahui
    if (emailAvailable === false) {
      validationErrors.email = 'Email sudah terdaftar.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToast({ message: 'Harap perbaiki kesalahan di atas sebelum mengirim.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      };

      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setToast({ message: 'Pengguna baru berhasil ditambahkan!', type: 'success' });
        setTimeout(() => router.push('/admin/users'), 1500);
      } else {
        setToast({ message: data.error || 'Gagal menambahkan pengguna.', type: 'error' });
      }
    } catch {
      setToast({ message: 'Terjadi kesalahan saat mengirim data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ── derived ───────────────────────────────────────────────────────────────
  const isFormComplete =
    formData.full_name.trim() &&
    formData.email.trim() &&
    formData.password &&
    formData.confirm_password &&
    formData.role;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="pb-8">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link
                href="/admin/users"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Tambah Pengguna Baru</h1>
            </div>
            <p className="ml-14 text-base text-gray-600">Isi data akun dan tentukan akses pengguna</p>
          </div>
        </div>
      </motion.div>

      {/* ── Form Layout ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left — Main Fields ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <div className="space-y-6">

                {/* ── Nama Lengkap ──────────────────────────────────────── */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Contoh: Budi Santoso"
                      autoComplete="off"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                        errors.full_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.full_name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.full_name}
                    </p>
                  )}
                </div>

                {/* ── Email ─────────────────────────────────────────────── */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="contoh@domain.com"
                      autoComplete="off"
                      className={`w-full pl-10 pr-10 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                        errors.email ? 'border-red-500' : emailAvailable === true ? 'border-green-400' : 'border-gray-300'
                      }`}
                    />
                    {/* Spinner / indicator di ujung kanan */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingEmail ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : emailAvailable === true ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                  {errors.email ? (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  ) : emailAvailable === true ? (
                    <p className="mt-1 text-sm text-green-600 font-medium">✓ Email tersedia</p>
                  ) : touched.email && !errors.email && !checkingEmail && emailAvailable === null ? (
                    <p className="mt-1 text-xs text-gray-500">Memeriksa ketersediaan…</p>
                  ) : null}
                </div>

                {/* ── Password ──────────────────────────────────────────── */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Minimal 8 karakter"
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-11 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {/* Toggle Show / Hide */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0066FF] transition-colors duration-200"
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </p>
                  ) : (
                    <PasswordStrengthBar password={formData.password} />
                  )}
                </div>

                {/* ── Konfirmasi Password ───────────────────────────────── */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Ulangi password di atas"
                      autoComplete="new-password"
                      className={`w-full pl-10 pr-11 py-2 border rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-[#0066FF] focus:border-[#0066FF] outline-none transition-all duration-200 ${
                        errors.confirm_password
                          ? 'border-red-500'
                          : touched.confirm_password && formData.confirm_password && formData.confirm_password === formData.password
                          ? 'border-green-400'
                          : 'border-gray-300'
                      }`}
                    />
                    {/* Toggle Show / Hide */}
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0066FF] transition-colors duration-200"
                      aria-label={showConfirm ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirm_password ? (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirm_password}
                    </p>
                  ) : touched.confirm_password && formData.confirm_password && formData.confirm_password === formData.password ? (
                    <p className="mt-1 text-sm text-green-600 font-medium">✓ Password cocok</p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* ── Submit Button (mobile / sm — tampil di bawah fields) ──── */}
            <div className="mt-6 lg:hidden">
              <button
                type="submit"
                disabled={loading || !isFormComplete}
                className="w-full px-4 py-2.5 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menyimpan…
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Tambah Pengguna
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* ── Right — Role & Action ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* ── Role Card ───────────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Role Pengguna</h2>
            <p className="text-xs text-gray-500 mb-4">Tentukan tingkat akses untuk akun ini</p>

            <RoleSelect
              value={formData.role}
              onChange={handleRoleChange}
              hasError={!!errors.role}
            />

            {errors.role && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.role}
              </p>
            )}

            {/* Role info badge — tampil setelah role dipilih */}
            {formData.role && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
              >
                <p className="text-xs text-gray-500">
                  {formData.role === 'admin' && 'Admin dapat mengelola seluruh konten, pengguna, dan pengaturan sistem.'}
                  {formData.role === 'editor' && 'Editor dapat membuat, mengedit, dan menghapus artikel serta mengelola komentar.'}
                  {formData.role === 'user' && 'Viewer hanya dapat mengakses dan membaca konten yang tersedia.'}
                </p>
              </motion.div>
            )}
          </div>

          {/* ── Action Card (desktop) ─────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 hidden lg:block">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Simpan Akun</h2>
            <div className="space-y-3">
              <form onSubmit={handleSubmit} noValidate>
                <button
                  type="submit"
                  disabled={loading || !isFormComplete}
                  className="w-full px-4 py-2 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan…
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Tambah Pengguna
                    </>
                  )}
                </button>
              </form>
              <Link
                href="/admin/users"
                className="w-full px-4 py-2 border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 text-gray-900 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
              >
                <X className="w-4 h-4" />
                Batalkan
              </Link>
            </div>
          </div>

          {/* ── Security Note ─────────────────────────────────────────── */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-blue-800">Catatan Keamanan</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Password akan di-hash sebelum disimpan. Pengguna baru disarankan untuk mengubah password setelah login pertama.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}