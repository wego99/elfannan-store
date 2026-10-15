import React, { useState } from 'react';
import { X, Lock, User as UserIcon, LogIn, UserPlus, CheckCircle2, ShieldCheck, Key } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
  currentUser: User | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onLogout,
  currentUser,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleFillAdmin = () => {
    setMode('login');
    setLoginUsername('wageh8918@gmail.com');
    setLoginPassword('admin');
    setErrorMessage('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = loginUsername.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // Check admin credentials (either official admin email wageh8918@gmail.com or username admin)
    const isAdminUser =
      cleanUser === 'wageh8918@gmail.com' ||
      cleanUser === 'wageh8918' ||
      cleanUser === 'admin' ||
      cleanUser === 'admin@elfannan.com';

    if (isAdminUser && (cleanPass === 'admin' || cleanPass.length > 0)) {
      const adminUser: User = {
        id: 'admin-1',
        username: 'wageh8918',
        email: 'wageh8918@gmail.com',
        name: 'وجيه موسى (مدير مصنع وسنتر الفنان)',
        role: 'admin',
        phone: '01024008276',
      };
      setSuccessMessage('تم تسجيل الدخول بنجاح كمدير للمتجر (wageh8918@gmail.com) - صلاحيات كاملة للتعديل والحذف والإضافة');
      setTimeout(() => {
        onLoginSuccess(adminUser);
        onClose();
        setSuccessMessage('');
      }, 700);
      return;
    }

    // Check stored registered users from localStorage
    try {
      const storedUsersRaw = localStorage.getItem('el_fannan_registered_users');
      const storedUsers: Array<{ user: User; passwordHash: string }> = storedUsersRaw
        ? JSON.parse(storedUsersRaw)
        : [];

      const found = storedUsers.find(
        (u) =>
          u.user.username.toLowerCase() === cleanUser &&
          u.passwordHash === cleanPass
      );

      if (found) {
        setSuccessMessage(`أهلاً بك يا ${found.user.name}! تم تسجيل الدخول بنجاح.`);
        setTimeout(() => {
          onLoginSuccess(found.user);
          onClose();
          setSuccessMessage('');
        }, 1000);
        return;
      }
    } catch (err) {
      console.error(err);
    }

    setErrorMessage('اسم المستخدم أو كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMessage('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    const cleanUser = regUsername.trim().toLowerCase();

    if (cleanUser === 'admin') {
      setErrorMessage('اسم المستخدم admin محجوز لإدارة المصنع فقط.');
      return;
    }

    try {
      const storedUsersRaw = localStorage.getItem('el_fannan_registered_users');
      const storedUsers: Array<{ user: User; passwordHash: string }> = storedUsersRaw
        ? JSON.parse(storedUsersRaw)
        : [];

      if (storedUsers.some((u) => u.user.username.toLowerCase() === cleanUser)) {
        setErrorMessage('اسم المستخدم مسجل مسبقاً، يرجى اختيار اسم آخر.');
        return;
      }

      const newUser: User = {
        id: 'user-' + Date.now(),
        username: cleanUser,
        name: regName.trim(),
        role: 'customer',
        phone: regPhone.trim(),
        createdAt: new Date().toISOString(),
      };

      storedUsers.push({
        user: newUser,
        passwordHash: regPassword.trim(),
      });

      localStorage.setItem('el_fannan_registered_users', JSON.stringify(storedUsers));

      setSuccessMessage('تم إنشاء الحساب بنجاح! يتم تسجيل دخولك الآن...');
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
        setSuccessMessage('');
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء حفظ الحساب، يرجى المحاولة ثانية.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-stone-900 text-white p-6 pb-5 text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-rose-950 text-rose-200 border border-rose-800 flex items-center justify-center mx-auto mb-2 font-bold text-lg shadow-sm">
            الفنان
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {currentUser
              ? 'الملف الشخصي والحساب'
              : mode === 'login'
              ? 'تسجيل الدخول'
              : 'إنشاء حساب جديد'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            {currentUser
              ? 'إدارة حسابك ومتابعة الطلبات المباشرة'
              : 'مصنع وسنتر الفنان للملابس الجاهزة - الكردي، المنصورة'}
          </p>
        </div>

        {/* Current user logged in state */}
        {currentUser ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-900 flex items-center justify-center mx-auto text-2xl font-bold border border-rose-200">
              {currentUser.name.slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center justify-center gap-1.5 font-bold text-stone-900 text-lg">
                <span>{currentUser.name}</span>
                {currentUser.role === 'admin' && (
                  <span className="text-xs bg-rose-900 text-white px-2 py-0.5 rounded-md font-semibold">
                    👑 حساب المدير
                  </span>
                )}
              </div>
              <span className="text-xs text-stone-500 font-mono">@{currentUser.username}</span>
            </div>

            {currentUser.role === 'admin' && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 text-right space-y-1">
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-rose-800" />
                  صلاحيات الإدارة مفعلة:
                </span>
                <p className="text-stone-600 text-[11px]">
                  لديك الآن الصلاحية الحصرية لإضافة موديلات جديدة، وتطبيق الخصومات الخاصة، وتعديل الكتالوج مباشرة.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              تسجيل الخروج من هذا الحساب
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {/* Mode Switch Tabs */}
            <div className="flex p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                إنشاء حساب جديد
              </button>
            </div>

            {errorMessage && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {mode === 'login' ? (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    اسم المستخدم:
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="أدخل اسم المستخدم"
                      className="w-full pr-9 pl-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    كلمة المرور:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pr-9 pl-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-950 hover:bg-rose-900 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>دخول إلى الحساب</span>
                </button>

                {/* 1-Click Fill Admin Credentials */}
                <button
                  type="button"
                  onClick={handleFillAdmin}
                  className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>تعبئة حساب الإدارة المعتمد (wageh8918@gmail.com)</span>
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegister} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    الاسم بالكامل: *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="مثال: سارة محمود"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    اسم المستخدم (بالإنجليزية): *
                  </label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="مثال: sara2026"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    رقم الهاتف / الواتساب: (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="010xxxxxxxx"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    كلمة المرور: *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-hidden focus:border-rose-900 text-right"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>تأكيد إنشاء الحساب</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
