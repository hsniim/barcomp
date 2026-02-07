// app/admin/users/page.js
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Try to import Radix UI components - use fallback if not available
let AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent;
let AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle;
let Select, SelectContent, SelectItem, SelectTrigger, SelectValue;
let DropdownMenu, DropdownMenuContent, DropdownMenuItem;
let DropdownMenuSeparator, DropdownMenuTrigger;

try {
  const alertDialogModule = require('@/components/ui/alert-dialog');
  AlertDialog = alertDialogModule.AlertDialog;
  AlertDialogAction = alertDialogModule.AlertDialogAction;
  AlertDialogCancel = alertDialogModule.AlertDialogCancel;
  AlertDialogContent = alertDialogModule.AlertDialogContent;
  AlertDialogDescription = alertDialogModule.AlertDialogDescription;
  AlertDialogFooter = alertDialogModule.AlertDialogFooter;
  AlertDialogHeader = alertDialogModule.AlertDialogHeader;
  AlertDialogTitle = alertDialogModule.AlertDialogTitle;
} catch (e) {
  console.warn('Alert Dialog components not found, using fallback');
}

try {
  const selectModule = require('@/components/ui/select');
  Select = selectModule.Select;
  SelectContent = selectModule.SelectContent;
  SelectItem = selectModule.SelectItem;
  SelectTrigger = selectModule.SelectTrigger;
  SelectValue = selectModule.SelectValue;
} catch (e) {
  console.warn('Select components not found, using fallback');
}

try {
  const dropdownModule = require('@/components/ui/dropdown-menu');
  DropdownMenu = dropdownModule.DropdownMenu;
  DropdownMenuContent = dropdownModule.DropdownMenuContent;
  DropdownMenuItem = dropdownModule.DropdownMenuItem;
  DropdownMenuSeparator = dropdownModule.DropdownMenuSeparator;
  DropdownMenuTrigger = dropdownModule.DropdownMenuTrigger;
} catch (e) {
  console.warn('Dropdown components not found, using fallback');
}

