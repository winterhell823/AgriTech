import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
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
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export function Navbar({ onMenuClick, onSearch }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState('');

  const submitSearch = () => {
    onSearch?.(query);
  };

  return (
    <AppBar position="fixed" color="default" sx={{ bgcolor: 'rgba(245, 247, 244, 0.94)', backdropFilter: 'blur(10px)' }}>
      <Toolbar sx={{ minHeight: 72, gap: 2 }}>
        <IconButton edge="start" onClick={onMenuClick} color="inherit" aria-label="toggle sidebar">
          <MenuIcon />
        </IconButton>

        <Stack spacing={0} sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ lineHeight: 1.1 }}>
            Crop Intelligence
          </Typography>
          <Typography variant="caption" color="text.secondary">
            AI-Powered Agricultural Intelligence
          </Typography>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <TextField
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submitSearch();
            }
          }}
          placeholder="Search field or location"
          sx={{ width: { xs: 160, sm: 260, md: 320 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <IconButton color="inherit">
          <Badge color="error" variant="dot">
            <NotificationsNoneIcon />
          </Badge>
        </IconButton>

        <IconButton onClick={(event) => setAnchorEl(event.currentTarget)} color="inherit">
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>A</Avatar>
          <ArrowDropDownIcon fontSize="small" />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Settings</MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}