import { Alert, AlertTitle, Button, Stack } from '@mui/material';

export function ErrorState({ title = 'Unable to load data', message = 'Try refreshing the view.', onRetry }) {
  return (
    <Alert severity="error">
      <AlertTitle>{title}</AlertTitle>
      <Stack direction="row" spacing={2} alignItems="center">
        <span>{message}</span>
        {onRetry ? (
          <Button size="small" color="inherit" variant="outlined" onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </Stack>
    </Alert>
  );
}