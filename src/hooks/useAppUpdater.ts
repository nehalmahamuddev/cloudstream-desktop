import { useState, useEffect, useCallback, useRef } from 'react';

export interface UpdateInfo {
  version: string;
  currentVersion: string;
  date?: string;
  body?: string;
}

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'up-to-date'
  | 'downloading'
  | 'ready-to-restart'
  | 'error';

export function useAppUpdater() {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false);
  const updateRef = useRef<any>(null);

  const isTauri = typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);

  const checkForUpdates = useCallback(async (isManual: boolean = false) => {
    if (!isTauri) {
      if (isManual) {
        setStatus('up-to-date');
      }
      return;
    }

    try {
      setStatus('checking');
      setError(null);

      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();

      if (update && update.available) {
        updateRef.current = update;
        setUpdateInfo({
          version: update.version,
          currentVersion: update.currentVersion,
          date: update.date,
          body: update.body,
        });
        setStatus('available');
      } else {
        setStatus('up-to-date');
      }
    } catch (err: any) {
      console.warn('[Updater] Check failed:', err);
      setError(err?.message || 'Failed to check for updates');
      setStatus(isManual ? 'error' : 'idle');
    }
  }, [isTauri]);

  const downloadAndInstall = useCallback(async () => {
    const update = updateRef.current;
    if (!update) return;

    try {
      setStatus('downloading');
      setDownloadProgress(0);
      setError(null);

      let totalBytes = 0;
      let downloadedBytes = 0;

      await update.downloadAndInstall((event: any) => {
        if (event.event === 'Started') {
          totalBytes = event.data?.contentLength || 0;
        } else if (event.event === 'Progress') {
          downloadedBytes += event.data?.chunkLength || 0;
          if (totalBytes > 0) {
            const percent = Math.min(100, Math.round((downloadedBytes / totalBytes) * 100));
            setDownloadProgress(percent);
          }
        } else if (event.event === 'Finished') {
          setDownloadProgress(100);
          setStatus('ready-to-restart');
        }
      });
    } catch (err: any) {
      console.error('[Updater] Download & install failed:', err);
      setError(err?.message || 'Failed to download update');
      setStatus('error');
    }
  }, []);

  const dismissBanner = useCallback(() => {
    setIsBannerDismissed(true);
  }, []);

  // Silent background check 10 seconds after cold launch
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForUpdates(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [checkForUpdates]);

  return {
    status,
    updateInfo,
    downloadProgress,
    error,
    isBannerDismissed,
    checkForUpdates: () => checkForUpdates(true),
    downloadAndInstall,
    dismissBanner,
  };
}
