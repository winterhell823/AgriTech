import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';

export function MetricCard({ label, value, delta, icon, accent = '#2f6b3f' }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <div>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {label}
            </Typography>
            <Typography variant="h5">{value}</Typography>
            {delta ? (
              <Typography variant="caption" color="text.secondary">
                {delta}
              </Typography>
            ) : null}
          </div>
          <Avatar sx={{ bgcolor: accent, width: 44, height: 44 }}>{icon}</Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}