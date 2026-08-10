import { createContext, useContext, useMemo, useState } from 'react';
import { mapLayers, timelineOptions } from '../data/mockData';

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(timelineOptions.at(-1).value);
  const [selectedLayer, setSelectedLayer] = useState(mapLayers[0].id);
  const [selectedFieldId, setSelectedFieldId] = useState('1024');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const value = useMemo(
    () => ({
      selectedDate,
      setSelectedDate,
      selectedLayer,
      setSelectedLayer,
      selectedFieldId,
      setSelectedFieldId,
      selectedCrop,
      setSelectedCrop,
      sidebarOpen,
      setSidebarOpen,
      chatOpen,
      setChatOpen,
      timelineOptions,
      mapLayers,
    }),
    [selectedDate, selectedLayer, selectedFieldId, selectedCrop, sidebarOpen, chatOpen],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
}