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

export const ConfirmModal = ({ message, onCancel, onConfirm, loading = false, index = 0, container }: ConfirmModalProps) => {
    return (
        <ModalPortal onClose={onCancel} index={index} container={container}>
            <Paper elevation={6} sx={{ width: 360, p: 4, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    再次確認
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
                <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 4 }}>
                    <Button variant="outlined" onClick={onCancel} sx={{ borderRadius: 999 }} disabled={loading}>
                        取消
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={onConfirm}
                        sx={{ borderRadius: 999 }}
                        disabled={loading}
                    >
                        {loading ? '處理中…' : '確認'}
                    </Button>
                </Stack>
            </Paper>
        </ModalPortal>
    );
};
