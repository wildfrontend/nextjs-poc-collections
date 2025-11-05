import MicIcon from '@mui/icons-material/Mic';
import { IconButton, Tooltip } from '@mui/material';

interface VoiceInputButtonProps {
  onClick: () => void;
}

export const VoiceInputButton = ({ onClick }: VoiceInputButtonProps) => {
  return (
    <Tooltip title="開始語音輸入">
      <IconButton
        color="primary"
        onClick={onClick}
        size="large"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          width: 56,
          height: 56,
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <MicIcon />
      </IconButton>
    </Tooltip>
  );
};
