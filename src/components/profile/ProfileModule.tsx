import React, { useState } from 'react';
import { User, Shield, MapPin, Mail, Calendar, Phone, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileModule: React.FC = () => {
  const { authUser, changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!authUser) {
    return null;
  }

  const user = {
    name: authUser.employee_name,
    email: authUser.email,
    role: authUser.role,
    plantLocation: authUser.department,
  };

  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      setMessage('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Unable to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-xl flex items-center justify-center ring-4 ring-blue-100 shadow-sm">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
            <p className="text-xs font-semibold text-blue-700 mt-0.5">{user.role}</p>
            <p className="text-xs text-slate-500 mt-0.5">{user.plantLocation}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-4 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
            <Mail className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-[10px] text-slate-400">Email Address</p>
              <p className="font-semibold text-slate-800">{user.email}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
            <Shield className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-[10px] text-slate-400">Security Role</p>
              <p className="font-semibold text-slate-800">{user.role}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
            <MapPin className="w-4 h-4 text-amber-600" />
            <div>
              <p className="text-[10px] text-slate-400">Department</p>
              <p className="font-semibold text-slate-800">{user.plantLocation}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
            <Phone className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-[10px] text-slate-400">Mobile Number</p>
              <p className="font-semibold text-slate-800">{authUser.phone_number || '--'}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
            <User className="w-4 h-4 text-cyan-600" />
            <div>
              <p className="text-[10px] text-slate-400">Employee ID</p>
              <p className="font-semibold text-slate-800">{authUser.employee_id}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg flex items-center gap-3">
            <Calendar className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-[10px] text-slate-400">Active Shift Duty</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Change Password</h2>
            <p className="text-xs text-slate-500">Update the password used to sign in to your account.</p>
          </div>
        </div>

        {message && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              autoComplete="current-password"
              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              isSubmitting ? 'bg-blue-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
