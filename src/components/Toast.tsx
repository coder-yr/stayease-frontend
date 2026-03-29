import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-brand-accent" />,
  error:   <XCircle className="w-5 h-5 text-rose-500" />,
  info:    <Info className="w-5 h-5 text-sky-500" />,
};

const borders: Record<ToastType, string> = {
  success: 'border-brand-accent/30',
  error:   'border-rose-200',
  info:    'border-sky-200',
};

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => (
  <div className="fixed top-24 right-6 z-[999] flex flex-col gap-3 w-[320px] max-w-[calc(100vw-24px)]">
    <AnimatePresence>
      {toasts.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className={`bg-white/95 backdrop-blur-xl border ${borders[t.type]} rounded-2xl shadow-2xl shadow-slate-900/10 p-5 flex items-start gap-4`}
        >
          <div className="shrink-0 mt-0.5">{icons[t.type]}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-widest">{t.title}</p>
            {t.message && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t.message}</p>}
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="shrink-0 text-slate-300 hover:text-slate-600 transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);

// Hook for easy use in pages
export function useToast() {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((type: ToastType, title: string, message?: string, duration = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, dismiss };
}

export default Toast;
