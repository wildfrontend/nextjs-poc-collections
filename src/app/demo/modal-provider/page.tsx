'use client';

import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { ConfirmModal } from '@/components/demo-modal/ConfirmModal';
import {
  ModalProvider,
  useModalController,
  useModalSlot,
} from '@/components/demo-modal/ModalProvider';
import { SampleModal } from '@/components/demo-modal/SampleModal';

interface DemoPayload {
  title: string;
  description: string;
}

const ProfileModalDemo = () => {
  const openModal = useModalController('main');
  const slot = useModalSlot<DemoPayload>('main', 'profile');

  const handleOpen = () => {
    void openModal('profile', {
      title: '使用者資訊',
      description: '這個範例展示了如何透過 Provider 傳遞不同資料給 Modal。',
    });
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        onClick={handleOpen}
        sx={{ borderRadius: 2, py: 1.5 }}
      >
        開啟資料 Modal
      </Button>
      {slot && (
        <SampleModal
          title={slot.payload?.title ?? '未命名 Modal'}
          description={slot.payload?.description ?? '沒有提供描述內容'}
          onClose={() => slot.close()}
          onConfirm={() => slot.resolveWith(() => true)}
          index={slot.index}
        />
      )}
    </>
  );
};

const ConfirmModalDemo = ({
  onResult,
}: {
  onResult: (confirmed: boolean) => void;
}) => {
  const openModal = useModalController('main');
  const slot = useModalSlot<{ message?: string }>('main', 'confirm');

  const handleOpen = async () => {
    const confirmed = await openModal('confirm', {
      message: '確定要使用 Modal Provider 的 POC 嗎？',
    });
    onResult(confirmed === true);
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        color="success"
        onClick={handleOpen}
        sx={{ borderRadius: 2, py: 1.5 }}
      >
        開啟確認 Modal
      </Button>
      {slot && (
        <ConfirmModal
          message={slot.payload?.message ?? '需要確認的訊息'}
          onCancel={() => slot.close(false)}
          onConfirm={() => slot.resolveWith(async () => {
            await new Promise((resolve) => setTimeout(resolve, 800));
            return true;
          })}
          loading={slot.isResolving}
          index={slot.index}
        />
      )}
    </>
  );
};

const LogModalDemo = ({ onOpen }: { onOpen: (timestamp: string) => void }) => {
  const openModal = useModalController('log');
  const slot = useModalSlot<{ title?: string; description?: string }>(
    'log',
    'log'
  );

  const handleOpen = () => {
    const timestamp = new Date().toLocaleTimeString();
    onOpen(timestamp);
    void openModal('log', {
      title: '操作已記錄',
      description: `最新操作時間：${timestamp}`,
    });
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        color="secondary"
        onClick={handleOpen}
        sx={{ borderRadius: 2, py: 1.5 }}
      >
        開啟紀錄 Modal
      </Button>
      {slot && (
        <SampleModal
          title={slot.payload?.title ?? '操作已記錄'}
          description={slot.payload?.description ?? '無資訊'}
          onClose={() => slot.close()}
          index={slot.index}
        />
      )}
    </>
  );
};

const DemoContent = () => {
  const [logs, setLogs] = useState<string[]>([]);

  const appendLog = (message: string) => {
    setLogs((prev) => [message, ...prev.slice(0, 7)]);
  };

  return (
    <Stack spacing={4} maxWidth={640} mx="auto">
      <Box>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          Modal Provider PoC
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          透過 Context 控制 Modal 的開啟與關閉，並以 payload
          傳遞資料，以便在不同頁面共用相同的對話框。
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ProfileModalDemo />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <ConfirmModalDemo
              onResult={(confirmed) => {
                const time = new Date().toLocaleTimeString();
                appendLog(`${time}：${confirmed ? '確認' : '取消'}動作`);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <LogModalDemo
              onOpen={(timestamp) => {
                appendLog(`${timestamp}：打開紀錄 Modal`);
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} color="text.primary">
          最近操作紀錄
        </Typography>
        {logs.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            暫無操作紀錄，點擊上方按鈕看看效果。
          </Typography>
        ) : (
          <List dense sx={{ mt: 1 }}>
            {logs.map((log, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText primary={log} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Stack>
  );
};

export default function ModalProviderDemoPage() {
  return (
    <ModalProvider>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          py: { xs: 6, md: 10 },
          px: 2,
        }}
      >
        <Container maxWidth="md">
          <DemoContent />
        </Container>
      </Box>
    </ModalProvider>
  );
}
