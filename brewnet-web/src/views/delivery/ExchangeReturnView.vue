<template>
  <div class="container">
    <h2 class="title">교환/반품 배송 목록</h2>
    <AppTable
      :columns="columns"
      :rows-per-page="pageSize"
      :paginated-data="paginatedExchangeDeliveries"
      :total-elements="totalElements"
      @reload="reloadData"
      @change-page="onChangePage"
    />
  </div>
</template>

<script setup>
import { useToast } from 'primevue';
import { onMounted, ref } from 'vue';

import AppTable from '@/components/common/AppTable.vue';
import { useAppConfirmModal } from '@/hooks/useAppConfirmModal';
import DeliverApi from '@/utils/api/DeliveryApi';
import { DELIVERY_STATUS, DRAFT_KIND, EXCHANGE_STATUS, RETURN_STATUS } from '@/utils/constant';
import {
  formatKoDeliveryStatus,
  formatKoDraftKind,
  formatKoExchangeStatus,
  formatKoReturnStatus,
} from '@/utils/format';

const { showConfirm } = useAppConfirmModal();
const toast = useToast();

const paginatedExchangeDeliveries = ref([]);
const page = ref(0);
const pageSize = ref(15);
const totalElements = ref(0);

const deliveryApi = new DeliverApi();

const getDeliveryButtonLabel = status => {
  if (status === EXCHANGE_STATUS.APPROVED) {
    return '회수 시작';
  }
  if (status === EXCHANGE_STATUS.PICKING) {
    return '회수 완료';
  }
  if (status === EXCHANGE_STATUS.PICKED) {
    return '재배송 시작';
  }
  if (status === EXCHANGE_STATUS.SHIPPING) {
    return '재배송 완료';
  }
  return '';
};

const clickCall = data => {
  location.href = `tel:${data.contact}`;
};

const changeDeliveryStatus = (code, deliveryKind, toStatus) => {
  deliveryApi
    .changeDeliveryStatus({
      code,
      deliveryKind,
      deliveryStatus: toStatus,
    })
    .then(() => {
      toast.add({ severity: 'success', summary: '처리 성공', detail: '상태 변경 완료', life: 3000 });
      reloadData();
    });
};

const clickChangeStatus = data => {
  const currentStatus = data.deliveryStatus;

  // 변경할 배송상태 설정
  let header = '';
  let acceptLabel = '';
  let message = '';
  let toStatus = null;

  if (data.deliveryKind === DRAFT_KIND.EXCHANGE) {
    // 교환일 때
    if (currentStatus === EXCHANGE_STATUS.APPROVED) {
      header = '회수 시작';
      acceptLabel = '회수 시작';
      message = '회수를 시작하시겠습니까?';
      toStatus = EXCHANGE_STATUS.PICKING;
    } else if (currentStatus === EXCHANGE_STATUS.PICKED) {
      header = '재배송 시작';
      acceptLabel = '재배송 시작';
      message = '재배송을 시작하시겠습니까?';
      toStatus = EXCHANGE_STATUS.SHIPPING;
    }
  } else if (data.deliveryKind === DRAFT_KIND.RETURN) {
    // 반품일 때
    if (currentStatus === RETURN_STATUS.APPROVED) {
      header = '회수 시작';
      acceptLabel = '회수 시작';
      message = '회수를 시작하시겠습니까?';
      toStatus = RETURN_STATUS.PICKING;
    }
  }

  if (!toStatus) {
    toast.add({
      severity: 'error',
      summary: '처리 실패',
      detail: '변경할 상태값이 설정되지 않았습니다. -- 교환/반품',
      life: 3000,
    });
    return;
  }

  showConfirm({
    header,
    message: `[주문코드: ${data.code} / 배송지: ${data.deliveryFranchiseName}] ${message}`,
    acceptLabel,
    onAccept: () => {
      changeDeliveryStatus(data.code, data.deliveryKind, toStatus);
    },
  });
};

const isShowActionButton = (deliveryKind, deliveryStatus) => {
  // 교환/반품 -> APPROVED 상태일 때에만
  if (deliveryKind === DRAFT_KIND.EXCHANGE) {
    return deliveryStatus === EXCHANGE_STATUS.APPROVED || deliveryStatus === EXCHANGE_STATUS.PICKED;
  }

  return deliveryStatus === RETURN_STATUS.APPROVED;
};

