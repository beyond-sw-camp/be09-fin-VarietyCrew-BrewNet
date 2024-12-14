<template>
  <div class="container">
    <h2 class="title">주문 배송 목록</h2>
    <AppTable
      :columns="columns"
      :rows-per-page="pageSize"
      :paginated-data="paginatedOrderDeliveries"
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
import { DELIVERY_STATUS, DRAFT_KIND, ORDER_STATUS } from '@/utils/constant';
import { formatKoDeliveryStatus } from '@/utils/format';

const { showConfirm } = useAppConfirmModal();
const toast = useToast();

const paginatedOrderDeliveries = ref([]);
const page = ref(0);
const pageSize = ref(15);
const totalElements = ref(0);

const deliveryApi = new DeliverApi();

const getDeliveryButtonLabel = status => {
  if (status === ORDER_STATUS.APPROVED) {
    return '배송 시작';
  }
  if (status === ORDER_STATUS.SHIPPING) {
    return '배송 완료';
  }
  return '';
};

const clickCall = data => {
  location.href = `tel:${data.contact}`;
};

const changeDeliveryStatus = (orderCode, toStatus) => {
  deliveryApi
    .changeDeliveryStatus({
      code: orderCode,
      deliveryKind: DRAFT_KIND.ORDER,
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

  if (currentStatus === DELIVERY_STATUS.START_DELIVERY) {
    header = '배송 시작';
    acceptLabel = '배송 시작';
    message = '배송을 시작하시겠습니까?';
    toStatus = DELIVERY_STATUS.SHIPPING;
  }

  if (!toStatus) {
    toast.add({
      severity: 'error',
      summary: '처리 실패',
      detail: '변경할 상태값이 설정되지 않았습니다. -- 주문',
      life: 3000,
    });
    return;
  }

  showConfirm({
    header,
    message: `[주문코드: ${data.code} / 배송지: ${data.deliveryFranchiseName}] ${message}`,
    acceptLabel,
    onAccept: () => {
      changeDeliveryStatus(data.code, toStatus);
    },
  });
};

const isShowActionButton = deliveryStatus => {
  return deliveryStatus === ORDER_STATUS.APPROVED;
};

const columns = [
  {
    field: 'code',
    header: '주문코드',
  },
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
          // getLabel: data => {
          //   if (isShowActionButton(data.deliveryStatus)) {
          //     return getDeliveryButtonLabel(data.deliveryStatus);
          //   }
          //   return formatKoOrderStatus(data.deliveryStatus);
          // },
          getLabel: data => formatKoDeliveryStatus(data.deliveryStatus),
          getVariant: data => undefined,
          // getVariant: data => {
          //   if (isShowActionButton(data.deliveryStatus)) {
          //     return undefined;
          //   }
          //   return 'text';
          // },
          clickHandler: clickChangeStatus,
          // getDisabled: data => !isShowActionButton(data.deliveryStatus),
        },
      ],
    },
  },
];

const getDeliveryList = () => {
  deliveryApi
    .getDeliveryList({ page: page.value, pageSize: pageSize.value, deliveryKind: DRAFT_KIND.ORDER })
    .then(data => {
      paginatedOrderDeliveries.value = data.content;
      totalElements.value = data.totalElements;
    })
    .catch(e => {
      paginatedOrderDeliveries.value = [];
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
  // paginatedOrderDeliveries.value = [
  //   {
  //     code: 100,
  //     deliveryKind: DRAFT_KIND.ORDER,
  //     deliveryFranchiseName: '낙성대점',
  //     deliveryStatus: ORDER_STATUS.APPROVED,
  //     contact: '01011111111',
  //   },
  //   {
  //     code: 99,
  //     deliveryKind: DRAFT_KIND.ORDER,
  //     deliveryFranchiseName: '숭실대점',
  //     deliveryStatus: ORDER_STATUS.SHIPPING,
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
