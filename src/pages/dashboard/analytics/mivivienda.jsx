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

import { reportApi } from 'src/api/reports/fmv/reportService';
import { RouterLink } from 'src/components/router-link';
import { BreadcrumbsSeparator } from 'src/components/breadcrumbs-separator';
import { Close, FilterAlt, Search } from '@mui/icons-material';
import { ChevronDown } from '@untitled-ui/icons-react';
import RestoreIcon from '@mui/icons-material/Restore';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { FondoMiViviendaDetails } from 'src/sections/dashboard/analytics/fmv-details';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();
  const user_id = searchParams.get('user_id');

  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const facetsReqIdRef = useRef(0);

  const user = useMockedUser();
  const [opts, setOpts] = useState({ estados: [], departamentos: [], personerias: [] });
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
    return {
      estado: '',
      departamento: '',
      personeria: '',
      ruc: '',
    };
  });

  const handleClear = () => {
    setSelectedParams((p) => ({ ...p, ruc: '' }));
  };

  const fetchFacetsOnce = async ({ estado, departamento }) => {
    const reqId = ++facetsReqIdRef.current;
    const controller = new AbortController();

    try {
      const { data } = await reportApi.reportEntitiesFacets({
        userId: user?.user_id,
        estado: estado || undefined,
        departamento: departamento || undefined,
        signal: controller.signal,
      });

      // Ignora respuestas viejas
      if (reqId !== facetsReqIdRef.current) return;

      setOpts((o) => ({
        ...o,
        estados: data.estados ?? [],
        departamentos: data.departamentos ?? [],
        personerias: data.personerias ?? [],
      }));

      // Validación de selecciones
      setSelectedParams((p) => {
        const estOk = !p.estado || (data.estados ?? []).some((d) => d.value === p.estado);
        const objOk =
          !p.departamento || (data.departamentos ?? []).some((o) => o.value === p.departamento);
        const perOk =
          !p.personeria || (data.personerias ?? []).some((o) => o.value === p.personeria);

        return {
          ...p,
          estado: estOk ? p.estado : '',
          departamento: estOk && objOk ? p.departamento : '',
          personeria: estOk && objOk && perOk ? p.personeria : '',
          ruc: '',
        };
      });
    } catch (e) {}
  };

  useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      const { success, top, bottom, totalEntidades } = await reportApi.reportDepartments({
        userId: user?.user_id,
        signal: ctrl.signal,
      });

      if (!success) return;

      setTotal(totalEntidades ?? 0);
      setTopDepartamento(top);
      setBottomDepartamento(bottom);
    })();

    return () => ctrl.abort();
  }, []);

  // facets
  useEffect(() => {
    fetchFacetsOnce({
      estado: selectedParams.estado,
      departamento: selectedParams.departamento,
    });
  }, [selectedParams.estado, selectedParams.departamento]);

  useEffect(() => {
    setPage(1);
  }, [
    selectedParams.estado,
    selectedParams.departamento,
    selectedParams.personeria,
    selectedParams.ruc,
  ]);

  useEffect(() => {
    let timer;
    let controller;

    const run = async () => {
      controller = new AbortController();
      setLoading(true);

      try {
        const { estado, departamento, personeria, ruc } = selectedParams;

        const { data, total } = await reportApi.reportEntities({
          userId: user?.user_id,
          estado: estado || undefined,
          departamento: departamento || undefined,
          personeria: personeria || undefined,
          ruc: ruc || undefined,
          page,
          limit: PAGE_SIZE,
          signal: controller.signal,
        });

        setRows(
          (data || []).map((r) => ({
            ...r,
            bhf_desembolsados: [...(r.bhf_desembolsados ?? [])].sort(
              (a, b) => Number(a?.anio) - Number(b?.anio)
            ),
          }))
        );
        setRowCount(total ?? 0);
      } catch (_) {
        // ignorar aborts
      } finally {
        setLoading(false);
      }
    };

    // Debounce si cambia descripción; inmediato para otros casos
    const delay = selectedParams.ruc ? 300 : 0;
    timer = setTimeout(run, delay);

    return () => {
      clearTimeout(timer);
      controller?.abort();
    };
  }, [
    page,
    selectedParams.estado,
    selectedParams.departamento,
    selectedParams.personeria,
    selectedParams.ruc,
  ]);

  useEffect(() => {
    const handleLogout = async () => {
      if (user_id && user?.user_id != user_id) {
        await auth.signOut();
        router.push(paths.index);
      }
    };
    handleLogout();
  }, [user?.user_id, router]);

  const resetFilters = async () => {
    if (resetting) return;
    setResetting(true);

    abortRef.current?.abort();

    setSelectedParams((p) => ({
      ...p,
      estado: '',
      departamento: '',
      personeria: '',
      ruc: '',
    }));
    setPage(1);

    await fetchFacetsOnce({});

    setResetting(false);
  };

  const filterOptions = createFilterOptions({
    stringify: (option) => normalize(option?.value || ''),
    trim: true,
    ignoreCase: true,
    limit: 300,
  });

  return (
    <>
      <Seo title="Reporte: FMV" />
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
                  <Typography sx={{ fontSize: '1.875rem', fontWeight: 'bold' }}>
                    Fondo Mi Vivienda
                  </Typography>
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
                      Fondo Mi Vivienda
                    </Typography>
                  </Breadcrumbs>
                </Stack>
                <Stack>
                  <Box sx={{ display: 'flex', gap: 6 }}>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ fontSize: '24px', fontWeight: 'bold' }}>{total || 0}</Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'gray' }}>Entidades totales</Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ fontSize: '24px', fontWeight: 'bold', color: 'primary.main' }}>
                        {rowCount || 0}
                      </Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'gray' }}>Vigentes filtradas</Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
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
                <Box sx={{ display: 'flex', gap: 3 }}>
                  {/* Input de búsqueda */}
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Buscar (RUC)"
                      value={selectedParams.ruc}
                      onChange={(e) => setSelectedParams((p) => ({ ...p, ruc: e.target.value }))}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search
                              size={20}
                              sx={{ color: 'gray' }}
                            />
                          </InputAdornment>
                        ),
                        endAdornment: selectedParams.ruc && (
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

                  {/* Botón Filtros */}
                  <Button
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
                </Box>

                {/* Panel de filtros expandible */}
                {showFilters && (
                  <>
                    <Box sx={{ width: '100%', mt: 3 }}>
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                      >
                        {/* Estado */}
                        <Grid
                          item
                          size={{
                            xs: 12,
                            md: 6,
                          }}
                        >
                          <Autocomplete
                            options={[{ value: '', count: 0 }, ...opts.estados]}
                            filterOptions={filterOptions}
                            getOptionLabel={(o) => (o?.value ? `${o.value} (${o.count ?? 0})` : '')}
                            isOptionEqualToValue={(o, v) => o?.value === v?.value}
                            value={
                              selectedParams.estado
                                ? {
                                    value: selectedParams.estado,
                                    count:
                                      opts.estados.find((d) => d.value === selectedParams.estado)
                                        ?.count ?? 0,
                                  }
                                : { value: '', count: 0 }
                            }
                            onChange={(_, val) => {
                              setSelectedParams((p) => ({
                                ...p,
                                estado: val?.value || '',
                                departamento: '',
                                personeria: '',
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Estado"
                                placeholder="Escribe para filtrar…"
                                fullWidth
                              />
                            )}
                            // Opcional: render bonito con el conteo alineado a la derecha
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
                            getOptionLabel={(o) => (o?.value ? `${o.value} (${o.count ?? 0})` : '')}
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
                                personeria: '',
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
                            // Opcional: render bonito con el conteo alineado a la derecha
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

                        {/* Personería */}
                        <Grid
                          item
                          size={{
                            xs: 12,
                            sm: 6,
                            md: 3,
                          }}
                        >
                          <Autocomplete
                            options={[{ value: '', count: 0 }, ...opts.personerias]}
                            filterOptions={filterOptions}
                            getOptionLabel={(o) => (o?.value ? `${o.value} (${o.count ?? 0})` : '')}
                            isOptionEqualToValue={(o, v) => o?.value === v?.value}
                            value={
                              selectedParams.personeria
                                ? {
                                    value: selectedParams.personeria,
                                    count:
                                      opts.personerias.find(
                                        (d) => d.value === selectedParams.personeria
                                      )?.count ?? 0,
                                  }
                                : { value: '', count: 0 }
                            }
                            onChange={(_, val) => {
                              setSelectedParams((p) => ({
                                ...p,
                                personeria: val?.value || '',
                              }));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Personerías"
                                placeholder="Escribe para filtrar…"
                                fullWidth
                              />
                            )}
                            // Opcional: render bonito con el conteo alineado a la derecha
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
              <FondoMiViviendaDetails
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
