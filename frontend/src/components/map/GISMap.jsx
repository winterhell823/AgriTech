import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { MapContainer, Polygon, TileLayer, useMap } from 'react-leaflet';
import { LayerControls } from './LayerControls';
import { TimeSlider } from './TimeSlider';
import { getCropColor, getStageColor, getStressColor } from '../../utils/formatters';

const baseCenter = [17.4725, 78.3942];

function MapSync({ selectedField, resetCounter }) {
  const map = useMap();

  useEffect(() => {
    if (selectedField?.geometry?.geometry?.coordinates?.[0]) {
      const bounds = selectedField.geometry.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [map, selectedField, resetCounter]);

  return null;
}

function getColorForField(field, selectedLayer) {
  if (selectedLayer === 'crop') {
    return getCropColor(field.crop);
  }
  if (selectedLayer === 'phenology') {
    return getStageColor(field.stage);
  }
  if (selectedLayer === 'stress') {
    return getStressColor(field.stress);
  }
  if (selectedLayer === 'weather') {
    if (field.temperature >= 35) return '#c4473b';
    if (field.temperature >= 33) return '#d18b00';
    return '#3f7d58';
  }
  return '#2f6b3f';
}

export function GISMap({ fields, selectedFieldId, onSelectField, selectedLayer, onSelectedLayerChange, dates, selectedDate, onSelectedDateChange, layers, selectedCrop }) {
  const [resetCounter, setResetCounter] = useState(0);
  const mapRef = useRef(null);

  const selectedField = useMemo(() => {
    if (!Array.isArray(fields) || fields.length === 0) {
      return null;
    }

    return fields.find((field) => field.id === selectedFieldId) ?? fields[0];
  }, [fields, selectedFieldId]);

  const visibleFields = useMemo(
    () => (Array.isArray(fields) && selectedCrop && selectedCrop !== 'All' ? fields.filter((field) => field.crop === selectedCrop) : fields ?? []),
    [fields, selectedCrop],
  );

  const handleZoomIn = () => mapRef.current?.zoomIn?.();
  const handleZoomOut = () => mapRef.current?.zoomOut?.();
  const handleReset = () => {
    mapRef.current?.setView?.(baseCenter, 13);
    setResetCounter((current) => current + 1);
  };
  const handleLocate = () => {
    navigator.geolocation?.getCurrentPosition?.((position) => {
      mapRef.current?.setView?.([position.coords.latitude, position.coords.longitude], 14);
    });
  };
  const handleFullscreen = () => {
    const container = document.querySelector('.gis-map-shell');
    if (!document.fullscreenElement) {
      container?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <Paper className="gis-map-shell" sx={{ position: 'relative', height: { xs: 520, md: 720 }, overflow: 'hidden', borderRadius: 3 }}>
      <Box sx={{ position: 'absolute', inset: 0, minHeight: 0 }}>
        <MapContainer
          center={baseCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenReady={(event) => {
            mapRef.current = event.target;
          }}
        >
          <TileLayer
            url={selectedLayer === 'satellite' ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
            attribution={selectedLayer === 'satellite' ? 'Tiles &copy; Esri' : '&copy; OpenStreetMap contributors'}
          />
          <MapSync selectedField={selectedField} resetCounter={resetCounter} />
          {visibleFields.map((field) => {
            const positions = field.geometry.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);

            return (
            <Polygon
              key={`${field.id}-${selectedDate}-${selectedLayer}`}
              positions={positions}
              eventHandlers={{
                click: () => onSelectField(field.id),
              }}
              style={() => {
                const isSelected = field.id === selectedFieldId;
                const isDimmed = selectedCrop && selectedCrop !== 'All' && field.crop !== selectedCrop;
                const fillOpacity = selectedLayer === 'boundaries' ? 0.04 : isDimmed ? 0.08 : 0.42;

                return {
                  color: isSelected ? '#ffffff' : getColorForField(field, selectedLayer),
                  weight: isSelected ? 4 : 2,
                  opacity: isSelected ? 1 : 0.95,
                  fillColor: getColorForField(field, selectedLayer),
                  fillOpacity,
                };
              }}
            />
            );
          })}
        </MapContainer>
      </Box>

      <LayerControls
        layers={layers}
        selectedLayer={selectedLayer}
        onLayerChange={onSelectedLayerChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
        onReset={handleReset}
        onFullscreen={handleFullscreen}
      />

      <Box sx={{ position: 'absolute', left: 16, top: 16, zIndex: 500, maxWidth: 280, width: 'calc(100% - 32px)' }}>
        <Paper sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.95)' }}>
          <Typography variant="subtitle2" gutterBottom noWrap>
            Active Layer: {layers.find((layer) => layer.id === selectedLayer)?.label ?? 'Satellite'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Click a field polygon to inspect the model output, evidence, and recommendations.
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 500, px: 2, pb: 2 }}>
        <TimeSlider dates={dates} value={selectedDate} onChange={onSelectedDateChange} />
      </Box>
    </Paper>
  );
}