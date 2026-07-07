'use client';

// app/admin/dashboard/settings/page.tsx
// Admin settings — view profile info, change password

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import { Shield, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import ClipLoader from 'react-spinners/ClipLoader';

const ADMIN_EMAIL = 'info@smartmathz.com';

const inputCls = `w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white
  focus:outline-none focus:ring-2 focus:ring-[#7FB509]/30 focus:border-[#7FB509]
  placeholder:text-gray-400 transition-all`;

export default function AdminSettingsPage() {
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);

  const passwordStrength = (pw: string) => {
    if (pw.length >= 12) return 4;
    if (pw.length >= 8)  return 3;
    if (pw.length >= 6)  return 2;
    if (pw.length > 0)   return 1;
    return 0;
  };

  const strength      = passwordStrength(newPw);
  const strengthLabel = ['', 'Too short', 'Weak', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-[#7FB509]', 'bg-green-500'][strength];

  const handleChangePassword = async () => {
    setError('');
    setSuccess(false);

    if (!currentPw || !newPw || !confirmPw) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPw.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setError('New passwords do not match.');
      return;
    }
    if (newPw === currentPw) {
      setError('New password must be different from current password.');
      return;
    }

    setLoading(true);

    // Re-authenticate with current password first to verify it
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email:    ADMIN_EMAIL,
      password: currentPw,
    });

    if (signInError) {
      setError('Current password is incorrect.');
      setLoading(false);
      return;
    }

    // Now update to new password
    const { error: updateError } = await supabase.auth.updateUser({ password: newPw });

    if (updateError) {
      setError(updateError.message || 'Failed to update password. Please try again.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    toast.success('Password updated successfully!');
    setLoading(false);
  };

  return (
    <div className="max-w-7xl space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your admin account details.</p>
      </div>

      {/* ── Profile card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
          Admin Profile
        </h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1a2e05] flex items-center justify-center flex-shrink-0">
            <Shield className="text-[#7FB509] w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">SmartMathz Admin</p>
            <p className="text-sm text-gray-500">{ADMIN_EMAIL}</p>
            <span className="inline-block mt-1 text-xs bg-[#7FB509]/10 text-[#3a5a09] font-semibold
                             px-2.5 py-0.5 rounded-full">
              Administrator
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Role',         val: 'Lead Administrator'    },
            { label: 'Email',        val: ADMIN_EMAIL             },
            { label: 'Portal',       val: 'SmartMathz Admin'      },
            { label: 'Access Level', val: 'Full Access'           },
          ].map(({ label, val }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-0.5">
                {label}
              </p>
              <p className="text-sm font-semibold text-gray-800">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Change password card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <Lock className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
            Change Password
          </h2>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700
                          text-sm px-4 py-3 rounded-xl mb-5">
            <CheckCircle size={16} />
            Password updated successfully!
          </div>
        )}

        <div className="space-y-4">

          {/* Current password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPw}
                onChange={e => { setCurrentPw(e.target.value); setError(''); setSuccess(false); }}
                placeholder="Enter current password"
                className={inputCls}
              />
              <button type="button" onClick={() => setShowCurrent(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-[#7FB509] cursor-pointer transition-colors">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPw}
                onChange={e => { setNewPw(e.target.value); setError(''); setSuccess(false); }}
                placeholder="Min. 6 characters"
                className={inputCls}
              />
              <button type="button" onClick={() => setShowNew(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-[#7FB509] cursor-pointer transition-colors">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {newPw.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1.5">
                  {[1,2,3,4].map(lvl => (
                    <div key={lvl} className={`h-1 flex-1 rounded-full transition-all duration-300
                      ${lvl <= strength ? strengthColor : 'bg-gray-100'}`} />
                  ))}
                </div>
                <p className={`text-xs font-semibold mt-1
                  ${strength >= 3 ? 'text-[#7FB509]' : strength >= 2 ? 'text-amber-500' : 'text-red-500'}`}>
                  {strengthLabel}
                </p>
              </div>
            )}
          </div>

          {/* Confirm new password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPw}
                onChange={e => { setConfirmPw(e.target.value); setError(''); setSuccess(false); }}
                placeholder="Repeat new password"
                className={inputCls}
              />
              <button type="button" onClick={() => setShowConfirm(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-[#7FB509] cursor-pointer transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {confirmPw.length > 0 && (
              <p className={`text-xs font-semibold mt-1.5
                ${newPw === confirmPw ? 'text-[#7FB509]' : 'text-red-500'}`}>
                {newPw === confirmPw ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600
                            text-sm px-4 py-2.5 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#1a2e05] hover:bg-[#2a4a09] text-white font-bold
                       text-sm flex items-center justify-center gap-2 cursor-pointer transition-all
                       shadow-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]">
            {loading
              ? <><ClipLoader size={16} color="#fff" /><span>Updating...</span></>
              : '🔒 Update Password'}
          </button>
        </div>
      </div>

    </div>
  );
}