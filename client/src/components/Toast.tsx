// client/src/components/Toast.tsx
import React from 'react';
import { XCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// Define the types for our toast messages
export type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const iconMap = {
  success: <CheckCircle className="h-5 w-5 text-green-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-100',
    info: 'bg-blue-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100',
  };

  const textColor = {
    success: 'text-green-800',
    info: 'text-blue-800',
    warning: 'text-yellow-800',
    error: 'text-red-800',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-opacity duration-300 ${bgColor[type]}`}
      role="alert"
    >
      {iconMap[type]}
      <p className={`text-sm font-medium ${textColor[type]}`}>{message}</p>
      <button
        onClick={onClose}
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${textColor[type]} hover:bg-opacity-80`}
      >
        <span className="sr-only">Dismiss</span>
        <XCircle className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Toast;