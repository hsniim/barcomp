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

// FIXED: JSDoc type definition based on Prisma schema (snake_case fields)
/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} full_name
 * @property {string} [username]
 * @property {string} email
 * @property {string} role - Enum: super_admin, admin, editor, user
 * @property {string} status - Enum: active, inactive, suspended, banned
 * @property {string} [avatar]
 * @property {string} [phone]
 * @property {string} [company]
 * @property {string} [job_title]
 * @property {string} created_at
 * @property {string} [last_login_at]
 * @property {number} [login_count]
 * @property {boolean} [email_verified]
 * @property {Object} [_count]
 * @property {number} [_count.articles]
 * @property {number} [_count.comments]
 */

export default function UsersPage() {
  /** @type {[User[], Function]} */
  const [users, setUsers] = useState([]);
  /** @type {[User | null, Function]} */
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
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
  }, [pagination.page, roleFilter, statusFilter, search]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        // FIXED: Assume API returns snake_case fields from Prisma
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error);
    }
  };

  // FIXED: Assume API returns snake_case fields from Prisma
  // TODO: Backend should send stats in response untuk performa lebih baik
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
        // FIXED: users already have snake_case fields from Prisma
        setUsers(data.users);
        setPagination(data.pagination);
        
        // Calculate stats from data (or use response stats if API provides it)
        // TODO: Backend should include stats in response for better performance
        const superAdmins = data.users.filter(u => u.role === 'super_admin').length;
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

  // TODO: Consider soft-delete (set deleted_at) instead of hard delete for audit trail
  // Backend should handle cascade delete: articles, comments, sessions, activity logs
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
    if (currentUser?.id === user.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    if (user.role === 'super_admin') {
      toast.error("Cannot delete Super Admin users");
      return;
    }
    
    // FIXED: Use full_name from schema
    if (confirm(`Are you sure you want to delete ${user.full_name}? This will permanently remove their account, articles, and comments.`)) {
      fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            toast.success('User deleted successfully');
            fetchUsers();
          } else {
            toast.error(data.error || 'Failed to delete user');
          }
        })
        .catch(error => {
          console.error('Failed to delete user:', error);
          toast.error('Failed to delete user');
        });
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchUsers();
  };

  // FIXED: Role mapping sesuai enum dari schema
  const getRoleBadge = (role) => {
    const roleConfig = {
      super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Crown },
      admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Shield },
      editor: { label: 'Editor', color: 'bg-green-100 text-green-700 border-green-200', icon: Edit3 },
      user: { label: 'User', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: User }
    };
    return roleConfig[role] || roleConfig.user;
  };

  // FIXED: Status mapping sesuai enum dari schema
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { label: 'Active', color: 'bg-green-100 text-green-700 border-green-200' },
      inactive: { label: 'Inactive', color: 'bg-gray-100 text-gray-700 border-gray-200' },
      suspended: { label: 'Suspended', color: 'bg-amber-100 text-amber-700 border-amber-200' },
      banned: { label: 'Banned', color: 'bg-red-100 text-red-700 border-red-200' }
    };
    return statusConfig[status] || statusConfig.inactive;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return formatDateTime(dateString);
    } catch {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
          <p className="mt-1 text-base text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Link href="/admin/users/create">
          <Button className="flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052CC] text-white shadow-lg transition-all duration-300">
            <UserPlus className="w-4 h-4" />
            Add New User
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: UsersIcon, color: 'text-[#0066FF]', bg: 'bg-blue-50' },
          { label: 'Super Admins', value: stats.superAdmins, icon: Crown, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Active Users', value: stats.activeUsers, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Articles', value: stats.totalArticles, icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' }
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

      {/* Search & Filter Bar */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all duration-200"
                  />
                </div>
              </form>

              {/* Filter by Role */}
              {Select ? (
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-gray-300">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full sm:w-40 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="user">User</option>
                </select>
              )}

              {/* Filter by Status */}
              {Select ? (
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40 border-gray-300">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="banned">Banned</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-40 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-gray-200 shadow-md overflow-hidden">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-[#0066FF]"></div>
                <p className="mt-4 text-sm text-gray-600 font-medium">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center">
                <UsersIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No Users Found</h3>
                <p className="text-gray-600 mb-6">
                  {search || roleFilter !== 'all' || statusFilter !== 'all'
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by adding your first user"}
                </p>
                <Link href="/admin/users/create">
                  <Button className="bg-[#0066FF] hover:bg-[#0052CC]">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <AnimatePresence mode="popLayout">
                      {users.map((user, index) => {
                        const roleBadge = getRoleBadge(user.role);
                        const statusBadge = getStatusBadge(user.status);

                        return (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-blue-50/50 transition-colors duration-200 group"
                          >
                            {/* User Info - FIXED: Use full_name, username, avatar from schema */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {user.avatar ? (
                                    <img
                                      src={user.avatar}
                                      alt={user.full_name}
                                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-[#0066FF] transition-colors duration-200"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-full flex items-center justify-center border-2 border-gray-200 group-hover:border-[#0066FF] transition-colors duration-200">
                                      <span className="text-white font-semibold text-sm">
                                        {user.full_name?.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                  {/* FIXED: Show email_verified badge if available */}
                                  {user.email_verified && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                    </div>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-sm font-bold text-gray-900 group-hover:text-[#0066FF] transition-colors duration-200 truncate">
                                    {user.full_name}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {user.username ? `@${user.username}` : user.email}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Role - FIXED: Use role from schema */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {editingRole.userId === user.id ? (
                                <div className="flex items-center gap-2">
                                  {Select ? (
                                    <Select 
                                      value={editingRole.currentRole} 
                                      onValueChange={(value) => setEditingRole({ ...editingRole, currentRole: value })}
                                    >
                                      <SelectTrigger className="w-32 h-8">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="user">User</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  ) : (
                                    <select
                                      value={editingRole.currentRole}
                                      onChange={(e) => setEditingRole({ ...editingRole, currentRole: e.target.value })}
                                      className="w-32 h-8 px-2 text-xs border border-gray-300 rounded"
                                    >
                                      <option value="super_admin">Super Admin</option>
                                      <option value="admin">Admin</option>
                                      <option value="editor">Editor</option>
                                      <option value="user">User</option>
                                    </select>
                                  )}
                                  <Button
                                    size="sm"
                                    onClick={() => handleUpdateRole(user.id, editingRole.currentRole)}
                                    className="h-8 px-2 bg-[#0066FF] hover:bg-[#0052CC]"
                                  >
                                    <CheckCircle2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingRole({ userId: null, currentRole: '' })}
                                    className="h-8 px-2"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <span className={cn(
                                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border",
                                  roleBadge.color
                                )}>
                                  <roleBadge.icon className="w-3.5 h-3.5" />
                                  {roleBadge.label}
                                </span>
                              )}
                            </td>

                            {/* Status - FIXED: Use status from schema */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={cn(
                                "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                                statusBadge.color
                              )}>
                                {statusBadge.label}
                              </span>
                            </td>

                            {/* FIXED: Use last_login_at and login_count from schema */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                {user.last_login_at ? (
                                  <>
                                    <div className="flex items-center gap-1 text-gray-900">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(user.last_login_at)}
                                    </div>
                                    {user.login_count !== undefined && (
                                      <div className="text-xs text-gray-500 mt-0.5">
                                        {user.login_count} logins
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-400">Never logged in</span>
                                )}
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
                                      disabled={currentUser?.id === user.id || user.role === 'super_admin'}
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
                                    disabled={currentUser?.id === user.id || user.role === 'super_admin'}
                                    className="text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
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

      {/* Delete User Alert Dialog - FIXED: Use full_name, username from schema */}
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
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteDialog.user?.full_name}</span>
                {deleteDialog.user?.username && <span> (@{deleteDialog.user.username})</span>}? 
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