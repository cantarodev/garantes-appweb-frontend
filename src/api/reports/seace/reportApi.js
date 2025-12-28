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

export const getReportDetractions = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account
) => {
  return handleResponse(
    apiClient.post(`/report/observations/detractions`, {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
    })
  );
};

export const getReportDebitCreditNotes = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account
) => {
  return handleResponse(
    apiClient.post(`/report/observations/notes`, {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
    })
  );
};

export const getReportCorrelativity = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account
) => {
  return handleResponse(
    apiClient.post(`/report/observations/correlativity`, {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
    })
  );
};

export const getReportFactoring = (
  user_id,
  period,
  queryType,
  docType,
  currency,
  filters,
  account
) => {
  return handleResponse(
    apiClient.post(`/report/observations/factoring`, {
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account,
    })
  );
};

export const getReportMissings = (user_id, period, queryType, docType, currency, account) => {
  return handleResponse(
    apiClient.get(
      `/report/missings/${user_id}/${period}/${queryType}/${docType}/${currency}/${account}`
    )
  );
};

export const downloadObservations = (filteredData) => {
  return handleResponse(apiClient.post('/report/observations/download', { filteredData }));
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

  const dispo = resp.headers['content-disposition'] || '';
  const match = dispo.match(/filename="([^"]+)"/);
  const filename = match?.[1] || `convocatorias_${new Date().toISOString().slice(0, 19).replace(/:/g, '-').replace('T', '_')}.xlsx`;


  const url = URL.createObjectURL(new Blob([resp.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

export const downloadMissingsExcel = (filteredData, filePath) => {
  return handleResponse(
    apiClient.post('/report/missings/download-excel', { filteredData, filePath })
  );
};
