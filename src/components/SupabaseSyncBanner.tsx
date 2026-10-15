import React, { useState } from 'react';
import { Database, RefreshCw, UploadCloud, CheckCircle2, AlertTriangle, Copy, Check, ExternalLink, HelpCircle } from 'lucide-react';
import { Product } from '../types';
import { SUPABASE_URL } from '../lib/supabase';

interface SupabaseSyncBannerProps {
  supabaseProductCount: number;
  totalProductsCount: number;
  isLoading: boolean;
  rlsWarning: boolean;
  onRefresh: () => Promise<void>;
  onSeedDefaults: () => Promise<void>;
}

export const SupabaseSyncBanner: React.FC<SupabaseSyncBannerProps> = ({
  supabaseProductCount,
  totalProductsCount,
  isLoading,
  rlsWarning,
  onRefresh,
  onSeedDefaults,
}) => {
  const [showRlsHelp, setShowRlsHelp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sqlCommand = `ALTER TABLE products DISABLE ROW LEVEL SECURITY;`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await onSeedDefaults();
    } finally {
      setIsSeeding(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border border-amber-500/40 rounded-2xl p-4 sm:p-5 text-white shadow-lg mb-8 text-right">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Connection Info */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">
                قاعدة بيانات متجر الفنان (Supabase Database)
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                متصل بالجدول: products
              </span>
              {rlsWarning && (
                <button
                  type="button"
                  onClick={() => setShowRlsHelp(true)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-pointer hover:bg-amber-500/30 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>تنبيه أذونات RLS (اضغط للحل)</span>
                </button>
              )}
            </div>

            <p className="text-xs text-stone-300 mt-1">
              المشروع: <span className="font-mono text-emerald-300 dir-ltr">{SUPABASE_URL.replace('https://', '')}</span>
              {' '}• الأعمدة المفعلة: <span className="font-mono text-stone-200">title, price, image</span>
              {' '}• المخزن في السحابة: <strong className="text-amber-400">{supabaseProductCount}</strong> منتج
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="px-3 py-2 bg-stone-800 hover:bg-stone-700 disabled:opacity-60 text-xs font-semibold rounded-xl border border-stone-700 text-stone-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="إعادة جلب المنتجات المحدثة من Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>تحديث من السحابة</span>
          </button>

          {supabaseProductCount === 0 && (
            <button
              type="button"
              onClick={handleSeed}
              disabled={isSeeding || isLoading}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-60 text-stone-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              title="رفع كافة الموديلات الحالية إلى جدول products في Supabase"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${isSeeding ? 'animate-bounce' : ''}`} />
              <span>{isSeeding ? 'جاري الرفع لـ Supabase...' : 'رفع منتجات الكتالوج إلى Supabase'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowRlsHelp(true)}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
            title="تعليمات صلاحيات Supabase RLS"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* RLS Help Modal */}
      {showRlsHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-xs text-stone-900">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-right space-y-4">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>إعداد صلاحيات جدول products في Supabase</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowRlsHelp(false)}
                className="text-stone-400 hover:text-stone-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              بشكل افتراضي، تقوم Supabase بتفعيل نظام حماية يسمى <strong className="font-mono">Row Level Security (RLS)</strong>، مما قد يمنع المتصفح من إرسال المنتجات الجديدة أو حذفها إذا لم توجد سياسة مخصصة.
            </p>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2">
              <p className="text-xs font-bold text-stone-800">
                الحل الأسهل (خطوة واحدة في لوحة Supabase):
              </p>
              <ol className="text-xs text-stone-600 list-decimal list-inside space-y-1">
                <li>افتح لوحة تحكم <strong>Supabase</strong> وانتقل إلى <strong>SQL Editor</strong>.</li>
                <li>انسخ الكود التالي والصقه هناك ثم اضغط <strong>Run</strong>:</li>
              </ol>

              <div className="relative mt-2 bg-stone-900 text-emerald-400 font-mono text-xs p-3 rounded-xl flex items-center justify-between">
                <code className="dir-ltr">{sqlCommand}</code>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-[11px] font-sans flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ الكود'}</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-stone-500 bg-amber-50 border border-amber-200 rounded-xl p-3">
              💡 <strong>ملاحظة:</strong> الموقع يقوم بحفظ أي منتج محلياً وتلقائياً كنسخة احتياطية حتى لو لم يتم تفعيل الكود، وبمجرد تشغيل الكود في Supabase سيتم المزامنة السحابية الدائمة دون انقطاع.
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRlsHelp(false)}
                className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                فهمت، حسناً
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
