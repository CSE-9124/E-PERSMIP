import React, { useState, useEffect } from 'react';
import { setNotificationCallback } from '../utils/notification';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Set the global notification callback
    setNotificationCallback((message, type) => {
      setNotification({ message, type });
      
      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    });
  }, []);

  const dismissNotification = () => {
    setNotification(null);
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-gradient-to-r from-green-500 to-emerald-600',
          textColor: 'text-white',
          icon: CheckCircleIcon,
          borderColor: 'border-green-400'
        };
      case 'error':
        return {
          bgColor: 'bg-gradient-to-r from-red-500 to-red-600',
          textColor: 'text-white',
          icon: XCircleIcon,
          borderColor: 'border-red-400'
        };
      case 'warning':
        return {
          bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          textColor: 'text-white',
          icon: ExclamationTriangleIcon,
          borderColor: 'border-yellow-400'
        };
      case 'info':
      default:
        return {
          bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
          textColor: 'text-white',
          icon: InformationCircleIcon,
          borderColor: 'border-blue-400'
        };
    }
  };

  return (
    <>
      {children}
      {notification && (
        <div className="fixed top-4 right-4 z-50 notification-enter">
          <div className={`
            relative overflow-hidden rounded-xl notification-shadow border-l-4 backdrop-blur-sm
            ${getNotificationConfig(notification.type).bgColor}
            ${getNotificationConfig(notification.type).borderColor}
            max-w-sm min-w-80
            transform transition-all duration-300 ease-out
          `}>
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-px bg-white/30"></div>
            </div>
            
            <div className="relative p-4 flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                {React.createElement(getNotificationConfig(notification.type).icon, {
                  className: `h-6 w-6 ${getNotificationConfig(notification.type).textColor} drop-shadow-sm`
                })}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className={`
                  text-sm font-medium leading-relaxed
                  ${getNotificationConfig(notification.type).textColor}
                  drop-shadow-sm
                `}>
                  {notification.message}
                </p>
              </div>
              
              {/* Close button */}
              <button 
                onClick={dismissNotification}
                className={`
                  flex-shrink-0 ml-2 p-1.5 rounded-full
                  ${getNotificationConfig(notification.type).textColor}
                  hover:bg-white/20 active:bg-white/30
                  transition-all duration-200 ease-out
                  focus:outline-none focus:ring-2 focus:ring-white/50
                  hover:scale-110 active:scale-95
                `}
                aria-label="Tutup notifikasi"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Progress bar for auto-dismiss */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 overflow-hidden">
              <div 
                className="h-full bg-white/50 notification-progress"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationProvider;
