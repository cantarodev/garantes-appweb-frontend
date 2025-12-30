import Box from '@mui/material/Box';
import { Seo } from 'src/components/seo';
import Grid from '@mui/material/Grid2';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useRouter } from 'src/hooks/use-router';
import { paths } from 'src/paths';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from 'src/hooks/use-auth';
import { useSearchParams } from 'src/hooks/use-search-params';
import {
  alpha,
  Autocomplete,
  Breadcrumbs,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';

import { RouterLink } from 'src/components/router-link';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { SeaceDetails } from 'src/sections/dashboard/analytics/seace-details';
import { reportApi } from 'src/api/reports/seace/reportService';

import RestoreIcon from '@mui/icons-material/Restore';

import { es } from 'date-fns/locale';
import { startOfDay, addDays } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';
import { Close, Filter, FilterAlt, Search } from '@mui/icons-material';
import { ChevronDown } from '@untitled-ui/icons-react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const TZ = 'America/Lima';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useMockedUser();
  const auth = useAuth();
  const user_id = searchParams.get('user_id');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const facetsReqIdRef = useRef(0);

  const [opts, setOpts] = useState({ departamentos: [], objetos: [] });
  const abortRef = useRef(null);

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [topDepartamento, setTopDepartamento] = useState([]);
  const [bottomDepartamento, setBottomDepartamento] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const PAGE_SIZE = 20;

  const [selectedParams, setSelectedParams] = useState(() => {
    const todayLocal = startOfDay(new Date());
    const fromDate = fromZonedTime(todayLocal, TZ).toISOString();
    const toDate = fromZonedTime(addDays(todayLocal, 1), TZ).toISOString();
    return {
      startDay: todayLocal,
      endDay: todayLocal,
      fromDate,
      toDate,
      departamento: '',
      objContratacion: '',
      q: '',
    };
  });

  const handleClear = () => {
    setSelectedParams((p) => ({ ...p, q: '' }));
  };

  const fetchFacetsOnce = async ({ fromDate, toDate, departamento }) => {
    const reqId = ++facetsReqIdRef.current;
    const controller = new AbortController();

    try {
      const { data } = await reportApi.reportConvocatoriasFacets({
        userId: user?.user_id,
        fromDate,
        toDate,
        departamento: departamento || undefined,
        signal: controller.signal,
      });

      // Ignora respuestas viejas
      if (reqId !== facetsReqIdRef.current) return;

      setOpts((o) => ({
        ...o,
        departamentos: data.departamentos ?? [],
        objetos: data.objetos ?? [],
      }));

      // Validación de selecciones
      setSelectedParams((p) => {
        const depOk =
          !p.departamento || (data.departamentos ?? []).some((d) => d.value === p.departamento);
        const objOk =
          !p.objContratacion || (data.objetos ?? []).some((o) => o.value === p.objContratacion);

        return {
          ...p,
          departamento: depOk ? p.departamento : '',
          objContratacion: depOk && objOk ? p.objContratacion : '',
          nomenclatura: '',
        };
      });
    } catch (e) {}
  };

  useEffect(() => {
    if (!selectedParams.fromDate || !selectedParams.toDate) return;
    const ctrl = new AbortController();
    (async () => {
      const { success, top, bottom, totalConvocatorias } = await reportApi.reportDepartments({
        userId: user?.user_id,
        fromDate: selectedParams.fromDate,
        toDate: selectedParams.toDate,
        signal: ctrl.signal,
      });

      if (!success) return;

      setTotal(totalConvocatorias ?? 0);
      setTopDepartamento(top);
      setBottomDepartamento(bottom);
    })();

    return () => ctrl.abort();
  }, [selectedParams.fromDate, selectedParams.toDate]);

  // facets
  useEffect(() => {
    if (!selectedParams.fromDate || !selectedParams.toDate) return;
    fetchFacetsOnce({
      fromDate: selectedParams.fromDate,
      toDate: selectedParams.toDate,
      departamento: selectedParams.departamento,
    });
  }, [selectedParams.fromDate, selectedParams.toDate, selectedParams.departamento]);

  useEffect(() => {
    setPage(1);
  }, [
    selectedParams.fromDate,
    selectedParams.toDate,
    selectedParams.departamento,
    selectedParams.objContratacion,
    selectedParams.q,
  ]);

  useEffect(() => {
    let timer;
    let controller;

    const run = async () => {
      controller = new AbortController();
      setLoading(true);

      try {
        const { fromDate, toDate, departamento, objContratacion, q } = selectedParams;

        const { data, total } = await reportApi.reportConvocatorias({
          userId: user?.user_id,
          fromDate,
          toDate,
          departamento: departamento || undefined,
          objContratacion: objContratacion || undefined,
          q: q || undefined,
          page,
          limit: PAGE_SIZE,
          signal: controller.signal,
        });

        setRows((data || []).map((r, i) => ({ id: `${r.parent_id}_${i}`, ...r })));
        setRowCount(total ?? 0);
      } catch (_) {
        // ignorar aborts
      } finally {
        setLoading(false);
      }
    };

    // Debounce si cambia q; inmediato para otros casos
    const delay = selectedParams.q ? 300 : 0;
    timer = setTimeout(run, delay);

    return () => {
      clearTimeout(timer);
      controller?.abort();
    };
  }, [
    page,
    selectedParams.fromDate,
    selectedParams.toDate,
    selectedParams.departamento,
    selectedParams.objContratacion,
    selectedParams.q,
  ]);

  const filterOptions = createFilterOptions({
    stringify: (option) => normalize(option?.value || ''),
    trim: true,
    ignoreCase: true,
    limit: 300,
  });

  const resetFilters = async () => {
    if (resetting) return;
    setResetting(true);

    abortRef.current?.abort();

    const todayLocal = startOfDay(new Date());
    const fromDate = fromZonedTime(todayLocal, TZ).toISOString();
    const toDate = fromZonedTime(addDays(todayLocal, 1), TZ).toISOString();

    setSelectedParams((p) => ({
      ...p,
      startDay: todayLocal,
      endDay: todayLocal,
      fromDate,
      toDate,
      departamento: '',
      objContratacion: '',
      q: '',
    }));
    setPage(1);

    await fetchFacetsOnce({ fromDate, toDate, departamento: '' });

    setResetting(false);
  };

  useEffect(() => {
    const handleLogout = async () => {
      if (user_id && user?.user_id != user_id) {
        await auth.signOut();
        router.push(paths.index);
      }
    };
    handleLogout();
  }, [user?.user_id, router]);

  return (
    <>
      <Seo title="Reporte: SEACE" />
      {!(user_id && user?.user_id != user_id) ? (
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
                  <Typography sx={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Seace</Typography>
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
                      Seace
                    </Typography>
                  </Breadcrumbs>
                </Stack>
                <Stack>
                  <Box sx={{ display: 'flex', gap: 4 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ fontSize: '24px', fontWeight: 'bold' }}>{total || 0}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'gray' }}>Convocatorias totales</Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: 'primary.main' }}>
                        {rowCount || 0}
                      </Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'gray' }}>Vigentes filtradas</Box>
                    </Box>
                    <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                      <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: 'orange' }}>
                        {total - rowCount || 0}
                      </Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'gray' }}>Omitidas</Box>
                    </Box>
                  </Box>
                </Stack>
              </Stack>
            </Stack>
            <Box>
              <Box
                mb={3}
                mt={1}
              >
                {/* Búsqueda principal */}
                <Box>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                  >
                    <Grid
                      item
                      size={{
                        xs: 12,
                        sm: 12,
                        md: 8,
                        lg: 9,
                      }}
                    >
                      {/* Input de búsqueda */}
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          placeholder="Buscar (nomenclatura, entidad o descripción...)"
                          value={selectedParams.q}
                          onChange={(e) => setSelectedParams((p) => ({ ...p, q: e.target.value }))}
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Search
                                  size={20}
                                  className="text-gray-500"
                                />
                              </InputAdornment>
                            ),
                            endAdornment: selectedParams.q && (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleClear}
                                  edge="end"
                                  size="small"
                                  sx={{
                                    color: '#6b7280',
                                    '&:hover': {
                                      color: '#9ca3af',
                                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    },
                                  }}
                                >
                                  <Close />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                              paddingY: 0.5,
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid
                      item
                      size={{
                        xs: 9,
                        sm: 10,
                        md: 3,
                        lg: 2,
                      }}
                    >
                      {/* Botón Filtros */}
                      <Button
                        fullWidth
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outlined"
                        startIcon={<FilterAlt size={20} />}
                        endIcon={
                          <ChevronDown
                            size={18}
                            style={{
                              transition: 'transform 150ms ease',
                              transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        }
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 3,
                          py: 1.5,
                          borderRadius: 2,
                          textTransform: 'none',
                        }}
                      >
                        Filtros
                      </Button>
                    </Grid>
                    <Grid
                      item
                      size={{
                        xs: 3,
                        sm: 2,
                        md: 1,
                        lg: 1,
                      }}
                    >
                      <Tooltip title="Restablecer filtros">
                        <span>
                          {/* span para que Tooltip funcione aunque esté disabled */}
                          <IconButton
                            onClick={resetFilters}
                            size="large"
                            disabled={resetting || loading}
                          >
                            <RestoreIcon fontSize="large" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </Box>

                {/* Panel de filtros expandible */}
                {showFilters && (
                  <>
                    <Box sx={{ width: '100%', mt: 3 }}>
                      <LocalizationProvider
                        dateAdapter={AdapterDateFns}
                        adapterLocale={es}
                      >
                        <Grid
                          container
                          spacing={2}
                          alignItems="center"
                        >
                          {/* Rango de fechas */}
                          <Grid
                            item
                            size={{
                              xs: 12,
                              md: 6,
                            }}
                          >
                            <Stack
                              direction={{ xs: 'column', sm: 'row' }}
                              spacing={2}
                            >
                              <DatePicker
                                label="Desde (día)"
                                views={['year', 'month', 'day']}
                                value={selectedParams.startDay}
                                onChange={(date) => {
                                  if (!date) return;
                                  const startLocal = startOfDay(date);

                                  const endLocal =
                                    selectedParams.endDay && selectedParams.endDay < startLocal
                                      ? startLocal
                                      : selectedParams.endDay;

                                  const fromDate = fromZonedTime(startLocal, TZ).toISOString();
                                  const toDate = fromZonedTime(
                                    addDays(startOfDay(endLocal || startLocal), 1),
                                    TZ
                                  ).toISOString();

                                  setSelectedParams((p) => ({
                                    ...p,
                                    startDay: startLocal,
                                    endDay: endLocal || startLocal,
                                    fromDate,
                                    toDate,
                                  }));
                                }}
                                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                                format="dd/MM/yyyy"
                              />

                              <DatePicker
                                label="Hasta (día)"
                                views={['year', 'month', 'day']}
                                value={selectedParams.endDay}
                                minDate={selectedParams.startDay}
                                onChange={(date) => {
                                  if (!date) return;
                                  const endLocal = startOfDay(date);
                                  const toDate = fromZonedTime(
                                    addDays(endLocal, 1),
                                    TZ
                                  ).toISOString();
                                  setSelectedParams((p) => ({
                                    ...p,
                                    endDay: endLocal,
                                    toDate,
                                  }));
                                }}
                                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                                format="dd/MM/yyyy"
                              />
                            </Stack>
                          </Grid>

                          {/* Departamento */}
                          <Grid
                            item
                            size={{
                              xs: 12,
                              md: 3,
                              sm: 6,
                            }}
                          >
                            <Autocomplete
                              options={[{ value: '', count: 0 }, ...opts.departamentos]}
                              filterOptions={filterOptions}
                              getOptionLabel={(o) =>
                                o?.value ? `${o.value} (${o.count ?? 0})` : ''
                              }
                              isOptionEqualToValue={(o, v) => o?.value === v?.value}
                              value={
                                selectedParams.departamento
                                  ? {
                                      value: selectedParams.departamento,
                                      count:
                                        opts.departamentos.find(
                                          (d) => d.value === selectedParams.departamento
                                        )?.count ?? 0,
                                    }
                                  : { value: '', count: 0 }
                              }
                              onChange={(_, val) => {
                                setSelectedParams((p) => ({
                                  ...p,
                                  departamento: val?.value || '',
                                  objContratacion: '',
                                }));
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Departamento"
                                  placeholder="Escribe para filtrar…"
                                  fullWidth
                                />
                              )}
                              renderOption={(props, option) => (
                                <Box
                                  component="li"
                                  {...props}
                                  key={option.value || 'none'}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                  }}
                                >
                                  <span>{option.value || 'Ninguno'}</span>
                                  {option.value && <span>({option.count ?? 0})</span>}
                                </Box>
                              )}
                            />
                          </Grid>

                          {/* Objeto de contratación */}
                          <Grid
                            item
                            size={{
                              xs: 12,
                              sm: 6,
                              md: 3,
                            }}
                          >
                            <Autocomplete
                              options={[{ value: '', count: 0 }, ...opts.objetos]}
                              filterOptions={filterOptions}
                              getOptionLabel={(o) =>
                                o?.value ? `${o.value} (${o.count ?? 0})` : ''
                              }
                              isOptionEqualToValue={(o, v) => o?.value === v?.value}
                              value={
                                selectedParams.objContratacion
                                  ? {
                                      value: selectedParams.objContratacion,
                                      count:
                                        opts.objetos.find(
                                          (d) => d.value === selectedParams.objContratacion
                                        )?.count ?? 0,
                                    }
                                  : { value: '', count: 0 }
                              }
                              onChange={(_, val) => {
                                setSelectedParams((p) => ({
                                  ...p,
                                  objContratacion: val?.value || '',
                                }));
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label="Obj. de Contratación"
                                  placeholder="Escribe para filtrar…"
                                  fullWidth
                                />
                              )}
                              renderOption={(props, option) => (
                                <Box
                                  component="li"
                                  {...props}
                                  key={option.value || 'none'}
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                  }}
                                >
                                  <span>{option.value || 'Ninguno'}</span>
                                  {option.value && <span>({option.count ?? 0})</span>}
                                </Box>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </LocalizationProvider>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mt: 2,
                        pt: 2,
                        borderTop: 1,
                        borderColor: 'grey.800',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Filtros activos:
                      </Typography>

                      {topDepartamento[0]?.departamento && (
                        <Chip
                          label={
                            <>
                              <span>{topDepartamento[0]?.departamento}</span>{' '}
                              <span style={{ fontSize: '14px' }}>
                                ({topDepartamento[0]?.count})
                              </span>
                            </>
                          }
                          size="small"
                          sx={(theme) => ({
                            borderRadius: '9999px',
                            bgcolor: alpha(theme.palette.info.dark, 0.3),
                            color: theme.palette.success.main,
                            fontWeight: 600,
                          })}
                        />
                      )}

                      {bottomDepartamento[0]?.departamento && (
                        <Chip
                          label={
                            <>
                              <span>{bottomDepartamento[0]?.departamento}</span>{' '}
                              <span style={{ fontSize: '14px' }}>
                                ({bottomDepartamento[0]?.count})
                              </span>
                            </>
                          }
                          size="small"
                          sx={(theme) => ({
                            borderRadius: '9999px',
                            bgcolor: alpha(theme.palette.success.dark, 0.3),
                            color: theme.palette.error.main,
                            fontWeight: 600,
                          })}
                        />
                      )}
                    </Box>
                  </>
                )}
              </Box>
              <SeaceDetails
                selectedParams={selectedParams}
                rows={rows}
                rowCount={rowCount}
                page={page}
                PAGE_SIZE={PAGE_SIZE}
                setPage={setPage}
                loading={loading}
              />
            </Box>
          </Container>
        </Box>
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default Page;
