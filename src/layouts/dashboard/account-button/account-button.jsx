import User01Icon from '@untitled-ui/icons-react/build/esm/User01';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import SvgIcon from '@mui/material/SvgIcon';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { usePopover } from 'src/hooks/use-popover';

import { AccountPopover } from './account-popover';
import { useEffect, useState } from 'react';

export const AccountButton = () => {
  const [photo, setPhoto] = useState('');
  const popover = usePopover();

  return (
    <>
      <Box
        component={ButtonBase}
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        sx={{
          alignItems: 'center',
          display: 'flex',
          borderStyle: 'solid',
          borderRadius: '50%',
        }}
      >
        <Avatar
          sx={{
            height: 34,
            width: 34,
          }}
          src={photo}
        >
          <SvgIcon>
            <User01Icon />
          </SvgIcon>
        </Avatar>
      </Box>
      <AccountPopover
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      />
    </>
  );
};
