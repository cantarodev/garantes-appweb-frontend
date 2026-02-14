import {
  reportDepartments,
  reportConvocatorias,
  reportConvocatoriasFacets,
  downloadConvocatoriasExcel,
} from '../seace/reportApi';

class ReportApi {
  async reportDepartments(request) {
    const { userId, fromDate, toDate, signal } = request;

    return await reportDepartments(userId, fromDate, toDate, signal);
  }

  async reportConvocatoriasFacets(request) {
    const { userId, fromDate, toDate, departamento, abortRef } = request;

    return await reportConvocatoriasFacets(userId, fromDate, toDate, departamento, abortRef);
  }

  async reportConvocatorias(request) {
    const { userId, fromDate, toDate, page, departamento, objContratacion, q } = request;

    return await reportConvocatorias(
      userId,
      fromDate,
      toDate,
      page,
      departamento,
      objContratacion,
      q
    );
  }

  async downloadConvocatoriasExcel(request) {
    const { userId, fromDate, toDate, departamento, objContratacion, q, columns } = request;
    return await downloadConvocatoriasExcel(
      userId,
      fromDate,
      toDate,
      departamento,
      objContratacion,
      q,
      columns
    );
  }
}

export const reportApi = new ReportApi();
