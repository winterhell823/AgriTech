import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { FieldDetailsPage } from './pages/FieldDetailsPage';
import { FieldMonitoringPage } from './pages/FieldMonitoringPage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { WeatherPage } from './pages/WeatherPage';
import { ReportsPage } from './pages/ReportsPage';

export default function App() {
	return (
		<DashboardProvider>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<LandingPage />} />
				<Route element={<AppLayout />}>
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/fields" element={<FieldMonitoringPage />} />
					<Route path="/fields/:fieldId" element={<FieldDetailsPage />} />
					<Route path="/weather" element={<WeatherPage />} />
					<Route path="/reports" element={<ReportsPage />} />
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</DashboardProvider>
	);
}
