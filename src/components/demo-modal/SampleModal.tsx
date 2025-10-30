'use client';

import { Box, Button, Stack, Typography } from '@mui/material';

import { ModalPortal } from './ModalPortal';

interface SampleModalProps {
    title: string;
    description: string;
    onClose: () => void;
    onConfirm?: () => void;
    index?: number;
    container?: HTMLElement;
}

export const SampleModal = ({ title, description, onClose, onConfirm, index = 0, container }: SampleModalProps) => {
    return (
        <ModalPortal onClose={onClose} index={index} container={container}>
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 420,
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: 4,
                    p: 4,
                }}
            >
                <Typography variant="h6" component="h2" fontWeight={600} color="text.primary">
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    {description}
                </Typography>
                <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 4 }}>
                    <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 999 }}>
                        關閉
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onConfirm ?? onClose}
                        sx={{ borderRadius: 999 }}
                    >
                        確認
                    </Button>
                </Stack>
            </Box>
        </ModalPortal>
    );
};
