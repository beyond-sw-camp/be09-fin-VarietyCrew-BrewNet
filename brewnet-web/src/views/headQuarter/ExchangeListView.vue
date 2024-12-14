<template>
  <div>
    <!-- 검색 area -->
    <SearchArea grid class="exchange-search">
      <AppDateRangePicker v-model:start="startDate" v-model:end="endDate" label="사용일자" class="criteria use-date" />
      <!-- <AppSelect v-model="position" label="직급" :options="positionOptions" :initial-value="initialPosition" /> -->
      <AppInputText id="input_name_keyword" v-model="nameKeyword" label="임직원명" />
    </SearchArea>

    <AppTable
      :paginated-data="paginatedExchanges"
      :columns="columns"
      :total-elements="exchanges.length"
      :rows-per-page="pageSize"
      show-excel-export
      @change-page="onChangePage"
      @reload="reload"
      @export-excel="onExportExcel"
    />

    <DynamicDialog />
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { useToast } from 'primevue';
import { ref, onMounted, computed, watch, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

import AppTable from '@/components/common/AppTable.vue';
import AppDateRangePicker from '@/components/common/form/AppDateRangePicker.vue';
import AppInputText from '@/components/common/form/AppInputText.vue';
import SearchArea from '@/components/common/SearchArea.vue';
import { useAppConfirmModal } from '@/hooks/useAppConfirmModal';
import { useModal } from '@/hooks/useModal';
import HQExchangeTempApi from '@/utils/api/HQExchangeTempApi';
import ExcelManager from '@/utils/ExcelManager';
import { formatKoExchangeReason, formatKoExchangeStatus } from '@/utils/format';
import { mockupExchanges } from '@/utils/mockup';

const router = useRouter();
const { showConfirm } = useAppConfirmModal();
const { openModal } = useModal();
const toast = useToast();

const nameKeyword = ref('');
const exchanges = ref([]);
const paginatedExchanges = computed(() => {
  return exchanges.value.slice(0, 15);
});
const pageSize = ref(15);
const startDate = ref(dayjs().subtract(1, 'year').toDate());
const endDate = ref(new Date());

const hqExchangeTempApi = new HQExchangeTempApi();

const goToDetail = exchangeCode => {
  router.push({ name: 'hq:order:exchange:detail', params: { exchangeCode } });
};

const columns = [
  { field: 'exchangeCode', header: '교환번호', sortable: true },
  { field: 'franchiseName', header: '교환요청지점' },
  { field: 'itemName', header: '교환품목명' },
  { field: 'reason', header: '교환사유', render: data => formatKoExchangeReason(data.reason) },
  { field: 'status', header: '교환상태', render: data => formatKoExchangeStatus(data.status) },
  { field: 'memberCode', header: '교환담당자' },
  { field: 'createdAt', header: '교환요청일자' },
  {
    field: '',
    header: '',
    template: {
      button: [
        {
          getLabel: () => '상세보기',
          clickHandler: rowData => goToDetail(rowData.exchangeCode),
        },
      ],
    },
  },
];

const onChangePage = event => {
  const { page } = event;
  console.log(page, '페이지로 변경되었다!');
};

const reload = () => {
  console.log('reload 테이블');
};

const onExportExcel = () => {
  hqExchangeTempApi
    .getAllExchangeList({
      // startDate: criteria.value.startDate,
      // endDate: criteria.value.endDate,
      // criteria: criteria.value.criteria,
      // keyword: criteria.value.keyword,
    })
    .then(rows => {
      const orderedFields = columns.filter(e => e.field).map(e => e.field); // 엑셀 컬럼 순서
      const headerNames = columns.filter(e => e.field).map(e => e.header); // 헤더명

      const excelManager = new ExcelManager(rows, orderedFields);
      excelManager.setHeaderNames(headerNames);
      excelManager.export(`교환목록${dayjs().format('YYMMDD')}`);
    })
    .catch(e => {
      toast.add({ severity: 'error', summary: '처리 실패', detail: e.message, life: 3000 });
    });
};

onMounted(() => {
  exchanges.value = [...mockupExchanges];
});
</script>

<style scoped>
.exchange-search {
  .criteria.use-date {
    grid-column: 1 / 7;
  }
}
</style>
