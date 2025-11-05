'use client';

import { Button, Paper, Stack, Typography } from '@mui/material';

import { ModalPortal } from './ModalPortal';

interface ConfirmModalProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
  index?: number;
  container?: HTMLElement;
}

export const ConfirmModal = ({
  message,
  onCancel,
  onConfirm,
  loading = false,
  index = 0,
  container,
}: ConfirmModalProps) => {
  return (
    <ModalPortal container={container} index={index} onClose={onCancel}>
      <Paper elevation={6} sx={{ width: 360, p: 4, borderRadius: 3 }}>
        <Typography fontWeight={600} gutterBottom variant="h6">
          再次確認
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {message}
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1.5}
          sx={{ mt: 4 }}
        >
          <Button
            disabled={loading}
            onClick={onCancel}
            sx={{ borderRadius: 999 }}
            variant="outlined"
          >
            取消
          </Button>
          <Button
            color="success"
            disabled={loading}
            onClick={onConfirm}
            sx={{ borderRadius: 999 }}
            variant="contained"
          >
            {loading ? '處理中…' : '確認'}
          </Button>
        </Stack>
      </Paper>
    </ModalPortal>
  );
};
