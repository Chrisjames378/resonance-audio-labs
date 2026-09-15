import React from 'react';
import { ToastState } from '../types';

interface ToastProps {
  toast: ToastState;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast.visible) return null;

  let iconClass = 'fa-info-circle text-indigo-400';
  if (toast.type === 'success') iconClass = 'fa-check-circle text-emerald-400';
  if (toast.type === 'warning') iconClass = 'fa-exclamation-triangle text-amber-400';
  if (toast.type === 'error') iconClass = 'fa-exclamation-circle text-rose-400';

  return (
    <div
      id="toast"
      className="fixed top-5 right-5 z-50 bg-slate-800 text-white px-5 py-3 rounded-xl shadow-2xl border border-indigo-500/30 flex items-center gap-3 transition-all duration-300 ease-out animate-bounce-short"
    >
      <i className={`fas ${iconClass} text-lg`}></i>
      <span className="text-sm font-medium">{toast.message}</span>
    </div>
  );
};
