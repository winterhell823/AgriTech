import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Link, Stack, TextField, Typography } from '@mui/material';

export function LoginPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, background: 'linear-gradient(135deg, #1b2a21 0%, #2f6b3f 100%)' }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Crop Intelligence
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to the AI-powered agricultural intelligence platform.
              </Typography>
            </Box>
            <TextField label="Email" type="email" fullWidth />
            <TextField label="Password" type="password" fullWidth />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <FormControlLabel control={<Checkbox />} label="Remember me" />
              <Link href="#" underline="hover">Forgot password?</Link>
            </Stack>
            <Button variant="contained" size="large">Login</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}