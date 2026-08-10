import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { FieldDetailsPage } from './pages/FieldDetailsPage';
import { FieldMonitoringPage } from './pages/FieldMonitoringPage';
import { LoginPage } from './pages/LoginPage';
import { WeatherPage } from './pages/WeatherPage';
import { AssistantPage } from './pages/AssistantPage';
import { ReportsPage } from './pages/ReportsPage';
import { CategoryPage } from './pages/CategoryPage';

export default function App() {
	return (
		<DashboardProvider>
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route element={<AppLayout />}>
					<Route index element={<DashboardPage />} />
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route
						path="/crop-classification"
						element={<CategoryPage title="Crop Classification" kind="crop" subtitle="Crop composition and thematic map emphasis" />}
					/>
					<Route
						path="/phenology"
						element={<CategoryPage title="Phenology" kind="phenology" subtitle="Stage distribution across the landscape" />}
					/>
					<Route
						path="/moisture-stress"
						element={<CategoryPage title="Moisture Stress" kind="stress" subtitle="Stress severity and trend monitoring" />}
					/>
					<Route path="/field-monitoring" element={<FieldMonitoringPage />} />
					<Route path="/weather" element={<WeatherPage />} />
					<Route path="/reports" element={<ReportsPage />} />
					<Route path="/assistant" element={<AssistantPage />} />
					<Route path="/field/:fieldId" element={<FieldDetailsPage />} />
				</Route>
				<Route path="*" element={<Navigate to="/dashboard" replace />} />
			</Routes>
		</DashboardProvider>
	);
}
