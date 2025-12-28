import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const armarTabla = (texto) => {
  const regex = /(\w+)\s(\w+):\s([\d.]+)\s\(debería\sser\s([\d.]+)\)/g;
  const filas = [];

  let match;
  while ((match = regex.exec(texto)) !== null) {
    const [_, nombre, tipo, incorrecto, correcto] = match;
    const diferencia = (parseFloat(correcto) - parseFloat(incorrecto)).toFixed(2);
    const observacion = `debería ser ${correcto}`;

    filas.push({
      nombre: tipo,
      correcto: parseFloat(correcto),
      incorrecto: parseFloat(incorrecto),
      diferencia: parseFloat(diferencia),
      observacion: observacion,
    });
  }

  return filas;
};

export const ModalDetail = ({ open, handleClose, data }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
          >
            Detalles
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell sx={{ textAlign: 'right' }}>SUNAT</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>PLE</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>Diferencia</TableCell>
                <TableCell>Observación</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {armarTabla(data)?.map((detail, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{detail.nombre}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Typography sx={{ color: 'green' }}>{detail.correcto}</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Typography sx={{ color: 'red' }}>{detail.incorrecto}</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>{detail.diferencia}</TableCell>
                    <TableCell>{detail.observacion}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};

ModalDetail.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  data: PropTypes.object,
};
