import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

const StatsCard = ({
  title,
  value,
  change,
  changeType = 'increase',
  data,
  color,
  icon: Icon,
  progress,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        minHeight: '200px',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.08)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
    >
      <CardContent>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {Icon && (
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: '50%',
                width: 48,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Icon sx={{ color: color || theme.palette.primary.main }} />
            </Box>
          )}

          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>

          <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
            {value}
          </Typography>

          {typeof change !== 'undefined' && (
            <Typography
              variant="body2"
              sx={{
                color: changeType === 'increase' ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {changeType === 'increase' ? '+' : '-'}{Math.abs(change)}%
            </Typography>
          )}

          {typeof progress !== 'undefined' && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: `${color}15`,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color || theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {data && data.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '100px',
              width: '100%',
              minWidth: '200px',
              opacity: 0.2,
            }}
          >
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={color || theme.palette.primary.main}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor={color || theme.palette.primary.main}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={color || theme.palette.primary.main}
                  fill={`url(#gradient-${title})`}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard; 