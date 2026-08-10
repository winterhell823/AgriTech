import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
	palette: {
		mode: 'light',
		primary: {
			main: '#2f6b3f',
			dark: '#1f4b2c',
			light: '#6ea77c',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#7a5c2f',
		},
		background: {
			default: '#edf1ec',
			paper: '#ffffff',
		},
		text: {
			primary: '#163025',
			secondary: '#5a6a61',
		},
		success: {
			main: '#2e7d32',
		},
		warning: {
			main: '#d18b00',
		},
		error: {
			main: '#c4473b',
		},
		info: {
			main: '#306d8a',
		},
	},
	typography: {
		fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
		h4: {
			fontWeight: 700,
			letterSpacing: '-0.02em',
		},
		h5: {
			fontWeight: 700,
		},
		h6: {
			fontWeight: 700,
		},
		subtitle1: {
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 16,
	},
	components: {
		MuiAppBar: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
					borderBottom: '1px solid rgba(17, 34, 24, 0.08)',
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					border: '1px solid rgba(29, 61, 41, 0.08)',
					boxShadow: '0 12px 30px rgba(16, 31, 22, 0.06)',
				},
			},
		},
		MuiDrawer: {
			styleOverrides: {
				paper: {
					borderRight: 'none',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					borderRadius: 12,
					fontWeight: 600,
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontWeight: 600,
				},
			},
		},
		MuiTextField: {
			defaultProps: {
				size: 'small',
			},
		},
		MuiTableCell: {
			styleOverrides: {
				head: {
					fontWeight: 700,
					color: '#2a4235',
					background: 'rgba(47, 107, 63, 0.04)',
				},
			},
		},
	},
});
