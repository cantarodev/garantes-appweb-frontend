import apiClient from '../../apiClient';
import { handleResponse } from 'src/utils/api-utils';

export const reportDepartments = (userId, fromDate, toDate, signal) => {
  return handleResponse(
    apiClient.get('/seace/report/convocatorias/departments', {
      params: { userId, fromDate, toDate },
      signal: signal,
    })
  );
};

export const reportConvocatoriasFacets = (userId, fromDate, toDate, departamento, abortRef) => {
  return handleResponse(
    apiClient.get('/seace/report/convocatorias/facets', {
      params: { userId, fromDate, toDate, departamento },
      signal: abortRef?.current?.signal,
    })
  );
};

export const reportConvocatorias = (
  userId,
  fromDate,
  toDate,
  page,
  departamento,
  objContratacion,
  q
) => {
  return handleResponse(
    apiClient.get('/seace/report/convocatorias/show', {
      params: {
        userId,
        fromDate,
        toDate,
        page,
        departamento,
        objContratacion,
        q,
      },
    })
  );
};

export const downloadConvocatoriasExcel = async (
  userId,
  fromDate,
  toDate,
  departamento,
  objContratacion,
  q,
  columns
) => {
  const resp = await apiClient.post(
    '/seace/report/convocatorias/export',
    {
      userId,
      fromDate,
      toDate,
      departamento,
      objContratacion,
      q,
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

  const pad = (n) => String(n).padStart(2, '0');

  const now = new Date();
  const stamp =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  const dispo = resp.headers['content-disposition'] || '';
  const match = dispo.match(/filename="([^"]+)"/);
  const filename = match?.[1] || `convocatorias_${stamp}.xlsx`;


  const url = URL.createObjectURL(new Blob([resp.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

