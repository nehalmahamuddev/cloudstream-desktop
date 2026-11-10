import React from 'react';
import { Sparkles, Download, RefreshCw, X, AlertCircle } from 'lucide-react';
import { UpdateInfo, UpdateStatus } from '../hooks/useAppUpdater';

interface UpdateNotificationBannerProps {
  status: UpdateStatus;
  updateInfo: UpdateInfo | null;
  downloadProgress: number;
  error: string | null;
  onUpdate: () => void;
  onDismiss: () => void;
}

export const UpdateNotificationBanner: React.FC<UpdateNotificationBannerProps> = ({
  status,
  updateInfo,
  downloadProgress,
  error,
  onUpdate,
  onDismiss,
}) => {
  if (status === 'idle' || status === 'checking' || status === 'up-to-date') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 24,
        zIndex: 9999,
        maxWidth: 420,
        width: 'calc(100vw - 48px)',
        background: 'rgba(25, 23, 58, 0.96)',
        backdropFilter: 'blur(16px)',
        borderRadius: 14,
        border: '1px solid rgba(157, 114, 255, 0.35)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(124, 58, 237, 0.25)',
        padding: '16px 20px',
        color: '#ffffff',
        fontFamily: "var(--font-body, 'Inter', sans-serif)",
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #7c3aed, #9d72ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
          }}
        >
          {status === 'error' ? (
            <AlertCircle size={20} color="#fff" />
          ) : status === 'downloading' ? (
            <RefreshCw size={18} color="#fff" style={{ animation: 'spin 1.5s linear infinite' }} />
          ) : (
            <Sparkles size={20} color="#fff" />
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: -0.2 }}>
              {status === 'ready-to-restart'
                ? 'Update Ready to Install'
                : status === 'downloading'
                ? 'Downloading Update...'
                : status === 'error'
                ? 'Update Failed'
                : `Update Available: v${updateInfo?.version}`}
            </span>
            <button
              onClick={onDismiss}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#8e89b4',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 6,
              }}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>

          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: '#a5a1c9', lineHeight: 1.4 }}>
            {status === 'ready-to-restart'
              ? 'Download completed. Restart CloudStream Desktop to apply the new version.'
              : status === 'downloading'
              ? `Downloading update package (${downloadProgress}%)...`
              : status === 'error'
              ? error || 'An error occurred during update check or download.'
              : updateInfo?.body || `A new version of CloudStream Desktop is available (Current: v${updateInfo?.currentVersion || '0.1.0'}).`}
          </p>

          {status === 'downloading' && (
            <div
              style={{
                marginTop: 10,
                width: '100%',
                height: 6,
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 3,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${downloadProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  transition: 'width 0.2s ease',
                  borderRadius: 3,
                }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {status === 'available' && (
              <button
                onClick={onUpdate}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '7px 14px',
                  color: '#ffffff',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)',
                  transition: 'transform 0.1s ease',
                }}
              >
                <Download size={14} /> Update Now
              </button>
            )}

            {status === 'ready-to-restart' && (
              <button
                onClick={onUpdate}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '7px 14px',
                  color: '#ffffff',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                }}
              >
                <RefreshCw size={14} /> Restart to Apply
              </button>
            )}

            {status === 'error' && (
              <button
                onClick={onUpdate}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  padding: '7px 14px',
                  color: '#ffffff',
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            )}

            <button
              onClick={onDismiss}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                padding: '7px 12px',
                color: '#a5a1c9',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
