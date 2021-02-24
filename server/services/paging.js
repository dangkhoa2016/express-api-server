
class PagingService {
  constructor() { }

  getPagination = (page, size) => {
    if (page < 1)
      page = 1;
    const limit = size ? +size : 3;
    const offset = page > 1 ? (page - 1) * limit : 0;

    return { limit, offset };
  }

  getPagingData = (dataSql, page, limit) => {
    const { count: total, rows: data } = dataSql;
    const current_page = page ? +page : 0;
    const last_page = Math.ceil(total / limit);

    return { total, data, last_page, current_page };
  }
}


module.exports = new PagingService();