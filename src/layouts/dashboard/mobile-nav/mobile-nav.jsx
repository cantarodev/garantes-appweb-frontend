import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import LogOut03 from '@untitled-ui/icons-react/build/esm/LogOut03';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { Logo } from 'src/components/logo';
import { RouterLink } from 'src/components/router-link';
import { Scrollbar } from 'src/components/scrollbar';
import { usePathname } from 'src/hooks/use-pathname';
import { paths } from 'src/paths';
import { TenantSwitch } from '../tenant-switch';
import { MobileNavSection } from './mobile-nav-section';
import { AccountButton } from '../account-button';
import { Divider, Grid, Tooltip } from '@mui/material';
import { useRouter } from 'src/hooks/use-router';
import { useAuth } from 'src/hooks/use-auth';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { Issuer } from 'src/utils/auth';
import toast from 'react-hot-toast';

const MOBILE_NAV_WIDTH = 280;

const useCssVars = (color) => {
  const theme = useTheme();

  return useMemo(() => {
    switch (color) {
      // Blend-in and discrete have no difference on mobile because
      // there's a backdrop and differences are not visible
      case 'blend-in':
      case 'discrete':
        if (theme.palette.mode === 'dark') {
          return {
            '--nav-bg': theme.palette.background.default,
            '--nav-color': theme.palette.neutral[100],
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[400],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': theme.palette.text.primary,
            '--nav-item-disabled-color': theme.palette.neutral[600],
            '--nav-item-icon-color': theme.palette.neutral[500],
            '--nav-item-icon-active-color': theme.palette.primary.main,
            '--nav-item-icon-disabled-color': theme.palette.neutral[700],
            '--nav-item-chevron-color': theme.palette.neutral[700],
            '--nav-scrollbar-color': theme.palette.neutral[400],
          };
        } else {
          return {
            '--nav-bg': theme.palette.background.default,
            '--nav-color': theme.palette.text.primary,
            '--nav-logo-border': theme.palette.neutral[100],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.text.secondary,
            '--nav-item-hover-bg': theme.palette.action.hover,
            '--nav-item-active-bg': theme.palette.action.selected,
            '--nav-item-active-color': theme.palette.text.primary,
            '--nav-item-disabled-color': theme.palette.neutral[400],
            '--nav-item-icon-color': theme.palette.neutral[400],
            '--nav-item-icon-active-color': theme.palette.primary.main,
            '--nav-item-icon-disabled-color': theme.palette.neutral[400],
            '--nav-item-chevron-color': theme.palette.neutral[400],
            '--nav-scrollbar-color': theme.palette.neutral[900],
          };
        }

      case 'evident':
        if (theme.palette.mode === 'dark') {
          return {
            '--nav-bg': theme.palette.neutral[800],
            '--nav-color': theme.palette.common.white,
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[400],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': theme.palette.common.white,
            '--nav-item-disabled-color': theme.palette.neutral[500],
            '--nav-item-icon-color': theme.palette.neutral[400],
            '--nav-item-icon-active-color': theme.palette.primary.main,
            '--nav-item-icon-disabled-color': theme.palette.neutral[500],
            '--nav-item-chevron-color': theme.palette.neutral[600],
            '--nav-scrollbar-color': theme.palette.neutral[400],
          };
        } else {
          return {
            '--nav-bg': theme.palette.neutral[800],
            '--nav-color': theme.palette.common.white,
            '--nav-logo-border': theme.palette.neutral[700],
            '--nav-section-title-color': theme.palette.neutral[400],
            '--nav-item-color': theme.palette.neutral[400],
            '--nav-item-hover-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-bg': 'rgba(255, 255, 255, 0.04)',
            '--nav-item-active-color': theme.palette.common.white,
            '--nav-item-disabled-color': theme.palette.neutral[500],
            '--nav-item-icon-color': theme.palette.neutral[400],
            '--nav-item-icon-active-color': theme.palette.primary.main,
            '--nav-item-icon-disabled-color': theme.palette.neutral[500],
            '--nav-item-chevron-color': theme.palette.neutral[600],
            '--nav-scrollbar-color': theme.palette.neutral[400],
          };
        }

      default:
        return {};
    }
  }, [theme, color]);
};

export const MobileNav = (props) => {
  const { color = 'evident', open, onClose, sections = [] } = props;
  const pathname = usePathname();
  const cssVars = useCssVars(color);
  const router = useRouter();
  const auth = useAuth();
  const user = useMockedUser();

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
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          ...cssVars,
          backgroundColor: 'var(--nav-bg)',
          color: 'var(--nav-color)',
          width: MOBILE_NAV_WIDTH,
        },
      }}
      variant="temporary"
    >
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%',
          },
          '& .simplebar-scrollbar:before': {
            background: 'var(--nav-scrollbar-color)',
          },
        }}
      >
        <Stack sx={{ height: '100%' }}>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ p: 3 }}
          >
            <Box
              component={RouterLink}
              href={paths.index}
              sx={{
                borderColor: 'var(--nav-logo-border)',
                borderRadius: 1,
                borderStyle: 'solid',
                borderWidth: 1,
                display: 'flex',
                height: 40,
                p: '4px',
                width: 40,
              }}
            >
              <Logo />
            </Box>
            <TenantSwitch sx={{ flexGrow: 1 }} />
          </Stack>
          <Stack
            component="nav"
            spacing={2}
            sx={{
              flexGrow: 1,
              px: 2,
            }}
          >
            {sections.map((section, index) => (
              <MobileNavSection
                items={section.items}
                key={index}
                pathname={pathname}
                subheader={section.subheader}
              />
            ))}
          </Stack>
          <Box sx={{ p: 2 }}>
            <Divider />
            <Box
              component="div"
              sx={{
                p: 2,
                mx: 0,
                my: 2,
                borderRadius: 1,
                boxShadow: 1,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'background.paper',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                  backgroundColor: 'background.default',
                },
              }}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
              >
                <Grid
                  item
                  xs={10}
                >
                  <Tooltip title={user?.name + ' ' + user?.lastname}>
                    <Typography
                      sx={{ cursor: 'pointer' }}
                      variant="body1"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '160px',
                      }}
                    >
                      {user?.name + ' ' + user?.lastname}
                    </Typography>
                  </Tooltip>
                  <Tooltip title={user?.email}>
                    <Typography
                      sx={{ cursor: 'pointer' }}
                      variant="body2"
                      color="text.secondary"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '160px',
                      }}
                    >
                      {user?.email}
                    </Typography>
                  </Tooltip>
                </Grid>
                <Grid
                  item
                  xs={2}
                  container
                  justifyContent="flex-end"
                >
                  <AccountButton />
                </Grid>
              </Grid>
            </Box>
            <Button
              fullWidth
              startIcon={
                <SvgIcon fontSize="small">
                  <LogOut03 />
                </SvgIcon>
              }
              onClick={handleLogout}
              target="_blank"
              variant="outlined"
            >
              Cerrar sesión
            </Button>
          </Box>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
};

MobileNav.propTypes = {
  color: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  sections: PropTypes.array,
};
