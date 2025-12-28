import apiClient from '../../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const reportDepartments = (userId, signal) => {
  return handleResponse(
    apiClient.get('/fmv/report/entities/departments', {
      params: { userId },
      signal: signal,
    })
  );
};

export const reportEntitiesFacets = (userId, estado, departamento, abortRef) => {
  return handleResponse(
    apiClient.get('/fmv/report/entities/facets', {
      params: { userId, estado, departamento },
      signal: abortRef?.current?.signal,
    })
  );
};

export const reportEntities = (userId, page, estado, departamento, personeria, ruc) => {
  return handleResponse(
    apiClient.get('/fmv/report/entities/show', {
      params: {
        userId,
        page,
        estado,
        departamento,
        personeria,
        ruc,
      },
    })
  );
};

export const downloadEntidadesExcel = async (
  userId,
  estado,
  departamento,
  personeria,
  ruc,
  columns
) => {
  const resp = await apiClient.post(
    '/fmv/report/entities/export',
    {
      userId,
      estado,
      departamento,
      personeria,
      ruc,
      columns,
    },
    { responseType: 'blob' }
  );

  const ct = resp.headers['content-type'] || '';
  if (ct.includes('application/json')) {
    // intenta leer el blob como texto y parsear
    const txt = await resp.data.text();
    let msg = 'Error al exportar';
    try {
      msg = JSON.parse(txt)?.message || msg;
    } catch {}
    throw new Error(msg);
  }

  const dispo = resp.headers['content-disposition'] || '';
  const match = dispo.match(/filename="([^"]+)"/);
const filename = match?.[1] || `entidades_${new Date().toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_')}.xlsx`;


  const url = URL.createObjectURL(new Blob([resp.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
