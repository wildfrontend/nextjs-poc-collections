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

export const SampleModal = ({
  title,
  description,
  onClose,
  onConfirm,
  index = 0,
  container,
}: SampleModalProps) => {
  return (
    <ModalPortal container={container} index={index} onClose={onClose}>
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
        <Typography
          color="text.primary"
          component="h2"
          fontWeight={600}
          variant="h6"
        >
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }} variant="body2">
          {description}
        </Typography>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1.5}
          sx={{ mt: 4 }}
        >
          <Button
            onClick={onClose}
            sx={{ borderRadius: 999 }}
            variant="outlined"
          >
            關閉
          </Button>
          <Button
            color="primary"
            onClick={onConfirm ?? onClose}
            sx={{ borderRadius: 999 }}
            variant="contained"
          >
            確認
          </Button>
        </Stack>
      </Box>
    </ModalPortal>
  );
};
