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

export const UsersChangeRole = (props) => {
  const { handleUserSelected, user, role, handleOpen, handleUsersGet } = props;
  const [selectedOption, setSelectedOption] = useState('');
  const popover = usePopover();

  const handleChangeRole = async (newValue, toastId) => {
    try {
      const { message } = await usersApi.changeRoleUser({
        email: user.email,
        role: newValue,
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
    setSelectedOption(user.role);
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
            onClick={() => handleChangeRole(newValue, t.id)}
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
    if (user.role === 'user') {
      setSelectedOption('user');
    } else if (user.role === 'admin') {
      setSelectedOption('admin');
    } 
  }, [user]);

  return (
    <>
      <Tooltip title={user.verified && 'Cambiar rol'}>
        <span>
          <IconButton
            onClick={() => handleMenu()}
            ref={popover.anchorRef}
            disabled={!user.verified}
          >
            <SeverityPill
              style={{ cursor: 'pointer' }}
            >
              {role}
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
              value="user"
              control={<Radio />}
              label="Usuario"
            />
            <FormControlLabel
              value="admin"
              control={<Radio />}
              label="Administrador"
            />
          </RadioGroup>
        </MenuItem>
      </Menu>
    </>
  );
};

UsersChangeRole.propTypes = {
  handleOpen: PropTypes.func,
  onClose: PropTypes.func,
  handleUserSelected: PropTypes.func,
  user: PropTypes.object,
  handleUsersGet: PropTypes.func,
  role: PropTypes.string,
};
