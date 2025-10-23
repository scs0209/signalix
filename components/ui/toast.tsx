'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: (id: string) => void;
}

export interface ToastContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
}

/**
 * 토스트 알림 컴포넌트
 */
export function Toast({ 
  id, 
  title, 
  description, 
  type = 'info', 
  duration = 5000,
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(id), 300); // 애니메이션 완료 후 제거
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(id), 300);
  };

  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full bg-white border rounded-lg shadow-lg transition-all duration-300 ease-in-out',
        typeStyles[type],
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={cn('flex-shrink-0 w-5 h-5 mr-3', iconStyles[type])}>
            {icons[type]}
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            {description && (
              <p className={cn('text-sm', title ? 'mt-1' : '')}>
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="sr-only">닫기</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 토스트 컨테이너 컴포넌트
 */
export function ToastContainer({ toasts, onRemove }: { 
  toasts: ToastProps[]; 
  onRemove: (id: string) => void; 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
        />
      ))}
    </div>
  );
}

/**
 * 토스트 훅
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, description?: string) => {
    addToast({ title, description, type: 'success' });
  };

  const error = (title: string, description?: string) => {
    addToast({ title, description, type: 'error' });
  };

  const warning = (title: string, description?: string) => {
    addToast({ title, description, type: 'warning' });
  };

  const info = (title: string, description?: string) => {
    addToast({ title, description, type: 'info' });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
}
