import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { PageHeader } from '../components/common/PageHeader';
import { useAsyncData } from '../hooks/useAsyncData';
import { getFields } from '../services/fieldService';
import { formatDateLabel, formatPercent, formatNumber, getPriorityColor } from '../utils/formatters';
import { useDashboard } from '../context/DashboardContext';

const pageSize = 6;

export function FieldMonitoringPage() {
  const navigate = useNavigate();
  const { selectedDate } = useDashboard();
  const { data: fieldsData } = useAsyncData(() => getFields(selectedDate), [selectedDate]);
  const fields = fieldsData ?? [];
  const [query, setQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [stressFilter, setStressFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const [page, setPage] = useState(1);

  const filteredFields = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    return fields
      .filter((field) => (cropFilter === 'All' ? true : field.crop === cropFilter))
      .filter((field) => (stressFilter === 'All' ? true : field.stress === stressFilter))
      .filter((field) => (stageFilter === 'All' ? true : field.stage === stageFilter))
      .filter((field) => field.id.includes(lowerQuery) || field.name.toLowerCase().includes(lowerQuery) || field.crop.toLowerCase().includes(lowerQuery))
      .sort((a, b) => {
        if (sortBy === 'field') return a.id.localeCompare(b.id);
        if (sortBy === 'crop') return a.crop.localeCompare(b.crop);
        if (sortBy === 'stress') return a.stress.localeCompare(b.stress);
        if (sortBy === 'stage') return a.stage.localeCompare(b.stage);
        return b.priority.localeCompare(a.priority);
      });
  }, [fields, query, cropFilter, stressFilter, stageFilter, sortBy]);

  const paginatedFields = filteredFields.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box>
      <PageHeader
        title="Field Monitoring"
        subtitle="Search, filter, and sort validated field-level observations"
      />
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <Grid item xs={12} md={3}>
            <TextField fullWidth placeholder="Search field" value={query} onChange={(event) => setQuery(event.target.value)} />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Crop</InputLabel>
              <Select label="Crop" value={cropFilter} onChange={(event) => setCropFilter(event.target.value)}>
                {['All', 'Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Other'].map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Stress</InputLabel>
              <Select label="Stress" value={stressFilter} onChange={(event) => setStressFilter(event.target.value)}>
                {['All', 'Healthy', 'Mild Stress', 'Moderate Stress', 'Severe Stress'].map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Stage</InputLabel>
              <Select label="Stage" value={stageFilter} onChange={(event) => setStageFilter(event.target.value)}>
                {['All', 'Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity', 'Harvest-ready'].map((item) => (
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort by</InputLabel>
              <Select label="Sort by" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <MenuItem value="priority">Priority</MenuItem>
                <MenuItem value="field">Field ID</MenuItem>
                <MenuItem value="crop">Crop</MenuItem>
                <MenuItem value="stress">Stress</MenuItem>
                <MenuItem value="stage">Stage</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Field ID</TableCell>
                <TableCell>Crop</TableCell>
                <TableCell>Stage</TableCell>
                <TableCell>Stress</TableCell>
                <TableCell>Confidence</TableCell>
                <TableCell>Observation Date</TableCell>
                <TableCell>Priority</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFields.map((field) => (
                <TableRow key={field.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/field/${field.id}`)}>
                  <TableCell>{field.id}</TableCell>
                  <TableCell>{field.crop}</TableCell>
                  <TableCell>{field.stage}</TableCell>
                  <TableCell>{field.stress}</TableCell>
                  <TableCell>{formatPercent(field.confidence)}</TableCell>
                  <TableCell>{formatDateLabel(field.observationDate)}</TableCell>
                  <TableCell>
                    <Chip label={field.priority} size="small" sx={{ bgcolor: getPriorityColor(field.priority), color: '#fff' }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {formatNumber(paginatedFields.length)} of {formatNumber(filteredFields.length)} fields
          </Typography>
          <Pagination count={Math.max(1, Math.ceil(filteredFields.length / pageSize))} page={page} onChange={(_, nextPage) => setPage(nextPage)} />
        </Stack>
      </Paper>
    </Box>
  );
}