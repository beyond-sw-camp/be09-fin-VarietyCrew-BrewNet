<template>
  <div>
    <!-- 검색 area -->
    <SearchArea grid class="order-search" @search="onSearch" @form-reset="onReset">
      <AppDateRangePicker
        v-model:start="criteria.startDate"
        v-model:end="criteria.endDate"
        label="작성일자"
        class="criteria created-at"
      />
      <AppSelect
        v-model="criteria.criteria"
        label="검색조건"
        :options="searchOptions"
        :initial-value="criteria.criteria"
      />
      <AppInputText id="input_name_keyword" v-model="criteria.keyword" label="검색어" />
    </SearchArea>

    <AppTable
      :paginated-data="paginatedOrders"
      :columns="columns"
      :total-elements="totalElements"
      :rows-per-page="size"
      show-excel-export
      @reload="reloadData"
      @change-page="onChangePage"
      @export-excel="onExportExcel"
    />

    <DynamicDialog />
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { useToast } from 'primevue';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import AppTable from '@/components/common/AppTable.vue';
import AppDateRangePicker from '@/components/common/form/AppDateRangePicker.vue';
import AppInputText from '@/components/common/form/AppInputText.vue';
import AppSelect from '@/components/common/form/AppSelect.vue';
import SearchArea from '@/components/common/SearchArea.vue';
import { useUserStore } from '@/stores/user';
import FCOrderApi from '@/utils/api/FCOrderApi';
import { CRITERIA_FC_ORDER_LIST, ORDER_STATUS, SEARCH_CRITERIA } from '@/utils/constant';
import ExcelManager from '@/utils/ExcelManager';
import { formatKoOrderStatus, formatKoSearchCriteria } from '@/utils/format';
import { getOrderStatusSeverity, makeSelectOption } from '@/utils/helper';

const router = useRouter();
const toast = useToast();

const totalElements = ref(0);
const page = ref(0);
const size = ref(15);

const getInitialCriteria = () => ({
  startDate: dayjs().subtract(1, 'year').toDate(),
  endDate: new Date(),
  criteria: SEARCH_CRITERIA.ORDER_CODE,
  keyword: '',
});

const criteria = ref(getInitialCriteria());
const paginatedOrders = ref([]);
const fcOrderApi = new FCOrderApi();
const searchFilter = ref('orderCode');
const searchOptions = computed(() => {
  return CRITERIA_FC_ORDER_LIST.map(e => makeSelectOption(formatKoSearchCriteria(e), e));
});

function clickGoDetail(data) {
  router.push({ name: 'fc:home:order:detail', params: { orderCode: data.orderCode } });
}

const columns = [
  {
    field: 'recentOrderStatus',
    header: '주문상태',
    render: data => formatKoOrderStatus(data.recentOrderStatus),
    template: {
      tag: {
        getSeverity: data => getOrderStatusSeverity(data.recentOrderStatus),
      },
    },
  },
  { field: 'orderCode', header: '주문번호' },
  {
    field: 'orderItemList',
    header: '주문품목명',
    render: data => data.orderItemList.map(item => item.name).join(', '),
  },
  {
    field: 'sumPrice',
    header: '주문금액',
    render: data => {
      // 공급가액 + 부가세
      return (data.sumPrice * 1.1).toLocaleString();
    },
  },
  { field: 'createdAt', header: '주문일자' },
  {
    field: 'recentOrderStatusCreatedAt',
    header: '완료일자',
    render: data => (data.recentOrderStatus === 'SHIPPED' ? data.recentOrderStatusCreatedAt : ''), // Display only if status is SHIPPED
  },
  {
    field: '',
    header: '',
    template: {
      button: [
        {
          getLabel: () => '상세보기',
          clickHandler: clickGoDetail,
        },
      ],
    },
  },
];

const getOrders = () => {
  fcOrderApi
    .searchOrders({
      page: page.value,
      size: size.value,
      startDate: criteria.value.startDate,
      endDate: criteria.value.endDate,
      criteria: criteria.value.criteria,
      keyword: criteria.value.keyword,
    })
    .then(data => {
      totalElements.value = data.totalElements;
      paginatedOrders.value = data.content;
    });
};

const onSearch = () => {
  getOrders();
};

const onReset = () => {
  criteria.value = getInitialCriteria();
  page.value = 0;
  getOrders();
};

const reloadData = () => {
  getOrders();
};

const onChangePage = event => {
  page.value = event.page;
  getOrders();
};

const onExportExcel = () => {
  fcOrderApi
    .getAllOrders({
      startDate: criteria.value.startDate,
      endDate: criteria.value.endDate,
      criteria: criteria.value.criteria,
      keyword: criteria.value.keyword,
    })
    .then(rows => {
      const orderedFields = columns.filter(e => e.field).map(e => e.field); // 엑셀 컬럼 순서
      const headerNames = columns.filter(e => e.field).map(e => e.header); // 헤더명

      // 데이터 표시 수정
      const tableRows = rows.map(row => ({
        ...row,
        recentOrderStatus: formatKoOrderStatus(row.recentOrderStatus),
        orderItemList: row.orderItemList.map(item => item.name).join(', '),
        recentOrderStatusCreatedAt:
          row.recentOrderStatus === ORDER_STATUS.SHIPPED ? row.recentOrderStatusCreatedAt : '', // Display only if status is SHIPPED
      }));

      const excelManager = new ExcelManager(tableRows, orderedFields);
      excelManager.setHeaderNames(headerNames);
      excelManager.export(`나의주문목록${dayjs().format('YYMMDD')}`);
    });
};

onMounted(() => {
  getOrders();
});
</script>

<style scoped>
.order-search {
  .criteria.created-at {
    grid-column: 1 / 7;
  }
}
</style>
