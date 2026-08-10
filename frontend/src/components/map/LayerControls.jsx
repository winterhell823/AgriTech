import { Box, Button, ButtonGroup, IconButton, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import ZoomOutOutlinedIcon from '@mui/icons-material/ZoomOutOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import SatelliteAltOutlinedIcon from '@mui/icons-material/SatelliteAltOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

export function LayerControls({ layers, selectedLayer, onLayerChange, onZoomIn, onZoomOut, onLocate, onReset, onFullscreen }) {
  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 600,
        width: 260,
        p: 1.5,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Map Layers
      </Typography>
      <ToggleButtonGroup
        exclusive
        value={selectedLayer}
        onChange={(_, nextLayer) => nextLayer && onLayerChange(nextLayer)}
        fullWidth
        sx={{ flexWrap: 'wrap', mb: 1.5 }}
      >
        {layers.map((layer) => (
          <ToggleButton key={layer.id} value={layer.id} size="small" sx={{ minWidth: '49%', borderRadius: 1.5 }}>
            {layer.id === 'satellite' ? <SatelliteAltOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} /> : <PublicOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />}
            {layer.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <ButtonGroup fullWidth size="small" sx={{ mb: 1 }}>
        <Button onClick={onZoomIn} startIcon={<ZoomInOutlinedIcon />}>In</Button>
        <Button onClick={onZoomOut} startIcon={<ZoomOutOutlinedIcon />}>Out</Button>
      </ButtonGroup>
      <Stack direction="row" spacing={1}>
        <Button onClick={onLocate} startIcon={<MyLocationOutlinedIcon />} fullWidth size="small">Locate</Button>
        <Button onClick={onReset} startIcon={<RestartAltOutlinedIcon />} fullWidth size="small">Reset</Button>
        <IconButton onClick={onFullscreen} size="small" sx={{ border: '1px solid rgba(22,48,37,0.15)' }}>
          <FullscreenOutlinedIcon fontSize="small" />
        </IconButton>
      </Stack>
    </Paper>
  );
}