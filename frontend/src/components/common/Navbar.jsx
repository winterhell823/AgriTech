import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export function Navbar({ onMenuClick, onSearch, onHomeClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState('');

  const submitSearch = () => {
    onSearch?.(query);
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{
        bgcolor: 'rgba(245, 247, 244, 0.98)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(15, 42, 20, 0.08)',
        boxShadow: 'none',
        width: '100%',
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: { xs: 2, md: 3.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <IconButton edge="start" onClick={onMenuClick} color="inherit" aria-label="toggle sidebar">
            <MenuIcon />
          </IconButton>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ lineHeight: 1.1 }}>
              Crop Intelligence
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Geospatial field health and moisture monitoring
            </Typography>
          </Box>

          <Button
            startIcon={<HomeOutlinedIcon />}
            onClick={onHomeClick}
            sx={{ textTransform: 'none', color: 'text.primary', display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Home
          </Button>
        </Stack>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }}>
          <TextField
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                submitSearch();
              }
            }}
            placeholder="Search field or location"
            sx={{ width: 'min(360px, 35vw)', maxWidth: 360, minWidth: 180 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Updated now
          </Typography>

          <IconButton color="inherit">
            <Badge color="error" variant="dot">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} color="inherit">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>A</Avatar>
            <ArrowDropDownIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}