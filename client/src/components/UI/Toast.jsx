import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const Toast = () => {
    const { toasts, removeToast } = useToast();

    const getToastIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            default:
                return <Info className="h-5 w-5 text-blue-500" />;
        }
    };

    const getToastStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`flex items-center p-4 rounded-lg border shadow-lg max-w-sm transition-all duration-300 ${getToastStyles(toast.type)}`}
                >
                    <div className="flex items-center space-x-3 flex-1">
                        {getToastIcon(toast.type)}
                        <p className="text-sm font-medium">{toast.message}</p>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-3 flex-shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toast;