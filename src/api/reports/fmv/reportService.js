import {
  reportDepartments,
  reportEntities,
  reportEntitiesFacets,
  downloadEntidadesExcel,
} from '../fmv/reportApi';

class ReportApi {
  async reportDepartments(request) {
    const { userId, signal } = request;

    return await reportDepartments(userId, signal);
  }

  async reportEntitiesFacets(request) {
    const { userId, estado, departamento, abortRef } = request;

    return await reportEntitiesFacets(userId, estado, departamento, abortRef);
  }

  async reportEntities(request) {
    const { userId, page, estado, departamento, personeria, ruc } = request;

    return await reportEntities(userId, page, estado, departamento, personeria, ruc);
  }

  async downloadEntidadesExcel(request) {
    const { userId, estado, departamento, personeria, ruc, columns } = request;
    return await downloadEntidadesExcel(userId, estado, departamento, personeria, ruc, columns);
  }
}

export const reportApi = new ReportApi();
