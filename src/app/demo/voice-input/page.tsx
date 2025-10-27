'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Alert,
    AlertTitle,
} from '@mui/material';
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
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="text.primary">
                        語音輸入測試
                    </Typography>

                    <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                        <Typography variant="h6" component="h2" gutterBottom fontWeight="600" color="text.secondary">
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
                            variant="outlined"
                            sx={{
                                p: 6,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderStyle: 'dashed',
                                borderWidth: 2,
                                borderColor: 'grey.300',
                            }}
                        >
                            <Box textAlign="center">
                                <Typography color="text.secondary" sx={{ mb: 2 }}>
                                    點擊下方按鈕開始測試語音輸入
                                </Typography>
                                <VoiceInputButton onClick={() => setShowVoiceInput(true)} />
                            </Box>
                        </Paper>
                    ) : (
                        <Paper variant="outlined" sx={{ p: 3, bgcolor: 'background.paper' }}>
                            <Typography variant="h6" component="h3" gutterBottom fontWeight="600" color="text.secondary">
                                語音輸入介面：
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <VoiceInput roomId="test-room" onClose={() => setShowVoiceInput(false)} />
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
