import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { reportApi } from 'src/api/reports/fmv/reportService';
import {
  TableContainer,
  CardHeader,
  Box,
  LinearProgress,
  IconButton,
  SvgIcon,
  TableFooter,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Paper,
  TablePagination,
} from '@mui/material';

import { useRef, useState } from 'react';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { DownloadButton } from 'src/sections/components/buttons/button-download';
import { useMockedUser } from 'src/hooks/use-mocked-user';

const baseColumnLabels = {
  convocatoria: 'Convocatoria',
  departamento: 'Departamento',
  provincia: 'Provincia',
  distrito: 'Distrito',
  fecha_ingreso: 'Fecha Ingreso',
  fecha_registro: 'Fecha Registro',
  dia: 'Día',
  mes: 'Mes',
  anio: 'Año',
  fecha_caducidad: 'Fecha Caducidad',
  vigencia_dias: 'Vigencia (Días)',
  estado: 'Estado',
  codigo_et: 'Código ET',
  razon_social: 'Razón Social',
  personeria: 'Personería',
  representante_legal: 'Representante Legal',
  dni: 'Dni',
  ruc: 'Ruc',
  direccion_razon_social: 'Dirección Razón Social',
  telefono: 'Teléfono',
  celular: 'Celular',
  email: 'Email',
  ingeniero: 'Ingeniero',
  cip: 'Cip',
  arquitecto: 'Arquitecto',
  cap: 'Cap',
  ingeniero2: 'Ingeniero2',
  cip2: 'Cip2',
  arquitecto2: 'Arquitecto2',
  cap2: 'Cap2',
  abogado: 'Abogado',
  cal: 'Cal',
  resolucion: 'Resolucion',
  numero_total_de_bfhs_desembolsados: 'Total',
};

