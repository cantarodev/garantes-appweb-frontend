import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { usePopover } from 'src/hooks/use-popover';

export const TenantSwitch = (props) => {
  return (
    <>
      <Stack
        alignItems="center"
        direction="row"
        spacing={2}
        {...props}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            sx={{
              color: 'text.primary',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: '0.3px',
              lineHeight: 1,
              '& span': {
                color: 'primary.main',
              },
            }}
          >
            <span>GaranTech</span>
          </Typography>
        </Box>
      </Stack>
    </>
  );
};

TenantSwitch.propTypes = {
  sx: PropTypes.object,
};
