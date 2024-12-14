import dayjs from 'dayjs';

import BaseApiService from './BaseApiService';

export default class HQExchangeTempApi extends BaseApiService {
  constructor() {
    super('/v1/hq/exchange');
  }

  // 전체 교환 목록 (엑셀 다운로드용)
  getAllExchangeList({
    startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    endDate = dayjs().format('YYYY-MM-DD'),
    criteria,
    keyword,
  }) {
    const searchParams = new URLSearchParams();
    searchParams.append('startDate', dayjs(startDate).format('YYYY-MM-DD'));
    searchParams.append('endDate', dayjs(endDate).format('YYYY-MM-DD'));

    if (criteria && keyword) {
      searchParams.append('searchFilter', criteria);
      searchParams.append('searchWord', keyword);
    }

    return this.get(`/excel-data?${searchParams.toString()}`);
  }
}
