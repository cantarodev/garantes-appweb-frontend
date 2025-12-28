import PropTypes from 'prop-types';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';

import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';
import { Divider } from '@mui/material';
import { LogOut03 } from '@untitled-ui/icons-react';
import { useRouter } from 'src/hooks/use-router';
import { useAuth } from 'src/hooks/use-auth';
import { Issuer } from 'src/utils/auth';
import { useCallback } from 'react';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      switch (auth.issuer) {
        case Issuer.JWT: {
          await auth.signOut();
          break;
        }

        default: {
          console.warn('Using an unknown Auth Issuer, did not log out');
        }
      }

      router.push(paths.index);
    } catch (err) {
      console.error(err);
      toast.error(
        'No pudimos cerrar la sesión. Intenta nuevamente o contacta con el soporte si el problema persiste.',
        { duration: 5000, position: 'top-center' }
      );
    }
  }, [auth, router]);
  
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      {...other}
      sx={{
        borderRadius: 5,
      }}
    >
      <Box
        sx={{
          p: 1,
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: '8px',
        }}
      >
        <ListItemButton
          component={RouterLink}
          href={paths.dashboard.account}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <Settings04Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Configuraciones</Typography>} />
        </ListItemButton>
        <Divider />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize="small">
              <LogOut03 />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant="body1">Cerrar sesión</Typography>} />
        </ListItemButton>
      </Box>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