import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Shield,
  Edit3,
  Trash2,
  MoreHorizontal,
  Crown,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  User,
  Activity,
  TrendingUp,
  MessageSquare,
  FileText,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { cn, formatDateTime, getStatusColor } from '@/lib/utils';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');       // ← diubah ke 'all'
  const [statusFilter, setStatusFilter] = useState('all');   // ← diubah ke 'all'
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [stats, setStats] = useState({
    totalUsers: 0,
    superAdmins: 0,
    activeUsers: 0,
    totalArticles: 0
  });

  // Alert Dialog states
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  
  // Edit Role states
  const [editingRole, setEditingRole] = useState({ userId: null, currentRole: '' });

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, [pagination.page, roleFilter, statusFilter, search]); // ← tambah search ke dependency

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: '20',
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(search && { search })
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
        
        // Calculate stats from data (atau dari response jika API sudah kirim stats)
        const superAdmins = data.users.filter(u => u.role === 'SUPER_ADMIN').length;
        const activeUsers = data.users.filter(u => u.status === 'active').length;
        const totalArticles = data.users.reduce((sum, u) => sum + (u._count?.articles || 0), 0);
        
        setStats({
          totalUsers: data.pagination.total || data.users.length,
          superAdmins,
          activeUsers,
          totalArticles
        });
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();
      if (data.success) {
        toast.success('User role updated successfully');
        fetchUsers();
        setEditingRole({ userId: null, currentRole: '' });
      } else {
        toast.error(data.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteDialog.user) return;

    try {
      const response = await fetch(`/api/admin/users/${deleteDialog.user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        toast.success('User deleted successfully');
        setUsers(prev => prev.filter(u => u.id !== deleteDialog.user.id));
        setDeleteDialog({ open: false, user: null });
        fetchUsers();
      } else {
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteUserFallback = (user) => {
    if (!confirm(`Are you sure you want to delete "${user.fullName}"? This will permanently remove:\n\n- User account and credentials\n- All published articles (${user._count?.articles || 0})\n- All comments (${user._count?.comments || 0})\n- Activity history and login records\n\nThis action cannot be undone.`)) {
      return;
    }
    
    handleDeleteUser();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchUsers();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role) => {
    const badges = {
      SUPER_ADMIN: {
        label: 'Super Admin',
        className: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        icon: Shield
      },
      EDITOR: {
        label: 'Editor',
        className: 'bg-teal-100 text-teal-700 border-teal-200',
        icon: Edit3
      },
      USER: {
        label: 'User',
        className: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: User
      }
    };

    const badge = badges[role] || badges.USER;
    const Icon = badge.icon;

    return (
      <span className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
        badge.className
      )}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  // Fallback Select Component
  const FallbackSelect = ({ value, onValueChange, children, className, placeholder }) => (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-200 bg-white",
        className
      )}
    >
      {placeholder && <option value="all">{placeholder}</option>}
      {children}
    </select>
  );

  const FallbackSelectItem = ({ value, children }) => (
    <option value={value}>{children}</option>
  );

  // Use Radix or fallback
  const SelectComponent = Select || FallbackSelect;
  const SelectItemComponent = SelectItem || FallbackSelectItem;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Users</h1>
          <p className="mt-1 text-base text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Link href="/admin/users/create">
          <Button className="flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </Link>
      </motion.div>

      {/* Current User Profile Section */}
      {currentUser && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-[#0066FF] bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {getInitials(currentUser.fullName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{currentUser.fullName}</h3>
                    <Crown className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{currentUser.email}</p>
                  <div className="flex items-center gap-3">
                    {getRoleBadge(currentUser.role)}
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Currently logged in
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'text-[#0066FF]', bg: 'bg-blue-50' },
          { label: 'Super Admins', value: stats.superAdmins, icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Active Users', value: stats.activeUsers, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Articles', value: stats.totalArticles, icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-gray-200 hover:border-[#0066FF] hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, username or email..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPagination(prev => ({ ...prev, page: 1 }));
                    }}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={(v) => {
                setRoleFilter(v);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="EDITOR">Editor</SelectItem>
                  <SelectItem value="USER">User</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(v) => {
                setStatusFilter(v);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                type="submit"
                className="bg-[#0066FF] hover:bg-[#0052CC] text-white transition-all duration-300"
              >
                Search
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">User Management</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066FF]"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 mb-6">
                  {search || roleFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Get started by adding your first user'
                  }
                </p>
                {search === '' && roleFilter === 'all' && statusFilter === 'all' && (
                  <Link href="/admin/users/create">
                    <Button className="bg-[#0066FF] hover:bg-[#0052CC] text-white">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First User
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence mode="popLayout">
                      {users.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.03 }}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          {/* User Avatar & Name */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <img
                                  src={user.avatar}
                                  alt={user.fullName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  {getInitials(user.fullName)}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                                <p className="text-xs text-gray-500">@{user.username}</p>
                                {currentUser?.id === user.id && (
                                  <span className="text-xs text-[#0066FF] font-medium">(You)</span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-start gap-2">
                              <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <span className="text-sm text-gray-900 block">{user.email}</span>
                                {user.emailVerified && (
                                  <span className="text-xs text-green-600 flex items-center gap-1 mt-0.5">
                                    <CheckCircle2 className="w-3 h-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Role - Edit Mode */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingRole.userId === user.id ? (
                              Select ? (
                                <Select
                                  value={editingRole.currentRole}
                                  onValueChange={(newRole) => handleUpdateRole(user.id, newRole)}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                                    <SelectItem value="EDITOR">Editor</SelectItem>
                                    <SelectItem value="USER">User</SelectItem>
                                  </SelectContent>
                                </Select>
                              ) : (
                                <select
                                  value={editingRole.currentRole}
                                  onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                  className="w-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066FF] transition-all duration-200"
                                >
                                  <option value="SUPER_ADMIN">Super Admin</option>
                                  <option value="EDITOR">Editor</option>
                                  <option value="USER">User</option>
                                </select>
                              )
                            ) : (
                              getRoleBadge(user.role)
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "px-2.5 py-1 text-xs font-semibold rounded-full",
                              getStatusColor(user.status)
                            )}>
                              {user.status || '—'}
                            </span>
                          </td>

                          {/* Last Login */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-start gap-2">
                              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <span className="text-sm text-gray-900 block">
                                  {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : 'Never'}
                                </span>
                                {user.loginCount > 0 && (
                                  <span className="text-xs text-gray-500">
                                    {user.loginCount} login{user.loginCount > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Activity */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {user._count?.articles > 0 && (
                                <div className="flex items-center gap-1 text-gray-900">
                                  <FileText className="w-3 h-3" />
                                  {user._count.articles} articles
                                </div>
                              )}
                              {user._count?.comments > 0 && (
                                <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                                  <MessageSquare className="w-3 h-3" />
                                  {user._count.comments} comments
                                </div>
                              )}
                              {!user._count?.articles && !user._count?.comments && (
                                <span className="text-xs text-gray-400">No activity</span>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {DropdownMenu ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-[#0066FF]"
                                  >
                                    <MoreHorizontal className="w-5 h-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuItem
                                    onClick={() => setEditingRole({ userId: user.id, currentRole: user.role })}
                                    className="cursor-pointer"
                                  >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    <span>Edit Role</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link 
                                      href={`/admin/users/edit/${user.id}`}
                                      className="flex items-center cursor-pointer"
                                    >
                                      <User className="w-4 h-4 mr-2" />
                                      <span>Edit Profile</span>
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => {
                                      if (AlertDialog) {
                                        setDeleteDialog({ open: true, user });
                                      } else {
                                        setDeleteDialog({ open: false, user });
                                        handleDeleteUserFallback(user);
                                      }
                                    }}
                                    disabled={currentUser?.id === user.id || user.role === 'SUPER_ADMIN'}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    <span>Delete User</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingRole({ userId: user.id, currentRole: user.role })}
                                  className="hover:bg-blue-100 hover:text-[#0066FF]"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Link href={`/admin/users/edit/${user.id}`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-gray-100"
                                  >
                                    <User className="w-4 h-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setDeleteDialog({ open: false, user });
                                    handleDeleteUserFallback(user);
                                  }}
                                  disabled={currentUser?.id === user.id || user.role === 'SUPER_ADMIN'}
                                  className="text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between flex-wrap gap-4"
        >
          <div className="text-sm text-gray-700 font-medium">
            Showing page <span className="font-bold text-gray-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-gray-900">{pagination.totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-2 border-gray-300 hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Delete User Alert Dialog */}
      {AlertDialog && (
        <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: null })}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <AlertDialogTitle className="text-xl font-bold text-gray-900">
                  Delete User Account
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-base text-gray-600 leading-relaxed">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteDialog.user?.fullName}</span> (@{deleteDialog.user?.username})? 
                This action cannot be undone and will permanently remove:
                <ul className="mt-3 space-y-2 list-disc list-inside">
                  <li>User account and credentials</li>
                  <li>All published articles ({deleteDialog.user?._count?.articles || 0})</li>
                  <li>All comments ({deleteDialog.user?._count?.comments || 0})</li>
                  <li>Activity history and login records</li>
                </ul>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="border-gray-300 hover:bg-gray-100">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Yes, Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}