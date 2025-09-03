'use client';

import SlowTimerDemo from '@/components/slow-timer';
import { Container, Typography } from '@mui/material';

const Page = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Typography gutterBottom variant="h4">
        Slow Timer Demo
      </Typography>
      <SlowTimerDemo />
    </Container>
  );
};

export default Page;
