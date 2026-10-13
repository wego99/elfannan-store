import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Gift, Check, Copy, MessageCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

export interface WheelPrize {
  id: string;
  label: string;
  shortLabel: string;
  code: string;
  type: 'percent' | 'fixed' | 'shipping' | 'gift';
  value: number; // percentage or fixed amount in EGP
  description: string;
  color: string;
  textColor: string;
}

export const WHEEL_PRIZES: WheelPrize[] = [
  {
    id: 'p1',
    label: 'خصم 15% فوري على أي بيجاما',
    shortLabel: 'خصم 15%',
    code: 'FANNAN15',
    type: 'percent',
    value: 15,
    description: 'خصم 15% على إجمالي قيمة مشترياتك من كولكشن البيتي والشتوي.',
    color: '#881337', // Rose 900
    textColor: '#ffffff',
  },
  {
    id: 'p2',
    label: '🚚 شحن مجاني لكافة المحافظات',
    shortLabel: 'شحن مجاني',
    code: 'FREESHIP',
    type: 'shipping',
    value: 0,
    description: 'توصيل مجاني لباب بيتك لأي محافظة في مصر مع حق المعاينة.',
    color: '#0f766e', // Teal 700
    textColor: '#ffffff',
  },
  {
    id: 'p3',
    label: 'خصم 50 ج.م فوري على الفاتورة',
    shortLabel: '50 ج.م كاش',
    code: 'SAVE50',
    type: 'fixed',
    value: 50,
    description: 'خصم 50 جنيه مصري مباشر عند الشراء بقيمة 250 ج.م فأكثر.',
    color: '#b45309', // Amber 700
    textColor: '#ffffff',
  },
  {
    id: 'p4',
    label: '🎁 هدية بندانة قطن تركي مجاناً',
    shortLabel: 'هدية قطنية',
    code: 'GIFT2026',
    type: 'gift',
    value: 0,
    description: 'هدية بندانة قطن تركي أصلي ملمس فائق النعومة تضاف لطلبك مجاناً.',
    color: '#4c1d95', // Violet 900
    textColor: '#ffffff',
  },
  {
    id: 'p5',
    label: 'خصم 20% على كولكشن العرائس',
    shortLabel: 'خصم 20%',
    code: 'BRIDE20',
    type: 'percent',
    value: 20,
    description: 'خصم استثنائي 20% على أفخم موديلات القطيفة وتجهيز العرائس.',
    color: '#9f1239', // Rose 800
    textColor: '#ffffff',
  },
  {
    id: 'p6',
    label: 'خصم 70 ج.م على باقات الشتاء',
    shortLabel: '70 ج.م خصم',
    code: 'WINTER70',
    type: 'fixed',
    value: 70,
    description: 'وفر 70 جنيهاً مصرياً على موديلات الميلتون والجاكيت البيتي الثقيل.',
    color: '#155e75', // Cyan 800
    textColor: '#ffffff',
  },
  {
    id: 'p7',
    label: 'خصم 10% إضافي على الأوكازيون',
    shortLabel: 'خصم 10%',
    code: 'EXTRA10',
    type: 'percent',
    value: 10,
    description: 'خصم 10% إضافي حتى على الموديلات المخفضة بالفعل.',
    color: '#713f12', // Yellow 900
    textColor: '#ffffff',
  },
  {
    id: 'p8',
    label: '👑 ترقية للشحن السريع VIP',
    shortLabel: 'شحن VIP',
    code: 'VIPFAST',
    type: 'shipping',
    value: 0,
    description: 'أولوية تجهيز وخروج المندوب خلال 24 ساعة فقط لعنوانك.',
    color: '#1c1917', // Stone 900
    textColor: '#fef08a',
  },
];

