'use client';

import RunningClockDemo from '@/components/runing-clock';
import { Container, Typography } from '@mui/material';

const Page = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Typography gutterBottom variant="h4">
        Running Clock Demo
      </Typography>
      <RunningClockDemo />
    </Container>
  );
};

export default Page;
