import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

import { usePopover } from 'src/hooks/use-popover';
import { usersApi } from 'src/api/users/userService';
import { Button, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { SeverityPill } from './severity-pill';
import { useEffect, useState } from 'react';

export const UsersChangeStatus = (props) => {
  const { handleUserSelected, user, statusColor, status, handleOpen, handleUsersGet } = props;
  const [selectedOption, setSelectedOption] = useState('');
  const popover = usePopover();

  const handleChangeStatus = async (newValue, toastId) => {
    try {
      const { message } = await usersApi.changeStatusUser({
        email: user.email,
        status: newValue,
      });
      toast.dismiss(toastId);
      handleUsersGet();
      toast.success(message, { duration: 3000, position: 'top-center' });
    } catch (err) {
      console.error(err);
      toast.error(err.message, { duration: 3000, position: 'top-center' });
    }
  };

  const handleMenu = () => {
    popover.handleOpen();
    setSelectedOption(user.status);
  };

  const handleOptionChange = (event) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);

    toast(
      (t) => (
        <span>
          ¿Estás seguro?
          <Button
            sx={{ ml: 1, mr: 1 }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleChangeStatus(newValue, t.id)}
            variant="contained"
          >
            Sí
          </Button>
        </span>
      ),
      {
        duration: 5000,
      }
    );
  };

  useEffect(() => {
    if (user.status === 'pending') {
      setSelectedOption('pending');
    } else if (user.status === 'inactive') {
      setSelectedOption('inactive');
    } else if (user.status === 'active') {
      setSelectedOption('active');
    }
  }, [user]);

  return (
    <>
      <Tooltip title={user.verified && 'Cambiar estado'}>
        <span>
          <IconButton
            onClick={() => handleMenu()}
            ref={popover.anchorRef}
            disabled={!user.verified}
          >
            <SeverityPill
              color={statusColor}
              style={{ cursor: 'pointer' }}
            >
              {status}
            </SeverityPill>
          </IconButton>
        </span>
      </Tooltip>
      <Menu
        anchorEl={popover.anchorRef.current}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={popover.handleClose}
        open={popover.open}
        PaperProps={{
          sx: {
            maxWidth: '100%',
            width: 200,
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <MenuItem>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => handleOptionChange(e)}
          >
            <FormControlLabel
              value="pending"
              control={<Radio />}
              label="Pendiente"
            />
            <FormControlLabel
              value="active"
              control={<Radio />}
              label="Activo"
            />
            <FormControlLabel
              value="inactive"
              control={<Radio />}
              label="Inactivo"
            />
          </RadioGroup>
        </MenuItem>
      </Menu>
    </>
  );
};

UsersChangeStatus.propTypes = {
  handleOpen: PropTypes.func,
  onClose: PropTypes.func,
  handleUserSelected: PropTypes.func,
  user: PropTypes.object,
  handleUsersGet: PropTypes.func,
  statusColor: PropTypes.string,
  status: PropTypes.string,
};
