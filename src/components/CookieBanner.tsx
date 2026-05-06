import React, { useState, useEffect } from 'react';
import { cookieUtils } from '../utils/cookieUtils';
import { useTheme } from '../contexts/ThemeContext';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const consent = cookieUtils.getCookie('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    cookieUtils.setCookie('cookieConsent', 'accepted', 365);
    setShowBanner(false);
  };

  const handleDecline = () => {
    cookieUtils.setCookie('cookieConsent', 'declined', 365);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div 
        className="max-w-4xl mx-auto p-5 md:p-6 rounded-xl"
        style={{ 
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`
        }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 
              className="font-semibold mb-2"
              style={{ color: theme.text }}
            >
              Cookie 提示
            </h3>
            <p 
              className="text-sm leading-relaxed"
              style={{ color: theme.textSecondary }}
            >
              为了给你提供更好的使用体验，本应用使用 Cookie 保存你的设置偏好。这些数据将保存一年，不会被用于追踪或其他目的。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
            <button
              onClick={handleDecline}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{ 
                backgroundColor: `${theme.text}11`,
                color: theme.text,
                border: `1px solid ${theme.border}`
              }}
            >
              拒绝
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              style={{ 
                background: theme.gradient,
                color: '#ffffff'
              }}
            >
              接受
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
