import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import DownloadIcon from '@untitled-ui/icons-react/build/esm/Download01';
import { reportApi } from 'src/api/reports/seace/reportService';
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
  Tooltip,
} from '@mui/material';

import { useRef, useState } from 'react';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { formatInTimeZone } from 'date-fns-tz';
import { DownloadButton } from 'src/sections/components/buttons/button-download';
import { useMockedUser } from 'src/hooks/use-mocked-user';

const columnLabels = {
  id_convocatoria: 'ID Convocatoria',
  items_count: 'Items',
  departamento: 'Departamento',
  nombre: 'Entidad',
  fecha_publicacion: 'Fecha de Publicación',
  nomenclatura: 'Nomenclatura',
  obj_contratacion: 'Obj. de Contratación',
  descripcion: 'Descripción',
  presentacion_interval: 'Crono. Presentación',
  buena_pro_interval: 'Crono. Buena Pro',
};

export const SeaceDetails = (props) => {
  const { rows, rowCount, page, PAGE_SIZE, setPage, loading, selectedParams } = props;
  const user = useMockedUser();
  const containerRef = useRef();

  const [columnVisibility, setColumnVisibility] = useState({
    id_convocatoria: false,
    items_count: true,
    departamento: true,
    nombre: true,
    fecha_publicacion: false,
    nomenclatura: true,
    obj_contratacion: true,
    descripcion: true,
    presentacion_interval: true,
    buena_pro_interval: true,
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

  const exportToExcel = async () => {
    const activeKeys = Object.keys(columnVisibility).filter((k) => columnVisibility[k]);

    try {
      await reportApi.downloadConvocatoriasExcel({
        userId: user?.user_id,
        fromDate: selectedParams.fromDate,
        toDate: selectedParams.toDate,
        departamento: selectedParams.departamento,
        objContratacion: selectedParams.objContratacion,
        nomenclatura: selectedParams.nomenclatura,
        descripcion: selectedParams.descripcion,
        columns: activeKeys,
      });
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Convocatorias"
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
                {Object.keys(columnVisibility).map((column) => (
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
                ))}

                {rows.length > 0 && <DownloadButton onDownload={() => exportToExcel(rows)} />}
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
                {columnVisibility.id_convocatoria && (
                  <TableCell>
                    <Tooltip
                      title={columnLabels.id_convocatoria}
                      arrow
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          maxWidth: 60,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ID Convocatoria
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.items_count && (
                  <TableCell>
                    <Typography sx={{ fontSize: 12, fontWeight: 'bold' }}>Items</Typography>
                  </TableCell>
                )}
                {columnVisibility.departamento && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                      }}
                    >
                      Departamento
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.nombre && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        minWidth: 250,
                      }}
                    >
                      Entidad
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.fecha_publicacion && (
                  <TableCell>
                    <Tooltip
                      title={columnLabels.fecha_publicacion}
                      arrow
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          maxWidth: 90,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Fecha Publicación
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.nomenclatura && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        minWidth: 120,
                      }}
                    >
                      Nomenclatura
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.obj_contratacion && (
                  <TableCell>
                    <Tooltip
                      title={columnLabels.obj_contratacion}
                      arrow
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          minWidth: 80,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Objeto
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.descripcion && (
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        minWidth: 380,
                      }}
                    >
                      Descripción
                    </Typography>
                  </TableCell>
                )}
                {columnVisibility.presentacion_interval && (
                  <TableCell>
                    <Tooltip
                      title={columnLabels.presentacion_interval}
                      arrow
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          width: 120,
                          maxWidth: 120,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Presentación
                      </Typography>
                    </Tooltip>
                  </TableCell>
                )}
                {columnVisibility.buena_pro_interval && (
                  <TableCell>
                    <Tooltip
                      title={columnLabels.buena_pro_interval}
                      arrow
                    >
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          width: 120,
                          maxWidth: 120,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Buena Pro
                      </Typography>
                    </Tooltip>
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
                    height="500px"
                    maxHeight="500px"
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
                      {columnVisibility.id_convocatoria && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.id_convocatoria).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.items_count && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.items_count).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.departamento && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>{detail.departamento}</Typography>
                        </TableCell>
                      )}
                      {columnVisibility.nombre && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '250px' }}>
                            {detail.nombre ? detail.nombre : '-'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.fecha_publicacion && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {formatInTimeZone(
                              detail.fecha_publicacion_date,
                              '',
                              'dd/MM/yyyy HH:mm'
                            )}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.nomenclatura && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12, width: '130px' }}>
                            {String(detail.nomenclatura).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.obj_contratacion && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            <Typography sx={{ fontSize: 12 }}>{detail.obj_contratacion}</Typography>
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.descripcion && (
                        <TableCell className="customTableCell">
                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 'normal',
                              width: '380px',
                            }}
                          >
                            {detail.descripcion ? detail.descripcion : '-'}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.presentacion_interval && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.presentacion_interval).trim()}
                          </Typography>
                        </TableCell>
                      )}
                      {columnVisibility.buena_pro_interval && (
                        <TableCell className="customTableCell">
                          <Typography sx={{ fontSize: 12 }}>
                            {String(detail.buena_pro_interval).trim()}
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

SeaceDetails.propTypes = {
  rows: PropTypes.array,
};
