import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastStack: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto bg-neutral-900 text-white p-3.5 rounded-xl shadow-2xl border border-neutral-700 flex items-start gap-3 transform transition-all duration-300 animate-slide-up"
        >
          {toast.image ? (
            <img
              src={toast.image}
              alt=""
              className="w-10 h-12 object-cover rounded shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="p-2 rounded-full bg-amber-500/20 text-amber-400 shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : toast.type === 'warning' ? (
                <AlertCircle className="w-5 h-5 text-amber-400" />
              ) : (
                <Info className="w-5 h-5 text-sky-400" />
              )}
            </div>
          )}

          <div className="flex-1 text-left">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">{toast.title}</h4>
            <p className="text-xs text-stone-200 mt-0.5 line-clamp-2">{toast.message}</p>
          </div>

          <button
            id={`dismiss-toast-${toast.id}`}
            onClick={() => onDismiss(toast.id)}
            className="text-stone-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
