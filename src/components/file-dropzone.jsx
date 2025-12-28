import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import Upload01Icon from '@untitled-ui/icons-react/build/esm/Upload01';
import XIcon from '@untitled-ui/icons-react/build/esm/X';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import toast from 'react-hot-toast';
import { fileManagerApi } from 'src/api/file-manager/fileService';
import { FileIcon } from 'src/components/file-icon';
import { bytesToSize } from 'src/utils/bytes-to-size';
import { Fragment, useState } from 'react';
import { useMockedUser } from 'src/hooks/use-mocked-user';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { useSelector } from 'react-redux';
import {
  Alert,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

export const FileDropzone = (props) => {
  const {
    caption,
    files = [],
    onRemove,
    onRemoveAll,
    onClose,
    handleItemsTotalsGet,
    handleItemsGet,
    opt,
    ...other
  } = props;
  const { getRootProps, getInputProps, isDragActive } = useDropzone(other);
  const [uploading, setUploading] = useState(false);
  const user = useMockedUser();
  const selectedAccount = useSelector((state) => state.account);
  const hasAnyFiles = files.length > 0;

  // Estados para los desplegables
  const [periodocpe, setPeriodocpe] = useState('');
  const [type, setType] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [errors, setErrors] = useState([]);

  const handlePeriodocpeChange = (e) => {
    setPeriodocpe(e.target.value);
    console.log('Periodocpe seleccionado:', e.target.value);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    console.log('Tipo seleccionado:', e.target.value);
  };

  const handleUpload = async () => {
    setShowConfirmation(true);
  };

  const confirmUpload = async () => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('user_id', user?.user_id);
      formData.append('rucAccount', selectedAccount);
      formData.append('period', periodocpe.replace(/-/g, ''));
      formData.append('type', type);
      formData.append('option', opt);
      files.forEach((file) => {
        formData.append('files', file);
      });
      const response = await fileManagerApi.createFile(formData);

      if (response.status === 'success') {
        toast.success(response.message, { duration: 3000, position: 'top-center' });
        onClose();
        handleItemsTotalsGet();
        handleItemsGet();
      } else {
        setErrors(response.errors);
        setShowConfirmation(false);
        onRemoveAll();
      }

      setUploading(false);
    } catch (error) {
      setUploading(false);
      toast.error(error.message, { duration: 3000, position: 'top-center' });
    }
  };

  const cancelUpload = () => {
    setShowConfirmation(false);
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const months = Array.from({ length: currentMonth }, (v, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return `${currentYear}-${month}`;
  });

  return (
    <div>
      {/* Desplegables */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <FormControl sx={{ m: 0, minWidth: 120 }}>
          <InputLabel id="periodocpe-label">Periodo</InputLabel>
          <Select
            labelId="periodocpe-label"
            id="periodocpe"
            value={periodocpe}
            onChange={handlePeriodocpeChange}
            label="Periodo CPE"
          >
            {months.map((month) => (
              <MenuItem
                key={month}
                value={month}
              >
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {opt === 'ple' && (
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="type-label">Tipo</InputLabel>
            <Select
              labelId="type-label"
              id="type"
              value={type}
              onChange={handleTypeChange}
              label="Tipo"
            >
              <MenuItem value="compras">compras</MenuItem>
              <MenuItem value="ventas">ventas</MenuItem>
              {/* Añade más opciones según sea necesario */}
            </Select>
          </FormControl>
        )}
      </Stack>

      <Box
        sx={{
          alignItems: 'center',
          border: 1,
          borderRadius: 1,
          borderStyle: 'dashed',
          borderColor: 'divider',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          outline: 'none',
          p: 6,
          ...(isDragActive && {
            backgroundColor: 'action.active',
            opacity: 0.5,
          }),
          '&:hover': {
            backgroundColor: 'action.hover',
            cursor: 'pointer',
            opacity: 0.5,
          },
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Stack
          alignItems="center"
          direction="row"
          spacing={2}
        >
          <Avatar sx={{ height: 64, width: 64 }}>
            <SvgIcon>
              <Upload01Icon />
            </SvgIcon>
          </Avatar>
          <Stack spacing={1}>
            <Typography
              sx={{
                '& span': {
                  textDecoration: 'underline',
                },
              }}
              variant="h6"
            >
              <span>Haga clic para cargar</span> o arrastrar y soltar
            </Typography>
            {caption && (
              <Typography
                color="text.secondary"
                variant="body2"
              >
                {caption}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
      {hasAnyFiles && (
        <Box sx={{ mt: 2 }}>
          <List>
            {files.map((file) => {
              const extension = file.name.split('.').pop();

              return (
                <ListItem
                  key={file.path}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    '& + &': {
                      mt: 1,
                    },
                  }}
                >
                  <ListItemIcon>
                    <FileIcon extension={extension} />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    primaryTypographyProps={{ variant: 'subtitle2' }}
                    secondary={bytesToSize(file.size)}
                  />
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      onClick={() => onRemove?.(file)}
                    >
                      <SvgIcon>
                        <XIcon />
                      </SvgIcon>
                    </IconButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
          {uploading && (
            <Typography
              variant="body1"
              color="text.secondary"
              style={{ marginTop: '10px' }}
            >
              <LinearProgress />
            </Typography>
          )}

          {!uploading && showConfirmation && (
            <Typography
              variant="body1"
              color="text.secondary"
              style={{ marginTop: '10px' }}
            >
              ¿Estás seguro de subir PLE {type}, periodo {periodocpe}?
            </Typography>
          )}

          <Stack
            alignItems="center"
            direction="row"
            justifyContent="flex-end"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button
              color="inherit"
              onClick={showConfirmation ? cancelUpload : onRemoveAll}
              size="small"
              type="button"
            >
              {showConfirmation ? 'Cancelar' : 'Eliminar todo'}
            </Button>
            <Button
              disa
              onClick={showConfirmation ? confirmUpload : handleUpload}
              size="small"
              type="button"
              variant="contained"
              disabled={!periodocpe || (!type && opt !== 'vouching') || uploading}
            >
              {showConfirmation ? 'Confirmar' : 'Subir'}
            </Button>
          </Stack>
        </Box>
      )}
      {errors?.length > 0 && !hasAnyFiles && (
        <Box
          display="flex"
          flexDirection="column"
          maxHeight="500px"
          pt={2}
        >
          <Box mb={2}>
            <Alert
              severity="warning"
              variant="outlined"
            >
              Se encontraron errores en el archivo. Por favor, corríjalos y vuelva a cargar los
              archivos.
            </Alert>
          </Box>
          <TableContainer
            component={Paper}
            sx={{ flex: 1, overflowY: 'auto', position: 'relative' }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      textAlign="center"
                    >
                      Error
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="subtitle1"
                      textAlign="center"
                    >
                      Filas
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {errors?.map((file, fileIndex) => {
                  return (
                    <Fragment key={fileIndex}>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            textAlign="center"
                          >
                            {file.filename}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      {file.observations.map((obs, obsIndex) => {
                        return (
                          <TableRow key={obsIndex}>
                            <TableCell
                              className="customTableCell"
                              sx={{
                                color: 'error.main',
                                fontWeight: 'bold',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                whiteSpace: 'normal',
                                maxWidth: '300px',
                              }}
                            >
                              <Typography sx={{ fontSize: 12 }}>
                                {String(obs.split('en las filas')[0]).trim()}
                              </Typography>
                            </TableCell>
                            <TableCell
                              className="customTableCell"
                              sx={{
                                color: 'error.main',
                                fontWeight: 'bold',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                whiteSpace: 'normal',
                                maxWidth: '300px',
                              }}
                            >
                              <Typography sx={{ fontSize: 12 }}>
                                {String(obs.split('en las filas')[1])
                                  .trim()
                                  .replace(/^\[|\]$/g, '')}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </div>
  );
};

FileDropzone.propTypes = {
  caption: PropTypes.string,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onRemoveAll: PropTypes.func,
  onClose: PropTypes.func,
  // From Dropzone
  accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string.isRequired).isRequired),
  disabled: PropTypes.bool,
  getFilesFromEvent: PropTypes.func,
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  noClick: PropTypes.bool,
  noDrag: PropTypes.bool,
  noDragEventsBubbling: PropTypes.bool,
  noKeyboard: PropTypes.bool,
  onDrop: PropTypes.func,
  onDropAccepted: PropTypes.func,
  onDropRejected: PropTypes.func,
  onFileDialogCancel: PropTypes.func,
  handleItemsTotalsGet: PropTypes.func,
  handleItemsGet: PropTypes.func,
  preventDropOnDocument: PropTypes.bool,
};
