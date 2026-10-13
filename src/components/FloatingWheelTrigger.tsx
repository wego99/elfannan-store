import React from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingWheelTriggerProps {
  onOpenWheel: () => void;
  hasWonDiscount?: boolean;
}

export const FloatingWheelTrigger: React.FC<FloatingWheelTriggerProps> = ({
  onOpenWheel,
  hasWonDiscount,
}) => {
  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        onClick={onOpenWheel}
        className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-amber-600 via-rose-700 to-amber-600 hover:from-amber-500 hover:to-rose-600 text-white rounded-full shadow-xl hover:shadow-2xl border border-amber-300/40 transition-all duration-300 hover:scale-105 cursor-pointer active:scale-95"
        aria-label="افتح عجلة الحظ واربح خصم فوري"
      >
        {/* Animated Glow Halo */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 opacity-60 blur-xs group-hover:opacity-100 transition duration-300 -z-10" />

        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm shrink-0">
          🎡
        </div>

        <div className="text-right">
          <span className="block text-xs font-black tracking-tight leading-tight whitespace-nowrap">
            {hasWonDiscount ? 'كوبون الهدية نشط 🎁' : 'عجلة الحظ والهدايا'}
          </span>
          <span className="block text-[10px] text-amber-200 font-medium whitespace-nowrap">
            {hasWonDiscount ? 'اضغط لعرض الكود' : 'العب واكسب خصم فوري'}
          </span>
        </div>

        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin duration-3000 hidden sm:block" />
      </button>
    </div>
  );
};