export const FondoMiViviendaDetails = (props) => {
  const { rows, rowCount, page, PAGE_SIZE, setPage, loading, selectedParams } = props;
  const user = useMockedUser();
  const containerRef = useRef();

  const [columnVisibility, setColumnVisibility] = useState({
    convocatoria: false,
    departamento: true,
    provincia: false,
    distrito: false,
    fecha_ingreso: true,
    fecha_registro: false,
    dia: false,
    mes: false,
    anio: false,
    fecha_caducidad: false,
    vigencia_dias: false,
    estado: true,
    codigo_et: false,
    razon_social: true,
    personeria: true,
    representante_legal: true,
    dni: false,
    ruc: true,
    direccion_razon_social: true,
    telefono: false,
    celular: false,
    email: true,
    ingeniero: false,
    cip: false,
    arquitecto: false,
    cap: false,
    ingeniero2: false,
    cip2: false,
    arquitecto2: false,
    cap2: false,
    abogado: false,
    cal: false,
    resolucion: false,
    numero_total_de_bfhs_desembolsados: true,
    numero_total_de_bfhs_desembolsados1: true,
    numero_total_de_bfhs_desembolsados2: true,
    numero_total_de_bfhs_desembolsados3: true,
    numero_total_de_bfhs_desembolsados4: true,
  });
  const [open, setOpen] = useState(false);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleColumnVisibilityChange = (column) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const isEmpty = rows.length === 0;

  const getLast4YearsFromDB = (rows) => {
    const years = Array.from(
      new Set(rows.flatMap((r) => (r.bhf_desembolsados ?? []).map((x) => Number(x.anio))))
    )
      .filter(Number.isFinite)
      .sort((a, b) => a - b);

    return years.slice(-4);
  };

  const buildDynamicLabelsFromDB = (rows) => {
    const years = getLast4YearsFromDB(rows); // SOLO BD
    const dynamic = Object.fromEntries(
      years.map((y, i) => [`numero_total_de_bfhs_desembolsados${i + 1}`, `Total ${y}`])
    );
    return { labels: { ...baseColumnLabels, ...dynamic }, years };
  };

  const { labels } = buildDynamicLabelsFromDB(rows);
  const columnLabels = labels;

  const exportToExcelFmv = async () => {
    const activeKeys = Object.keys(columnVisibility).filter((k) => columnVisibility[k]);

    try {
      await reportApi.downloadEntidadesExcel({
        userId: user?.user_id,
        fromDate: selectedParams.fromDate,
        toDate: selectedParams.toDate,
        estado: selectedParams.estado,
        departamento: selectedParams.departamento,
        personeria: selectedParams.personeria,
        ruc: selectedParams.ruc,
        columns: activeKeys,
      });
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Entidades"
        sx={{ p: 2, pt: 1, pb: 0 }}
        action={
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            <IconButton onClick={handleDialogOpen}>
              <ViewColumnIcon />
            </IconButton>
            <Dialog
              open={open}
              onClose={handleDialogClose}
              fullScreen
              PaperProps={{
                sx: {
                  height: '100%',
                  width: '300px',
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  overflowY: 'auto',
                },
              }}
            >
              <DialogTitle>Columnas</DialogTitle>
              <DialogContent
                sx={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'calc(100% - 64px)',
                  overflowY: 'auto',
                }}
              >
                {Object.keys(columnVisibility).map(
                  (column) =>
                    columnLabels[column] && (
                      <FormControlLabel
                        key={column}
                        control={
                          <Checkbox
                            checked={columnVisibility[column]}
                            onChange={() => handleColumnVisibilityChange(column)}
                          />
                        }
                        label={columnLabels[column]}
                      />
                    )
                )}

                {rows.length > 0 && <DownloadButton onDownload={() => exportToExcelFmv(rows)} />}
              </DialogContent>
            </Dialog>
          </Stack>
        }
      />
      <Box
        display="flex"
        flexDirection="column"
        height="500px"
        maxHeight="500px"
        p={2}
        pb={0}
      >
        <TableContainer
          component={Paper}
          ref={containerRef}
          sx={{ flex: 1, overflowY: 'auto', position: 'relative' }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columnVisibility.convocatoria && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Convocatoria</Typography>
                  </TableCell>
                )}
                {columnVisibility.departamento && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Departamento</Typography>
                  </TableCell>
                )}
                {columnVisibility.provincia && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Provincia
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.distrito && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Distrito
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.fecha_ingreso && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Fecha Ingreso
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.fecha_registro && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Fecha Registro
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.dia && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Día
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.mes && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Mes
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.anio && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        width: '110px',
                      }}
                    >
                      Año
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.fecha_caducidad && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        width: '110px',
                      }}
                    >
                      Fecha Caducidad
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.vigencia_dias && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>
                      Vigencia (Días)
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.estado && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Estado</Typography>
                  </TableCell>
                )}
                {columnVisibility.codigo_et && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Código ET
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.razon_social && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Razón Social
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.personeria && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Personería
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.representante_legal && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Representante Legal
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.dni && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Dni
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.ruc && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Ruc
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.direccion_razon_social && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        width: '110px',
                      }}
                    >
                      Dirección Razón Social
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.telefono && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        width: '110px',
                      }}
                    >
                      Teléfono
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.celular && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Celular</Typography>
                  </TableCell>
                )}
                {columnVisibility.email && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Email</Typography>
                  </TableCell>
                )}
                {columnVisibility.ingeniero && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Ingeniero
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.cip && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Cip
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.arquitecto && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Arquitecto
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.cap && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Cap
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.ingeniero2 && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Ingeniero2
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.cip2 && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Cip2
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.arquitecto2 && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        width: '110px',
                      }}
                    >
                      Arquitecto2
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.cap2 && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        width: '110px',
                      }}
                    >
                      Cap2
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.abogado && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Abogado</Typography>
                  </TableCell>
                )}
                {columnVisibility.cal && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Cal</Typography>
                  </TableCell>
                )}
                {columnVisibility.resolucion && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Resolución
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.numero_total_de_bfhs_desembolsados1 &&
                  columnLabels?.numero_total_de_bfhs_desembolsados1 && (
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          minWidth: '90px',
                        }}
                      >
                        {columnLabels.numero_total_de_bfhs_desembolsados1}
                      </Typography>
                    </TableCell>
                  )}
                {columnVisibility.numero_total_de_bfhs_desembolsados2 &&
                  columnLabels.numero_total_de_bfhs_desembolsados2 && (
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          minWidth: '90px',
                        }}
                      >
                        {columnLabels.numero_total_de_bfhs_desembolsados2}
                      </Typography>
                    </TableCell>
                  )}
                {columnVisibility.numero_total_de_bfhs_desembolsados3 &&
                  columnLabels.numero_total_de_bfhs_desembolsados3 && (
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          minWidth: '90px',
                        }}
                      >
                        {columnLabels.numero_total_de_bfhs_desembolsados3}
                      </Typography>
                    </TableCell>
                  )}
                {columnVisibility?.numero_total_de_bfhs_desembolsados4 &&
                  columnLabels?.numero_total_de_bfhs_desembolsados4 && (
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          minWidth: '90px',
                        }}
                      >
                        {columnLabels.numero_total_de_bfhs_desembolsados4}
                      </Typography>
                    </TableCell>
                  )}
                {columnVisibility.numero_total_de_bfhs_desembolsados && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        minWidth: '90px',
                      }}
                    >
                      Total
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={25}
                    align="center"
                    style={{ height: 460 }}
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                    >
                      <LinearProgress />
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : isEmpty ? (
                <TableRow>
                  <TableCell
                    colSpan={25}
                    align="center"
                    style={{ height: 180 }}
                  >
                    <Typography
                      variant="body1"
                      color="textSecondary"
                    >
                      No hay datos disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rows?.map((detail, index) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {columnVisibility.convocatoria && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.convocatoria).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.departamento && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.departamento).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.provincia && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{detail.provincia}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.distrito && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '250px' }}>
                            {detail.distrito ? detail.distrito : '-'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.fecha_ingreso && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{detail.fecha_ingreso}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.fecha_registro && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '130px' }}>
                            {String(detail.fecha_registro).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.dia && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            <Typography sx={{ fontSize: 12 }}>{detail.dia}</Typography>
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.mes && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'normal',
                              width: '380px',
                            }}
                          >
                            {detail.descripcion ? detail.mes : '-'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.anio && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.anio).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.fecha_caducidad && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.fecha_caducidad).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.vigencia_dias && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.vigencia_dias).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.estado && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.estado).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.codigo_et && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{detail.codigo_et}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.razon_social && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '250px' }}>
                            {detail.razon_social ? detail.razon_social : '-'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.personeria && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{detail.personeria}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.representante_legal && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '130px' }}>
                            {String(detail.representante_legal).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.dni && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            <Typography sx={{ fontSize: 12 }}>{detail.dni}</Typography>
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.ruc && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'normal',
                              width: '380px',
                            }}
                          >
                            {detail.ruc ? detail.ruc : '-'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.direccion_razon_social && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.direccion_razon_social).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.telefono && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.telefono).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.celular && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.celular).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.email && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.email).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.ingeniero && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{detail.ingeniero}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.cip && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '250px' }}>
                            {detail.cip ? detail.cip : '-'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.arquitecto && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{detail.arquitecto}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.cap && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '130px' }}>
                            {String(detail.cap).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.ingeniero2 && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            <Typography sx={{ fontSize: 12 }}>{detail.ingeniero2}</Typography>
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.cip2 && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'normal',
                              width: '380px',
                            }}
                          >
                            {detail.cip2 ? detail.cip2 : '-'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.arquitecto2 && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.arquitecto2).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.cap2 && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.cap2).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.abogado && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.abogado).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.cal && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{String(detail.cal).trim()}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.resolucion && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{detail.resolucion}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.numero_total_de_bfhs_desembolsados1 && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '250px' }}>
                            {' '}
                            {detail.bhf_desembolsados[0].csp}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.numero_total_de_bfhs_desembolsados2 && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {detail.bhf_desembolsados[1].csp}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.numero_total_de_bfhs_desembolsados3 && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '130px' }}>
                            {String(detail.bhf_desembolsados[2].csp).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.numero_total_de_bfhs_desembolsados4 && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            <Typography sx={{ fontSize: 12 }}>
                              {detail.bhf_desembolsados[3].csp}
                            </Typography>
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.numero_total_de_bfhs_desembolsados && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'normal',
                              width: '380px',
                            }}
                          >
                            {detail.numero_total_de_bfhs_desembolsados}
                          </Typography>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePagination
        component="div"
        count={rowCount}
        page={page - 1}
        rowsPerPage={PAGE_SIZE}
        onPageChange={(_, p) => setPage(p + 1)}
        rowsPerPageOptions={[PAGE_SIZE]}
      />
    </Card>
  );
};

FondoMiViviendaDetails.propTypes = {
  rows: PropTypes.array,
};
