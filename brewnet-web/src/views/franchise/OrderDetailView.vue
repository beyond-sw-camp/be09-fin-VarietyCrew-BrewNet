<template>
  <div class="order-detail-container">
    <template v-if="orderDetail">
      <div class="top-area">
        <Tag
          rounded
          :value="formatKoOrderStatus(orderDetail.orderStatus)"
          :severity="getOrderStatusSeverity(orderDetail.orderStatus)"
          class="mb-1"
        />
        <div class="top-buttons">
          <Button label="교환" variant="outlined" size="small" :disabled="!isCompleted" @click="clickExchange" />
          <Button label="반품" variant="outlined" size="small" :disabled="!isCompleted" @click="clickReturn" />
          <Button label="목록으로" size="small" severity="secondary" variant="outlined" @click="clickGoToList" />
          <Button
            label="취소"
            severity="danger"
            size="small"
            variant="outlined"
            :disabled="!isRequested"
            @click="clickCancel"
          />
        </div>
      </div>

      <div class="body-area">
        <h1>주문상세</h1>

        <AppTableStyled full-width>
          <tbody>
            <tr>
              <th>주문번호</th>
              <td>{{ orderDetail.orderCode }}</td>
              <th>주문금액</th>
              <td>{{ orderDetail.sumPrice.toLocaleString() }}</td>
              <th>주문일자</th>
              <td>{{ orderDetail.createdAt }}</td>
              <th>완료일자</th>
              <td>{{ orderDetail.doneDate }}</td>
            </tr>
            <tr>
              <th colspan="8">주문품목</th>
            </tr>
            <tr>
              <th>품목코드</th>
              <th colspan="3">품목명</th>
              <th>수량</th>
              <th>단가</th>
              <th>주문금액</th>
              <th>부가세</th>
            </tr>
            <tr v-for="item in orderDetail.orderItemList" :key="item.itemCode">
              <td class="align-center">{{ item.itemCode }}</td>
              <td colspan="3">{{ item.name }}</td>
              <td class="align-right">{{ item.quantity.toLocaleString() }}</td>
              <td class="align-right">{{ (item.partSum / item.quantity).toLocaleString() }}</td>
              <td class="align-right">{{ item.partSum.toLocaleString() }}</td>
              <td class="align-right">{{ (item.partSum * 0.1).toLocaleString() }}</td>
            </tr>
            <tr>
              <th>총 주문금액</th>
              <td class="align-right" colspan="7">{{ totalPrice.toLocaleString() }}</td>
            </tr>
          </tbody>
        </AppTableStyled>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useToast } from 'primevue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import AppTableStyled from '@/components/common/AppTableStyled.vue';
import { useAppConfirmModal } from '@/hooks/useAppConfirmModal';
import FCOrderApi from '@/utils/api/FCOrderApi';
import { ORDER_STATUS } from '@/utils/constant';
import { formatKoOrderStatus } from '@/utils/format';
import { getOrderStatusSeverity } from '@/utils/helper';

const route = useRoute();
const router = useRouter();
const { showConfirm } = useAppConfirmModal();
const toast = useToast();

const orderDetail = ref(null);

const isRequested = computed(() => {
  return orderDetail.value.orderStatus === ORDER_STATUS.REQUESTED;
});

const isCompleted = computed(() => {
  return orderDetail.value.orderStatus === ORDER_STATUS.SHIPPED;
});

const fcOrderApi = new FCOrderApi();
const { orderCode } = route.params;

const totalPrice = computed(() => {
  if (orderDetail.value && orderDetail.value.orderItemList) {
    const totalPartSum = orderDetail.value.orderItemList.reduce((sum, item) => {
      return sum + item.partSum + item.partSum * 0.1; // 부가세도 총합에 추가
    }, 0);
    return totalPartSum.toLocaleString();
  }
  return '0';
});

const clickExchange = () => {
  // TODO:: 교환 요청
};

const clickReturn = () => {
  // TODO:: 반품 요청
};

const clickGoToList = () => {
  router.replace({ name: 'fc:home:order:list' });
};

const cancelOrder = () => {
  fcOrderApi.deleteOrder(orderCode).then(() => {
    toast.add({ severity: 'error', summary: '처리 성공', detail: '주문이 취소되었습니다.', life: 3000 });
    router.replace({ name: 'fc:home:order:list' });
  });
};

const clickCancel = () => {
  showConfirm({
    header: '주문 취소',
    message: '주문을 취소하시겠습니까?',
    acceptLabel: '주문 취소',
    onAccept: cancelOrder,
    danger: true,
  });
};

onMounted(() => {
  // 주문 상세 데이터 셋팅
  fcOrderApi.getOrderDetail(orderCode).then(data => {
    orderDetail.value = data;
  });
});
</script>

<style scoped>
.order-detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;

  .top-area {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .top-buttons {
      display: flex;
      gap: 5px;
    }
  }

  .body-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    .approval-line-table {
      align-self: flex-end;

      th {
        border: 1px solid black;
        padding: 3px 0;
        font-size: 13px;
        width: 70px;
      }
      td {
        border: 1px solid black;
        font-size: 13px;
        text-align: center;
      }

      & > tr:nth-child(2) {
        height: 50px;
      }
    }
  }
}
</style>
