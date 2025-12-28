import React from 'react';
import { Backdrop, Box, Button, ButtonBase, Fade, Modal, SvgIcon } from '@mui/material';

const SessionManager = ({ showModal, signOut, counter, extendSession }) => {
  const settings = window.localStorage.getItem('app.settings');
  const { paletteMode } = settings ? JSON.parse(settings) : { paletteMode: 'light' };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: paletteMode === 'dark' ? '#1e1e1e' : '#f5f5f5',
    color: paletteMode === 'dark' ? '#e0e0e0' : '#333333',
    border: `1px solid ${paletteMode === 'dark' ? '#2a2a2a' : '#dcdcdc'}`,
    boxShadow:
      paletteMode === 'dark'
        ? '0px 4px 20px rgba(0, 0, 0, 0.7)'
        : '0px 4px 20px rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    p: 4,
  };

  return (
    <Modal
      open={showModal}
      onClose={signOut}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 500 } }}
    >
      <Fade in={showModal}>
        <Box
          sx={style}
          maxWidth="sm"
        >
          <h2 style={{ fontSize: '18px', margin: '0 0 10px' }}>Tu sesión está por expirar</h2>
          <p style={{ fontSize: '14px', marginBottom: '20px' }}>
            Tu sesión expira en {counter} segundos.
          </p>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'primary.' }}
            onClick={extendSession}
            fullWidth
          >
            Permanecer en la sesión
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SessionManager;
