import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAudioPreviewReturn {
    /** audio 元素的 ref */
    audioRef: React.RefObject<HTMLAudioElement | null>;
    /** 是否正在播放預覽 */
    isPlaying: boolean;
    /** 切換播放/暫停 */
    togglePlayback: () => void;
    /** 手動播放 */
    play: () => void;
    /** 手動暫停 */
    pause: () => void;
    /** 停止並重置到開頭 */
    stop: () => void;
}

export const useAudioPreview = (audioUrl: string | null): UseAudioPreviewReturn => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const play = useCallback(() => {
        const el = audioRef.current;
        if (!el || !audioUrl) return;

        try {
            el.load();
        } catch {}

        el.play().catch(() => {});
    }, [audioUrl]);

    const pause = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;

        el.pause();
    }, []);

    const stop = useCallback(() => {
        const el = audioRef.current;
        if (!el) return;

        el.pause();
        el.currentTime = 0;
        setIsPlaying(false);
    }, []);

    const togglePlayback = useCallback(() => {
        const el = audioRef.current;
        if (!el || !audioUrl) return;

        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [audioUrl, isPlaying, pause, play]);

    // 監聽音頻元素的播放狀態事件
    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => {
            el.currentTime = 0;
            setIsPlaying(false);
        };

        el.addEventListener('play', handlePlay);
        el.addEventListener('pause', handlePause);
        el.addEventListener('ended', handleEnded);

        return () => {
            el.removeEventListener('play', handlePlay);
            el.removeEventListener('pause', handlePause);
            el.removeEventListener('ended', handleEnded);
        };
    }, []);

    // 當 audioUrl 改變時，重置播放狀態
    useEffect(() => {
        if (!audioUrl) {
            setIsPlaying(false);
        }
    }, [audioUrl]);

    // 清理：組件卸載時停止播放
    useEffect(() => {
        const el = audioRef.current;
        return () => {
            if (el) {
                el.pause();
                el.currentTime = 0;
            }
        };
    }, []);

    return {
        audioRef,
        isPlaying,
        togglePlayback,
        play,
        pause,
        stop,
    };
};
