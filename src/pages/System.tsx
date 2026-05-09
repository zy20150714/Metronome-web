import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { cookieUtils } from '../utils/cookieUtils';

const System: React.FC = () => {
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

  const getCookieStatus = () => {
    const consent = cookieUtils.getCookie('cookieConsent');
    if (consent === 'accepted') return '已同意';
    if (consent === 'declined') return '已拒绝';
    return '未设置';
  };

  return (
    <div 
      className="min-h-screen p-4 sm:p-6"
      style={{ backgroundColor: theme.background }}
    >
      <div className="container mx-auto max-w-lg">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all duration-300"
            style={{ 
              backgroundColor: theme.surface,
              color: theme.text,
              border: `1px solid ${theme.border}`,
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
            className="text-2xl font-bold mb-1"
            style={{ color: theme.text }}
          >
            系统设置
          </h1>
          <p style={{ color: theme.textSecondary, fontSize: '14px' }}>应用设置和Cookie管理</p>
        </div>

        {showSuccess && (
          <div 
            className="mb-4 p-4 rounded-xl text-center font-medium"
            style={{ backgroundColor: `${theme.primary}20`, color: theme.primary, border: `1px solid ${theme.primary}` }}
          >
            操作成功
          </div>
        )}

        <div 
          className="mb-4 p-5 rounded-2xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold mb-1" style={{ color: theme.text }}>Cookie 同意状态</h2>
              <p className="text-sm" style={{ color: theme.textSecondary }}>{getCookieStatus()}</p>
            </div>
            <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAcceptCookies}
              className="flex-1 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: theme.primary, color: '#fff' }}
            >
              同意
            </button>
            <button
              onClick={handleDeclineCookies}
              className="flex-1 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ backgroundColor: `${theme.primary}15`, color: theme.text }}
            >
              拒绝
            </button>
          </div>
        </div>

        <div 
          className="mb-4 p-5 rounded-2xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold mb-1" style={{ color: theme.text }}>本地存储</h2>
              <p className="text-sm" style={{ color: theme.textSecondary }}>
                {localStorage.getItem('metronome-settings') ? '已保存设置' : '无保存的设置'}
              </p>
            </div>
            <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>

          <button
            onClick={handleClearData}
            className="w-full py-3 rounded-xl font-medium transition-all duration-200"
            style={{ backgroundColor: '#ef444415', color: '#ef4444', border: `1px solid #ef444440` }}
          >
            清除所有数据
          </button>
        </div>

        <div 
          className="p-5 rounded-2xl"
          style={{ 
            backgroundColor: theme.surface,
            border: `1px solid ${theme.border}`,
            boxShadow: theme.shadow
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${theme.primary}20` }}
            >
              <svg className="w-6 h-6" style={{ color: theme.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: theme.text }}>关于应用</h3>
              <p className="text-sm" style={{ color: theme.textSecondary }}>节拍器 v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default System;
