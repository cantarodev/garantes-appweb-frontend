import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { paths } from 'src/paths';

const issuers = {
  Sire: '/assets/logos/logo-sire.png',
  Dua: '/assets/logos/logo-sire.png',
};

export const AuthIssuer = (props) => {
  const { issuer: currentIssuer } = props;

  return (
    <Box
      sx={{
        borderColor: 'divider',
        borderRadius: 2.5,
        borderStyle: 'solid',
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
      }}
    >
      <Typography variant="body2">Gestiona tus impuestos de una manera más oportuna</Typography>
      <Stack
        alignItems="center"
        direction="row"
        gap={3}
        sx={{ mt: 2 }}
      >
        {Object.keys(issuers).map((issuer) => {
          const isCurrent = issuer === currentIssuer;
          const icon = issuers[issuer];

          return (
            <Tooltip
              key={issuer}
              title={issuer}
            >
              <Box
                component="img"
                src={icon}
                sx={{
                  height: 30,
                  '&:not(:hover)': {
                    ...(!isCurrent && {
                      filter: 'grayscale(100%)',
                    }),
                  },
                }}
              />
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
};
//PLEs

AuthIssuer.propTypes = {
  issuer: PropTypes.string.isRequired,
};
