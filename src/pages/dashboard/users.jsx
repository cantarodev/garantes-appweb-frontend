import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { paths } from 'src/paths';
import { RouterLink } from 'src/components/router-link';

import { usersApi } from 'src/api/users/userService';
import { Seo } from 'src/components/seo';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useSelection } from 'src/hooks/use-selection';
import { UserListSearch } from 'src/sections/dashboard/users/user-list-search';
import { UserListTable } from 'src/sections/dashboard/users/user-list-table';
import { Breadcrumbs, Link } from '@mui/material';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';

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
    return users.map((user) => user.user_id);
  }, [users]);
};

const Page = () => {
  const usersSearch = useUsersSearch();
  const usersStore = useUsersStore(usersSearch.state);
  const usersIds = useUsersIds(usersStore.users);
  const usersSelection = useSelection(usersIds);
  const [open, setOpen] = useState(false);

  const handleOpen = (option) => {
    setOpen(option);
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
          pt: 2,
          pb: 8,
        }}
      >
        <Container maxWidth="xxl">
          <Stack
            spacing={3}
            sx={{ mb: 3 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack>
                <Typography sx={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Usuarios</Typography>
                <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                  <Link
                    sx={{ fontSize: '0.875rem', color: 'gray' }}
                    component={RouterLink}
                    href={paths.dashboard.analytics.seace}
                    variant="subtitle2"
                  >
                    Dashboard
                  </Link>
                  <Typography
                    color="primary.main"
                    variant="subtitle2"
                  >
                    Usuarios
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <Card>
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
