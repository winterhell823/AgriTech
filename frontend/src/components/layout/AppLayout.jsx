import { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Navbar } from '../common/Navbar';
import { Sidebar } from '../common/Sidebar';
import { useDashboard } from '../../context/DashboardContext';

export function AppLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const { setSidebarOpen, setSelectedFieldId } = useDashboard();
  const [collapsed, setCollapsed] = useState(false);

  const drawerWidth = useMemo(() => (collapsed ? 88 : 270), [collapsed]);

  const handleSearch = (query) => {
    if (!query) {
      return;
    }

    const normalized = query.trim().toLowerCase();
    const fieldMatch = normalized.match(/\d+/);

    if (fieldMatch) {
      setSelectedFieldId(fieldMatch[0]);
      navigate(`/field/${fieldMatch[0]}`);
      return;
    }

    navigate('/field-monitoring');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      <Navbar
        onMenuClick={() => {
          if (isDesktop) {
            setCollapsed((current) => !current);
          } else {
            setSidebarOpen(true);
          }
        }}
        onSearch={handleSearch}
      />
      <Sidebar collapsed={collapsed} drawerWidth={drawerWidth} onNavigate={() => !isDesktop && setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8.5,
          px: { xs: 1.5, md: 2.5 },
          pb: 3,
          ml: { xs: 0, md: `${drawerWidth}px` },
          transition: 'margin-left 180ms ease',
        }}
      >
        <Toolbar sx={{ minHeight: 16, p: 0 }} />
        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          <Outlet key={location.pathname} />
        </Box>
      </Box>
    </Box>
  );
}