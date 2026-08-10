import { Card, CardContent, Typography } from '@mui/material';

export function SectionCard({ title, subtitle, action, children, sx }) {
  return (
    <Card sx={{ ...sx, height: '100%' }}>
      <CardContent>
        {(title || subtitle || action) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <div>
              {title ? <Typography variant="h6">{title}</Typography> : null}
              {subtitle ? <Typography variant="body2" color="text.secondary">{subtitle}</Typography> : null}
            </div>
            {action}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}