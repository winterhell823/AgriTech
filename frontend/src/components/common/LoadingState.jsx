import { Card, CardContent, Skeleton, Stack } from '@mui/material';

export function LoadingState({ rows = 3, height = 220 }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="rounded" height={height} />
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton key={index} variant="text" />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}