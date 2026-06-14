'use client';

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  return (
    <div id="toast-wrapper" className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          let bgColor = 'bg-emerald-500 text-white dark:bg-emerald-600';
          let Icon = CheckCircle;

          if (t.tipe === 'error') {
            bgColor = 'bg-rose-500 text-white dark:bg-rose-600';
            Icon = AlertTriangle;
          } else if (t.tipe === 'info') {
            bgColor = 'bg-sky-500 text-white dark:bg-sky-600';
            Icon = Info;
          }

          return (
            <motion.div
              id={`toast-item-${t.id}`}
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-lg border border-white/10 ${bgColor}`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="shrink-0" />
                <span className="text-sm font-medium leading-tight">{t.text}</span>
              </div>
              <button
                id={`btn-close-toast-${t.id}`}
                onClick={() => removeToast(t.id)}
                className="ml-3 text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Tutup"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
