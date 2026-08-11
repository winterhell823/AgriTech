import { Avatar, Card, CardContent, Stack, Typography } from '@mui/material';

export function MetricCard({ label, value, delta, icon, accent = '#2f6b3f' }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 3, border: '1px solid rgba(22, 48, 37, 0.08)', boxShadow: '0 10px 24px rgba(15, 42, 23, 0.05)' }}>
      <CardContent sx={{ py: 2.5, px: 3, minHeight: 130, display: 'flex', alignItems: 'center' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2} sx={{ width: '100%' }}>
          <div>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
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