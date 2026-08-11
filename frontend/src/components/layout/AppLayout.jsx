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

  const drawerWidth = useMemo(() => (collapsed ? 88 : 250), [collapsed]);

  const handleSearch = (query) => {
    if (!query) {
      return;
    }

    const normalized = query.trim().toLowerCase();
    const fieldMatch = normalized.match(/\d+/);

    if (fieldMatch) {
      setSelectedFieldId(fieldMatch[0]);
      navigate(`/fields/${fieldMatch[0]}`);
      return;
    }

    navigate('/fields');
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', overflowX: 'hidden', bgcolor: 'background.default' }}>
      <Navbar
        onMenuClick={() => {
          if (isDesktop) {
            setCollapsed((current) => !current);
          } else {
            setSidebarOpen(true);
          }
        }}
        onSearch={handleSearch}
        onHomeClick={() => navigate('/')}
      />
      <Sidebar collapsed={collapsed} drawerWidth={drawerWidth} onNavigate={() => !isDesktop && setSidebarOpen(false)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          pt: 9,
          px: { xs: 2, md: 4 },
          pb: 3,
          ml: { xs: 0, md: `${drawerWidth}px` },
          transition: 'margin-left 180ms ease',
        }}
      >
        <Toolbar sx={{ minHeight: 16, p: 0 }} />
        <Box sx={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
          <Outlet key={location.pathname} />
        </Box>
      </Box>
    </Box>
  );
}