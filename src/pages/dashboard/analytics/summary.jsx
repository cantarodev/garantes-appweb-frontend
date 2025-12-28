import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { useSettings } from 'src/hooks/use-settings';
import { useCallback, useEffect, useState } from 'react';
import { reportApi } from 'src/api/reports/seace/reportService';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { SummaryFilter } from 'src/sections/dashboard/analytics/summary-filter';
import { Card, CardContent } from '@mui/material';

const Page = () => {
  const settings = useSettings();
  const [generalDetail, setGeneralDetail] = useState({});
  const [details, setDetails] = useState([]);

  const [selectedParams, setSelectedParams] = useState({ period: '', type: 'compras' });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const user = useMockedUser();

  const handleDetails = useCallback(
    async (period, type, page, pageSize) => {
      const user_id = user?.user_id;
      try {
        const response = await reportApi.getReportDetails({
          user_id,
          period,
          type,
          page,
          pageSize,
        });
        setDetails(response?.items);
        setGeneralDetail(response?.generalDetail);
        return response;
      } catch (err) {
        console.error(err);
      }
    },
    [user]
  );

  // useEffect(() => {
  //   const loadData = async () => {
  //     const paginatedData = await handleDetails(
  //       selectedParams.period,
  //       selectedParams.type,
  //       page + 1,
  //       rowsPerPage
  //     );
  //     setDetails(paginatedData?.items);
  //     setTotalRecords(paginatedData?.total);
  //     setGeneralDetail(paginatedData?.generalDetail);
  //   };
  //   loadData();
  // }, [selectedParams, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Seo title="Dashboard: Resumen" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Grid
            container
            spacing={{
              xs: 3,
              lg: 4,
            }}
          >
            <Grid
              size={{ xs: 12 }}
              sx={{
                borderBottomWidth: 2,
                borderBottomStyle: 'solid',
                borderBottomColor: 'primary.main',
                marginRight: '-10px',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={4}
              >
                <Stack spacing={1}>
                  <Typography variant="h4">Resumen</Typography>
                </Stack>
                <SummaryFilter
                  selectedParams={selectedParams}
                  setSelectedParams={setSelectedParams}
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 12 }}>
              <Card>
                <CardContent sx={{ textAlign: 'center', fontSize: 24 }}>
                  Mantenimiento KPIs
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Page;
