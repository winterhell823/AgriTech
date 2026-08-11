import { useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@mui/material';
import fieldSatellite from '../../assets/field-satellite.svg';

const orbitPath = 'M 660 90 C 700 56 780 56 820 90 C 860 124 860 198 820 232 C 780 266 700 266 660 232 C 620 198 620 124 660 90 Z';

const supportsReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export function HeroFieldVisual() {
  const [reduced, setReduced] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    setReduced(supportsReducedMotion());
  }, []);

  const observationPoints = useMemo(
    () => [
      { x: 161, y: 110, label: 'FIELD 1024', value: 'NDVI 0.68', delay: 0 },
      { x: 541, y: 140, label: 'FIELD 1102', value: 'NDVI 0.74', delay: 1.9 },
      { x: 311, y: 420, label: 'FIELD 1031', value: 'NDVI 0.61', delay: 3.8 },
    ],
    [],
  );

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        maxWidth: 540,
        mx: 'auto',
        position: 'relative',
        borderRadius: 5,
        overflow: 'hidden',
        boxShadow: '0 28px 60px rgba(20, 34, 24, 0.12)',
        minHeight: 460,
        bgcolor: '#1c2d1b',
      }}
    >
      <Box component="img" src={fieldSatellite} alt="Satellite field observation" sx={{ width: '100%', height: 460, objectFit: 'cover', display: 'block' }} />

      <Box
        component="svg"
        viewBox="0 0 900 600"
        preserveAspectRatio="xMidYMid slice"
        sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="satelliteTrail" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(241, 232, 171, 0.72)" />
            <stop offset="100%" stopColor="rgba(241, 232, 171, 0)" />
          </linearGradient>
          <radialGradient id="satelliteGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.75)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <path d={orbitPath} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2" />
        <path d={orbitPath} fill="none" stroke="rgba(241, 232, 171, 0.18)" strokeWidth="0.8" />

        {!reduced && (
          <path
            d={orbitPath}
            fill="none"
            stroke="url(#satelliteTrail)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.32"
          />
        )}

        <circle cx="710" cy="90" r="10" fill="rgba(241, 232, 171, 0.88)" opacity="0.28" />
        <circle cx="710" cy="90" r="5" fill="#fff" opacity="0.82" />

        <g
          style={{
            animation: reduced ? 'none' : 'orbit 16s linear infinite',
            transformOrigin: '710px 90px',
          }}
        >
          <circle cx="710" cy="90" r="8" fill="#f4e3a0" opacity="0.35" />
        </g>

        {!reduced && (
          <g>
            <path d="M 230 70 L 750 95" stroke="rgba(241,232,171,0.28)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            <circle cx="250" cy="78" r="4" fill="#f4e3a0" opacity="0.95" />
          </g>
        )}

        {observationPoints.map((point, index) => (
          <g key={index} opacity="0.9">
            <circle cx={point.x} cy={point.y} r="7" fill="#f4e3a0" opacity="0.76" />
            <circle cx={point.x} cy={point.y} r="12" fill="rgba(244,227,160,0.18)"> 
              {!reduced && (
                <animate attributeName="r" values="7;14;7" dur="4s" begin={`${point.delay}s`} repeatCount="indefinite" />
                )}
            </circle>
          </g>
        ))}

        {!reduced &&
          observationPoints.map((point, index) => (
            <g key={`beam-${index}`} opacity="0.75">
              <rect
                x={point.x - 62}
                y={point.y - 100}
                width="124"
                height="8"
                rx="4"
                fill="rgba(241, 232, 171, 0.15)"
                style={{ animation: `scanBeam 18s linear infinite`, animationDelay: `${index * 2.4}s` }}
              />
              <g
                style={{
                  opacity: 0,
                  animation: `labelPulse 18s ease ${3.2 + index * 2.4}s infinite`,
                }}
              >
                <rect x={point.x + 18} y={point.y - 60} width="130" height="62" rx="14" fill="rgba(23, 40, 23, 0.94)" />
                <text x={point.x + 28} y={point.y - 34} fill="#f4e3a0" fontSize="13" fontWeight="700" fontFamily="Inter, Arial, sans-serif">{point.label}</text>
                <text x={point.x + 28} y={point.y - 16} fill="#ffffff" fontSize="12" fontFamily="Inter, Arial, sans-serif">{point.value}</text>
              </g>
            </g>
          ))}
      </Box>

      <Box
        component="style"
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes orbit {
              0% { transform: translate(0, 0) rotate(0deg); transform-origin: 710px 90px; }
              100% { transform: translate(0, 0) rotate(360deg); transform-origin: 710px 90px; }
            }
            @keyframes scanBeam {
              0% { opacity: 0; transform: translateX(-260px); }
              10% { opacity: 0.32; }
              45% { opacity: 0.42; }
              90% { opacity: 0.32; }
              100% { opacity: 0; transform: translateX(260px); }
            }
            @keyframes labelPulse {
              0%, 18% { opacity: 0; transform: translateY(8px); }
              25%, 55% { opacity: 1; transform: translateY(0); }
              75%, 100% { opacity: 0; transform: translateY(-8px); }
            }
            @keyframes pulseSpot {
              0%, 100% { opacity: 0.45; transform: scale(1); }
              50% { opacity: 0.85; transform: scale(1.12); }
            }
          `,
        }}
      />
    </Box>
  );
}
