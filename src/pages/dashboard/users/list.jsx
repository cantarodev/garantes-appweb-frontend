import { useCallback, useEffect, useMemo, useState } from 'react';
import Download01Icon from '@untitled-ui/icons-react/build/esm/Download01';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { usersApi } from 'src/api/users/userService';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useSelection } from 'src/hooks/use-selection';
import { UserListSearch } from 'src/sections/dashboard/users/user-list-search';
import { UserListTable } from 'src/sections/dashboard/users/user-list-table';

const useUsersSearch = () => {
  const [state, setState] = useState({
    filters: {
      query: undefined,
      hasAcceptedMarketing: undefined,
      isProspect: undefined,
      isReturning: undefined,
    },
    page: 0,
    rowsPerPage: 5,
    sortBy: 'updatedAt',
    sortDir: 'desc',
  });

  const handleFiltersChange = useCallback((filters) => {
    setState((prevState) => ({
      ...prevState,
      filters,
    }));
  }, []);

  const handleSortChange = useCallback((sort) => {
    setState((prevState) => ({
      ...prevState,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
    }));
  }, []);

  const handlePageChange = useCallback((event, page) => {
    setState((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setState((prevState) => ({
      ...prevState,
      rowsPerPage: parseInt(event.target.value, 10),
    }));
  }, []);

  return {
    handleFiltersChange,
    handleSortChange,
    handlePageChange,
    handleRowsPerPageChange,
    state,
  };
};

const useUsersStore = (searchState) => {
  const isMounted = useMounted();
  const [state, setState] = useState({
    users: [],
    usersCount: 0,
  });

  const handleUsersGet = useCallback(async () => {
    try {
      const response = await usersApi.getUsers(searchState);

      if (isMounted()) {
        setState({
          users: response.data,
          usersCount: response.count,
        });
      }
    } catch (err) {
      console.error(err);
    }
  }, [searchState, isMounted]);

  useEffect(
    () => {
      handleUsersGet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchState]
  );

  return {
    ...state,
    handleUsersGet,
  };
};

const useUsersIds = (users = []) => {
  return useMemo(() => {
    return users.filter((user) => !user.isAdmin).map((user) => user.id);
  }, [users]);
};

const Page = () => {
  const usersSearch = useUsersSearch();
  const usersStore = useUsersStore(usersSearch.state);
  const usersIds = useUsersIds(usersStore.users);
  const usersSelection = useSelection(usersIds);
  const [open, setOpen] = useState(false);

  const handleOpen = (option) => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  usePageView();

  return (
    <>
      <Seo title="Dashboard: Usuarios" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Usuarios</Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={
                      <SvgIcon>
                        <Download01Icon />
                      </SvgIcon>
                    }
                  >
                    Exportar
                  </Button>
                </Stack>
              </Stack>
              {/* <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <Button
                  startIcon={
                    <SvgIcon>
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                >
                  Agregar
                </Button>
              </Stack> */}
            </Stack>
            <Card>
              klkl
              <UserListSearch
                onFiltersChange={usersSearch.handleFiltersChange}
                onSortChange={usersSearch.handleSortChange}
                sortBy={usersSearch.state.sortBy}
                sortDir={usersSearch.state.sortDir}
              />
              <UserListTable
                count={usersStore.usersCount}
                items={usersStore.users.filter((user) => !user.isAdmin)}
                onDeselectAll={usersSelection.handleDeselectAll}
                onDeselectOne={usersSelection.handleDeselectOne}
                onPageChange={usersSearch.handlePageChange}
                onRowsPerPageChange={usersSearch.handleRowsPerPageChange}
                onSelectAll={usersSelection.handleSelectAll}
                onSelectOne={usersSelection.handleSelectOne}
                page={usersSearch.state.page}
                rowsPerPage={usersSearch.state.rowsPerPage}
                selected={usersSelection.selected}
                handleUsersGet={usersStore.handleUsersGet}
                open={open}
                handleOpen={handleOpen}
                onClose={handleClose}
              />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
