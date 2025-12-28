import { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { AccountGeneralSettings } from 'src/sections/dashboard/account/account-general-settings';
import { Breadcrumbs, Link } from '@mui/material';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { RouterLink } from 'src/components/router-link';
import { paths } from 'src/paths';

const now = new Date();

const tabs = [{ label: 'General', value: 'general' }];

const Page = () => {
  const user = useMockedUser();
  const [currentTab, setCurrentTab] = useState('general');

  usePageView();

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  return (
    <>
      <Seo title="Dashboard: Cuenta" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
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
                <Typography sx={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Cuenta</Typography>
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
                    Cuenta
                  </Typography>
                </Breadcrumbs>
              </Stack>
            </Stack>
            <div>
              <Tabs
                indicatorColor="primary"
                onChange={handleTabsChange}
                scrollButtons="auto"
                textColor="primary"
                value={currentTab}
                variant="scrollable"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab.value}
                    label={tab.label}
                    value={tab.value}
                  />
                ))}
              </Tabs>
              <Divider />
            </div>
          </Stack>
          {currentTab === 'general' && (
            <AccountGeneralSettings
              avatar={user?.avatar || ''}
              email={user?.email || ''}
              name={user?.name || ''}
              lastname={user?.lastname || ''}
            />
          )}
        </Container>
      </Box>
    </>
  );
};

export default Page;
