import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { Box, IconButton } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export interface VoicePreviewProps {
  audioUrl: string;
}

export const VoicePreview = ({ audioUrl }: VoicePreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
    });

    return () => {
      audio.pause();
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton onClick={togglePlay} size="small" sx={{ color: 'primary.main' }}>
        {isPlaying ? <StopIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
      </IconButton>
    </Box>
  );
};