const columns = [
  {
    field: 'code',
    header: '주문코드',
  },
  { field: 'deliveryKind', header: '구분', render: data => formatKoDraftKind(data.deliveryKind) },
  { field: 'deliveryFranchiseName', header: '배송지' },
  {
    field: '',
    header: '가맹점 연락처',
    template: {
      button: [
        {
          getLabel: () => '가맹점',
          getSeverity: () => 'secondary',
          getVariant: () => undefined,
          getIcon: () => 'pi pi-phone',
          clickHandler: clickCall,
        },
      ],
    },
  },
  {
    field: '',
    header: '',
    template: {
      button: [
        {
          getLabel: data => {
            if (isShowActionButton(data.deliveryKind, data.deliveryStatus)) {
              return getDeliveryButtonLabel(data.deliveryStatus);
            }

            // 나머지 상태는 현재 상태 그대로 보여주기
            if (data.deliveryKind === DRAFT_KIND.EXCHANGE) {
              return formatKoExchangeStatus(data.deliveryStatus);
            }

            return formatKoReturnStatus(data.deliveryStatus);
          },
          // getLabel: data => formatKoDeliveryStatus(data.deliveryStatus),
          getVariant: data => {
            if (isShowActionButton(data.deliveryKind, data.deliveryStatus)) {
              return undefined;
            }
            return 'text';
          },
          clickHandler: clickChangeStatus,
          getDisabled: data => !isShowActionButton(data.deliveryKind, data.deliveryStatus),
        },
      ],
    },
  },
];

const getDeliveryList = () => {
  deliveryApi
    .getDeliveryList({ page: page.value, pageSize: pageSize.value, deliveryKind: DRAFT_KIND.EXCHANGE })
    .then(data => {
      paginatedExchangeDeliveries.value = data.content;
      totalElements.value = data.totalElements;
    })
    .catch(e => {
      paginatedExchangeDeliveries.value = [];
      totalElements.value = 0;
    });
};

const reloadData = () => {
  getDeliveryList();
};

const onChangePage = event => {
  page.value = event.page;
  getDeliveryList();
};

onMounted(() => {
  getDeliveryList();
  // paginatedExchangeDeliveries.value = [
  //   {
  //     code: 100,
  //     deliveryKind: DRAFT_KIND.EXCHANGE,
  //     deliveryFranchiseName: '낙성대점',
  //     deliveryStatus: EXCHANGE_STATUS.APPROVED,
  //     contact: '01011111111',
  //   },
  //   {
  //     code: 99,
  //     deliveryKind: DRAFT_KIND.EXCHANGE,
  //     deliveryFranchiseName: '숭실대점',
  //     deliveryStatus: EXCHANGE_STATUS.PICKING,
  //     contact: '01011111111',
  //   },
  //   {
  //     code: 98,
  //     deliveryKind: DRAFT_KIND.EXCHANGE,
  //     deliveryFranchiseName: '미아점',
  //     deliveryStatus: EXCHANGE_STATUS.PICKED,
  //     contact: '01011111111',
  //   },
  //   {
  //     code: 97,
  //     deliveryKind: DRAFT_KIND.EXCHANGE,
  //     deliveryFranchiseName: '미아사거리점',
  //     deliveryStatus: EXCHANGE_STATUS.SHIPPING,
  //     contact: '01011111111',
  //   },
  //   {
  //     code: 96,
  //     deliveryKind: DRAFT_KIND.RETURN,
  //     deliveryFranchiseName: '낙성대점',
  //     deliveryStatus: RETURN_STATUS.APPROVED,
  //     contact: '01011111111',
  //   },
  //   {
  //     code: 95,
  //     deliveryKind: DRAFT_KIND.RETURN,
  //     deliveryFranchiseName: '숭실대점',
  //     deliveryStatus: RETURN_STATUS.PICKING,
  //     contact: '01011111111',
  //   },
  // ];
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding: 0 16px;

  .title {
    padding: 16px 0;
  }
}
</style>