interface LuckyWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPrizeToCart: (prize: WheelPrize) => void;
}

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  isOpen,
  onClose,
  onApplyPrizeToCart,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [wonPrize, setWonPrize] = useState<WheelPrize | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [userName, setUserName] = useState('');
  const [appliedNotice, setAppliedNotice] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const numSlices = WHEEL_PRIZES.length;
  const sliceAngle = (2 * Math.PI) / numSlices;

  // Render wheel on canvas
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 16;

    ctx.clearRect(0, 0, size, size);

    // Draw outer golden border
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#b45309';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(center, center, radius + 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#fef3c7';
    ctx.fill();
    ctx.restore();

    // Draw each slice
    WHEEL_PRIZES.forEach((prize, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = prize.color;
      ctx.fill();

      // Border between slices
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fef3c7';
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = prize.textColor;
      ctx.font = 'bold 13px Cairo, sans-serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;
      ctx.fillText(prize.shortLabel, radius - 24, 5);
      ctx.restore();

      ctx.restore();
    });

    // Outer decorative studs (bulbs)
    const numStuds = 24;
    for (let i = 0; i < numStuds; i++) {
      const studAngle = (i * 2 * Math.PI) / numStuds;
      const sx = center + (radius + 6) * Math.cos(studAngle);
      const sy = center + (radius + 6) * Math.sin(studAngle);

      ctx.save();
      ctx.beginPath();
      ctx.arc(sx, sy, 3, 0, 2 * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#ffffff';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }

    // Inner hub
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#1c1917';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('الفنان', center, center + 4);
    ctx.restore();
  }, [isOpen]);

  // Confetti Animation when winning
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 400;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    const particles: Array<{
      x: number;
      y: number;
      color: string;
      radius: number;
      vx: number;
      vy: number;
      opacity: number;
    }> = [];

    const colors = ['#f43f5e', '#fbbf24', '#10b981', '#38bdf8', '#a855f7', '#f97316'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 5 + 3,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.7) * 14,
        opacity: 1,
      });
    }

    let animationFrame: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.opacity -= 0.012;

        if (p.opacity > 0) {
          active = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.restore();
        }
      });

      if (active) {
        animationFrame = requestAnimationFrame(render);
      }
    };

    render();
  };

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWonPrize(null);
    setHasCopied(false);
    setAppliedNotice(false);

    // Pick a winning index
    const winningIndex = Math.floor(Math.random() * numSlices);
    const selectedPrize = WHEEL_PRIZES[winningIndex];

    // Calculate rotation:
    // Canvas slices start at 0 radians (3 o'clock).
    // The pointer is positioned at the top (12 o'clock, which is -90 degrees or 270 degrees).
    // To have slice `winningIndex` land under the top pointer:
    const sliceDeg = 360 / numSlices;
    // Angle of slice center:
    const sliceCenterDeg = winningIndex * sliceDeg + sliceDeg / 2;
    // Pointer is at 270 deg (top):
    const targetDeg = (270 - sliceCenterDeg + 360) % 360;

    // Extra spins (5 to 7 full rotations)
    const fullSpins = (5 + Math.floor(Math.random() * 2)) * 360;
    const finalAngle = rotationAngle + fullSpins + targetDeg;

    setRotationAngle(finalAngle);

    // Spin duration: 4.5 seconds
    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(selectedPrize);
      triggerConfetti();
      try {
        localStorage.setItem('el_fannan_won_coupon', JSON.stringify(selectedPrize));
      } catch (e) {
        console.error(e);
      }
    }, 4500);
  };

  const handleCopyCode = () => {
    if (!wonPrize) return;
    navigator.clipboard.writeText(wonPrize.code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleApplyToCart = () => {
    if (!wonPrize) return;
    onApplyPrizeToCart(wonPrize);
    setAppliedNotice(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleWhatsAppWithCode = () => {
    if (!wonPrize) return;
    const msg = `السلام عليكم ورحمة الله، أنا ${userName ? userName : 'أحد زبائن المتجر'} ولعبت في عجلة الحظ وكسبت عرض (${wonPrize.label}) بكود الخصم: ${wonPrize.code}. أرغب بتطبيق الكود على طلبي الجديد من مصنع الفنان!`;
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-gradient-to-b from-[#18181b] via-[#27272a] to-[#18181b] rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden text-right text-white p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Confetti Overlay Canvas */}
        <canvas
          ref={confettiCanvasRef}
          className="pointer-events-none absolute inset-0 z-30 w-full h-full"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-40 p-2 text-stone-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold border border-amber-500/30 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>هدايا وجوائز سنتر الفنان الفورية</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            عجلة الحظ لعملاء وزبائن الفنان 🎡
          </h2>
          <p className="text-xs text-stone-300 max-w-sm mx-auto">
            دوّر العجلة الآن واربح كود خصم فوري أو شحن مجاني يضاف مباشرة لفاتورتك!
          </p>
        </div>

        {/* Wheel Viewport Container */}
        <div className="relative flex flex-col items-center justify-center my-4">
          
          {/* Top Indicator Pointer (Arrow at 12 o'clock pointing down) */}
          <div className="absolute top-0 z-20 -mt-2.5 flex flex-col items-center drop-shadow-lg">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400" />
            <div className="w-3 h-3 bg-amber-300 rounded-full -mt-2 shadow-sm" />
          </div>

          {/* Rotating Wheel Canvas */}
          <div 
            className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full shadow-[0_0_35px_rgba(245,158,11,0.25)] flex items-center justify-center transition-transform"
            style={{
              transform: `rotate(${rotationAngle}deg)`,
              transition: isSpinning ? 'transform 4.5s cubic-bezier(0.12, 0.8, 0.32, 1)' : 'none',
            }}
          >
            <canvas
              ref={canvasRef}
              width={340}
              height={340}
              className="w-full h-full rounded-full"
            />
          </div>

        </div>

        {/* Controls / Winning Prize Result */}
        {!wonPrize ? (
          <div className="space-y-3 pt-2">
            
            {/* Optional Name Input */}
            <div className="max-w-xs mx-auto">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="اسمك أو لقبك (اختياري)..."
                disabled={isSpinning}
                className="w-full px-3 py-2 bg-stone-900/80 border border-stone-700 rounded-xl text-xs text-white text-center placeholder:text-stone-500 focus:outline-hidden focus:border-amber-400"
              />
            </div>

            {/* Spin CTA Button */}
            <div className="text-center">
              <button
                onClick={spinWheel}
                disabled={isSpinning}
                className={`w-full max-w-xs mx-auto py-3.5 px-6 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  isSpinning
                    ? 'bg-stone-700 text-stone-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:brightness-110 text-white shadow-amber-500/20 hover:shadow-amber-500/40'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isSpinning ? 'العجلة تدور الآن... بالتوفيق!' : 'دوّر العجلة واكسب هديتك!'}</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400 text-center">
              * لكل عميل لفة حظ واحدة يومياً للاستفادة بخصم المصنع الحصري.
            </p>
          </div>
        ) : (
          /* Winning State Display */
          <div className="bg-stone-900/90 border border-amber-500/50 rounded-2xl p-5 text-center space-y-3 animate-in zoom-in-95 duration-200">
            
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-400/40">
              <Gift className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs text-amber-400 font-bold block">
                🎉 ألف مبروك {userName ? `يا ${userName}` : ''}!
              </span>
              <h3 className="text-lg font-black text-white mt-0.5">
                {wonPrize.label}
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                {wonPrize.description}
              </p>
            </div>

            {/* Coupon Code Pill */}
            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between max-w-xs mx-auto">
              <button
                onClick={handleCopyCode}
                className="px-2.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                {hasCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopied ? 'تم النسخ!' : 'نسخ الكود'}</span>
              </button>

              <span className="font-mono font-black text-amber-300 tracking-wider text-sm px-2">
                {wonPrize.code}
              </span>

              <span className="text-[11px] text-stone-500 font-medium">كود الخصم:</span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1 max-w-xs mx-auto">
              <button
                onClick={handleApplyToCart}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{appliedNotice ? 'تم تطبيق الخصم في السلة! ✓' : 'تطبيق الخصم فوراً في السلة'}</span>
              </button>

              <button
                onClick={handleWhatsAppWithCode}
                className="w-full py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-300" />
                <span>طلب بالواتساب مع كود الهدية</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400">
              * الكود فعال ومحفوظ لجلسة الشراء الحالية الخاصة بك.
            </p>

          </div>
        )}

      </div>
    </div>
  );
};
