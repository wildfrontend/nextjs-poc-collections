'use client';

import {
  Alert,
  AlertTitle,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { VoiceInputButton } from '@/components/voice-input/button';
import { VoiceInput } from '@/components/voice-input/input';

export default function Page() {
  const [showVoiceInput, setShowVoiceInput] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 3,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            color="text.primary"
            component="h1"
            fontWeight="bold"
            gutterBottom
            variant="h3"
          >
            語音輸入測試
          </Typography>

          <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }} variant="outlined">
            <Typography
              color="text.secondary"
              component="h2"
              fontWeight="600"
              gutterBottom
              variant="h6"
            >
              功能說明：
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="點擊麥克風按鈕開始錄音" />
              </ListItem>
              <ListItem>
                <ListItemText primary="錄音中可以看到紅色脈衝動畫和計時器" />
              </ListItem>
              <ListItem>
                <ListItemText primary="點擊暫停按鈕停止錄音" />
              </ListItem>
              <ListItem>
                <ListItemText primary="停止後可以預覽播放錄音" />
              </ListItem>
              <ListItem>
                <ListItemText primary="點擊發送按鈕模擬發送語音" />
              </ListItem>
              <ListItem>
                <ListItemText primary="點擊 X 按鈕取消錄音" />
              </ListItem>
            </List>
          </Paper>

          {!showVoiceInput ? (
            <Paper
              sx={{
                p: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: 'grey.300',
              }}
              variant="outlined"
            >
              <Box textAlign="center">
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  點擊下方按鈕開始測試語音輸入
                </Typography>
                <VoiceInputButton onClick={() => setShowVoiceInput(true)} />
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{ p: 3, bgcolor: 'background.paper' }}
              variant="outlined"
            >
              <Typography
                color="text.secondary"
                component="h3"
                fontWeight="600"
                gutterBottom
                variant="h6"
              >
                語音輸入介面：
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <VoiceInput
                  onClose={() => setShowVoiceInput(false)}
                  roomId="test-room"
                />
              </Box>
            </Paper>
          )}

          <Alert severity="info" sx={{ mt: 3 }}>
            <AlertTitle>提示：</AlertTitle>
            首次使用時瀏覽器會要求麥克風權限，請允許才能正常使用語音功能。
          </Alert>
        </Paper>
      </Container>
    </Box>
  );
}
