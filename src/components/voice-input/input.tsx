'use client';

import CloseIcon from '@mui/icons-material/Close';
import PauseIcon from '@mui/icons-material/Pause';
import SendIcon from '@mui/icons-material/Send';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { useState } from 'react';

import { VoicePreview } from './preview';
import { useRecordVoice } from './record-voice';

const formatTime = (s: number) =>
  `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

export interface VoiceInputProps {
  roomId: string;
  onClose?: () => void;
}

export const VoiceInput = ({ roomId, onClose }: VoiceInputProps) => {
  const {
    isStopped,
    isRecording,
    isDisabled,
    audioBlob,
    audioUrl,
    seconds,
    reset,
    stop,
  } = useRecordVoice();
  const [isUploading, setIsUploading] = useState(false);

  // 停止（關麥）
  const handlePauseRecording = () => {
    stop();
  };

  const handleCancel = () => {
    reset();
    onClose?.();
  };

  const handleSend = async () => {
    if (!audioBlob) return;

    try {
      setIsUploading(true);
      // TODO: 實作上傳邏輯
      console.log('準備發送語音訊息，大小:', audioBlob.size, 'bytes');

      reset();
      onClose?.();
    } catch (error) {
      console.error('發送語音訊息失敗:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* 取消 */}
      <IconButton
        aria-label="取消錄音"
        color="inherit"
        onClick={handleCancel}
        sx={{
          color: 'text.secondary',
          '&:hover': {
            bgcolor: 'grey.100',
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* 中間：狀態 + 秒數 */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderRadius: '24px',
          border: 1,
          borderColor: 'grey.300',
          bgcolor: 'grey.50',
          px: 2,
          py: 1,
        }}
      >
        <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', gap: 1 }}>
          {isDisabled && (
            <Typography color="error" variant="caption">
              麥克風權限未開啟
            </Typography>
          )}
          {isRecording && (
            <>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': {
                      opacity: 1,
                    },
                    '50%': {
                      opacity: 0.3,
                    },
                  },
                }}
              />
              <Typography color="text.secondary" variant="body2">
                錄音中…
              </Typography>
            </>
          )}
          {isStopped && audioUrl && <VoicePreview audioUrl={audioUrl} />}
        </Box>

        <Typography color="text.primary" fontWeight={500} variant="body2">
          {formatTime(seconds)}
        </Typography>
      </Box>

      {/* 右側：錄製中→停止（關麥）；停止後→送出 */}
      {isStopped ? (
        <IconButton
          aria-label="發送語音訊息"
          disabled={!audioBlob || isUploading}
          onClick={handleSend}
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&:disabled': {
              bgcolor: 'grey.300',
            },
          }}
        >
          {isUploading ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            <SendIcon />
          )}
        </IconButton>
      ) : (
        <IconButton
          aria-label="停止錄音"
          disabled={isDisabled}
          onClick={handlePauseRecording}
          sx={{
            bgcolor: 'error.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'error.dark',
            },
            '&:disabled': {
              bgcolor: 'grey.300',
            },
          }}
          title="停止錄音"
        >
          <PauseIcon />
        </IconButton>
      )}
    </>
  );
};
