import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Stack, Typography, Divider, Box, useMediaQuery, useTheme } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GrassOutlinedIcon from '@mui/icons-material/GrassOutlined';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { NavLink, useLocation } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon /> },
  { label: 'Crop Classification', path: '/crop-classification', icon: <GrassOutlinedIcon /> },
  { label: 'Phenology', path: '/phenology', icon: <SpaOutlinedIcon /> },
  { label: 'Moisture Stress', path: '/moisture-stress', icon: <OpacityOutlinedIcon /> },
  { label: 'Field Monitoring', path: '/field-monitoring', icon: <MapOutlinedIcon /> },
  { label: 'Weather', path: '/weather', icon: <WbSunnyOutlinedIcon /> },
  { label: 'Reports', path: '/reports', icon: <AssessmentOutlinedIcon /> },
  { label: 'AI Assistant', path: '/assistant', icon: <SmartToyOutlinedIcon /> },
];

export function Sidebar({ collapsed, drawerWidth, onNavigate }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useDashboard();

  const content = (
    <Stack sx={{ height: '100%', bgcolor: '#142218', color: '#eef4ee' }}>
      <Box sx={{ px: collapsed ? 1.5 : 2.5, py: 2.25 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {collapsed ? 'CI' : 'Crop Intelligence'}
        </Typography>
        {!collapsed ? (
          <Typography variant="caption" sx={{ color: 'rgba(238, 244, 238, 0.7)' }}>
            Geospatial monitoring suite
          </Typography>
        ) : null}
      </Box>

      <List sx={{ px: 1, flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={() => onNavigate?.()}
            selected={location.pathname === item.path}
            sx={{
              mb: 0.75,
              borderRadius: 2,
              minHeight: 48,
              color: 'rgba(238, 244, 238, 0.9)',
              '&.Mui-selected': {
                bgcolor: 'rgba(144, 205, 153, 0.16)',
                color: '#ffffff',
                '& .MuiListItemIcon-root': { color: '#9cd0a8' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            {!collapsed ? <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} /> : null}
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <List sx={{ px: 1, py: 1 }}>
        {[
          { label: 'Settings', icon: <SettingsOutlinedIcon /> },
          { label: 'Help', icon: <HelpOutlineOutlinedIcon /> },
        ].map((item) => (
          <ListItemButton key={item.label} sx={{ borderRadius: 2, color: 'rgba(238, 244, 238, 0.86)' }}>
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            {!collapsed ? <ListItemText primary={item.label} /> : null}
          </ListItemButton>
        ))}
      </List>
    </Stack>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        open
        sx={{
          width: { xs: 0, md: drawerWidth },
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width 180ms ease',
          },
        }}
      >
        {content}
      </Drawer>
      <Drawer
        variant="temporary"
        open={!isDesktop && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 290,
            boxSizing: 'border-box',
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}