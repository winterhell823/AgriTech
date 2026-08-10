import { Card, CardContent, Typography } from '@mui/material';

export function EmptyState({ title = 'No records available', description = 'Adjust filters or select another field.' }) {
  return (
    <Card>
      <CardContent sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}