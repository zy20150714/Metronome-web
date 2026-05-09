import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { cookieUtils } from '../../utils/cookieUtils';

const CookieSettings: React.FC = () => {
  const { theme } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAcceptCookies = () => {
    cookieUtils.setCookie('cookieConsent', 'accepted', 365);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleDeclineCookies = () => {
    cookieUtils.setCookie('cookieConsent', 'declined', 365);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleClearData = () => {
    cookieUtils.deleteCookie('cookieConsent');
    cookieUtils.deleteCookie('metronome-settings');
    localStorage.removeItem('metronome-settings');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="mb-8">
          <Link
            to="/system"
            className="inline-flex items-center gap-3 px-6 py-4 rounded-lg font-semibold transition-all duration-300"
            style={{
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`,
              borderRadius: theme.cornerRadius,
              boxShadow: theme.shadow
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </Link>
        </div>

        <div className="mb-6">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: theme.id === 'tech' ? "'Orbitron', monospace" : "'Inter', sans-serif", color: theme.text }}
          >
            Cookie 设置
          </h1>
          <p style={{ color: theme.textSecondary }}>管理Cookie和本地存储设置</p>
        </div>

        {showSuccess && (
          <div
            className="mb-6 p-4 rounded-lg text-center"
            style={{
              backgroundColor: `${theme.primary}20`,
              border: `1px solid ${theme.primary}`,
              color: theme.primary
            }}
          >
            操作成功！
          </div>
        )}

        <div
          className="mb-6 p-6"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ background: `${theme.primary}20` }}
            >
              <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: theme.text }}>Cookie 同意状态</h3>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {cookieUtils.getCookie('cookieConsent') === 'accepted' ? '已同意' : 
                 cookieUtils.getCookie('cookieConsent') === 'declined' ? '已拒绝' : '未设置'}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAcceptCookies}
              className="flex-1 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: theme.primary,
                color: '#fff',
                borderRadius: theme.cornerRadius,
                boxShadow: `0 4px 16px ${theme.glow}`
              }}
            >
              同意
            </button>
            <button
              onClick={handleDeclineCookies}
              className="flex-1 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: `${theme.primary}15`,
                color: theme.text,
                border: `1px solid ${theme.border}`,
                borderRadius: theme.cornerRadius
              }}
            >
              拒绝
            </button>
          </div>
        </div>

        <div
          className="mb-6 p-6"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ background: `${theme.primary}20` }}
            >
              <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: theme.text }}>本地存储</h3>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {localStorage.getItem('metronome-settings') ? '已保存设置' : '无保存的设置'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClearData}
            className="w-full py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: '#ef444420',
              color: '#ef4444',
              border: `1px solid #ef444440`,
              borderRadius: theme.cornerRadius
            }}
          >
            清除所有数据
          </button>
        </div>

        <div
          className="p-6"
          style={{
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            borderRadius: theme.cornerRadius,
            boxShadow: theme.shadow
          }}
        >
          <h3 className="font-semibold mb-3" style={{ color: theme.text }}>关于 Cookie</h3>
          <div className="text-sm space-y-2" style={{ color: theme.textSecondary }}>
            <p>我们使用Cookie来保存您的节拍器设置，以便下次访问时自动恢复。</p>
            <p>您可以随时通过本页面管理Cookie偏好设置。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieSettings;
