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
  TextField,
} from '@mui/material';
import { useMemo, useState } from 'react';

import { ConfirmModal } from '@/components/demo-modal/ConfirmModal';
import {
  ModalProvider,
  useModalController,
  useModalManager,
  useModalSlot,
} from '@/components/demo-modal/ModalProvider';
import { ModalPortal } from '@/components/demo-modal/ModalPortal';
import { SampleModal } from '@/components/demo-modal/SampleModal';

interface DemoPayload {
  title: string;
  description: string;
}

interface NestedProfilePayload {
  user: {
    name: string;
    email: string;
    department: string;
  };
}

interface NestedNotePayload {
  initialNote: string;
}

const usePreviousModalPayload = <TPayload,>(namespace: string, currentIndex?: number) => {
  const { stack } = useModalManager();

  return useMemo(() => {
    if (typeof currentIndex !== 'number') {
      return undefined;
    }

    for (let i = currentIndex - 1; i >= 0; i--) {
      const entry = stack[i];
      if (entry.namespace === namespace) {
        return entry.payload as TPayload;
      }
    }

    return undefined;
  }, [stack, namespace, currentIndex]);
};

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

const NestedProfileModal = ({
  user,
  note,
  onEditNote,
  onClose,
  onConfirm,
  index,
  isConfirming,
  isEditing,
}: {
  user: NestedProfilePayload['user'];
  note: string;
  onEditNote: () => void;
  onClose: () => void;
  onConfirm: () => void;
  index: number;
  isConfirming: boolean;
  isEditing: boolean;
}) => {
  return (
    <ModalPortal onClose={onClose} index={index}>
      <Paper
        elevation={6}
        sx={{
          width: 420,
          maxWidth: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          設定使用者備註
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
          這個範例示範如何在巢狀 Modal 之間共享資料。
        </Typography>
        <Stack spacing={2.5} sx={{ mt: 3 }}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2" color="text.secondary">
              使用者
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email} ・ {user.department}
            </Typography>
          </Stack>
          <Stack
            spacing={1.5}
            sx={{
              p: 2,
              borderRadius: 2,
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="subtitle2" color="text.secondary">
                備註
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={onEditNote}
                sx={{ borderRadius: 999 }}
                disabled={isEditing}
              >
                編輯備註
              </Button>
            </Stack>
            <Typography variant="body2" color={note ? 'text.primary' : 'text.disabled'}>
              {note || '尚未設定備註'}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 999 }} disabled={isConfirming}>
            取消
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onConfirm}
            sx={{ borderRadius: 999 }}
            disabled={isConfirming}
          >
            {isConfirming ? '儲存中…' : '儲存'}
          </Button>
        </Stack>
      </Paper>
    </ModalPortal>
  );
};

const NoteEditorModal = ({
  namespace,
  index,
  defaultValue,
  onCancel,
  onSave,
}: {
  namespace: string;
  index: number;
  defaultValue: string;
  onCancel: () => void;
  onSave: (value: string) => void;
}) => {
  const [value, setValue] = useState(defaultValue);
  const parentPayload = usePreviousModalPayload<NestedProfilePayload>(namespace, index);

  return (
    <ModalPortal onClose={onCancel} index={index}>
      <Paper
        elevation={6}
        sx={{
          width: 400,
          maxWidth: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          更新備註
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          上一層 Modal 的使用者：{parentPayload?.user.name ?? '未知使用者'}（
          {parentPayload?.user.email ?? '未知信箱'}）
        </Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          maxRows={6}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          sx={{ mt: 3 }}
          placeholder="輸入要保存的備註內容"
        />
        <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={onCancel} sx={{ borderRadius: 999 }}>
            取消
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSave(value)}
            sx={{ borderRadius: 999 }}
          >
            儲存備註
          </Button>
        </Stack>
      </Paper>
    </ModalPortal>
  );
};

const NestedModalDemo = () => {
  const namespace = 'nested';
  const openModal = useModalController(namespace);
  const profileSlot = useModalSlot<NestedProfilePayload>(namespace, 'profile');
  const noteSlot = useModalSlot<NestedNotePayload>(namespace, 'note');

  const [note, setNote] = useState('想要升級到專業方案');
  const [lastSavedNote, setLastSavedNote] = useState<string | null>(null);

  const handleOpen = () => {
    const defaultNote = '想要升級到專業方案';
    setNote(defaultNote);
    setLastSavedNote(null);

    void (async () => {
      const result = await openModal<NestedProfilePayload, string>('profile', {
        user: {
          name: '王小明',
          email: 'ming@example.com',
          department: '產品設計部',
        },
      });

      setLastSavedNote(typeof result === 'string' ? result : null);
    })();
  };

  const handleEditNote = async () => {
    const updatedNote = await openModal<NestedNotePayload, string>('note', {
      initialNote: note,
    });

    if (typeof updatedNote === 'string') {
      setNote(updatedNote);
    }
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        color="info"
        onClick={handleOpen}
        sx={{ borderRadius: 2, py: 1.5 }}
      >
        開啟巢狀 Modal
      </Button>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
        最後儲存的備註：{lastSavedNote ?? '尚未儲存'}
      </Typography>

      {profileSlot && (
        <NestedProfileModal
          user={profileSlot.payload?.user ?? { name: '未知使用者', email: '未知信箱', department: '未提供部門' }}
          note={note}
          onEditNote={() => {
            void handleEditNote();
          }}
          onClose={() => profileSlot.close()}
          onConfirm={() => {
            void profileSlot.resolveWith(() => note);
          }}
          index={profileSlot.index}
          isConfirming={profileSlot.isResolving}
          isEditing={Boolean(noteSlot)}
        />
      )}

      {noteSlot && (
        <NoteEditorModal
          namespace={namespace}
          index={noteSlot.index}
          defaultValue={noteSlot.payload?.initialNote ?? ''}
          onCancel={() => noteSlot.close()}
          onSave={(value) => {
            void noteSlot.resolveWith(() => value);
          }}
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
          <Grid size={{ xs: 12, sm: 4 }}>
            <NestedModalDemo />
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
