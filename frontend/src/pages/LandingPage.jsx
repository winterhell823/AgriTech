import { useEffect, useMemo, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { HeroFieldVisual } from '../components/landing/HeroFieldVisual';
import dashboardMap from '../assets/dashboard-map.svg';
import timelineChart from '../assets/timeline-chart.svg';
import fieldOverhead from '../assets/field-overhead.svg';

const mockSourceCards = [
  { title: 'Optical Satellite', detail: 'Sentinel-2, Landsat' },
  { title: 'SAR', detail: 'Sentinel-1 backscatter' },
  { title: 'Weather', detail: 'Rainfall, Temperature, Humidity, Wind' },
];

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
`;

const orbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const scanLine = keyframes`
  from { transform: translateX(-40%) rotate(-16deg); opacity: 0; }
  10% { opacity: 0.24; }
  40% { opacity: 0.42; }
  60% { opacity: 0.42; }
  to { transform: translateX(140%) rotate(-16deg); opacity: 0; }
`;

const pulseGlow = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.75; }
  50% { transform: scale(1.08); opacity: 1; }
`;

const particleFloat = keyframes`
  from { transform: translate(0, 0); opacity: 0.18; }
  50% { transform: translate(3px, -6px); opacity: 0.34; }
  to { transform: translate(0, 0); opacity: 0.18; }
`;

const dataFlowDot = keyframes`
  0% { transform: translateX(0) translateY(0); opacity: 0.6; }
  50% { opacity: 1; }
  100% { transform: translateX(0) translateY(0); opacity: 0.6; }
`;

const windLine = keyframes`
  from { transform: translateX(0); opacity: 0.28; }
  50% { transform: translateX(4px); opacity: 0.68; }
  to { transform: translateX(0); opacity: 0.28; }
`;

const rainFall = keyframes`
  from { transform: translateY(0); opacity: 0.35; }
  to { transform: translateY(12px); opacity: 0; }
`;

function useInViewOnce(ref, options = { threshold: 0.15 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      return undefined;
    }

    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      options,
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options, visible]);

  return visible;
}

function useCountUp(target, duration, active) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    let rafId;
    const start = performance.now();

    const update = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) {
        rafId = requestAnimationFrame(update);
      }
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, active]);

  return value;
}

