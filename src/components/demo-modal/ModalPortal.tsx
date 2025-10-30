'use client';

import { Backdrop, Box } from '@mui/material';
import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
    children: ReactNode;
    onClose?: () => void;
    index?: number;
    container?: HTMLElement;
}

export const ModalPortal = ({ children, onClose, index = 0, container }: ModalPortalProps) => {
    const handleBackdropClick = () => {
        onClose?.();
    };

    const handleContentClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return createPortal(
        <Backdrop
            open
            sx={{
                zIndex: theme => theme.zIndex.modal + index + 1,
                backdropFilter: 'blur(4px)',
                bgcolor: 'rgba(17, 24, 39, 0.4)',
            }}
            onClick={handleBackdropClick}
        >
            <Box onClick={handleContentClick} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2 }}>
                {children}
            </Box>
        </Backdrop>,
        container ?? document.body
    );
};

