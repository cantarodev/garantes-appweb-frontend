import {
  reportDepartments,
  reportConvocatorias,
  reportConvocatoriasFacets,
  getReportMissings,
  downloadObservations,
  downloadConvocatoriasExcel,
  downloadMissingsExcel,
  getReportDetractions,
  getReportDebitCreditNotes,
  getReportCorrelativity,
  getReportFactoring,
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

  async getReportDetractions(request) {
    const { user_id, period, queryType, docType, currency, filters, account } = request;

    return await getReportDetractions(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account
    );
  }

  async getReportDebitCreditNotes(request) {
    const { user_id, period, queryType, docType, currency, filters, account } = request;

    return await getReportDebitCreditNotes(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account
    );
  }

  async getReportFactoring(request) {
    const { user_id, period, queryType, docType, currency, filters, account } = request;

    return await getReportFactoring(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account
    );
  }

  async getReportCorrelativity(request) {
    const { user_id, period, queryType, docType, currency, filters, account } = request;

    return await getReportCorrelativity(
      user_id,
      period,
      queryType,
      docType,
      currency,
      filters,
      account
    );
  }

  async getReportMissings(request) {
    const { user_id, period, queryType, docType, currency, account } = request;

    return await getReportMissings(user_id, period, queryType, docType, currency, account);
  }

  async downloadObservations(request) {
    const { downloadPath } = request;
    return await downloadObservations(downloadPath);
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