function RevealSection({ children, delay = 0 }) {
  const ref = useRef(null);
  const visible = useInViewOnce(ref, { threshold: 0.2 });

  return (
    <Box
      ref={ref}
      sx={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(25px)',
        transition: `opacity 680ms ease ${delay}ms, transform 680ms ease ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Box>
  );
}

function AnimatedChart({ alt, src, reducedMotion }) {
  const ref = useRef(null);
  const visible = useInViewOnce(ref, { threshold: 0.35 });
  const dashOffset = visible && !reducedMotion ? 0 : 120;
  const pointOpacity = visible ? 1 : 0;
  const lineDuration = reducedMotion ? 0 : 1800;

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        height: 280,
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: '#f5f7f1',
      }}
    >
      <Box component="img" src={src} alt={alt} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <Box
        component="svg"
        viewBox="0 0 320 180"
        preserveAspectRatio="none"
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <path
          d="M16 148 C 80 112, 130 72, 164 84 C 198 96, 242 60, 304 36"
          fill="none"
          stroke="#2f6b3f"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="120"
          strokeDashoffset={dashOffset}
          style={{ transition: `stroke-dashoffset ${lineDuration}ms ease`, opacity: 0.96 }}
        />
        <circle
          cx={visible ? 304 : 16}
          cy={visible ? 36 : 148}
          r="6"
          fill="#d1a92a"
          style={{
            transition: reducedMotion ? 'none' : 'transform 1200ms ease, opacity 1200ms ease',
            transform: visible ? 'translateX(0)' : 'translateX(-8px)',
            opacity: pointOpacity,
          }}
        />
      </Box>
    </Box>
  );
}

export function LandingPage() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const statsRef = useRef(null);
  const statsVisible = useInViewOnce(statsRef, { threshold: 0.35 });

  const monitoredCount = useCountUp(1248, 1200, statsVisible);
  const dimensionsCount = useCountUp(4, 1200, statsVisible);
  const historyCount = useCountUp(5, 1200, statsVisible);
  const platformCount = useCountUp(1, 1200, statsVisible);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(query.matches);

    const handleChange = (event) => {
      setReducedMotion(event.matches);
    };

    if (query.addEventListener) {
      query.addEventListener('change', handleChange);
    } else if (query.addListener) {
      query.addListener(handleChange);
    }

    return () => {
      if (query.removeEventListener) {
        query.removeEventListener('change', handleChange);
      } else if (query.removeListener) {
        query.removeListener(handleChange);
      }
    };
  }, []);

  const heroTextAnimation = useMemo(
    () => ({
      animation: reducedMotion ? 'none' : `${fadeUp} 700ms ease forwards`,
    }),
    [reducedMotion],
  );

  return (
    <Box sx={{ maxWidth: 1480, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 4, md: 6 }, color: '#163025' }}>
      <Stack spacing={6}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} lg={6}>
            <Stack spacing={3}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'text.secondary',
                  opacity: 0,
                  transform: 'translateY(16px)',
                  animation: reducedMotion ? 'none' : `${fadeUp} 700ms ease forwards`,
                  animationDelay: '80ms',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Satellite intelligence for the field
              </Typography>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  maxWidth: 680,
                  lineHeight: 1.05,
                  opacity: 0,
                  transform: 'translateY(24px)',
                  animation: reducedMotion ? 'none' : `${fadeUp} 700ms ease forwards`,
                  animationDelay: '180ms',
                }}
              >
                See What Your Fields Can't Tell You.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: 620,
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  opacity: 0,
                  transform: 'translateY(24px)',
                  animation: reducedMotion ? 'none' : `${fadeUp} 700ms ease forwards`,
                  animationDelay: '260ms',
                }}
              >
                Satellite-powered agricultural intelligence for crop monitoring, field health, and moisture stress detection.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{
                  opacity: 0,
                  transform: 'translateY(24px)',
                  animation: reducedMotion ? 'none' : `${fadeUp} 700ms ease forwards`,
                  animationDelay: '340ms',
                }}
              >
                <Button component={Link} to="/dashboard" variant="contained" size="large" sx={{ px: 4 }}>
                  Explore Dashboard →
                </Button>
                <Button component={Link} to="/reports" variant="outlined" size="large" sx={{ px: 4 }}>
                  Explore the Technology →
                </Button>
              </Stack>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', opacity: 0, transform: 'translateY(24px)', animation: reducedMotion ? 'none' : `${fadeUp} 700ms ease forwards`, animationDelay: '420ms' }}>
                {['Seed', 'Sprout', 'Growing Crop', 'Mature Crop'].map((stage, index) => (
                  <Box
                    key={stage}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        bgcolor: '#2f6b3f',
                        transform: 'scale(0.88)',
                        animation: reducedMotion ? 'none' : `${pulseGlow} 2.4s ease ${index * 0.12}s infinite alternate`,
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {stage}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} lg={6}>
            <HeroFieldVisual />
          </Grid>
        </Grid>

        <RevealSection delay={80}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 4, height: '100%', bgcolor: 'rgba(255,255,255,0.95)', position: 'relative', overflow: 'hidden' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Agriculture is changing faster than we can see it.</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Satellite observations help monitor crop development, vegetation health, moisture stress, weather conditions, field-level changes, and historical trends.
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, borderRadius: 4, height: '100%', bgcolor: 'rgba(255,255,255,0.95)', position: 'relative' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Multiple Signals. One Field View.</Typography>
                <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.16 }}>
                  <Box sx={{ position: 'absolute', top: 64, left: 42, width: 2, height: 160, bgcolor: 'rgba(47,107,63,0.18)' }} />
                  <Box sx={{ position: 'absolute', top: 58, left: 44, width: 10, height: 10, borderRadius: '50%', bgcolor: '#8fc88f', animation: `${dataFlowDot} 2.8s linear infinite` }} />
                </Box>
                <Stack spacing={2}>
                  {mockSourceCards.map((card, index) => (
                    <Box
                      key={card.title}
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 3,
                        bgcolor: '#f2f5ee',
                        transition: 'transform 250ms ease, box-shadow 250ms ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 18px 32px rgba(20,34,24,0.10)',
                        },
                      }}
                    >
                      <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: '#2f6b3f', display: 'grid', placeItems: 'center', color: '#fff', fontWeight: 700 }}>
                        {card.title.charAt(0)}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{card.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{card.detail}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </RevealSection>

        <RevealSection delay={160}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.96)',
                  transition: 'transform 250ms ease, box-shadow 250ms ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 18px 32px rgba(20,34,24,0.10)',
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>01 — Crop Classification</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Know what is growing.</Typography>
                <Stack spacing={1}>
                  {['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane'].map((crop) => (
                    <Box key={crop} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography variant="body2">{crop}</Typography>
                      <Typography variant="body2" color="text.secondary">{Math.round(70 + Math.random() * 25)}%</Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.96)',
                  transition: 'transform 250ms ease, box-shadow 250ms ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 18px 32px rgba(20,34,24,0.10)',
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>02 — Phenology</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Understand crop growth stages.</Typography>
                <Stack spacing={1}>
                  {['Germination', 'Vegetative', 'Flowering', 'Grain Filling', 'Maturity', 'Harvest-ready'].map((stage) => (
                    <Typography key={stage} variant="body2" color="text.secondary">• {stage}</Typography>
                  ))}
                </Stack>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.96)',
                  transition: 'transform 250ms ease, box-shadow 250ms ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 18px 32px rgba(20,34,24,0.10)',
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>03 — Moisture Stress</Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Detect changing field conditions.</Typography>
                {['Healthy', 'Mild Stress', 'Moderate Stress', 'Severe Stress'].map((stress) => (
                  <Box key={stress} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2">{stress}</Typography>
                    <Box sx={{ width: 90, height: 10, borderRadius: 1, bgcolor: '#e5e8e0' }}>
                      <Box
                        sx={{
                          width: stress === 'Healthy' ? '90%' : stress === 'Mild Stress' ? '70%' : stress === 'Moderate Stress' ? '54%' : '32%',
                          height: '100%',
                          bgcolor: stress === 'Healthy' ? '#2e7d32' : stress === 'Mild Stress' ? '#d18b00' : stress === 'Moderate Stress' ? '#ef7a2d' : '#c4473b',
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Card>
            </Grid>
          </Grid>
        </RevealSection>

        <RevealSection delay={240}>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12} md={7}>
              <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 24px 52px rgba(20, 34, 24, 0.10)', position: 'relative' }}>
                <Box sx={{ p: 4, pb: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>From Satellite Observations to Field-Level Intelligence.</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                    Field boundaries, crop type, stress overlays, and selected field insights are all available in a single GIS dashboard.
                  </Typography>
                </Box>
                <Box sx={{ position: 'relative', height: 420, background: '#101f16', overflow: 'hidden', borderRadius: 3 }}>
                  <Box component="img" src={fieldOverhead} alt="Aerial agricultural fields" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }} />
                  <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(16, 30, 18, 0.28)' }} />
                  <Box sx={{ position: 'absolute', left: 20, top: 20, zIndex: 2, minWidth: 192, p: 2, borderRadius: 3, bgcolor: 'rgba(16, 30, 18, 0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 22px 44px rgba(0,0,0,0.18)' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f4e3a0', mb: 1 }}>FIELD IQ</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>Field 1024</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Wheat</Typography>
                    <Typography variant="body2" sx={{ color: '#f4e3a0', mb: 0.5 }}>NDVI 0.68</Typography>
                    <Typography variant="body2" color="text.secondary">Moderate Stress</Typography>
                  </Box>
                  <Box component="span" sx={{ position: 'absolute', inset: 0, cursor: 'default', '&:hover ~ img': { transform: 'scale(1.02)' } }} />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <Card sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.96)', position: 'relative', overflow: 'hidden' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Agriculture is a timeline.</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
                    Historical observations let you compare NDVI, NDWI, and EVI trends across the growing season.
                  </Typography>
                  <AnimatedChart src={timelineChart} alt="Timeline chart" reducedMotion={reducedMotion} />
                </Card>

                <Card sx={{ p: 3, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.96)', position: 'relative', overflow: 'hidden' }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Turn Field Signals Into Action.</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.8 }}>
                    Predictions, evidence, and recommendations in a field-level action summary.
                  </Typography>
                  <Stack spacing={1.25}>
                    {['Declining NDWI', 'Declining NDVI', 'Low recent rainfall', 'High temperature', 'Relevant SAR response'].map((signal) => (
                      <Typography key={signal} variant="body2">• {signal}</Typography>
                    ))}
                  </Stack>
                  <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(209, 139, 0, 0.12)', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Priority: HIGH</Typography>
                    <Typography variant="body2" color="text.secondary">Suggested action: Irrigation / Field Inspection</Typography>
                    {!reducedMotion && (
                      <Box sx={{ position: 'absolute', right: 12, top: 12, width: 32, height: 20, borderTop: '2px solid rgba(196, 110, 8, 0.32)', borderRadius: 1, animation: `${windLine} 2.4s ease-in-out infinite` }} />
                    )}
                    {!reducedMotion && (
                      <Box sx={{ position: 'absolute', left: 12, bottom: 12, width: 2, height: 20, bgcolor: 'rgba(47, 107, 63, 0.22)', borderRadius: 1, animation: `${rainFall} 1.8s linear infinite` }} />
                    )}
                  </Box>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </RevealSection>

        <RevealSection delay={320}>
          <Grid container spacing={3} sx={{ mt: 2 }} ref={statsRef}>
            {[
              { value: monitoredCount, label: 'Fields Monitored' },
              { value: dimensionsCount, label: 'Monitoring Dimensions' },
              { value: historyCount, label: 'Historical Observation Dates' },
              { value: platformCount, label: 'Unified GIS Platform' },
            ].map((item) => (
              <Grid key={item.label} item xs={12} sm={6} md={3}>
                <Card sx={{ p: 3, borderRadius: 4, textAlign: 'center', height: '100%', transition: 'transform 250ms ease', '&:hover': { transform: 'translateY(-3px)' } }}>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{item.value}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{item.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </RevealSection>

        <RevealSection delay={400}>
          <Card sx={{ p: 5, borderRadius: 4, textAlign: 'center', mt: 2, bgcolor: '#f2f5ee' }}>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>Turn satellite observations into field-level intelligence.</Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>Monitor. Understand. Act.</Typography>
            <Button component={Link} to="/dashboard" variant="contained" size="large" sx={{ mt: 3, px: 4 }}>Open Crop Intelligence Dashboard →</Button>
          </Card>
        </RevealSection>
      </Stack>
    </Box>
  );
}
