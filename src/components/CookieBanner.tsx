import React, { useState, useEffect } from 'react';
import { cookieUtils } from '../utils/cookieUtils';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

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
      <div className="card-tech max-w-4xl mx-auto p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 text-white">Cookie 提示</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              为了给你提供更好的使用体验，本应用使用 Cookie 保存你的设置偏好。
              这些数据将保存一年，不会被用于追踪或其他目的。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
            <button
              onClick={handleDecline}
              className="btn-secondary px-6 py-3 rounded-lg font-semibold text-gray-300"
            >
              拒绝
            </button>
            <button
              onClick={handleAccept}
              className="btn-primary px-6 py-3 rounded-lg font-semibold text-white"
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
