import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import { MobileNav } from '../mobile-nav';
import { SideNav } from './side-nav';
import { useMobileNav } from './use-mobile-nav';
import { Box, IconButton, SvgIcon } from '@mui/material';
import ChevronRightIcon from '@untitled-ui/icons-react/build/esm/ChevronRight';

const SIDE_NAV_WIDTH = 280;

const VerticalLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const VerticalLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
});

export const VerticalLayout = (props) => {
  const { children, sections, navColor } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const mobileNav = useMobileNav();

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: 0,
          transform: 'translate(-50%)',
          m: 1,
          zIndex: 1200,
        }}
      >
        {!lgUp && (
          <IconButton onClick={mobileNav.handleOpen}>
            <SvgIcon fontSize="large">
              <ChevronRightIcon />
            </SvgIcon>
          </IconButton>
        )}
      </Box>
      {lgUp && (
        <SideNav
          color={navColor}
          sections={sections}
        />
      )}
      {!lgUp && (
        <MobileNav
          color={navColor}
          onClose={mobileNav.handleClose}
          open={mobileNav.open}
          sections={sections}
        />
      )}
      <VerticalLayoutRoot>
        <VerticalLayoutContainer>{children}</VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
};

VerticalLayout.propTypes = {
  children: PropTypes.node,
  navColor: PropTypes.oneOf(['blend-in', 'discrete', 'evident']),
  sections: PropTypes.array,
};
