import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { toast } from 'react-hot-toast';
import { Scrollbar } from 'src/components/scrollbar';
import { paths } from 'src/paths';
import { getInitials } from 'src/utils/get-initials';
import { SeverityPill } from 'src/components/severity-pill';
import { UsersChangeStatus } from 'src/components/users-change-status';
import { UsersMoreMenu } from 'src/components/users-more-menu';
import { useCallback, useState } from 'react';
import { usersApi } from 'src/api/users/userService';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { UsersChangeRole } from 'src/components/users-change-role';

export const UserListTable = (props) => {
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    handleOpen,
    handleUsersGet,
    onClose,
  } = props;
  const [currentUser, setCurrentUser] = useState(null);

  const loggedInUser = useMockedUser();

  const selectedSome = selected.length > 0 && selected.length < items.length;
  const selectedAll = items.length > 0 && selected.length === items.length;
  const enableBulkActions = selected.length > 0;

  const handleUserSelected = useCallback((bot) => {
    setCurrentUser((prevBot) => {
      return bot;
    });
  }, []);

  const deleteAllUsers = async (toastId) => {
    try {
      const { message } = await usersApi.deletAllUsers({ userIds: selected });
      toast.dismiss(toastId);
      handleUsersGet();
      toast.success(message, { duration: 3000, position: 'top-center' });
    } catch (err) {
      console.error(err);
      toast.error(err.message, { duration: 3000, position: 'top-center' });
    }
  };

  const confirmDeleteAll = () => {
    toast(
      (t) => (
        <span>
          ¿Eliminar todos los usuarios?
          <Button
            sx={{ ml: 1, mr: 1 }}
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => deleteAllUsers(t.id)}
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

  return (
    <Box sx={{ position: 'relative' }}>
      {enableBulkActions && (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: 'center',
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? 'neutral.800' : 'neutral.50',
            display: enableBulkActions ? 'flex' : 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            px: 2,
            py: 0.5,
            zIndex: 10,
          }}
        >
          <Checkbox
            checked={selectedAll}
            indeterminate={selectedSome}
            onChange={(event) => {
              if (event.target.checked) {
                onSelectAll?.();
              } else {
                onDeselectAll?.();
              }
            }}
          />
          <Button
            color="inherit"
            size="small"
            onClick={confirmDeleteAll}
          >
            Eliminar
          </Button>
        </Stack>
      )}
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelectAll?.();
                    } else {
                      onDeselectAll?.();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Doc. Identidad</TableCell>
              <TableCell>Tel/Celular</TableCell>
              <TableCell>Verificado</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.filter((user) => loggedInUser?.email != user?.email).map((user) => {
              const isSelected = selected.includes(user._id);
              const verifiedColor = user.verified ? 'success' : 'error';
              const statusColor =
                user.status === 'active'
                  ? 'success'
                  : user.status == 'inactive'
                  ? 'error'
                  : 'warning';
              const status =
                user.status === 'active'
                  ? 'Activo'
                  : user.status == 'inactive'
                  ? 'Inactivo'
                  : 'Pendiente';
              const verified = user.verified ? 'SI' : 'NO';
              const role = user.role === "admin" ? 'Administrador' : 'Usuario';
              let photoURL = '';
              if (user?.avatar) {
                photoURL = `/path/to/user/photos/${user.avatar}`;
              }

              return (
                <TableRow
                  hover
                  key={user._id}
                  selected={isSelected}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      disabled={user.status === 'inactive'}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onSelectOne?.(user._id);
                        } else {
                          onDeselectOne?.(user._id);
                        }
                      }}
                      value={isSelected}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack
                      alignItems="center"
                      direction="row"
                      spacing={1}
                    >
                      <Avatar
                        src={photoURL}
                        sx={{
                          height: 42,
                          width: 42,
                        }}
                      >
                        {getInitials(user.name + ' ' + user.lastname)}
                      </Avatar>
                      <div>
                        <Link
                          color="inherit"
                          href={paths.dashboard.users.details}
                          variant="subtitle2"
                        >
                          {user.name + ' ' + user.lastname}
                        </Link>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          {user.email}
                        </Typography>
                      </div>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{user.dni}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{user.phone}</Typography>
                  </TableCell>
                  <TableCell>
                    <SeverityPill color={verifiedColor}>{verified}</SeverityPill>
                  </TableCell>
                  <TableCell>
                    <UsersChangeStatus
                      handleUserSelected={handleUserSelected}
                      handleOpen={handleOpen}
                      onClose={onClose}
                      user={user}
                      handleUsersGet={handleUsersGet}
                      statusColor={statusColor}
                      status={status}
                    />
                  </TableCell>
                  <TableCell>
                    <UsersChangeRole
                      handleUserSelected={handleUserSelected}
                      handleOpen={handleOpen}
                      onClose={onClose}
                      user={user}
                      handleUsersGet={handleUsersGet}
                      role={role}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <UsersMoreMenu
                      handleUserSelected={handleUserSelected}
                      handleOpen={handleOpen}
                      user={user}
                      handleUsersGet={handleUsersGet}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Box>
  );
};

UserListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  handleOpen: PropTypes.func,
  handleUsersGet: PropTypes.func,
  onClose: PropTypes.func,
};
