import { useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { CheckRounded, ErrorOutlineRounded } from '@mui/icons-material';

export function DownloadButton({ onDownload, sx, ...props }) {
  const [state, setState] = useState('idle');

  const handleClick = async () => {
    if (state === 'loading') return;
    setState('loading');
    try {
      await onDownload?.();
      setState('success');
      setTimeout(() => setState('idle'), 1200);
    } catch (e) {
      console.error(e);
      setState('error');
      setTimeout(() => setState('idle'), 1600);
    }
  };

  const label =
    state === 'loading' ? 'Preparando…' :
    state === 'success' ? 'Descargado' :
    state === 'error'   ? 'Reintentar' :
    'Descargar';

  const startIcon =
    state === 'loading' ? <CircularProgress size={18} thickness={4} /> :
    state === 'success' ? <CheckRounded /> :
    state === 'error'   && <ErrorOutlineRounded />;

  return (
    <Box 
      sx={{
        position: 'sticky',
        bottom: '-20px',
        margin:0,
        padding:1,
        bgcolor:"background.paper"
      }}>
    <Button
      variant="contained"
      color="primary"
      onClick={handleClick}
      startIcon={startIcon}
      disableElevation
      sx={{
        width: '100%',
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: 0.2,
        px: 2.2,
        height: 40,
        transition: 'opacity .15s ease',
        ...(state === 'loading' && { opacity: 0.85 }),
        ...sx,
      }}
      {...props}
    >
      {label}
    </Button>
    </Box>
  );
}