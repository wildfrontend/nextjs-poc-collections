'use client';

import { Container, Typography } from '@mui/material';

import UserList from '@/components/performance-check';

const Page = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <Typography gutterBottom variant="h4">
        Performance Check Demo
      </Typography>
      <UserList />
    </Container>
  );
};

export default Page;
